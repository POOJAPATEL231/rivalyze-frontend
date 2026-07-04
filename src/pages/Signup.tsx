import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiErrorMessage } from "@/lib/apiError";
import { signup } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, signupFailure, signupStart, signupSuccess } from "@/store/slices/authSlice";

const MIN_PASSWORD_LENGTH = 8;

export default function Signup() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const stateFrom = (location.state as { from?: string } | null)?.from;
    const from = !stateFrom || stateFrom === "/" ? "/brief" : stateFrom;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password.length < MIN_PASSWORD_LENGTH) return;
        dispatch(signupStart());
        try {
            const tokens = await signup({ email, password });
            dispatch(
                signupSuccess({
                    user: { email },
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                }),
            );
            navigate(from, { replace: true });
        } catch (err) {
            dispatch(signupFailure(extractApiErrorMessage(err)));
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
                        <CardTitle className="text-xl">Create an account</CardTitle>
                        <CardDescription>Get started with Argus</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={MIN_PASSWORD_LENGTH}
                                    autoComplete="new-password"
                                />
                                {passwordTooShort && (
                                    <p className="text-xs text-muted-foreground">
                                        At least {MIN_PASSWORD_LENGTH} characters.
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading || password.length < MIN_PASSWORD_LENGTH}
                            >
                                {isLoading ? "Creating account…" : "Create account"}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
