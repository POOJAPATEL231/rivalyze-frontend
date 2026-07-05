import { Badge } from "@/components/ui/badge";
import { GuideCallout } from "@/components/guide/GuideCallout";
import { GuideNav } from "@/components/guide/GuideNav";
import { GuideQA } from "@/components/guide/GuideQA";
import { GuideSteps } from "@/components/guide/GuideSteps";

export function GuideView() {
    return (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-12">
            <GuideNav />

            <div className="min-w-0 max-w-prose space-y-16">
                <section id="introduction" className="scroll-mt-20 space-y-3">
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        01
                    </p>
                    <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                        Rivalyze User Guide
                    </h1>
                    <p className="text-muted-foreground">
                        Everything you can do in Rivalyze — from your first login to reading your
                        first report.
                    </p>
                    <p className="text-sm text-foreground">
                        Rivalyze is a competitive-intelligence tool. You give it a company name or a
                        startup idea, and it deploys five specialist AI agents — Discovery, News,
                        Product, Reviews, and Strategist — to map your competitive landscape, gather
                        evidence, and hand back a structured report: a threat assessment, a
                        head-to-head comparison, a SWOT analysis, sentiment tracking, and ranked
                        recommendations for what to do next.
                    </p>
                    <p className="text-sm text-foreground">
                        It&rsquo;s built for people who need a defensible read on a market without
                        spending days on manual research: founders validating an idea before they
                        build it, product teams tracking what competitors are shipping, strategy
                        teams preparing board materials, and investors doing diligence. Every claim
                        Rivalyze makes links back to the source that produced it, so you can check
                        its work instead of taking it on faith.
                    </p>
                </section>

                <section id="getting-started" className="scroll-mt-20 space-y-4">
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        02
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Getting started
                    </h2>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        How to access Rivalyze
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Open the app in a web browser. If you are not logged in, you land on a
                        public page that explains what Rivalyze does. From there you either create
                        an account or log in — there is no way to run an analysis without one.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Creating an account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Click <strong>Sign Up</strong> in the top-right corner of the homepage. You
                        only need an email address and a password of at least 8 characters — there
                        is no company profile or onboarding survey to fill in first.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Your first analysis in about 5 minutes
                    </h3>
                    <GuideSteps
                        items={[
                            <>
                                On the homepage, click <strong>Sign Up</strong> (top-right) or{" "}
                                <strong>Start Analysis</strong> (the large button near the top).
                            </>,
                            <>
                                Enter an <strong>Email</strong> and a <strong>Password</strong> of
                                at least 8 characters, then click <strong>Create account</strong>.
                            </>,
                            <>
                                You land on the Brief screen. Leave the mode set to{" "}
                                <strong>Existing company</strong>, type a company name into{" "}
                                <strong>Company name</strong> (for example, &ldquo;Notion&rdquo;),
                                and click <strong>Start intelligence scan</strong>.
                            </>,
                            <>
                                Wait while Rivalyze maps your competitive set. When the competitor
                                list appears, remove anything that doesn&rsquo;t belong, then click{" "}
                                <strong>Deploy the agents</strong>.
                            </>,
                            <>
                                Watch the five agents research in real time. When{" "}
                                <strong>Open the dashboard</strong> becomes clickable, click it.
                            </>,
                            "Read your report: threat level, head-to-head comparison, SWOT, sentiment, and opportunities.",
                        ]}
                    />
                </section>

                <section id="navigating" className="scroll-mt-20 space-y-4">
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        03
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Navigating the app
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Rivalyze has two distinct modes, and they don&rsquo;t share a navigation
                        bar.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        The homepage (logged out)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        A fixed top bar shows the Rivalyze logo on the left; links to{" "}
                        <strong>How It Works</strong>, <strong>Evidence</strong>,{" "}
                        <strong>Product</strong>, and <strong>Roadmap</strong> (each jumps to a
                        section further down the same page); a theme toggle; and{" "}
                        <strong>Login</strong> / <strong>Sign Up</strong> buttons on the right. Two{" "}
                        <strong>Start Analysis</strong> buttons on this page send a logged-out
                        visitor to sign in first, then straight through to Brief.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        The step bar (logged in)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Once you&rsquo;re logged in, a step bar replaces the homepage nav and stays
                        fixed to the top of every screen: the Rivalyze logo, then five numbered
                        steps joined into a rail — <strong>01 Brief</strong>,{" "}
                        <strong>02 Discovery</strong>, <strong>03 Run</strong>,{" "}
                        <strong>04 Dashboard</strong>, <strong>05 Recommendations</strong> — with a
                        checkmark for steps you&rsquo;ve completed and a padlock for steps you
                        haven&rsquo;t reached yet.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        On wide screens, three more destinations sit to the right as their own tabs:{" "}
                        <strong>Compare</strong>, <strong>Workspace</strong>, and{" "}
                        <strong>History</strong>. Compare and Workspace carry a small gold
                        &ldquo;S&rdquo; badge marking them as optional add-ons to the core flow. On
                        narrower windows these three collapse into a single menu button. Farthest
                        right: a theme toggle and a logout icon.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Locked steps aren&rsquo;t clickable. Typing a locked step&rsquo;s address
                        directly into the browser sends you back to Brief instead.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Global elements
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        The only control available everywhere is the theme toggle (a sun/moon icon),
                        which switches between dark and light appearance immediately. There is no
                        global search box, no notification bell, and no account menu in this version
                        of the app.
                    </p>
                </section>

                <section id="auth" className="scroll-mt-20 space-y-4 border-t border-border pt-10">
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Signing up and logging in
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Rivalyze uses a plain email-and-password account system. There is no
                        &ldquo;log in with Google&rdquo; or single sign-on option.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Creating an account
                    </h3>
                    <GuideSteps
                        items={[
                            <>
                                Click <strong>Sign Up</strong>.
                            </>,
                            <>
                                Enter your <strong>Email</strong>.
                            </>,
                            <>
                                Enter a <strong>Password</strong> of at least 8 characters. The{" "}
                                <strong>Create account</strong> button stays disabled, and a note
                                reading &ldquo;At least 8 characters.&rdquo; appears, until you meet
                                this.
                            </>,
                            <>
                                Click <strong>Create account</strong>. It reads &ldquo;Creating
                                account&hellip;&rdquo; while it works.
                            </>,
                        ]}
                    />
                    <p className="text-sm text-muted-foreground">
                        You&rsquo;re logged in immediately afterward and taken to Brief, or back to
                        whatever page you were trying to reach when you were asked to sign in.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Logging in
                    </h3>
                    <GuideSteps
                        items={[
                            <>
                                Click <strong>Login</strong>.
                            </>,
                            <>
                                Enter your <strong>Email</strong> and <strong>Password</strong>.
                            </>,
                            <>
                                Click <strong>Sign in</strong>.
                            </>,
                        ]}
                    />
                    <p className="text-sm text-muted-foreground">
                        A checkbox labeled <strong>Keep me logged in</strong> sits above the sign-in
                        button and is checked by default.
                    </p>

                    <GuideCallout variant="clarify">
                        <p>
                            The <strong>Keep me logged in</strong> checkbox doesn&rsquo;t appear to
                            change anything — your session is saved to the browser the same way
                            whether it&rsquo;s checked or not.
                        </p>
                    </GuideCallout>

                    <p className="text-sm text-muted-foreground">
                        A <strong>Forgot password?</strong> link sits next to the password field but
                        is not active yet — hovering it shows &ldquo;Coming soon,&rdquo; and
                        clicking it does nothing.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Logging out
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Click the logout icon at the far right of the step bar. You&rsquo;re
                        returned to the login screen immediately.
                    </p>

                    <GuideQA
                        question="Why was I sent to the login screen when I clicked a link?"
                        answer="You followed a link to a page inside the analysis flow while logged out, or your session had expired. Log in and Rivalyze sends you on to where you were originally headed."
                    />
                </section>

                <section id="brief" className="scroll-mt-20 space-y-4 border-t border-border pt-10">
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Brief — starting an analysis
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Brief is the first step of every analysis. You tell Rivalyze who you are —
                        either an existing company or a startup idea — and it uses that to kick off
                        research. It&rsquo;s always reachable by clicking <strong>01 Brief</strong>{" "}
                        in the step bar.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Analyzing an existing company
                    </h3>
                    <GuideSteps
                        items={[
                            <>
                                Make sure <strong>Existing company</strong> is selected (it&rsquo;s
                                the default).
                            </>,
                            <>
                                Type into <strong>Company name</strong> — this is required.
                            </>,
                            <>
                                Optionally type a website into <strong>Domain</strong>.
                            </>,
                            <>
                                Or click an example pill — <strong>Notion</strong>,{" "}
                                <strong>Figma</strong>, or <strong>Zomato</strong> — to fill both
                                fields for you.
                            </>,
                            <>
                                Click <strong>Start intelligence scan</strong>.
                            </>,
                        ]}
                    />

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Analyzing a startup idea
                    </h3>
                    <GuideSteps
                        items={[
                            <>
                                Click <strong>Startup idea</strong> to switch modes.
                            </>,
                            <>
                                Describe what you&rsquo;re building in the{" "}
                                <strong>Describe your idea</strong> box. A counter tracks how many
                                of the 500 available characters you&rsquo;ve used.
                            </>,
                            <>
                                Or click <strong>Try an example idea</strong> to fill in a sample
                                description.
                            </>,
                            <>
                                Click <strong>Start intelligence scan</strong>.
                            </>,
                        ]}
                    />

                    <p className="text-sm text-muted-foreground">
                        Company names must stay under 100 characters and idea descriptions under
                        500. Neither field accepts anything that looks like an HTML tag or script —
                        Rivalyze blocks the button and explains why until you remove it.
                    </p>

                    <GuideCallout variant="note">
                        <p>
                            Changing your input on this screen clears out any competitor set or
                            report tied to your previous entry. Nothing is deleted from History, but
                            your step-bar progress resets and you&rsquo;ll need to go through
                            Discovery and the live run again.
                        </p>
                    </GuideCallout>

                    <GuideQA
                        question="Can I analyze more than one company at a time?"
                        answer="No. Each Brief submission starts a single, separate analysis."
                    />
                </section>

                <section
                    id="discovery"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Discovery — reviewing your competitive set
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        After you submit a Brief, Rivalyze proposes a set of direct and indirect
                        competitors before committing to deeper research. You get to edit that list
                        first. This is the same screen the step bar calls{" "}
                        <strong>02 Discovery</strong> (it briefly relabels itself{" "}
                        <strong>Run</strong> once the agents are deployed).
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        While Rivalyze is mapping competitors
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You&rsquo;ll see an animated radar graphic and the text &ldquo;Mapping your
                        competitive set&hellip;&rdquo;. This usually takes under a minute. If it
                        takes much longer, Rivalyze shows an error asking you to try again — return
                        to Brief and resubmit.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Reviewing the proposed set
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        The heading changes to &ldquo;Here&rsquo;s who you&rsquo;re up
                        against,&rdquo; with a radar diagram on the left (your company at the
                        center, direct competitors on the inner ring, indirect ones on the outer
                        ring) and a <strong>Confirmed competitor set</strong> card on the right,
                        listing each one with a <strong>Direct</strong> or <strong>Indirect</strong>{" "}
                        tag and a short rationale.
                    </p>
                    <GuideSteps
                        items={[
                            <>
                                Read through the rows in <strong>Confirmed competitor set</strong>.
                                The header shows a running count, like &ldquo;3 of 4.&rdquo;
                            </>,
                            <>
                                To drop one that doesn&rsquo;t belong, click the <strong>X</strong>{" "}
                                button on its row. It moves into a <strong>Removed</strong> list.
                            </>,
                            <>
                                Changed your mind? Click the <strong>+</strong> button next to a
                                removed competitor to bring it back.
                            </>,
                            <>
                                When the list looks right, click <strong>Deploy the agents</strong>.
                                This is disabled if the list is empty.
                            </>,
                        ]}
                    />
                    <GuideQA
                        question="What if Rivalyze found the wrong competitors?"
                        answer="Remove the ones that don't fit before deploying. There's currently no way to add a competitor of your own that Rivalyze didn't surface itself."
                    />
                </section>

                <section
                    id="live-run"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Live run — watching the agents work
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Once you click <strong>Deploy the agents</strong>, three more agents — News,
                        Product, and Reviews — work in parallel, followed by a Strategist agent that
                        synthesizes everything into your report. It&rsquo;s the same screen and step
                        as Discovery; the heading simply changes to &ldquo;Five agents are on
                        it.&rdquo;
                    </p>
                    <p className="text-sm text-muted-foreground">
                        A row of four live counters — <strong>Elapsed</strong>,{" "}
                        <strong>LLM calls</strong>, <strong>Searches</strong>, and{" "}
                        <strong>Signals found</strong> — updates as the run progresses. Below that,
                        one card per agent on the left, each with a status badge (
                        <strong>Queued</strong>, <strong>Waiting</strong>, <strong>Running</strong>,
                        or <strong>Done</strong>) and a progress bar; on the right, a dark
                        terminal-style ledger logs every event as it happens.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        When every agent finishes, <strong>Open the dashboard</strong> becomes
                        clickable at the bottom of the screen.
                    </p>

                    <GuideCallout variant="note">
                        <p>
                            Navigating away or closing the tab mid-run does not cancel your analysis
                            — it keeps running on the server. Come back through{" "}
                            <strong>03 Run</strong> in the step bar, or through History once
                            it&rsquo;s done.
                        </p>
                    </GuideCallout>

                    <GuideQA
                        question="What happens if a run fails or times out?"
                        answer='A message appears in a dashed red box above the run panel — either a specific error or a generic "This is taking longer than expected. Please try again." Either way, you’ll need to start over from Brief.'
                    />
                </section>

                <section
                    id="dashboard"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Dashboard — the full report
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        The dashboard is where everything the agents found comes together. Click{" "}
                        <strong>Open the dashboard</strong> at the end of a run, click{" "}
                        <strong>04 Dashboard</strong> in the step bar once it&rsquo;s unlocked, or
                        click <strong>Open</strong> on any row in History.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        A <strong>Back</strong> button in the top-left returns you to Discovery. An{" "}
                        <strong>Export PDF</strong> button in the top-right saves the report as a
                        PDF, generated inside your browser.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        The <strong>executive summary</strong> banner shows a color-coded threat
                        level — Low (green), Medium/Moderate/Elevated (gold), or High/Critical (red)
                        — with run details and a written summary. The{" "}
                        <strong>head-to-head table</strong> lists the metrics Rivalyze compared,
                        with a highlighted <strong>You</strong> column and one column per
                        competitor. The <strong>SWOT section</strong> shows four boxes:{" "}
                        <strong>Strengths</strong> (teal), <strong>Weaknesses</strong> (rose),{" "}
                        <strong>Opportunities</strong> (gold), and <strong>Threats</strong>{" "}
                        (violet).
                    </p>

                    <GuideCallout variant="clarify">
                        <p>
                            In the current build, the SWOT section appears twice in a row, showing
                            identical information both times. That looks like a display bug rather
                            than something intentional — if you see it, it isn&rsquo;t something you
                            did.
                        </p>
                    </GuideCallout>

                    <p className="text-sm text-muted-foreground">
                        The <strong>rival sentiment</strong> panel is a bar chart scoring each
                        competitor, and the <strong>opportunities</strong> panel lists numbered
                        opportunities plus a <strong>Low-signal findings</strong> list for weaker
                        observations. A <strong>See the recommendations</strong> button at the
                        bottom moves you on.
                    </p>

                    <GuideCallout variant="clarify">
                        <p>
                            The small &ldquo;N sources&rdquo; badges throughout this page
                            aren&rsquo;t clickable yet — this looks like a feature that exists on
                            the server but hasn&rsquo;t been connected to this screen, not an
                            intentional dead end.
                        </p>
                    </GuideCallout>
                </section>

                <section
                    id="recommendations"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Recommendations — what to do about it
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Click <strong>See the recommendations</strong> on the dashboard, or{" "}
                        <strong>05 Recommendations</strong> in the step bar. Under the heading
                        &ldquo;What to do about it,&rdquo; a grid of cards appears — one per
                        recommendation, each with a confidence ring (green at 70%+, gold
                        55&ndash;69%, red under 55%) and a short rationale. A{" "}
                        <strong>Why can confidence be under 55%?</strong> box explains that
                        confidence reflects agent agreement and source corroboration, not a
                        subjective read from the model.
                    </p>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                        Actions at the bottom of the page
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        <strong>Export</strong> offers <strong>Markdown (.md)</strong> or{" "}
                        <strong>PDF (.pdf)</strong> downloads. <strong>Compare side-by-side</strong>{" "}
                        opens the optional Compare screen. <strong>Ask the intelligence</strong>{" "}
                        opens the optional Workspace screen. <strong>Re-run</strong> takes you back
                        to Brief to start a new analysis.
                    </p>

                    <GuideQA
                        question="Why is one recommendation's confidence so low?"
                        answer="Low confidence is shown deliberately, not hidden. It usually means the claim is backed by only one source or one agent, rather than several agreeing independently."
                    />
                </section>

                <section
                    id="compare"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature <Badge variant="watch">Optional</Badge>
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Compare</h2>
                    <p className="text-sm text-muted-foreground">
                        Compare lines you up against up to two competitors at once, using the same
                        metrics as the dashboard&rsquo;s head-to-head table. Click{" "}
                        <strong>Compare side-by-side</strong> on Recommendations, or the{" "}
                        <strong>Compare</strong> tab in the step bar once it&rsquo;s unlocked.
                    </p>
                    <GuideSteps
                        items={[
                            <>
                                Click competitor pills at the top to pick up to two rivals. Your own
                                entry, labeled &ldquo;[company] &middot; you,&rdquo; is always
                                included and can&rsquo;t be removed.
                            </>,
                            "If you pick a third rival, the first one you picked is automatically dropped to make room.",
                            "Read the columns below — each rival gets the same rows as the head-to-head table, plus a sentiment row.",
                            <>
                                A <strong>Verdict</strong> box at the bottom names who you&rsquo;re
                                comparing against and points you to Recommendations for the actual
                                next steps.
                            </>,
                        ]}
                    />
                    <GuideQA
                        question="Can I compare more than two rivals at once?"
                        answer="No — two is the maximum. Selecting a third replaces the oldest of your current two picks."
                    />
                </section>

                <section
                    id="workspace"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature <Badge variant="watch">Optional</Badge>
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Workspace
                    </h2>

                    <GuideCallout variant="warning">
                        <p>
                            This screen is a scripted demo, not a working feature yet. The chat only
                            recognizes a fixed set of sample questions about four made-up companies
                            — Northwind, PulseMetrics, Vantage, and Beacon — regardless of who you
                            actually analyzed. Uploading a document doesn&rsquo;t read it either:
                            clicking the upload area just adds a fake file name to the list. Treat
                            this screen as a preview of a planned feature, not a way to ask real
                            questions about your own competitors.
                        </p>
                    </GuideCallout>

                    <p className="text-sm text-muted-foreground">
                        Workspace is intended to let you upload your own documents and ask questions
                        grounded in everything the agents found. Click{" "}
                        <strong>Ask the intelligence</strong> on Recommendations, or the{" "}
                        <strong>Workspace</strong> tab in the step bar once it&rsquo;s unlocked. A{" "}
                        <strong>Documents</strong> panel sits on the left with a{" "}
                        <strong>Click to add a document to the workspace</strong> box; a{" "}
                        <strong>Chat</strong> panel sits on the right with suggested-question pills
                        and a text box.
                    </p>
                    <GuideSteps
                        items={[
                            "Click a suggested question, or type your own into the box and press Enter.",
                            "If your question matches one of the built-in sample topics, you get a canned answer with a citation you can click to open the Evidence Drawer.",
                            "Anything else returns a message saying it couldn't find an answer in the indexed sources.",
                        ]}
                    />
                </section>

                <section
                    id="history"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">History</h2>
                    <p className="text-sm text-muted-foreground">
                        History lists every analysis you&rsquo;ve run, so you can reopen a past
                        report without running it again. Unlike every other step, the{" "}
                        <strong>History</strong> tab is unlocked from the moment you log in, even
                        before your first analysis.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        A <strong>Search by company name</strong> box filters the list as you type.
                        Each row shows the company name, run date, threat-level badge, confidence
                        percentage (or &ldquo;No score yet&rdquo;), and an <strong>Open</strong>{" "}
                        button. <strong>Previous</strong> and <strong>Next</strong> buttons appear
                        once you have more than 10 past runs.
                    </p>
                    <GuideSteps
                        items={[
                            <>
                                Optionally type into <strong>Search by company name</strong> to
                                narrow the list.
                            </>,
                            <>
                                Click <strong>Open</strong> on the run you want. It reads
                                &ldquo;Opening&hellip;&rdquo; briefly.
                            </>,
                            "Rivalyze takes you straight to that run's Dashboard, with every step unlocked so you can also revisit Recommendations, Compare, and Workspace for it.",
                        ]}
                    />
                    <GuideQA
                        question="Can I delete an old analysis?"
                        answer="Not in this version — there's no delete option on this screen."
                    />
                </section>

                <section
                    id="evidence"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-primary uppercase">
                        Core feature
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Evidence drawer
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        A panel that slides in from the right, showing exactly which sources back up
                        a specific claim: source type, date, a quoted snippet, a link, and which
                        agent found it. Click a pill that reads something like &ldquo;&#9670; 2
                        sources&rdquo; to open it.
                    </p>

                    <GuideCallout variant="clarify">
                        <p>
                            This works reliably today from the Workspace chat&rsquo;s citations. On
                            Dashboard and Recommendations, the equivalent source-count badges are
                            currently display-only and don&rsquo;t open the drawer.
                        </p>
                    </GuideCallout>

                    <GuideSteps
                        items={[
                            "Click an evidence pill.",
                            "A panel slides in from the right, showing the claim in quotation marks, followed by one card per source.",
                            <>
                                Close it by clicking the <strong>&times;</strong> in the corner,
                                clicking outside the panel, or pressing Escape.
                            </>,
                        ]}
                    />
                </section>

                <section
                    id="settings"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        04
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Settings &amp; configuration
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Rivalyze doesn&rsquo;t have a dedicated settings page in this version. The
                        only user-adjustable option is the theme toggle — available on the homepage
                        top bar and on the step bar once you&rsquo;re logged in. It switches between
                        dark (the default) and light appearance and applies everywhere immediately.
                    </p>

                    <GuideCallout variant="clarify">
                        <p>
                            There is no account page and no visible way to change your email or
                            password, update notification preferences, or manage your profile from
                            inside the app.
                        </p>
                    </GuideCallout>
                </section>

                <section
                    id="troubleshooting"
                    className="scroll-mt-20 space-y-5 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        05
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Troubleshooting &amp; FAQ
                    </h2>

                    <GuideQA
                        question="I entered my email and password but got an error signing in."
                        answer="The message shown comes directly from the server — common causes are a wrong password, an email that's already registered (if signing up), or a network problem."
                    />
                    <GuideQA
                        question='I clicked "Start intelligence scan" and nothing happened.'
                        answer="Look for a red message above the button. It appears if your company name or idea text is too long, or contains text that looks like HTML or code."
                    />
                    <GuideQA
                        question="Discovery or the live run seems stuck."
                        answer="Each phase has a soft time limit — roughly a minute for Discovery, a few minutes for the full run. Past that point, Rivalyze shows an error and you'll need to restart from Brief."
                    />
                    <GuideQA
                        question="The SWOT section shows up twice on the Dashboard."
                        answer="That's a known display issue in the current build, not something you did — both copies show the same information."
                    />
                    <GuideQA
                        question="Nothing happens when I click a source count on Dashboard or Recommendations."
                        answer="Those badges aren't wired up to open the Evidence Drawer yet. Evidence links currently work reliably only from the Workspace chat."
                    />
                    <GuideQA
                        question="Workspace doesn't seem to know anything about my actual competitors."
                        answer="That's expected right now — Workspace is a scripted demo built around four fictional companies, not a live question-answering tool over your analysis."
                    />
                    <GuideQA
                        question={`I unchecked "Keep me logged in," but I'm still logged in later.`}
                        answer="That checkbox doesn't currently change anything — your session is saved to the browser either way."
                    />
                    <GuideQA
                        question="My PDF export looked cut off or oddly split across pages."
                        answer="The export renders the whole on-screen report as an image before turning it into a PDF, so very tall reports can split awkwardly at page breaks. Try again, or use the Markdown export on Recommendations instead."
                    />
                    <GuideQA
                        question="I was logged out without doing anything."
                        answer="Login sessions expire and are refreshed silently in the background; occasionally that refresh fails and you're signed out. Log back in — Rivalyze returns you to the page you were on."
                    />
                </section>

                <section
                    id="glossary"
                    className="scroll-mt-20 space-y-4 border-t border-border pt-10"
                >
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        06
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Glossary
                    </h2>
                    <dl className="space-y-3">
                        {GLOSSARY.map(({ term, definition }) => (
                            <div key={term}>
                                <dt className="text-sm font-semibold text-foreground">{term}</dt>
                                <dd className="text-sm text-muted-foreground">{definition}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
                    This guide reflects the state of the app at the time of writing and may not
                    match later versions.
                </footer>
            </div>
        </div>
    );
}

const GLOSSARY = [
    { term: "Rivalyze", definition: "The name of this application." },
    {
        term: "Agent",
        definition:
            "One of five automated researchers Rivalyze runs per analysis: Discovery, News, Product, Reviews, and Strategist.",
    },
    {
        term: "Threat level",
        definition:
            "An overall rating — Low, Medium/Moderate/Elevated, or High/Critical — summarizing how much competitive pressure a report found.",
    },
    {
        term: "Confidence",
        definition:
            "A percentage attached to a claim or recommendation, reflecting how many sources and agents agree and how recent the evidence is.",
    },
    {
        term: "Evidence / Evidence drawer",
        definition:
            "The sources behind a specific claim, viewable in a slide-in panel from the right of the screen.",
    },
    {
        term: "Direct competitor",
        definition:
            "A company that serves the same customer need in essentially the same way you do.",
    },
    {
        term: "Indirect competitor",
        definition:
            "A company that solves the same underlying problem through a different approach.",
    },
    {
        term: "Low-signal finding",
        definition:
            "An observation Rivalyze found but couldn't corroborate strongly enough to state with full confidence.",
    },
    {
        term: "Head-to-head",
        definition:
            "The side-by-side metric comparison between you and each competitor, shown on the Dashboard and in Compare.",
    },
    {
        term: "SWOT",
        definition:
            "Strengths, Weaknesses, Opportunities, Threats — a standard four-part framework for summarizing a competitive position.",
    },
    {
        term: "Run / Job",
        definition:
            "One complete pass through Discovery, News, Product, Reviews, and Strategist, triggered by a single Brief submission.",
    },
    {
        term: "Step bar",
        definition:
            "The row fixed to the top of the screen once you're logged in, showing your progress through the wizard plus tabs for Compare, Workspace, and History.",
    },
];
