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
    <div className="relative mt-10">
      <label className="block text-sm font-medium text-purple-200 mb-2 drop-shadow-sm">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-md px-3 py-2 text-left text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-lg"
        >
          <span>
            {selectedValue} {suffix}
          </span>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute z-20 w-full bg-gray-900/95 backdrop-blur-lg border border-purple-400/50 rounded-md shadow-2xl max-h-40 overflow-auto ${
              isBreakDropdown ? 'bottom-full mb-1' : 'mt-1'
            }`}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className={`w-full px-3 py-2 text-left hover:bg-purple-600/60 focus:outline-none focus:bg-purple-600/60 transition-all ${
                  selectedValue === option
                    ? 'bg-purple-600/80 text-white'
                    : 'text-gray-100'
                }`}
              >
                {option} {suffix}
                {selectedValue === option && (
                  <span className="float-right text-purple-300">✓</span>
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
    <div
      className="min-h-220 p-4 relative"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(139, 69, 199, 0.3) 0%, rgba(88, 28, 135, 0.4) 25%, rgba(67, 56, 202, 0.5) 50%, rgba(30, 27, 75, 0.8) 75%, rgba(15, 15, 35, 0.95) 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated stars */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div> */}

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Study Timer
          </h1>
          <p className="text-purple-200">Track your focus sessions</p>
        </header>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 drop-shadow-md">
                {isBreakTime ? 'Break Time' : 'Focus Time'}
              </h2>
              <div className="text-6xl font-bold text-white mb-6 font-mono drop-shadow-lg">
                {formatTime(timeLeft)}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="px-6 py-2 bg-purple-600/80 backdrop-blur-sm text-white rounded-md hover:bg-purple-700/80 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all border border-purple-400/30 shadow-lg"
                >
                  Start
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-md hover:bg-white/30 font-medium transition-all shadow-lg"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <Dropdown
                isOpen={focusDropdownOpen}
                setIsOpen={setFocusDropdownOpen}
                selectedValue={focusDuration}
                options={focusOptions}
                onSelect={handleFocusDurationChange}
                label="Focus Duration (minutes)"
              />
              <Dropdown
                isOpen={breakDropdownOpen}
                setIsOpen={setBreakDropdownOpen}
                selectedValue={breakDuration}
                options={breakOptions}
                onSelect={handleBreakDurationChange}
                label="Break Duration (minutes)"
              />
            </div>
          </div>
        </div>

        {isRunning && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-purple-900/40 backdrop-blur-md text-purple-100 rounded-full text-sm font-medium border border-purple-400/30 shadow-lg">
              <div className="w-2 h-2 bg-purple-300 rounded-full mr-2 animate-pulse"></div>
              {isBreakTime ? 'Take a break!' : 'Focus time active'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
