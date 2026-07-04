import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import AnalysisFlow from "@/pages/AnalysisFlow";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";
import Splash from "@/views/Splash";

function LandingRoute() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/brief" replace />;
    }

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
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                <Route path="/" element={<LandingRoute />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/brief" element={<AnalysisFlow />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
