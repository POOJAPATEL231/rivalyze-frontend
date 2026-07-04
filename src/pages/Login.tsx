import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, loginFailure, loginStart, loginSuccess } from "@/store/slices/authSlice";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const stateFrom = (location.state as { from?: string } | null)?.from;
    const from = !stateFrom || stateFrom === "/" ? "/brief" : stateFrom;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await login({ email, password });
            dispatch(loginSuccess(response));
            navigate(from, { replace: true });
        } catch (err) {
            dispatch(loginFailure(err instanceof Error ? err.message : "Login failed"));
        }
    };

    return (
        <div className="flex min-h-svh items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 font-heading text-xl font-semibold tracking-tight text-foreground"
                    >
                        <img
                            src="/brand/argus-icon.png"
                            alt=""
                            className="h-8 w-8 rounded-md object-cover"
                        />
                        Argus
                    </Link>
                </div>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Welcome back</CardTitle>
                        <CardDescription>Sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? "Signing in…" : "Sign in"}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
