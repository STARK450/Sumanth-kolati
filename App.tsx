import React, { useState, useEffect, useRef } from 'react';
import DemoOne from './components/ui/demo';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { GoogleGenAI } from "@google/genai";
import { Loader2, MessageSquare, Send, X, Info, Github, Twitter, Linkedin, ChevronDown, Settings2, ExternalLink, Mail, ArrowUpRight, Briefcase } from 'lucide-react';
import { cn } from './components/utils';

// --- Types & Interfaces ---

interface Project {
  title: string;
  category: string;
  description: string;
  link?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// --- Resume Data ---

const PROJECTS: Project[] = [
  {
    title: "Surveillance Summarization",
    category: "Computer Vision",
    description: "An object-tracking system generating concise, time-stamped video summaries to drastically improve surveillance footage review efficiency.",
    link: "https://github.com/STARK450"
  },
  {
    title: "Automated Audit System",
    category: "Enterprise AI",
    description: "Simulates Amazon Robotics stow videos to verify product placement and stow quality using high-volume image and video auditing pipelines.",
    link: "https://github.com/STARK450/Automated-Stow-Quality-Audit-Support-System-Human-in-the-Loop-.git"
  },
  {
    title: "Delivery Risk Estimator",
    category: "Predictive Modeling",
    description: "Analyzes business requirements to estimate development effort and delivery risk, generating architecture recommendations automatically.",
    link: "https://github.com/STARK450/AI-Driven-Delivery-Risk-Effort-Estimator-From-Business-Requirements-.git"
  },
  {
    title: "Market Volatility Prediction",
    category: "Financial Tech",
    description: "Advanced machine learning models for stock price movement and volatility prediction using historical market data analysis.",
    link: "https://github.com/STARK450/Stock-Volatility-Price-Movement-Prediction-System.git"
  }
];

const SKILLS = [
  "Java", "Python", "Full Stack Architecture", "AWS Cloud Infrastructure", 
  "Blockchain Technologies", "OpenCV", "Machine Learning", "Network Security"
];

// --- Components ---

// 1. Reveal Animation Component
interface RevealOnScrollProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15, // Slightly higher threshold for deliberate reveal
        rootMargin: "0px 0px -50px 0px"
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform will-change-transform motion-reduce:transition-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// 2. Gemini AI Service
const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    // Robust API Key extraction for various environments (Vite, Next.js, Standard Env)
    let apiKey: string | undefined = undefined;
    
