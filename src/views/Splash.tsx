// OWNER: Dhwani — build Saturday per your task doc. Design law: Rivalyze_Prototype_v9_2.
import Comparison from "@/components/landing/Comparison";
import Confidence from "@/components/landing/Confidence";
import Differentiator from "@/components/landing/Differentiator";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Nav from "@/components/landing/Nav";
import Problem from "@/components/landing/Problem";
import Roadmap from "@/components/landing/Roadmap";
import Showcase from "@/components/landing/Showcase";
import TrustBar from "@/components/landing/TrustBar";
import Users from "@/components/landing/Users";

interface SplashProps {
    onStartAnalysis: () => void;
}

export default function Splash({ onStartAnalysis }: SplashProps) {
    return (
        <div className="min-h-screen bg-background">
            <Nav />
            <Hero onStartAnalysis={onStartAnalysis} />
            <TrustBar />
            <Problem />
            <HowItWorks />
            <Differentiator />
            <Confidence />
            <Features />
            <Showcase />
            <Comparison />
            <Users />
            <Roadmap />
            <FinalCTA onStartAnalysis={onStartAnalysis} />
            <Footer />
        </div>
    );
}
