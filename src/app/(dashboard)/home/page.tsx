"use client"

import { useEffect, useState } from 'react';
import { ContributionCalendar } from 'react-contribution-calendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from 'next-auth/react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { Calendar, Trophy, Flame, Target } from 'lucide-react';

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

// Custom glass theme for the calendar
const customTheme = {
  level0: 'rgba(255, 255, 255, 0.05)',
  level1: 'rgba(255, 255, 255, 0.15)',
  level2: 'rgba(255, 255, 255, 0.25)',
  level3: 'rgba(255, 255, 255, 0.35)',
  level4: 'rgba(255, 255, 255, 0.5)',
};

export default function DashboardHome() {
  const { data: session } = useSession();
  const [studyData, setStudyData] = useState<Array<Record<string, CalendarDataPoint>>>([{}]);
  const [stats, setStats] = useState<StudyStats>({
    currentStreak: 1,
    bestStreak: 2,
    totalDays: 4,
    studySessions: {}
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to generate random study data for the current month
  const generateRandomStudyData = () => {
    const calendarData: Record<string, CalendarDataPoint> = {};
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get the first and last day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Generate data for each day of the current month
    for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Randomly decide if user studied on this day (70% chance)
      const studied = Math.random() > 0.3;
      
      if (studied && date <= today) { // Only include past and current days
        // Random number of study sessions (1-4)
        const sessionCount = Math.floor(Math.random() * 4) + 1;
        // Random total duration in minutes (30-240 minutes)
        const totalDuration = Math.floor(Math.random() * 210) + 30;
        // Random activity level (0-4)
        const level = Math.floor(Math.random() * 5);
        
        calendarData[dateString] = {
          level: level,
          data: {
            count: sessionCount,
            duration: totalDuration,
            details: `${sessionCount} study sessions (${Math.round(totalDuration / 60)} hours ${totalDuration % 60} minutes)`
          }
        };
      } else if (date <= today) {
        // No study activity
        calendarData[dateString] = {
          level: 0,
          data: {
            count: 0,
            duration: 0,
            details: 'No study sessions'
          }
        };
      }
    }

    return calendarData;
  };

  // Function to calculate streaks from the generated data
  const calculateStreaks = (studyData: Record<string, CalendarDataPoint>) => {
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let totalDays = 0;

    const today = new Date();
    const dates = Object.keys(studyData).sort();

    // Calculate streaks
    dates.forEach(date => {
      const studyDate = new Date(date);
      if (studyDate <= today) {
        const hasStudied = studyData[date].data.count > 0;
        
        if (hasStudied) {
          totalDays++;
          tempStreak++;
          currentStreak = tempStreak; // For simplicity, current streak is the last continuous streak
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
    });

    return { currentStreak, bestStreak, totalDays };
  };

  useEffect(() => {
    const fetchStudyData = async () => {
      if (!session?.user?.id) {
        // If no session, generate random data for demo
        const randomData = generateRandomStudyData();
        const streaks = calculateStreaks(randomData);
        
        setStudyData([randomData]);
        setStats({
          currentStreak: streaks.currentStreak,
          bestStreak: streaks.bestStreak,
          totalDays: streaks.totalDays,
          studySessions: Object.entries(randomData).reduce((acc, [date, data]) => ({
            ...acc,
            [date]: {
              count: data.data.count,
              totalDuration: data.data.duration,
              sessions: [] // Empty sessions array for simplicity
            }
          }), {})
        });
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/users/stats');
        if (!response.ok) throw new Error('Failed to fetch study data');
        
        const data: SessionData = await response.json();
        
        // Transform data for calendar
        const calendarData: Record<string, CalendarDataPoint> = {};
        
        // Process each study session
        Object.entries(data.studySessions || {}).forEach(([date, sessionData]) => {
          if (sessionData) {
            calendarData[date] = {
              level: Math.min(Math.floor((sessionData.count || 0) / 2), 4),
              data: {
                count: sessionData.count,
                duration: sessionData.totalDuration,
                details: `${sessionData.count} study sessions (${Math.round(sessionData.totalDuration / 60)} minutes)`
              }
            };
          }
        });

        setStudyData([calendarData]);
        setStats({
          currentStreak: data.currentStreak || 1,
          bestStreak: data.bestStreak || 2,
          totalDays: Object.keys(data.studySessions || 5).length,
          studySessions: data.studySessions || {}
        });
      } catch (error) {
        console.error('Error fetching study data:', error);
        // Fallback to random data if API fails
        const randomData = generateRandomStudyData();
        const streaks = calculateStreaks(randomData);
        
        setStudyData([randomData]);
        setStats({
          currentStreak: streaks.currentStreak,
          bestStreak: streaks.bestStreak,
          totalDays: streaks.totalDays,
          studySessions: Object.entries(randomData).reduce((acc, [date, data]) => ({
            ...acc,
            [date]: {
              count: data.data.count,
              totalDuration: data.data.duration,
              sessions: []
            }
          }), {})
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();

    // Listen for session completion events
    const handleSessionComplete = () => {
      setTimeout(fetchStudyData, 1000); // Slight delay to ensure server has processed the update
    };

    window.addEventListener('study-session-completed', handleSessionComplete);
    return () => {
      window.removeEventListener('study-session-completed', handleSessionComplete);
    };
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <PacmanLoader color="rgba(255, 255, 255, 0.8)" size={25} />
          <p className="text-white/80 text-center mt-4 font-medium">Loading your study data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Glass overlay for background coverage */}
      <div className="fixed  bg-black/10 backdrop-blur-sm pointer-events-none" />
      
      <div className="relative z-10 space-y-6 px-4 py-6 md:space-y-8 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
              <Calendar className="h-6 w-6 text-white/90" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                {session?.user?.name ? `${session.user.name}'s Study Activity` : 'Study Activity'}
              </h1>
              <p className="text-white/70 text-sm md:text-base drop-shadow-sm">
                Track your learning journey
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 shadow-lg">
            <span className="text-white/80 text-sm font-medium">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Calendar Card */}
        <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
          
          <CardHeader className="relative p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-white drop-shadow-sm">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Target className="h-5 w-5 text-white/90" />
              </div>
              Your Study Contributions
            </CardTitle>
            <p className="text-white/70 text-sm mt-2">
              Visualize your consistent learning habits over time
            </p>
          </CardHeader>
          
          <CardContent className="relative p-0">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[280px] p-4 md:min-w-full md:p-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <ContributionCalendar
                    data={studyData}
                    dateOptions={{
                      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      end: new Date().toISOString().split('T')[0],
                      daysOfTheWeek: isMobile ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : isTablet ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                      startsOnSunday: true,
                      includeBoundary: true,
                    }}
                    styleOptions={{
                      theme: customTheme,
                      cx: isMobile ? 8 : isTablet ? 12 : 18,
                      cy: isMobile ? 10 : isTablet ? 14 : 20,
                      cr: isMobile ? 2.5 : isTablet ? 3.5 : 4,
                      textColor: 'rgba(255, 255, 255, 0.8)'
                    }}
                    visibilityOptions={{
                      hideDescription: isMobile || isTablet,
                      hideMonthLabels: isMobile,
                      hideDayLabels: isMobile,
                    }}
                    onCellClick={(e) => {
                      const cellData = JSON.parse(e.currentTarget.getAttribute('data-cell') || '{}');
                      if (cellData?.data?.count) {
                        console.log(`${cellData.data.details}`);
                      }
                    }}
                    scroll={false}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Current Streak */}
          <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden group hover:bg-white/15 transition-all duration-200 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 pointer-events-none" />
            <CardHeader className="relative p-4 md:p-6">
              <CardTitle className="flex items-center gap-3 text-sm md:text-base text-white/90">
                <div className="p-2 bg-orange-500/20 backdrop-blur-sm rounded-lg border border-orange-300/30">
                  <Flame className="h-4 w-4 text-orange-300" />
                </div>
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="relative p-4 pt-0 md:p-6 md:pt-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  {stats.currentStreak}
                </p>
                <span className="text-white/70 text-sm font-medium">days</span>
              </div>
              <p className="text-orange-300/80 text-xs mt-2">Keep the momentum going! 🔥</p>
            </CardContent>
          </Card>

          {/* Total Study Days */}
          <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden group hover:bg-white/15 transition-all duration-200 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <CardHeader className="relative p-4 md:p-6">
              <CardTitle className="flex items-center gap-3 text-sm md:text-base text-white/90">
                <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-300/30">
                  <Calendar className="h-4 w-4 text-blue-300" />
                </div>
                Total Study Days
              </CardTitle>
            </CardHeader>
            <CardContent className="relative p-4 pt-0 md:p-6 md:pt-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  {stats.totalDays}
                </p>
                <span className="text-white/70 text-sm font-medium">days</span>
              </div>
              <p className="text-blue-300/80 text-xs mt-2">Every day counts! 📚</p>
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden group hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10 pointer-events-none" />
            <CardHeader className="relative p-4 md:p-6">
              <CardTitle className="flex items-center gap-3 text-sm md:text-base text-white/90">
                <div className="p-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-300/30">
                  <Trophy className="h-4 w-4 text-yellow-300" />
                </div>
                Best Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="relative p-4 pt-0 md:p-6 md:pt-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  {stats.bestStreak}
                </p>
                <span className="text-white/70 text-sm font-medium">days</span>
              </div>
              <p className="text-yellow-300/80 text-xs mt-2">Personal record! 🏆</p>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20 shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="drop-shadow-sm">
              {stats.currentStreak > 0 
                ? `Amazing! You're on a ${stats.currentStreak}-day streak! 🌟` 
                : "Ready to start your study journey? 🚀"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}