    // Check standard process.env (Node/Webpack/Next.js server)
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY; // Support NEXT_PUBLIC_ for client-side Next.js
    }
    
    // Check import.meta.env (Vite)
    // @ts-ignore - import.meta might not be typed in all configurations
    if (!apiKey && typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      apiKey = import.meta.env.VITE_API_KEY;
    }
    
    if (!apiKey) {
      // Return a string to the chat, avoiding object errors
      return "System Error: API Key is missing. Please set VITE_API_KEY (Vite) or NEXT_PUBLIC_API_KEY (Next.js) in your environment variables.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an AI assistant for Sumanth Kolati's portfolio. 
        Sumanth is a B.Tech CSE graduate (2021-2024) from Godavari Institute of Engineering and Technology.
        Skills: Java, Python, Full Stack Web Development, AWS, Blockchain.
        Experience: Internships at AWS Cloud Computing (APSSDC), Cisco Networking Academy, and Java Full Stack at Kodnest.
        Traits: Motivated, reliable, adaptable, strong work ethic.
        Interests: Quantum Physics, Gym, Thought Experiments.
        Be helpful, professional, and concise. Tone: Professional, Executive, Minimalist.`,
      }
    });

    // 1. Try standard text getter
    let text = response.text;

    // 2. Fallback: Manual extraction if .text returns object/undefined (defensive coding against [object Object])
    if (typeof text !== 'string') {
        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
            const parts = candidates[0].content?.parts;
            if (parts && parts.length > 0) {
                // @ts-ignore - 'text' property exists on Part but TS might need check
                if (typeof parts[0].text === 'string') {
                    // @ts-ignore
                    text = parts[0].text;
                }
            }
        }
    }

    // 3. Final validation
    if (typeof text === 'string') return text;
    if (text !== undefined && text !== null) return String(text);
    
    return "No response generated by the model.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "Unknown error";
    
    // Defensive error stringification to prevent [object Object]
    try {
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error === 'object' && error !== null) {
             // Check common error properties
             if (error.message) {
                 errorMessage = String(error.message);
             } else if (error.error && error.error.message) {
                 // GoogleGenAIError often has this structure
                 errorMessage = String(error.error.message);
             } else {
                 const json = JSON.stringify(error);
                 errorMessage = json === '{}' ? 'Connection Error' : json;
             }
        }
    } catch (e) {
        errorMessage = "Error parsing failure details";
    }
    
    // Clean up error message if it became [object Object] somehow
    if (errorMessage === '[object Object]') errorMessage = "Internal Error";
    
    return `System Alert: AI Service Unavailable. (${errorMessage})`;
  }
};

// 3. Chat Overlay Component
const GeminiChatOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Greetings. I am Sumanth's virtual assistant. How may I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    const response = await generateAIResponse(userMessage);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-6 pointer-events-auto">
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-5 duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-slate-200 font-medium flex items-center gap-2 text-xs uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              AI Assistant
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors duration-300" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed transition-all duration-300",
                  msg.role === 'user' 
                    ? "bg-white text-slate-950 shadow-lg shadow-white/5" 
                    : "bg-white/5 text-slate-200 border border-white/5"
                )}>
                  {/* Ensure content is rendered as string */}
                  {String(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-white/5 rounded-lg px-4 py-2 flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Processing</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40">
            <div className="flex gap-3">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your inquiry..."
                className="flex-1 bg-transparent border-b border-white/10 px-2 py-2 text-sm text-slate-200 focus:outline-none focus:border-white/30 transition-colors duration-300 placeholder:text-slate-600"
              />
              <Button size="icon" className="rounded-full shrink-0 h-10 w-10 bg-white text-black hover:bg-slate-200 transition-all duration-300 shadow-lg shadow-white/10" onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="h-16 w-16 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] bg-white text-black hover:bg-slate-200 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.05] active:scale-[0.98] border-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
};

// 4. Navigation
const Navbar = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-center pointer-events-none">
      <div 
        className="pointer-events-auto cursor-pointer group" 
        onClick={(e) => scrollToSection(e, 'home')}
      >
        <span className="text-lg font-bold text-slate-100 tracking-tighter transition-opacity duration-500 opacity-80 group-hover:opacity-100 drop-shadow-md" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          SK<span className="text-emerald-400">.</span>
        </span>
      </div>
      <div className="pointer-events-auto bg-slate-950/50 backdrop-blur-xl px-8 py-4 rounded-full border border-white/5 flex gap-8 shadow-xl shadow-black/20 transition-all duration-500 hover:bg-slate-950/70">
        {['Work', 'About', 'Contact'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            onClick={(e) => scrollToSection(e, item.toLowerCase())}
            className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors duration-300 uppercase tracking-[0.2em] cursor-pointer"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
};

// 5. Social Links
const SocialLinks = () => (
  <div className="fixed left-8 bottom-40 z-50 flex flex-col gap-8 pointer-events-auto hidden md:flex items-center">
    <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-500 to-transparent" />
    <a href="https://github.com/STARK450" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
      <Github className="w-5 h-5" />
    </a>
    <a href="https://www.naukri.com/mnjuser/profile" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
      <Briefcase className="w-5 h-5" />
    </a>
    <a href="mailto:sumanthstark450@gmail.com" className="text-slate-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
      <Mail className="w-5 h-5" />
    </a>
  </div>
);

// 6. Visual Settings Widget
const VisualSettings = ({ 
  metalness, 
  setMetalness, 
  roughness, 
  setRoughness,
  rain,
  setRain
}: { 
  metalness: number; 
  setMetalness: (v: number) => void; 
  roughness: number; 
  setRoughness: (v: number) => void; 
  rain: boolean;
  setRain: (v: boolean) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-40 md:flex hidden items-end gap-4 pointer-events-none">
      <Button 
        onClick={() => setExpanded(!expanded)} 
        variant="ghost" 
        className={cn(
          "h-12 w-12 rounded-full border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-black/20 backdrop-blur-sm pointer-events-auto",
          expanded && "bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        )}
      >
        <Settings2 className="w-5 h-5" />
      </Button>

      <div className={cn(
        "bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-left overflow-hidden shadow-2xl pointer-events-auto",
        expanded ? "w-72 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-10 p-0 border-0"
      )}>
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Environment Settings</h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              <label>Metalness</label>
              <span className="font-mono text-white">{metalness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={metalness}
              onChange={(e) => setMetalness(parseFloat(e.target.value))}
              className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-150 [&::-webkit-slider-thumb]:transition-transform duration-300"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              <label>Roughness</label>
              <span className="font-mono text-white">{roughness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={roughness}
              onChange={(e) => setRoughness(parseFloat(e.target.value))}
              className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-150 [&::-webkit-slider-thumb]:transition-transform duration-300"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
             <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Rain Simulation</label>
             <Switch checked={rain} onCheckedChange={setRain} className="data-[state=unchecked]:bg-slate-800 data-[state=checked]:bg-white transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [metalness, setMetalness] = useState(0.8);
  const [roughness, setRoughness] = useState(0.15);
  const [rain, setRain] = useState(false);
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-100 overflow-hidden">
      
      {/* 1. Background Layer (Fixed) */}
      <div className="fixed inset-0 z-0">
        <DemoOne metalness={metalness} roughness={roughness} rain={rain} />
        
        {/* Cinematic Vignette: Stronger edges, transparent center to show liquid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.9)_100%)] pointer-events-none" />
        
        {/* Subtle noise texture overlay for film grain effect (optional, adds realism) */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      {/* 2. UI Overlays (Fixed) */}
      <Navbar />
      <SocialLinks />
      <VisualSettings 
        metalness={metalness} 
        setMetalness={setMetalness} 
        roughness={roughness} 
        setRoughness={setRoughness} 
        rain={rain}
        setRain={setRain}
      />
      <GeminiChatOverlay />

      {/* 3. Scrollable Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen w-full flex flex-col justify-center items-center px-6 relative">
          
          {/* Intelligent Contrast: Deep, focused blur directly behind text only */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-black/60 blur-[80px] rounded-full pointer-events-none -z-10 opacity-80" />

          <div 
            className="text-center space-y-12 max-w-5xl"
            style={{ 
              opacity: Math.max(0, 1 - scrolled / 500),
              transform: `translateY(${scrolled * 0.5}px)` // Parallax effect
            }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase text-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Hyderabad, IN
            </div>
            
            <h1 
              className="text-6xl md:text-8xl lg:text-[10rem] font-extrabold tracking-tighter leading-[0.9] text-white animate-in fade-in slide-in-from-bottom-8 duration-[1500ms] delay-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'Montserrat, serif' }}
            >
              SUMANTH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-500 drop-shadow-none">KOLATI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto leading-loose animate-in fade-in slide-in-from-bottom-8 duration-[1500ms] delay-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Full Stack Engineer & AI Specialist. <br/>
              Crafting scalable digital ecosystems with precision and foresight.
            </p>
          </div>
          
          <div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50 cursor-pointer hover:opacity-100 transition-opacity duration-500 drop-shadow-md"
            style={{ opacity: Math.max(0, 1 - scrolled / 200) }}
            onClick={() => scrollToSection('work')}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </section>

        {/* WORK SECTION */}
        <section id="work" className="w-full max-w-7xl px-6 py-40 space-y-32">
          <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-12 gap-6 relative">
            {/* Localized backing for readability */}
            <div className="absolute -inset-10 bg-black/50 blur-3xl -z-10 rounded-full opacity-60 pointer-events-none" />
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Montserrat, serif' }}>Selected<br/>Works</h2>
            <p className="text-slate-300 text-sm max-w-xs leading-relaxed font-medium drop-shadow-md">
              A curated collection of projects spanning computer vision, enterprise AI, and predictive modeling.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PROJECTS.map((project, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <div 
                    className="group relative bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-slate-900/90 hover:border-white/20 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-2 flex flex-col h-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  >
                    {/* Inner subtle gradient for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    
                    <div className="space-y-8 flex-1 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-200 uppercase tracking-widest border border-white/5 shadow-sm">{project.category}</div>
                        <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-500" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-slate-100 group-hover:text-white transition-colors duration-500 leading-tight drop-shadow-lg">{project.title}</h3>
                        <p className="text-base text-slate-300 leading-loose group-hover:text-slate-200 transition-colors duration-500 drop-shadow-sm">{project.description}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="w-full max-w-6xl px-6 py-40 space-y-32 relative">
          
          <RevealOnScroll className="space-y-12 relative">
             {/* Readability Layer: Glass Container for Section Intro */}
             <div className="absolute -inset-8 bg-slate-950/40 backdrop-blur-xl rounded-3xl -z-10 border border-white/5 shadow-2xl" />

             <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
               <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white flex-1 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Montserrat, serif' }}>About</h2>
               <div className="flex-1 space-y-8">
                 <p className="text-2xl md:text-3xl text-slate-100 font-light leading-relaxed drop-shadow-md">
                   I am a motivated engineer with a disciplined approach to problem-solving. I thrive in collaborative high-stakes environments where precision meets innovation.
                 </p>
                 <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
               </div>
             </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
            {/* Readability Layer: Backing for columns */}
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(0,0,0,0.5)_0%,transparent_70%)] blur-2xl -z-10 pointer-events-none" />

            <RevealOnScroll className="space-y-12 p-8 rounded-2xl bg-slate-950/30 backdrop-blur-sm border border-white/5 hover:bg-slate-950/40 transition-colors duration-500">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 flex items-center gap-4 drop-shadow-sm">
                <span className="w-8 h-px bg-slate-400" /> Education & Experience
              </h3>
              <div className="space-y-12 pl-4 border-l border-white/10">
                 <div className="relative pl-8 group">
                   <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600 group-hover:bg-white group-hover:border-white transition-colors duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                   <div className="text-xl text-slate-100 font-medium group-hover:text-white transition-colors duration-300 drop-shadow-md">B.Tech CSE</div>
                   <div className="text-sm text-slate-400 mt-2 uppercase tracking-wide">GIET (2021-2024)</div>
                 </div>
                 <div className="relative pl-8 group">
                   <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600 group-hover:bg-white group-hover:border-white transition-colors duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                   <div className="text-xl text-slate-100 font-medium group-hover:text-white transition-colors duration-300 drop-shadow-md">AWS Cloud Intern</div>
                   <div className="text-sm text-slate-400 mt-2 uppercase tracking-wide">APSSDC (Summer '23)</div>
                 </div>
                 <div className="relative pl-8 group">
                   <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600 group-hover:bg-white group-hover:border-white transition-colors duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                   <div className="text-xl text-slate-100 font-medium group-hover:text-white transition-colors duration-300 drop-shadow-md">Full Stack Intern</div>
                   <div className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Kodnest</div>
                 </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="space-y-12 p-8 rounded-2xl bg-slate-950/30 backdrop-blur-sm border border-white/5 hover:bg-slate-950/40 transition-colors duration-500" delay={200}>
               <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 flex items-center gap-4 drop-shadow-sm">
                <span className="w-8 h-px bg-slate-400" /> Capabilities
              </h3>
              <div className="flex flex-wrap gap-3">
               {SKILLS.map(tech => (
                 <span key={tech} className="px-5 py-3 bg-slate-900/60 border border-white/10 text-sm text-slate-300 font-medium hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 cursor-default shadow-lg rounded-lg backdrop-blur-md">
                   {tech}
                 </span>
               ))}
              </div>
              
              <div className="pt-12 space-y-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Research Interests</h4>
                <div className="flex flex-col gap-4 text-lg text-slate-200 font-light">
                   <span className="hover:text-white transition-colors duration-300 cursor-default drop-shadow-md">Quantum Physics & Computation</span>
                   <span className="hover:text-white transition-colors duration-300 cursor-default drop-shadow-md">Artificial General Intelligence</span>
                   <span className="hover:text-white transition-colors duration-300 cursor-default drop-shadow-md">Philosophical Thought Experiments</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* CONTACT FOOTER */}
        <section id="contact" className="w-full bg-transparent py-40 px-6 text-center border-t border-white/5 relative">
          {/* Footer backing - seamless gradient fade from bottom */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent -z-10 pointer-events-none" />

          <RevealOnScroll className="max-w-4xl mx-auto space-y-16">
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_4px_25px_rgba(255,255,255,0.15)]" style={{ fontFamily: 'Montserrat, serif' }}>Let's Build<br/><span className="text-slate-500">The Future.</span></h2>
            
            <p className="text-slate-300 text-xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              I am currently available for select opportunities in Software Engineering and Full Stack Development.
            </p>
            
            <a href="https://wa.me/919347008359" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button size="lg" className="h-20 px-16 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] border-none shadow-[0_0_40px_rgba(255,255,255,0.25)]">
                Start a Conversation
              </Button>
            </a>

            <div className="pt-32 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold border-t border-white/5 mt-20 pt-10">
              <span>© 2024 Sumanth Kolati</span>
              <div className="flex gap-12">
                 <a href="https://github.com/STARK450" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Github</a>
                 <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">LinkedIn</a>
                 <a href="https://www.naukri.com/mnjuser/profile" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Naukri</a>
                 <a href="mailto:sumanthstark450@gmail.com" className="hover:text-white transition-colors duration-300">Email</a>
              </div>
            </div>
          </RevealOnScroll>
        </section>

      </div>
    </main>
  );
}