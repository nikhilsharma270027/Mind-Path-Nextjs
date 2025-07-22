"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Brain, BrainCircuit, Clock1 } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeatureGrid";

const features = [
  {
    icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#7fb236]" />,
    title: "Customized Study Plans",
    description: "Receive study plans tailored to your academic goals and preferred learning pace."
  },
  {
    icon: <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-[#7fb236]" />,
    title: "AI-Picked Learning Resources",
    description: "Explore high-quality resources intelligently selected by our AI to boost your learning."
  },
  {
    icon: <Clock1 className="h-5 w-5 sm:h-6 sm:w-6 text-[#7fb236]" />,
    title: "Smart Time Scheduling",
    description: "Stay organized and productive with tools to efficiently manage your study time."
  }
];


export default function Page() {
    const { data : session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    return (
        <div className="container mx-auto px-4 py-12 sm:py-36 bg-transparent">
           <HeroSection 
              title="Welcome to"
              highlighttext="MindPath"
              description="Your AI-powered study companion for personalized learning."
              ctaText={session ? "Move to Dashboard" : "Get Started"}
              ctaLink={session ? "/dashboard" : "/register"}
           />

           <FeaturesGrid features={features} />
        </div>
    );
}