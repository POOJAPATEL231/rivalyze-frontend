import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import AnalysisFlow from "@/pages/AnalysisFlow";
import Guide from "@/pages/Guide";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { useAppSelector } from "@/store/hooks";
import Splash from "@/views/Splash";

function LandingRoute() {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/brief" replace />;
    }

    const handleStartAnalysis = () => navigate("/brief");

    return <Splash onStartAnalysis={handleStartAnalysis} />;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                <Route path="/" element={<LandingRoute />} />
                <Route path="/guide" element={<Guide />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/brief" element={<AnalysisFlow />} />
                    <Route path="/discovery" element={<AnalysisFlow />} />
                    <Route path="/run" element={<AnalysisFlow />} />
                    <Route path="/dashboard" element={<AnalysisFlow />} />
                    <Route path="/recommendations" element={<AnalysisFlow />} />
                    <Route path="/compare" element={<AnalysisFlow />} />
                    <Route path="/workspace" element={<AnalysisFlow />} />
                    <Route path="/history" element={<AnalysisFlow />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
