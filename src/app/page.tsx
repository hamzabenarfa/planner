"use client";

import React from "react";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  Layout,
  Users,
  Zap,
  Layers,
  PieChart,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100 inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                v2.0 is now live
              </span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight"
            >
              Manage Projects with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                Precision & Speed
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The all-in-one workspace for agile teams. Streamline your workflow with powerful Kanban boards, real-time collaboration, and data-driven insights.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/register">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-slate-200 hover:bg-slate-50 text-slate-700" asChild>
                <Link href="#features">
                  See Features
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to help your team focus on what matters most—building great products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="h-8 w-8 text-blue-500" />}
              title="Kanban Boards"
              description="Visualize your workflow with intuitive drag-and-drop boards. Customize columns to fit your process."
            />
            <FeatureCard
              icon={<BarChart2 className="h-8 w-8 text-teal-500" />}
              title="Burndown Charts"
              description="Track sprint progress in real-time. Identify bottlenecks and ensure on-time delivery."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-500" />}
              title="Team Collaboration"
              description="Work together seamlessly. Assign tasks, leave comments, and share updates instantly."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-amber-500" />}
              title="Agile Workflows"
              description="Built for Scrum and Agile methodologies. Manage sprints, backlogs, and stories effortlessly."
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-purple-500" />}
              title="Project Planning"
              description="Plan roadmaps and milestones. Keep stakeholders aligned with clear project timelines."
            />
            <FeatureCard
              icon={<PieChart className="h-8 w-8 text-rose-500" />}
              title="AI Insights"
              description="Leverage AI to analyze team performance and get actionable recommendations for improvement."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">10k+</div>
              <div className="text-slate-500 font-medium">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">500+</div>
              <div className="text-slate-500 font-medium">Teams</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">1M+</div>
              <div className="text-slate-500 font-medium">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">99.9%</div>
              <div className="text-slate-500 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 -z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to transform how you work?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who use our platform to deliver projects faster and more efficiently.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-teal-500 hover:bg-teal-400 text-white shadow-lg hover:shadow-teal-500/25 transition-all" asChild>
            <Link href="/register">
              Start Your Free Trial
            </Link>
          </Button>
          <p className="mt-6 text-sm text-slate-400">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-xl text-slate-900">ProjectPlanner</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ProjectPlanner. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-6 p-3 bg-slate-50 rounded-xl w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
