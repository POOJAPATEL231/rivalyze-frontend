const fs = require("fs");
const path = require("path");

const files = [
    "src/hooks/useDiscoveryJob.ts",
    "src/components/layout/StepBar.tsx",
    "src/components/workspace/WorkspaceView.tsx",
    "src/components/recommendations/RecommendationsView.tsx",
    "src/components/discovery/CompetitorList.tsx",
    "src/components/discovery/DiscoveryView.tsx",
    "src/components/compare/CompareView.tsx",
    "src/components/run/LiveRunView.tsx",
    "src/components/history/HistoryView.tsx",
    "src/components/dashboard-view/DashboardView.tsx",
];

for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, "utf8");

    // Add import if needed
    if (!content.includes("useNavigate")) {
        // Insert after first import
        content = content.replace(
            /(import .*;\n)/,
            `$1import { useNavigate } from "react-router";\n`,
        );
    }

    // Add navigate hook if needed
    if (!content.includes("const navigate = useNavigate();")) {
        // Insert after dispatch
        content = content.replace(
            /(const dispatch = useAppDispatch\(\);)/,
            `$1\n    const navigate = useNavigate();`,
        );
    }

    // Replace dispatch(setStep("xxx")) with navigate("/xxx")
    // Note: some files might have dispatch(setStep(step)) or dispatch(setStep(step.id))
    content = content.replace(/dispatch\(\s*setStep\(\s*"([^"]+)"\s*\)\s*\)/g, 'navigate("/$1")');
    content = content.replace(
        /dispatch\(\s*setStep\(\s*step\.id\s*\)\s*\)/g,
        "navigate(`/${step.id}`)",
    );
    content = content.replace(/dispatch\(\s*setStep\(\s*step\s*\)\s*\)/g, "navigate(`/${step}`)");

    fs.writeFileSync(filePath, content);
}

console.log("Routing fixed!");
