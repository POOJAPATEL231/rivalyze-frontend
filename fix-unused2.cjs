const fs = require("fs");
const path = require("path");

function replaceFile(file, edits) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    for (const [from, to] of edits) {
        content = content.replace(from, to);
    }
    fs.writeFileSync(filePath, content);
}

replaceFile("src/components/compare/CompareView.tsx", [
    [
        /import\s*{\s*useAppDispatch,\s*useAppSelector\s*}\s*from\s*"@\/store\/hooks";/g,
        'import { useAppSelector } from "@/store/hooks";',
    ],
]);

replaceFile("src/components/discovery/DiscoveryView.tsx", [
    [
        /import\s*{\s*useAppDispatch,\s*useAppSelector\s*}\s*from\s*"@\/store\/hooks";/g,
        'import { useAppSelector } from "@/store/hooks";',
    ],
]);

replaceFile("src/components/workspace/WorkspaceView.tsx", [
    [/import\s*{\s*useAppDispatch\s*}\s*from\s*"@\/store\/hooks";\s*/g, ""],
]);

console.log("Unused useAppDispatch removed!");
