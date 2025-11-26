import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Users, CheckCircle2, Star, PlayCircle } from "lucide-react";

// Dynamically import the interactive demo (Client Component)
const InteractiveDemo = dynamic(() => import("@/components/homepage/interactive-demo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
      Loading Interactive Experience...
    </div>
  ),
});

export const metadata = {
  title: "ProjectPlanner - One place for projects, appointments, and sparks.",
  description: "The integrated workspace for time-pressed professionals. Manage projects, appointments, and ideas in one fluid interface.",
};

export default function Home() {
  return (

      <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {/* HERO SECTION */}
        <section className="relative mt-12  lg:mt-32 lg:pt-20 lg:pb-20 overflow-hidden section-padding ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">
              
              {/* Text Content */}
              <div className="flex-1 max-w-2xl text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  One place for <span className="text-primary">projects</span>,{" "}
                  <span className="text-secondary">appointments</span>, and{" "}
                  <span className="text-amber-500">sparks</span>.
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Stop switching apps. The only workspace that integrates your ideas, calendar, and tasks into one fluid workflow.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-primary/25 transition-all bg-primary hover:bg-primary/90 text-white" asChild>
                    <Link href="/register">
                      Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 group" asChild>
                    <Link href="#demo">
                      <PlayCircle className="mr-2 h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                      Watch 60-Second Demo
                    </Link>
                  </Button>
                </div>
                
                <p className="mt-6 text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card required
                  <span className="mx-2 hidden sm:inline">·</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> 14-day free trial
                </p>
              </div>

              {/* Interactive Demo */}
              <div className="flex-1 w-full max-w-[640px] lg:max-w-full relative z-10">
                <div className="relative rounded-xl overflow-hidden  hero-demo group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 -z-10" />
                  <InteractiveDemo />
                  
                  {/* Hint Overlay for interaction */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-1000">
                    Try dragging a task to the calendar
                  </div>
                </div>
                
                {/* Decorative BG elements */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* VALUE GRID */}
        <section className="py-24 bg-surface section-padding" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for high-velocity teams</h2>
              <p className="text-slate-600 text-lg">Every feature is designed to save you time, not consume it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Card 1: Time Intelligence */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Time Intelligence</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>Real-time availability sync</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>Smart meeting scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>Daily focus time protection</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Idea-to-Action */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Idea-to-Action Flow</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Quick-capture "Sparks"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Drag Sparks to Calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Convert notes to projects</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Team Sync */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Team Sync</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>Shared Kanban boards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>Role-based permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>Instant activity feed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="py-20 border-y border-slate-100 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Trusted by modern teams</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />)}
                </div>
                <p className="text-slate-700 italic mb-4">"Reduced our weekly planning meetings by 70%. The integration between sparks and the calendar is a game changer."</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">JD</div>
                  <div>
                    <div className="font-semibold text-slate-900">Jane Doe</div>
                    <div className="text-xs text-slate-500">Product Manager, TechFlow</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />)}
                </div>
                <p className="text-slate-700 italic mb-4">"Finally, a tool that works as fast as I do. No more switching between Notion and Google Calendar."</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">MS</div>
                  <div>
                    <div className="font-semibold text-slate-900">Mark Smith</div>
                    <div className="text-xs text-slate-500">Engineering Lead, StartUp Inc</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-slate-900"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Stop switching apps. <br />
              <span className="text-indigo-400">Start delivering projects.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join the new standard of project management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all w-full sm:w-auto" asChild>
                <Link href="/register">
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-700 hover:bg-slate-800 text-white hover:text-white bg-transparent w-full sm:w-auto" asChild>
                <Link href="/pricing">
                  See Team Pricing
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

  );
}
