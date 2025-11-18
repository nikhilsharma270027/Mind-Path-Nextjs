import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Bot, User, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  page: number;
  content: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sourcePages?: number[];
  sources?: Source[];
  timestamp?: Date;
  _id?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  loading: boolean;
  onSubmit: (content: string) => void;
}

export default function ChatInterface({
  messages,
  loading,
  onSubmit,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 🎤 Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setIsRecording(true);
      setErrorMsg("");
    };

    recognition.onerror = (event: any) => {
      console.log("Speech error:", event.error);

      if (event.error === "no-speech") {
        setErrorMsg("No speech detected. Try again.");
      } else if (event.error === "audio-capture") {
        setErrorMsg("Microphone not found or permission denied.");
      } else {
        setErrorMsg("Speech recognition error.");
      }

      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      console.log("Speech result:", text);

      if (text && text.trim().length > 0) {
        setInput((prev) => (prev ? prev + " " + text : text));
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // 🟢 Request Mic Permission
  async function requestMic() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Mic permission granted");
      return true;
    } catch (err) {
      console.log("Mic permission denied", err);
      setErrorMsg("Microphone permission denied.");
      return false;
    }
  }

  // 🎤 Start Listening
  const startListening = async () => {
    const permitted = await requestMic();
    if (!permitted) return;

    setErrorMsg("");
    recognitionRef.current.start();
  };

  // ⛔ Stop Listening
  const stopListening = () => {
    recognitionRef.current.stop();
    setIsRecording(false);
  };

  // ⬆️ submit message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSubmit(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#F2EDE0] rounded-lg border-2 border-black relative">
      {/* Header */}
      <div className="p-4 border-b border-black">
        <h2 className="text-lg font-semibold">Scriba Assistant</h2>
        <p className="text-sm text-muted-foreground">Ask questions about your document</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 pb-[90px] overflow-auto">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const messageId = message._id || `msg-${index}`;

            return (
              <div
                key={messageId}
                className={cn(
                  "flex gap-3 w-full",
                  message.role === "assistant" ? "justify-start" : "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}

                <Card
                  className={cn(
                    "max-w-[80%] p-4",
                    message.role === "assistant"
                      ? "bg-primary/10 rounded-tl-none"
                      : "bg-secondary/10 rounded-tr-none"
                  )}
                >
                  <span className="text-sm font-medium">
                    {message.role === "assistant" ? "AI Assistant" : "You"}
                  </span>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{message.content}</p>
                </Card>

                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}

          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* ERROR */}
      {errorMsg && (
        <div className="absolute bottom-[70px] left-0 w-full text-center text-red-500 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Input + Mic */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Button
            type="button"
            onClick={isRecording ? stopListening : startListening}
            className="h-12 w-12 rounded-full"
            variant={isRecording ? "destructive" : "secondary"}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 h-12 text-base px-4 rounded-full border-2"
          />

          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-12 px-6 rounded-full"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
