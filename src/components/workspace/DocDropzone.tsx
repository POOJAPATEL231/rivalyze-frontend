import { UploadCloud } from "lucide-react";

interface DocDropzoneProps {
    onAdd: () => void;
}

/** Click adds a mock document — no real upload for the hackathon demo. */
export function DocDropzone({ onAdd }: DocDropzoneProps) {
    return (
        <button
            type="button"
            onClick={onAdd}
            className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
            <UploadCloud className="size-5" />
            <span>Click to add a document to the workspace</span>
        </button>
    );
}
