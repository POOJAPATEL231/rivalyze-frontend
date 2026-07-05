import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { ChatBox } from "@/components/workspace/ChatBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkspaceView() {
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/recommendations")}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                </Button>
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-heading text-3xl font-semibold text-foreground">
                            Ask the intelligence
                        </h1>
                        <Badge variant="watch">Preview</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ask questions grounded in everything the agents found during the analysis
                        run.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChatBox />
                </CardContent>
            </Card>
        </div>
    );
}
