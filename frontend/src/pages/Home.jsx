import { Link } from "react-router";
import DemoCanvas from "../components/DemoCanvas";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-bg-app text-text-primary overflow-x-hidden lg:grid lg:items-center">

            {/* Full Screen Background Canvas */}
            <div className="max-lg:hidden absolute inset-0 z-0 overflow-hidden">
                {/* A subtle teal glow behind the canvas to make it pop */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(74,139,154,0.15)_0%,transparent_60%)] pointer-events-none z-10" />
                <DemoCanvas />
            </div>

            {/* Foreground Content Container */}
            <div className="relative z-20 w-full px-6 md:px-10 pointer-events-none">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-28 lg:pt-0">

                    {/* Left Side: Content Panel */}
                    <div className="flex flex-col space-y-12 py-8 px-4 md:px-6 md:py-8 pointer-events-auto backdrop-blur-[2px] z-20 rounded-3xl">

                        {/* Header */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight">
                                Map Your Mind. <br />
                                <span className="text-accent-teal">Connect the Data.</span>
                            </h1>
                            <p className="text-text-secondary text-lg leading-relaxed">
                                A boundless, interactive workspace to visually map out complex logic, workflows, and structures. <span className="font-bold text-white">Trace paths effortlessly with our built-in connection search</span>, instantly revealing the hidden links between any two distant nodes. Built for <span className="font-bold text-accent-teal">speed, clarity</span>, and <span className="font-bold text-accent-teal">absolute privacy</span>.
                            </p>
                        </div>

                        {/* Dynamic Scenarios */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold border-b border-border-subtle pb-2 uppercase tracking-widest font-mono text-sm text-text-secondary">Dynamic Scenarios</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-mono font-medium text-text-primary">Investigative Boards</h3>
                                    <p className="text-sm text-text-secondary">Map out complex investigations, connecting suspects and evidence with interactive strings.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-medium text-text-primary">Architectural Planning</h3>
                                    <p className="text-sm text-text-secondary">Visually map component trees, schemas, or API flows before writing a line of code.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-medium text-text-primary">Interactive Storyboards</h3>
                                    <p className="text-sm text-text-secondary">Map out branching narratives, dialogue trees, or complex game mechanics.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-medium text-text-primary">Project Workflows</h3>
                                    <p className="text-sm text-text-secondary">Build custom visual pipelines to track tasks and media buying structures.</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="pt-8 flex flex-col items-start">
                            <div className="relative inline-block group hover:scale-105 transition-transform duration-300 mt-2">
                                {/* Outer Glow */}
                                <div className="absolute -inset-1 bg-accent-teal/40 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-500 animate-[pulse_3s_ease-in-out_infinite]"></div>

                                <div className="relative overflow-hidden rounded-full p-[2px] shadow-2xl">
                                    {/* Rotating Border Element */}
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#ffffff_50%,transparent_100%)] opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

                                    <Link
                                        to="/register"
                                        className="relative flex items-center justify-between bg-bg-app/60 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-white pl-8 pr-2 py-2 rounded-full transition-colors duration-300 z-10 min-w-[280px]"
                                    >
                                        <span className="font-sans font-medium text-lg tracking-wide mr-6">Access Workspace</span>

                                        {/* Solid Inner Pill */}
                                        <div className="bg-accent-teal text-bg-app rounded-full p-3 flex items-center justify-center shadow-[0_0_15px_rgba(74,139,154,0.5)]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <p className="mt-8 text-sm font-mono text-text-secondary">
                                Sign in to sync your boards, or login as a guest to explore.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Demo Canvas (Mobile Inline / Desktop Empty Spacer) */}
                    <div className="w-full h-[500px] lg:h-[600px] pointer-events-auto lg:pointer-events-none relative overflow-hidden mt-8 lg:mt-0">
                        {/* Render DemoCanvas inline on mobile ONLY */}
                        <div className="max-lg:block lg:hidden absolute inset-0 z-0 bg-[#0f1115] border-y border-border-subtle">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(74,139,154,0.15)_0%,transparent_60%)] pointer-events-none z-10" />
                            <DemoCanvas isCentered={true} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}