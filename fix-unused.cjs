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
    [/import\s*{\s*setStep\s*}\s*from\s*"@\/store\/slices\/analysisSlice";\s*/g, ""],
    [/const\s*dispatch\s*=\s*useAppDispatch\(\);\s*/g, ""],
]);

replaceFile("src/components/dashboard-view/DashboardView.tsx", [
    [
        /import\s*{\s*setStep,\s*unlockStep\s*}\s*from\s*"@\/store\/slices\/analysisSlice";/g,
        'import { unlockStep } from "@/store/slices/analysisSlice";',
    ],
]);

replaceFile("src/components/discovery/CompetitorList.tsx", [[/setStep,\s*/g, ""]]);

replaceFile("src/components/discovery/DiscoveryView.tsx", [
    [/import\s*{\s*setStep\s*}\s*from\s*"@\/store\/slices\/analysisSlice";\s*/g, ""],
    [/const\s*dispatch\s*=\s*useAppDispatch\(\);\s*/g, ""],
]);

replaceFile("src/components/history/HistoryView.tsx", [[/\s*setStep,\s*/g, ""]]);

replaceFile("src/components/recommendations/RecommendationsView.tsx", [
    [
        /import\s*{\s*setStep,\s*unlockStep\s*}\s*from\s*"@\/store\/slices\/analysisSlice";/g,
        'import { unlockStep } from "@/store/slices/analysisSlice";',
    ],
]);

replaceFile("src/components/run/LiveRunView.tsx", [
    [
        /import\s*{\s*setStep,\s*unlockStep\s*}\s*from\s*"@\/store\/slices\/analysisSlice";/g,
        'import { unlockStep } from "@/store/slices/analysisSlice";',
    ],
]);

replaceFile("src/components/workspace/WorkspaceView.tsx", [
    [/import\s*{\s*setStep\s*}\s*from\s*"@\/store\/slices\/analysisSlice";\s*/g, ""],
    [/const\s*dispatch\s*=\s*useAppDispatch\(\);\s*/g, ""],
]);

replaceFile("src/hooks/useDiscoveryJob.ts", [[/\s*setStep,\s*/g, "\n"]]);

console.log("Unused imports removed!");
