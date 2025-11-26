import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Users, CheckCircle2, Phone, Kanban, Workflow, Bot, PenTool, Star, Shield, Globe, Trophy } from "lucide-react";

// Dynamically import the interactive demo (Client Component)
const InteractiveDemo = dynamic(() => import("@/components/homepage/interactive-demo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full animate-pulse rounded-xl flex items-center justify-center text-slate-400">
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
                    <Link href="mailto:sales@projectplanner.com">
                      <Phone className="mr-2 h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                      Talk to Sales
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
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 -z-10" /> */}
                  <InteractiveDemo />
                  
                 
                </div>
                
                {/* Decorative BG elements */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY */}
        {/* <section className="py-10 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by forward-thinking teams at</p>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Globe className="w-6 h-6" /> GlobalTech</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Zap className="w-6 h-6" /> FlashWorks</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Shield className="w-6 h-6" /> SecureNet</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Trophy className="w-6 h-6" /> WinCorp</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Bot className="w-6 h-6" /> AI Systems</div>
             </div>
          </div>
        </section> */}

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
                    <span>Quick-capture &quot;Sparks&quot;</span>
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

        {/* ALL-IN-ONE PLATFORM */}
        <section className="py-20 border-y border-slate-100 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need in one place</h2>
              <p className="text-slate-600 text-lg">Powering your workflow from idea to execution.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1: Kanban */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                  <Kanban className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Visual Boards</h3>
                <p className="text-sm text-slate-600">Track progress with flexible Kanban boards. Drag, drop, and done.</p>
              </div>

              {/* Feature 2: Diagrams */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                  <Workflow className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Diagrams</h3>
                <p className="text-sm text-slate-600">Create flowcharts and system diagrams with code-like precision.</p>
              </div>

              {/* Feature 3: AI Assistant */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                  <Bot className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">AI Powered</h3>
                <p className="text-sm text-slate-600">Generate tasks, summaries, and ideas with your intelligent assistant.</p>
              </div>

              {/* Feature 4: Whiteboards */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                  <PenTool className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Whiteboards</h3>
                <p className="text-sm text-slate-600">Brainstorm freely on an infinite canvas. Collaborate in real-time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-slate-50 section-padding">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by productivity obsessives</h2>
                <p className="text-slate-600 text-lg">Don&apos;t just take our word for it.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Testimonial 1 */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex gap-1 text-amber-400 mb-4">
                        {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-700 mb-6 italic">&quot;Finally, a tool that actually understands how my brain works. The ability to drag a note directly onto my calendar is a game changer.&quot;</p>
                      <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">SJ</div>
                          <div>
                              <div className="font-bold text-slate-900">Sarah Jenkins</div>
                              <div className="text-xs text-slate-500">Product Manager, TechFlow</div>
                          </div>
                      </div>
                  </div>

                   {/* Testimonial 2 */}
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex gap-1 text-amber-400 mb-4">
                        {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-700 mb-6 italic">&quot;We moved our entire engineering team to ProjectPlanner. The Kanban boards combined with the diagramming tools makes it indispensable.&quot;</p>
                      <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">MR</div>
                          <div>
                              <div className="font-bold text-slate-900">Michael Ross</div>
                              <div className="text-xs text-slate-500">CTO, StartUp Inc</div>
                          </div>
                      </div>
                  </div>

                   {/* Testimonial 3 */}
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex gap-1 text-amber-400 mb-4">
                        {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-700 mb-6 italic">&quot;I used to use 5 different apps. Now I use one. The mental clarity I&apos;ve gained is worth 10x the subscription price.&quot;</p>
                      <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">EL</div>
                          <div>
                              <div className="font-bold text-slate-900">Elena Lopez</div>
                              <div className="text-xs text-slate-500">Freelance Designer</div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </section>

        {/* PRICING */}
        <section className="py-24 bg-white section-padding" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
                <p className="text-slate-600 text-lg">Start for free, scale as you grow.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 {/* Free Plan */}
                 <div className="p-8 rounded-3xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors relative">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-2">$0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
                    <p className="text-slate-500 mb-6">Perfect for individuals.</p>
                    <Button variant="outline" className="w-full mb-8 rounded-full" asChild>
                        <Link href="/register">Get Started</Link>
                    </Button>
                    <ul className="space-y-3 text-slate-600 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 3 Projects</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic Kanban</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 7-day History</li>
                    </ul>
                 </div>

                 {/* Pro Plan */}
                 <div className="p-8 rounded-3xl border-2 border-indigo-600 bg-white shadow-xl relative scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-2">$12<span className="text-lg text-slate-500 font-medium">/mo</span></div>
                    <p className="text-slate-500 mb-6">For power users.</p>
                    <Button className="w-full mb-8 rounded-full bg-indigo-600 hover:bg-indigo-700" asChild>
                        <Link href="/register">Start Free Trial</Link>
                    </Button>
                    <ul className="space-y-3 text-slate-600 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Unlimited Projects</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Advanced Diagrams</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> AI Assistant</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Priority Support</li>
                    </ul>
                 </div>

                 {/* Team Plan */}
                 <div className="p-8 rounded-3xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors relative">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Team</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-2">$29<span className="text-lg text-slate-500 font-medium">/user</span></div>
                    <p className="text-slate-500 mb-6">Collaborate with ease.</p>
                    <Button variant="outline" className="w-full mb-8 rounded-full" asChild>
                        <Link href="/register">Contact Sales</Link>
                    </Button>
                    <ul className="space-y-3 text-slate-600 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Everything in Pro</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Team Permissions</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Shared Workspaces</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> SSO & Admin Tools</li>
                    </ul>
                 </div>
              </div>
            </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-slate-50 section-padding">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-600 text-lg">Everything you need to know about the product and billing.</p>
                </div>

                <div className="space-y-4">
                    <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden open:ring-2 open:ring-indigo-500/20">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                            Is there a free trial?
                            <span className="shrink-0 ml-1.5 transition duration-300 group-open:-rotate-180">
                                <ArrowRight className="w-4 h-4 rotate-90" />
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-slate-600">
                            Yes, you can try ProjectPlanner for free for 14 days. If you want to continue, you can choose one of our paid plans.
                        </p>
                    </details>

                    <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden open:ring-2 open:ring-indigo-500/20">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                            Can I cancel at any time?
                            <span className="shrink-0 ml-1.5 transition duration-300 group-open:-rotate-180">
                                <ArrowRight className="w-4 h-4 rotate-90" />
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-slate-600">
                            Absolutely. There are no lock-in contracts or cancellation fees. You can cancel your subscription at any time from your account settings.
                        </p>
                    </details>

                    <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden open:ring-2 open:ring-indigo-500/20">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                            How does the &quot;Sparks&quot; feature work?
                            <span className="shrink-0 ml-1.5 transition duration-300 group-open:-rotate-180">
                                <ArrowRight className="w-4 h-4 rotate-90" />
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-slate-600">
                            Sparks are quick-capture notes for your ideas. You can convert them into tasks, projects, or drag them directly onto your calendar to schedule time for them.
                        </p>
                    </details>

                     <details className="group bg-white rounded-xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden open:ring-2 open:ring-indigo-500/20">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                            Do you offer team discounts?
                            <span className="shrink-0 ml-1.5 transition duration-300 group-open:-rotate-180">
                                <ArrowRight className="w-4 h-4 rotate-90" />
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-slate-600">
                            Yes! For teams larger than 10 members, please contact our sales team for custom pricing and dedicated support.
                        </p>
                    </details>
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
