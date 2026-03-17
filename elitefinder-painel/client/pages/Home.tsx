import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";


// --- ÍCONES COMO COMPONENTES REACT ---
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       className={className}>{children}</svg>
);

const QualiaAILogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 20.5361 6.53613 24.4699 10.3431 26.3431L4 28L5.65685 21.6569C7.53012 25.4639 11.4639 28 16 28Z" stroke="url(#paint0_linear_logo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16L15 19L20 14" stroke="url(#paint1_linear_logo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_logo" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1"/>
                <stop offset="1" stopColor="#22D3EE"/>
            </linearGradient>
            <linearGradient id="paint1_linear_logo" x1="12" y1="14" x2="20" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A5B4FC"/>
                <stop offset="1" stopColor="#67E8F9"/>
            </linearGradient>
        </defs>
    </svg>
);

// --- CPU ICON SUBSTITUTO ---
const CpuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="23" />
    <line x1="20" y1="12" x2="23" y2="12" />
    <line x1="1" y1="12" x2="4" y2="12" />
  </Icon>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </Icon>
);

const MessageCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </Icon>
);

const ArrowRightLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
  </Icon>
);

const LayoutDashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
  </Icon>
);

const SmilePlusIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></Icon>;
const ClipboardCheckIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></Icon>;
const GaugeCircleIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M15.6 3.3a10 10 0 1 0 5.1 5.1"/><path d="M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/><path d="m12 12-4 4"/></Icon>;
const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>;
const FileDownIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m15 15-3 3-3-3"/></Icon>;
const ServerIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></Icon>;

// Hook para detectar quando o elemento está visível para animar
function useInViewAnimation() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// --- HEADER ---
const Header: React.FC<{
  whatIsItRef: React.RefObject<HTMLDivElement>;
  howItWorksRef: React.RefObject<HTMLDivElement>;
  featuresRef: React.RefObject<HTMLDivElement>;
  contactRef: React.RefObject<HTMLDivElement>;
}> = ({ whatIsItRef, howItWorksRef, featuresRef, contactRef }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-gray-900/90 shadow-lg backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + nome da empresa */}
        <button 
          onClick={scrollToTop}
          className="flex items-center space-x-3 bg-transparent border-none cursor-pointer transition-transform hover:scale-105"
        >
          <QualiaAILogo className="w-8 h-8" />
          <span className="text-xl font-bold text-white">Soluções de Análise IA</span>
        </button>

        <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <button
            onClick={() => scrollToSection(whatIsItRef)}
            className="hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
          >
            O Que É?
          </button>
          <button
            onClick={() => scrollToSection(howItWorksRef)}
            className="hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
          >
            Como Funciona
          </button>
          <button
            onClick={() => scrollToSection(featuresRef)}
            className="hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
          >
            Recursos
          </button>
          <button
            onClick={() => scrollToSection(contactRef)}
            className="hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
          >
            Contato
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/dashboard", { state: { forceLogin: true } })}
            className="hidden sm:block text-gray-300 hover:text-white text-sm bg-transparent border-none cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => scrollToSection(contactRef)}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-lg shadow-lg transition hover:scale-105 border-none cursor-pointer"
          >
            Agendar Demo
          </button>
        </div>
      </nav>
    </header>
  );
};

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative text-center py-24 md:py-40 overflow-hidden bg-gray-950">
      {/* Camada de fundo com gradiente */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.25)_0%,_rgba(79,70,229,0.05)_60%)]"></div>
      </div>
      {/* Conteúdo principal */}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter">
          Transforme Conversas em <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Insights de Negócio
          </span>.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
          A nossa IA analisa 100% das suas interações no WhatsApp, fornecendo notas, identificando pontos de melhoria e garantindo a excelência da sua equipe.
        </p>
        <div className="mt-10 flex justify-center items-center space-x-4">
          <a
            href="#como-funciona"
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-lg hover:brightness-110 transition shadow-2xl shadow-indigo-500/40"
          >
            Ver Como Funciona
          </a>
          <a
            href="#contato"
            className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition border border-gray-600"
          >
            Fale com um Especialista
          </a>
        </div>
      </div>
      <div className="absolute left-0 right-0 -bottom-1 z-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-24"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#waveGradient)"
            d="M0,80 Q360,0 720,80 Q1080,160 1440,80 L1440,120 L0,120 Z"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="100%" stopColor="#101728" />
            </linearGradient>
          </defs>
        </svg>
      </div>


    </section>
  );
};

