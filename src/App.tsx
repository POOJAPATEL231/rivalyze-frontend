import { useEffect } from "react";

import AppRouter from "@/Router";
import { useAppSelector } from "@/store/hooks";

function App() {
    const theme = useAppSelector((state) => state.ui.theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return <AppRouter />;
}

export default App;
