import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const PAGE_FORMAT = "a4";
const MARGIN_MM = 10;
const CANVAS_SCALE = 2;
const SECTION_GAP_MM = 4;

interface CanvasSnapshot {
    dataUrl: string;
    widthPx: number;
    heightPx: number;
}

/** Renders one element to a PNG data URL via html2canvas-pro at a fixed
 * supersampling scale for crisp text. windowWidth/windowHeight are pinned to
 * the element's own natural size so an off-screen clone (rendered outside
 * the visible viewport) still lays out and captures exactly as it would
 * on-screen, instead of html2canvas guessing from the real window size. */
async function snapshotElement(el: HTMLElement): Promise<CanvasSnapshot> {
    const rect = el.getBoundingClientRect();
    const canvas = await html2canvas(el, {
        scale: CANVAS_SCALE,
        useCORS: true,
        backgroundColor: null,
        windowWidth: Math.ceil(rect.width),
        windowHeight: Math.ceil(rect.height),
    });
    return {
        dataUrl: canvas.toDataURL("image/png"),
        widthPx: canvas.width,
        heightPx: canvas.height,
    };
}

/** Mounts a clone of `source` off-screen (fixed position, way outside the
 * viewport — not display:none, which would give html2canvas nothing to
 * measure or paint) so it can be edited and captured without touching the
 * live page, then tears it down again. */
async function withOffscreenClone<T>(
    source: HTMLElement,
    mutate: (clone: HTMLElement) => void,
    capture: (clone: HTMLElement) => Promise<T>,
): Promise<T> {
    const clone = source.cloneNode(true) as HTMLElement;
    mutate(clone);

    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.top = "0";
    host.style.left = "-99999px";
    host.style.width = `${source.getBoundingClientRect().width}px`;
    host.appendChild(clone);
    document.body.appendChild(host);

    try {
        return await capture(clone);
    } finally {
        document.body.removeChild(host);
    }
}

interface PdfCursor {
    pdf: jsPDF;
    pageHeightMm: number;
    usableWidthMm: number;
    y: number;
    hasContentOnPage: boolean;
}

function startNewPage(cursor: PdfCursor) {
    cursor.pdf.addPage();
    cursor.y = MARGIN_MM;
    cursor.hasContentOnPage = false;
}

/** Places one snapshot as an atomic block, starting a new page first if it
 * wouldn't fit in the remaining space of the current one. Never splits a
 * single snapshot across pages — callers are responsible for pre-chunking
 * anything tall enough to need that (see placeTableSection). */
function placeSnapshot(cursor: PdfCursor, snapshot: CanvasSnapshot) {
    const heightMm = (snapshot.heightPx / snapshot.widthPx) * cursor.usableWidthMm;
    const remainingMm = cursor.pageHeightMm - MARGIN_MM - cursor.y;

    if (cursor.hasContentOnPage && heightMm > remainingMm) {
        startNewPage(cursor);
    }

    cursor.pdf.addImage(
        snapshot.dataUrl,
        "PNG",
        MARGIN_MM,
        cursor.y,
        cursor.usableWidthMm,
        heightMm,
    );
    cursor.y += heightMm + SECTION_GAP_MM;
    cursor.hasContentOnPage = true;
}

/** Splits a table-bearing section into page-sized row chunks, measured from
 * the live DOM so a page break never lands mid-row, and re-adds the table's
 * own <thead> to every chunk so continuation pages stay readable. The first
 * chunk keeps whatever comes before the table in the section (e.g. a Card
 * title); later chunks hide that so only the table (with its repeated
 * header) appears, without changing the table's rendered width — hiding via
 * `display: none` rather than removing the wrapper keeps padding/width
 * identical across chunks, which is what keeps font size consistent. */
async function placeTableSection(cursor: PdfCursor, section: HTMLElement, table: HTMLTableElement) {
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    const rows = tbody ? Array.from(tbody.querySelectorAll(":scope > tr")) : [];

    if (!thead || rows.length === 0) {
        placeSnapshot(cursor, await snapshotElement(section));
        return;
    }

    const tableWidthPx = table.getBoundingClientRect().width;
    const pxPerMm = tableWidthPx / cursor.usableWidthMm;
    const usableHeightPx = (cursor.pageHeightMm - MARGIN_MM * 2) * pxPerMm;
    const theadHeightPx = thead.getBoundingClientRect().height;
    const chromeHeightPx =
        section.getBoundingClientRect().height - table.getBoundingClientRect().height;

    const chunks: Element[][] = [];
    let current: Element[] = [];
    let currentHeightPx = theadHeightPx + chromeHeightPx;

    for (const row of rows) {
        const rowHeightPx = row.getBoundingClientRect().height;
        if (current.length > 0 && currentHeightPx + rowHeightPx > usableHeightPx) {
            chunks.push(current);
            current = [];
            currentHeightPx = theadHeightPx;
        }
        current.push(row);
        currentHeightPx += rowHeightPx;
    }
    if (current.length > 0) chunks.push(current);

    for (let i = 0; i < chunks.length; i++) {
        const chunkRows = chunks[i];
        const isFirstChunk = i === 0;

        const snapshot = await withOffscreenClone(
            section,
            (clone) => {
                const cloneTable = clone.querySelector("table");
                const cloneBody = cloneTable?.querySelector("tbody");
                if (!cloneTable || !cloneBody) return;

                cloneBody.innerHTML = "";
                for (const row of chunkRows) cloneBody.appendChild(row.cloneNode(true));

                if (!isFirstChunk) {
                    let node = clone.firstElementChild;
                    while (node && node !== cloneTable && !node.contains(cloneTable)) {
                        (node as HTMLElement).style.display = "none";
                        node = node.nextElementSibling;
                    }
                }
            },
            (clone) => snapshotElement(clone),
        );

        placeSnapshot(cursor, snapshot);
    }
}

/** Exports `container`'s direct children as a paginated PDF. Any section
 * containing a <table> is split into row-accurate, header-repeating chunks
 * (see placeTableSection); every other section is captured as a single
 * atomic block. Either way, no single html2canvas render is ever more than
 * roughly one page tall, so large tables never approach the browser's
 * canvas size limits (~16384–32767px) the way one giant whole-page render
 * would. */
export async function exportSectionsToPdf(container: HTMLElement, filename: string) {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: PAGE_FORMAT });
    const pageHeightMm = pdf.internal.pageSize.getHeight();
    const pageWidthMm = pdf.internal.pageSize.getWidth();

    const cursor: PdfCursor = {
        pdf,
        pageHeightMm,
        usableWidthMm: pageWidthMm - MARGIN_MM * 2,
        y: MARGIN_MM,
        hasContentOnPage: false,
    };

    for (const section of Array.from(container.children)) {
        const table = section.querySelector("table");
        if (table) {
            await placeTableSection(cursor, section as HTMLElement, table);
        } else {
            placeSnapshot(cursor, await snapshotElement(section as HTMLElement));
        }
    }

    pdf.save(filename);
}
