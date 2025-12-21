import React, { useState, useEffect, useRef } from 'react';
import DemoOne from './components/ui/demo';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Github, ChevronDown, Settings2, Mail, ArrowUpRight, Briefcase } from 'lucide-react';
import { cn } from './components/utils';

// --- Types & Interfaces ---

interface Project {
  title: string;
  category: string;
  description: string;
  link?: string;
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
        threshold: 0.15,
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

// 2. Navigation
const Navbar = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-5 py-4 md:px-10 md:py-6 flex justify-between items-center pointer-events-none">
      <div 
        className="pointer-events-auto cursor-pointer group flex-shrink-0" 
        onClick={(e) => scrollToSection(e, 'home')}
      >
        <span className="text-base md:text-lg font-bold text-slate-100 tracking-tighter transition-opacity duration-500 opacity-80 group-hover:opacity-100 drop-shadow-md" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          SK<span className="text-emerald-400">.</span>
        </span>
      </div>
      <div className="pointer-events-auto bg-slate-950/40 backdrop-blur-xl px-4 py-2 md:px-6 md:py-2.5 rounded-full border border-white/10 flex gap-4 md:gap-8 shadow-xl shadow-black/20 transition-all duration-500 hover:bg-slate-950/60 ml-4">
        {['Work', 'About', 'Contact'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            onClick={(e) => scrollToSection(e, item.toLowerCase())}
            className="text-[9px] md:text-[10px] font-semibold text-slate-400 hover:text-white transition-colors duration-300 uppercase tracking-[0.15em] cursor-pointer"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
};

// 3. Social Links
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

// 4. Visual Settings Widget
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
              <span className="font-mono text-white">{String(metalness.toFixed(2))}</span>
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
              <span className="font-mono text-white">{String(roughness.toFixed(2))}</span>
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
             <Switch checked={rain} onCheckedChange={setRain} className="transition-colors duration-300" />
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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-100 overflow-x-hidden">
      
      {/* 1. Background Layer (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DemoOne metalness={metalness} roughness={roughness} rain={rain} />
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.9)_100%)] pointer-events-none" />
        
        {/* Subtle noise texture */}
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

      {/* 3. Scrollable Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen w-full flex flex-col justify-center items-center px-6 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-black/60 blur-[80px] rounded-full pointer-events-none -z-10 opacity-80" />

          <div 
            className="text-center space-y-12 max-w-5xl"
            style={{ 
              opacity: Math.max(0, 1 - scrolled / 500),
              transform: `translateY(${scrolled * 0.5}px)` 
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
            <div className="absolute -inset-10 bg-black/50 blur-3xl -z-10 rounded-full opacity-60 pointer-events-none" />
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Montserrat, serif' }}>Selected<br/>Works</h2>
            <p className="text-slate-300 text-sm max-w-xs leading-relaxed font-medium drop-shadow-md">
              A curated collection of projects spanning computer vision, enterprise AI, and predictive modeling.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PROJECTS.map((project, i) => (
              <RevealOnScroll key={`project-${i}`} delay={i * 100}>
                <a href={String(project.link || "#")} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <div 
                    className="group relative bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-slate-900/90 hover:border-white/20 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-2 flex flex-col h-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    
                    <div className="space-y-8 flex-1 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-200 uppercase tracking-widest border border-white/5 shadow-sm">{String(project.category)}</div>
                        <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-500" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-slate-100 group-hover:text-white transition-colors duration-500 leading-tight drop-shadow-lg">{String(project.title)}</h3>
                        <p className="text-base text-slate-300 leading-loose group-hover:text-slate-200 transition-colors duration-500 drop-shadow-sm">{String(project.description)}</p>
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
                 <span key={String(tech)} className="px-5 py-3 bg-slate-900/60 border border-white/10 text-sm text-slate-300 font-medium hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 cursor-default shadow-lg rounded-lg backdrop-blur-md">
                   {String(tech)}
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
                 <a key="footer-link-1" href="https://github.com/STARK450" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Github</a>
                 <a key="footer-link-2" href="https://www.naukri.com/mnjuser/profile" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Naukri</a>
                 <a key="footer-link-3" href="mailto:sumanthstark450@gmail.com" className="hover:text-white transition-colors duration-300">Email</a>
              </div>
            </div>
          </RevealOnScroll>
        </section>

      </div>
    </main>
  );
}
