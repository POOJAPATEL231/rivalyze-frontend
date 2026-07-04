import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-svh overflow-hidden bg-background text-foreground">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
