import { type FormEvent, useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import { TestimonialCarousel } from "@/components/auth/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
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
        <div className="relative isolate flex min-h-svh items-center justify-center bg-background p-4">
            <div className="pointer-events-none absolute inset-0 bg-background" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,color-mix(in_srgb,var(--primary)_45%,transparent)_0%,transparent_40%),radial-gradient(circle_at_90%_20%,color-mix(in_srgb,var(--chart-1)_30%,transparent)_0%,transparent_38%),radial-gradient(circle_at_85%_95%,color-mix(in_srgb,var(--success)_32%,transparent)_0%,transparent_40%),radial-gradient(circle_at_10%_90%,color-mix(in_srgb,var(--chart-4)_35%,transparent)_0%,transparent_35%)]" />

            <div className="relative isolate grid w-full max-w-5xl overflow-hidden rounded-4xl border border-border bg-[color-mix(in_srgb,var(--card)_38%,transparent)] shadow-lg backdrop-blur-2xl lg:min-h-[640px] lg:grid-cols-2">
                <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/10 via-white/[0.02] to-transparent" />
                <div className="relative z-10 p-8 sm:p-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 font-heading text-xl font-semibold tracking-tight text-foreground"
                    >
                        <img
                            src="/brand/argus-icon.png"
                            alt=""
                            className="h-9 w-9 rounded-xl object-cover"
                        />
                        Argus
                    </Link>

                    <h1 className="mt-8 font-heading text-3xl font-semibold text-foreground">
                        Create an account
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Get started with Argus</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                                className="h-11 bg-[color-mix(in_srgb,var(--background)_65%,transparent)]"
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
                                className="h-11 bg-[color-mix(in_srgb,var(--background)_65%,transparent)]"
                            />
                            {passwordTooShort && (
                                <p className="text-xs text-muted-foreground">
                                    At least {MIN_PASSWORD_LENGTH} characters.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full"
                            size="lg"
                            disabled={isLoading || password.length < MIN_PASSWORD_LENGTH}
                        >
                            {isLoading ? "Creating account…" : "Create account"}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="relative z-10 hidden flex-col justify-between overflow-hidden border-l border-border bg-[color-mix(in_srgb,var(--background)_42%,transparent)] p-10 backdrop-blur-2xl lg:flex">
                    <div>
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                            What our customers
                            <br />
                            are saying.
                        </h2>

                        <TestimonialCarousel />

                        <div className="mt-5 flex gap-3">
                            <span className="flex size-9 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                                <TrendingDown className="size-4" />
                            </span>
                            <span className="flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
                                <TrendingUp className="size-4" />
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-card p-6 shadow-md">
                        <p className="font-heading text-lg font-semibold text-card-foreground">
                            See every move your
                            <br />
                            competitors make.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Real-time competitive intelligence, distilled into a single war room.
                        </p>
                        <div className="mt-4 flex">
                            {["bg-chart-3", "bg-chart-5", "bg-chart-2", "bg-chart-1"].map(
                                (tone, i) => (
                                    <span
                                        key={tone}
                                        className={cn(
                                            "size-7 rounded-full border-2 border-card",
                                            tone,
                                            i > 0 && "-ml-2",
                                        )}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