// Função para animações que obtém referência e controla visibilidade
function AnimatedSection({ children }: { children: React.ReactNode }) {
  const { ref, isInView } = useInViewAnimation();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

// --- O QUE É ---
const WhatIsIt: React.FC = () => (
  <AnimatedSection>
    <div className="container mx-auto px-6 py-24 bg-gray-900">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white whitespace-nowrap">
          Visão Completa do Seu Atendimento.
        </h2>
        <p className="mt-4 text-lg text-gray-400 leading-relaxed">
          A análise manual alcança apenas uma fração das suas interações, deixando insights valiosos de fora. Nossa IA cobre 100% das conversas, revelando a imagem completa da sua qualidade de atendimento.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        <div className="p-8 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 transition-transform hover:-translate-y-3">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-800 to-red-600 mb-8 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">O Método Tradicional</h3>
          <p className="text-gray-300 leading-relaxed text-base">
            Análise manual de somente ~2% das conversas, com processo lento e sujeito a vieses que limitam insights e melhorias.
          </p>
        </div>
        <div className="p-8 bg-gradient-to-r from-indigo-600 via-cyan-600 to-cyan-400 rounded-3xl shadow-lg text-white transition-transform hover:-translate-y-3">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-8 shadow-lg">
            <ShieldCheckIcon className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Com a Nossa Solução</h3>
          <p className="leading-relaxed text-base">
            Analise 100% das conversas com IA avançada. Feedback instantâneo, objetivo, dados precisos e escalabilidade real para seu time.
          </p>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

// --- COMO FUNCIONA ---
const HowItWorks: React.FC = () => {
  const steps = [
    { icon: <MessageCircleIcon className="w-8 h-8 text-green-400"/>, title: "1. Captura Segura", text: "Conectamos seu WhatsApp ao WAHA de forma segura e estável.", color: "green" },
    { icon: <ArrowRightLeftIcon className="w-8 h-8 text-orange-400"/>, title: "2. Orquestração (n8n)", text: "O n8n gerencia o fluxo de mensagens para a nossa IA de forma eficiente.", color: "orange" },
    { icon: <CpuIcon className="w-8 h-8 text-blue-400"/>, title: "3. Análise com IA", text: "A nossa IA avalia sentimento, critérios, e atribui uma nota precisa à conversa.", color: "blue" },
    { icon: <LayoutDashboardIcon className="w-8 h-8 text-indigo-400"/>, title: "4. Dashboard Inteligente", text: "Visualize todos os dados num painel claro, intuitivo e acionável.", color: "indigo" }
  ];
  return (
    <AnimatedSection>
      <div className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Simples, Poderoso e Transparente.</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              A nossa arquitetura robusta garante um fluxo de dados seguro e estável, desde a captura até a visualização no seu dashboard.
            </p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            <style>
              {`
                .animated-dash {
                  animation: dash-animation 2s linear infinite;
                }
                @keyframes dash-animation {
                  from { stroke-dashoffset: 0; }
                  to { stroke-dashoffset: -32; }
                }
              `}
            </style>
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 text-center bg-gray-800/50 p-6 rounded-xl border border-gray-700 transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1">
                <div className={`mx-auto w-16 h-16 bg-${step.color}-900/50 text-${step.color}-400 rounded-full flex items-center justify-center mb-5 border border-${step.color}-800`}>{step.icon}</div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{step.text}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 left-full w-8 h-0.5 transform -translate-y-1/2">
                    <svg width="100%" height="2" className="overflow-visible">
                      <line x1="0" y1="1" x2="100%" y2="1" stroke="#4A5568" strokeWidth="1.5" strokeDasharray="8 8" className="animated-dash" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// --- FEATURE CARD ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div whileHover={{ y: -6, scale: 1.03 }} transition={{ type: 'spring', stiffness: 200 }}
    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/80 hover:-translate-y-1">
    <div className="mb-4">{icon}</div>
    <h3 className="font-semibold text-white">{title}</h3>
    <p className="text-sm text-gray-400 mt-2">{description}</p>
  </motion.div>
);

// --- FEATURES ---
const Features: React.FC = () => {
  const featureList = [
    { title: 'Análise de Sentimento', description: 'Entenda a emoção por trás de cada mensagem para agir rapidamente.', icon: <SmilePlusIcon className="w-8 h-8 text-indigo-400" /> },
    { title: 'Pontuação por Critérios', description: 'Avaliação automática de saudação, empatia, tempo de resposta e outros pontos personalizáveis.', icon: <ClipboardCheckIcon className="w-8 h-8 text-teal-400" /> },
    { title: 'Dashboard em Tempo Real', description: 'Acompanhe a performance da sua equipe ao vivo, com métricas claras e visuais.', icon: <GaugeCircleIcon className="w-8 h-8 text-sky-400" /> },
    { title: 'Identificação de Tendências', description: 'Descubra os melhores atendentes e as principais oportunidades de treino.', icon: <TrendingUpIcon className="w-8 h-8 text-green-400" /> },
    { title: 'Relatórios e Exportação', description: 'Exporte dados detalhados para folhas de cálculo e apresentações com apenas um clique.', icon: <FileDownIcon className="w-8 h-8 text-amber-400" /> },
    { title: 'Arquitetura Robusta', description: 'Construído sobre Docker, WAHA e n8n para garantir estabilidade e escalabilidade.', icon: <ServerIcon className="w-8 h-8 text-slate-400" /> },
  ];
  return (
    <AnimatedSection>
      <section id="recursos" className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Recursos que Impulsionam a Qualidade.</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              Tudo o que precisa para entender e melhorar cada ponto de contato com o seu cliente.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((feature, index) => (
              <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} />
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

// --- CONTATO ---
const Contact: React.FC = () => (
  <AnimatedSection>
    <section id="contato" className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="relative text-center max-w-3xl mx-auto bg-gradient-to-br from-indigo-600 to-cyan-500 p-10 rounded-2xl shadow-2xl shadow-indigo-500/30 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full filter blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full filter blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Pronto para Elevar a Qualidade do seu Atendimento?</h2>
            <p className="mt-4 text-indigo-200">A nossa equipe está pronta para mostrar como a nossa plataforma pode revolucionar o seu controle de qualidade. Agende uma demonstração gratuita e personalizada.</p>
            <div className="mt-8">
              <a href="#" className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-200 transition shadow-lg text-lg">Agendar Demonstração Gratuita</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AnimatedSection>
);

// --- FOOTER ---
const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Logo + Nome */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-2 mb-3">
            <QualiaAILogo className="w-10 h-10" />
            <span className="text-lg font-semibold text-white">Soluções de Análise IA</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Inteligência artificial para empresas que desejam avaliar e otimizar a qualidade do atendimento dos seus times no WhatsApp.
          </p>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Conecte-se
          </h3>
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
              LinkedIn
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
              GitHub
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
              Instagram
            </a>
          </div>
        </div>

        {/* Institucional */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Institucional
          </h3>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => navigate('/privacidade')}
              className="text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-center md:text-left"
            >
              Política de Privacidade
            </button>
            <button
              onClick={() => navigate('/termos')}
              className="text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-center md:text-left"
            >
              Termos de Uso
            </button>
          </div>
        </div>

        {/* Sobre / Descrição */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Sobre
          </h3>
          <p className="text-sm text-gray-500">
            Plataforma de análise de qualidade em conversas via WhatsApp, ajudando empresas a monitorar, mensurar e melhorar seus atendimentos.
          </p>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Soluções de Análise IA. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

// --- APP PRINCIPAL ---
const App: React.FC = () => {
  // Criar refs para as seções
  const whatIsItRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-gray-900">
      <Header 
        whatIsItRef={whatIsItRef} 
        howItWorksRef={howItWorksRef}
        featuresRef={featuresRef}
        contactRef={contactRef}
      />
      <main>
        <Hero />
        <div ref={whatIsItRef} id="o-que-e">
          <WhatIsIt />
        </div>
        <div ref={howItWorksRef} id="como-funciona">
          <HowItWorks />
        </div>
        <div ref={featuresRef}>
          <Features />
        </div>
        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
