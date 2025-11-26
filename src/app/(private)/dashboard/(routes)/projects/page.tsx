import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

const ProjectPage = () => {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto bg-slate-50/50 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
        <p className="text-slate-500">Manage your projects or create a new one with AI assistance.</p>
      </div>

      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
           <Sparkles className="w-32 h-32 text-indigo-500" />
        </div>
        
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-sm">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl text-indigo-950">AI Project Architect</CardTitle>
              <CardDescription className="text-indigo-900/70">
                Transform your ideas into structured project plans instantly.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea 
              placeholder="Describe your project idea... (e.g., 'Build a CRM for a small bakery with customer loyalty tracking')" 
              className="min-h-[120px] resize-none bg-white/60 backdrop-blur-sm border-indigo-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 text-base placeholder:text-indigo-300"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-indigo-100/50 bg-white/40 px-6 py-4">
          <p className="text-xs text-indigo-400 font-medium">Powered by advanced AI models</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectPage;