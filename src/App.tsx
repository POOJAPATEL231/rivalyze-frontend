import { useState } from "react";

import { Splash } from "@/components/splash/Splash";
import AnalysisFlow from "@/pages/AnalysisFlow";

function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <>
            {showSplash && <Splash onDismiss={() => setShowSplash(false)} />}
            <AnalysisFlow />
        </>
    );
}

export default App;
