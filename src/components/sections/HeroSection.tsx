import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Link } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroSectionProps {
    logo?: string;
    title: string;
    highlighttext: string;
    description: string;
    ctaText: string;
    ctaLink: string;
}
export const HeroSection = ({logo='📚', title, highlighttext, description, ctaText, ctaLink }: HeroSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
     <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-b-4 border-r-4 ">
        <span className="text-3xl">{logo}</span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-purple-300">
        {title} <span className="text-[#7fb236]">{highlighttext}</span>
      </h1>
      <p className="mt-3 text-lg text-white mb-8">
        {description}
      </p>
      <Link href={ctaLink}>
        <Button className="bg-[#c1ff72] hover:bg-[#b1ef62] text-gray-800 rounded-full px-6 py-6 text-lg border-2 border-b-4 border-r-4 border-black">
          {ctaText}
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </Link>
    </motion.div>
  )
}
