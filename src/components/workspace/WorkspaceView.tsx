import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { ChatBox } from "@/components/workspace/ChatBox";
import { DocDropzone } from "@/components/workspace/DocDropzone";
import { DocRow } from "@/components/workspace/DocRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";

interface Doc {
    id: string;
    name: string;
    status: string;
}

const DOC_TEMPLATES: Omit<Doc, "id">[] = [
    {
        name: "Board deck — Q3 strategy.pdf",
        status: "indexed · 14 chunks · 2.1 MB",
    },
    {
        name: "Competitor teardown — Northwind.docx",
        status: "indexed · 9 chunks · 640 KB",
    },
    {
        name: "Customer call notes — Meridian Corp.txt",
        status: "indexed · 3 chunks · 22 KB",
    },
    { name: "Pricing model v4.xlsx", status: "indexed · 6 chunks · 180 KB" },
];

export function WorkspaceView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [docs, setDocs] = useState<Doc[]>([]);

    function handleAddDoc() {
        const template = DOC_TEMPLATES[docs.length % DOC_TEMPLATES.length];
        setDocs((prev) => [...prev, { id: `doc-${prev.length}`, ...template }]);
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/recommendations")}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                </Button>
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">
                        Ask the intelligence
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ground questions against your own documents and everything the agents found.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-[45fr_55fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DocDropzone onAdd={handleAddDoc} />
                        {docs.map((doc) => (
                            <DocRow key={doc.id} name={doc.name} status={doc.status} />
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChatBox />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
