import { BrowserRouter, Route, Routes, useNavigate } from "react-router";

import AnalysisFlow from "@/pages/AnalysisFlow";
import { useAppDispatch } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";
import Splash from "@/views/Splash";

function LandingRoute() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleStartAnalysis = () => {
        dispatch(setStep("brief"));
        navigate("/brief");
    };

    return <Splash onStartAnalysis={handleStartAnalysis} />;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingRoute />} />
                <Route path="/brief" element={<AnalysisFlow />} />
            </Routes>
        </BrowserRouter>
    );
}
