"use client"

import { useEffect, useState } from 'react';
// import { ContributionCalendar } from 'react-contribution-calendar';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from 'next-auth/react';
// import PacmanLoader from 'react-spinners/PacmanLoader';

interface StudySession {
  duration: number;
  startTime: string;
  endTime: string;
  mode: string;
}

interface DailySession {
  count: number;
  totalDuration: number;
  sessions: StudySession[];
}

interface StudyStats {
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  studySessions: {
    [key: string]: DailySession;
  };
}

interface CalendarDataPoint {
  level: number;
  data: {
    count: number;
    duration: number;
    details: string;
  };
}

interface SessionData {
  studySessions: {
    [key: string]: DailySession;
  };
  totalStudyHours: number;
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string;
}

// Custom theme for the calendar using our color scheme
const customTheme = {
  level0: 'var(--color-cream-900)',
  level1: 'var(--color-aqua-100)',
  level2: 'var(--color-aqua-500)',
  level3: 'var(--color-teal-800)',
  level4: 'var(--color-navy-900)',
};

export default function DashboardHome() {

  return (
    <div className="space-y-4 px-2 py-4 sm:p-4 md:space-y-8 md:p-6 lg:p-8 bg-background">
      hello world
    </div>
  );
}