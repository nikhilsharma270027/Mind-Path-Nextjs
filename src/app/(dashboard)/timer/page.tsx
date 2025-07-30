"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const focusOptions: number[] = [15, 25, 30, 45, 60];
const breakOptions: number[] = [5, 10, 15, 20];

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue: number;
  options: number[];
  onSelect: (value: number) => void;
  label: string;
  suffix?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  setIsOpen,
  selectedValue,
  options,
  onSelect,
  label,
  suffix = 'minutes',
}) => {
  const isBreakDropdown = label.includes('Break');

  return (
    <div className="relative mt-6">
      <label className="block text-sm font-medium text-white/90 mb-3 drop-shadow-sm tracking-wide">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-left text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          <span className="drop-shadow-sm font-medium">
            {selectedValue} {suffix}
          </span>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute z-20 w-full bg-black/30 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl max-h-48 overflow-auto ${
              isBreakDropdown ? 'bottom-full mb-2' : 'mt-2'
            }`}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className={`w-full px-4 py-3 text-left hover:bg-white/15 focus:outline-none focus:bg-white/15 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  selectedValue === option
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/90'
                }`}
              >
                <span className="drop-shadow-sm">
                  {option} {suffix}
                </span>
                {selectedValue === option && (
                  <span className="float-right text-white/80 text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StudyTimer: React.FC = () => {
  const [focusDuration, setFocusDuration] = useState<number>(60);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreakTime, setIsBreakTime] = useState<boolean>(false);
  const [focusDropdownOpen, setFocusDropdownOpen] = useState<boolean>(false);
  const [breakDropdownOpen, setBreakDropdownOpen] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (isBreakTime) {
        setIsBreakTime(false);
        setTimeLeft(focusDuration * 60);
      } else {
        setIsBreakTime(true);
        setTimeLeft(breakDuration * 60);
      }
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isRunning, timeLeft, focusDuration, breakDuration, isBreakTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreakTime(false);
    setTimeLeft(focusDuration * 60);
  };

  const handleFocusDurationChange = (duration: number) => {
    setFocusDuration(duration);
    if (!isBreakTime) {
      setTimeLeft(duration * 60);
    }
    setFocusDropdownOpen(false);
  };

  const handleBreakDurationChange = (duration: number) => {
    setBreakDuration(duration);
    if (isBreakTime) {
      setTimeLeft(duration * 60);
    }
    setBreakDropdownOpen(false);
  };

  return (
    <div className="min-h-screen p-4 relative w-full text-white">
      {/* Glass overlay for full coverage */}
      <div className="fixed bg-black/20 backdrop-blur-sm pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Study Timer
          </h1>
          <p className="text-white/80 text-lg drop-shadow-sm">Track your focus sessions</p>
        </header>

        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-lg mx-auto overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 rounded-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2 drop-shadow-md">
                  {isBreakTime ? '🌟 Break Time' : '🎯 Focus Time'}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full" />
              </div>
              
              <div className="relative mb-8">
                <div className="text-7xl font-bold text-white mb-2 font-mono drop-shadow-lg tracking-wider">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/60 text-sm uppercase tracking-widest font-medium">
                  {isBreakTime ? 'Break Session' : 'Focus Session'}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/20 font-medium transition-all duration-200 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                >
                  {isRunning ? 'Running...' : 'Start'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/15 font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-6 border-t border-white/10 pt-8">
              <Dropdown
                isOpen={focusDropdownOpen}
                setIsOpen={setFocusDropdownOpen}
                selectedValue={focusDuration}
                options={focusOptions}
                onSelect={handleFocusDurationChange}
                label="Focus Duration"
              />
              <Dropdown
                isOpen={breakDropdownOpen}
                setIsOpen={setBreakDropdownOpen}
                selectedValue={breakDuration}
                options={breakOptions}
                onSelect={handleBreakDurationChange}
                label="Break Duration"
              />
            </div>
          </div>
        </div>

        {isRunning && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20 shadow-lg">
              <div className="w-3 h-3 bg-white/80 rounded-full mr-3 animate-pulse shadow-sm"></div>
              <span className="drop-shadow-sm">
                {isBreakTime ? '✨ Take a well-deserved break!' : '🔥 Focus time is active'}
              </span>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-8 max-w-lg mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-full h-2 border border-white/20 shadow-inner">
            <div 
              className="bg-gradient-to-r from-white/40 to-white/60 h-full rounded-full transition-all duration-1000 shadow-sm"
              style={{ 
                width: `${((isBreakTime ? breakDuration : focusDuration) * 60 - timeLeft) / ((isBreakTime ? breakDuration : focusDuration) * 60) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-2 font-medium">
            <span>Start</span>
            <span>{isBreakTime ? 'Break' : 'Focus'} Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;