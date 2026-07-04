import { type FormEvent, useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
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
            const tokens = await login({ email, password });
            dispatch(
                loginSuccess({
                    user: { email },
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                }),
            );
            navigate(from, { replace: true });
        } catch (err) {
            dispatch(loginFailure(extractApiErrorMessage(err)));
        }
    };

    return (
        <div className="relative isolate flex min-h-svh items-center justify-center bg-background p-4">
            <div className="pointer-events-none absolute inset-0 bg-background" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,color-mix(in_srgb,var(--primary)_45%,transparent)_0%,transparent_40%),radial-gradient(circle_at_90%_20%,color-mix(in_srgb,var(--chart-1)_30%,transparent)_0%,transparent_38%),radial-gradient(circle_at_85%_95%,color-mix(in_srgb,var(--success)_32%,transparent)_0%,transparent_40%),radial-gradient(circle_at_10%_90%,color-mix(in_srgb,var(--chart-4)_35%,transparent)_0%,transparent_35%)]" />

            <div className="relative isolate grid w-full max-w-4xl overflow-hidden rounded-4xl border border-border bg-[color-mix(in_srgb,var(--card)_38%,transparent)] shadow-lg backdrop-blur-2xl lg:grid-cols-2">
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
                        Welcome back
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Please enter your account details
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                                className="h-11 bg-[color-mix(in_srgb,var(--background)_65%,transparent)]"
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
                                className="h-11 bg-[color-mix(in_srgb,var(--background)_65%,transparent)]"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-muted-foreground">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="size-4 rounded border-border accent-primary"
                                />
                                Keep me logged in
                            </label>
                            <span className="cursor-default text-primary/70" title="Coming soon">
                                Forgot password?
                            </span>
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Sign up
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

                        <p className="mt-6 font-heading text-4xl text-primary/60">&ldquo;</p>
                        <p className="-mt-4 text-sm text-muted-foreground">
                            &ldquo;We finally see every move our competitors make before they even
                            announce it.&rdquo;
                        </p>

                        <div className="mt-4">
                            <p className="font-heading text-sm font-semibold text-foreground">
                                Alex Rivera
                            </p>
                            <p className="text-xs text-muted-foreground">Head of Product, Nimbus</p>
                        </div>

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
