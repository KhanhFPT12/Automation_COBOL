import { useAppStore } from "../../store";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Code2,
  LineChart,
  ShieldCheck,
  ExternalLink,
  BarChart3,
  Zap,
  Cpu,
  BookOpen,
  Video,
  FileText,
} from "lucide-react";
import type { Variants } from "motion/react";

const BENEFITS = [
  {
    icon: <BarChart3 className="h-8 w-8 stroke-[1.25]" />,
    title: "Engineering productivity at scale",
    description:
      "Achieve 20–80% productivity gains across SDLC tasks, with 90%+ time savings on repetitive modernization work.",
  },
  {
    icon: <Zap className="h-8 w-8 stroke-[1.25]" />,
    title: "Accelerate time to value",
    description:
      "Deliver complex migration work 20–40% faster and cut effort 50–80% for structured workflows with AI automation.",
  },
  {
    icon: <Cpu className="h-8 w-8 stroke-[1.25]" />,
    title: "Predictable cost efficiency",
    description:
      "Reduce compute spend by ~40% and lower cost per feature through earlier issue detection and optimized task routing.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 stroke-[1.25]" />,
    title: "Earlier risk detection and fewer incidents",
    description:
      "Catch vulnerabilities earlier in the SDLC, decreasing downstream incidents and improving compliance readiness.",
  },
];

const ACCORDION_ITEMS = [
  {
    title: "Automated Code Conversion",
    badge: "Core Engine",
    content:
      "Transform COBOL, Assembly, and RPG code into modern Java, Python, or Kotlin with semantic-aware AI. Every output is validated, documented, and ready for deployment.",
  },
  {
    title: "Logic & Dependency Analysis",
    badge: "Discovery",
    content:
      "Visualize complex legacy workflows, identify dead code, and map business logic dependencies before you start migration — so nothing is missed.",
  },
  {
    title: "Security & Compliance Integration",
    badge: "Governance",
    content:
      "SOC2, GDPR, and HIPAA compliance checks are embedded into every conversion step, ensuring modernized code meets regulatory requirements out of the box.",
  },
  {
    title: "Zero-Downtime Migration Paths",
    badge: "Deployment",
    content:
      "Generate migration blueprints compatible with Blue/Green deployments and microservice patterns so your teams can ship without service interruption.",
  },
];

const SUITE_CARDS = [
  {
    icon: <Code2 className="h-6 w-6" />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    title: "Code Converter",
    description:
      "Seamlessly refactor COBOL, Assembly, and C++ into high-performance Java and Python with automated syntax mapping and logic preservation.",
    badge: "99.8% Accuracy",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-100",
    page: "converter" as const,
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Logic Analyzer",
    description:
      "Map and visualize undocumented legacy workflows. Identify business logic bottlenecks and dead code using advanced AI flow analysis.",
    badge: "Graph Visualization",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeBorder: "border-violet-100",
    page: "data-mapping" as const,
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Automated Testing",
    description:
      "Ensure functional parity between legacy and modern systems. AI generates comprehensive regression test suites based on production traffic patterns.",
    badge: "Parity Validation",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-100",
    page: "auth-guide" as const,
  },
];

const CASE_STUDIES = [
  {
    name: "FinBank Corp",
    description:
      "FinBank Corp modernized 2M lines of COBOL in as little as 4 weeks, automating code analysis, refactoring and testing while maintaining full business logic integrity.",
    stats: [
      { value: "90%", label: "faster delivery, completing a full COBOL uplift in ~4 weeks" },
      { value: "160+", label: "engineering hours preserved, eliminating manual refactoring" },
    ],
  },
  {
    name: "GlobalPay Systems",
    description:
      "GlobalPay reduced legacy modernization timelines from months to days by automating code analysis, refactoring and transformation into modern microservice architectures.",
    stats: [
      { value: "10x", label: "faster documentation and architecture analysis" },
      { value: "100%", label: "operator-verified accuracy on critical payment processing logic" },
    ],
  },
];

const RESOURCES = [
  {
    type: "Webinar",
    title: "AI-native Modernization",
    description:
      "Engineering teams are burdened by legacy tech debt. See how AI-native workflows help teams move faster while reducing risk.",
    icon: <Video className="h-5 w-5" />,
    external: false,
  },
  {
    type: "Documentation",
    title: "Getting Started Guide",
    description:
      "Explore product documentation and learn how to set up your first modernization pipeline with core concepts and installation guides.",
    icon: <FileText className="h-5 w-5" />,
    external: false,
  },
  {
    type: "Tutorial",
    title: "COBOL to Java Walkthrough",
    description:
      "Step-by-step tutorial for converting your first COBOL program to clean Java using the ALSM converter workspace.",
    icon: <BookOpen className="h-5 w-5" />,
    external: true,
  },
];

export function LandingPage() {
  const { setActivePage } = useAppStore();
  const [openAccordion, setOpenAccordion] = useState<number>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cobolSnippet = `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY 'MODERNIZING...'.`;

  const javaSnippet = `@Service
public class ModernSystem {
  public void processMessage() {
    Logger.info("System modernised");
  }
}`;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col w-full"
      id="landing-page-container"
    >
      {/* Announcement Banner */}
      <div className="w-full bg-slate-900 text-white text-sm py-3 px-4 flex items-center justify-center gap-3">
        <span className="font-semibold text-sky-400">What's new:</span>
        <span className="text-slate-300 hidden sm:inline">
          ALSM now supports COBOL-to-Kotlin migration pipelines.
        </span>
        <button
          onClick={() => setActivePage("converter")}
          className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1 whitespace-nowrap transition"
        >
          Explore now <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200" id="hero-section">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-4 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400">
            Home /{" "}
            <span className="text-sky-600 font-medium">Products</span> / AI
            Modernization
          </p>
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            variants={itemVariants}
            className="max-w-2xl flex-1 text-center lg:text-left"
          >
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              AI modernization
              <br />
              for enterprises
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed font-sans max-w-lg mx-auto lg:mx-0">
              ALSM powers faster migration, higher productivity and
              modern architecture delivery across your organization.
            </p>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                id="hero-btn-explore"
                onClick={() => setActivePage("converter")}
                className="group cursor-pointer flex items-center gap-2 bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-95 rounded"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="hero-btn-docs"
                onClick={() => setActivePage("data-mapping")}
                className="cursor-pointer flex items-center gap-2 border border-sky-600 text-sky-600 px-6 py-3.5 text-sm font-semibold transition hover:bg-sky-50 active:scale-95 rounded"
              >
                Read documentation
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Hero Image — Robot Coding */}
          <motion.div
            variants={itemVariants}
            className="flex-1 w-full flex justify-center lg:justify-end relative"
            id="hero-interactive-preview"
          >
            <div className="relative">
              <img
                src="/images/robot-coding.png"
                alt="ALSM AI agent analyzing legacy code"
                className="w-full max-w-sm lg:max-w-md xl:max-w-lg select-none"
                style={{ mixBlendMode: 'multiply' }}
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 right-0 lg:-right-4 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <ChevronRight className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">3 targets ready</p>
                  <p className="text-[10px] text-slate-500">COBOL → Java 17</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet ALSM Section */}
      <section className="bg-sky-50 border-b border-sky-100" id="meet-alsm-section">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            <img
              src="/images/robot-happy.png"
              alt="ALSM AI partner — ready to help"
              className="w-44 md:w-56 shrink-0 select-none"
              style={{ mixBlendMode: 'multiply' }}
            />
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                YOUR AI PARTNER
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Meet ALSM — your intelligent
                <br className="hidden sm:block" /> modernization assistant
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed max-w-xl">
                ALSM analyzes your legacy codebase, maps business logic,
                converts code automatically, and validates every output —
                so your team ships modern systems with confidence.
              </p>
              <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={() => setActivePage("converter")}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 text-sm font-semibold rounded transition inline-flex items-center gap-2"
                >
                  Try it now <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActivePage("data-mapping")}
                  className="border border-slate-300 hover:border-sky-400 text-slate-700 hover:text-sky-600 px-5 py-2.5 text-sm font-semibold rounded transition"
                >
                  Learn more
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="bg-white border-b border-slate-100" id="overview-section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              OVERVIEW
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-sky-600 leading-tight">
              Build smarter with <br className="hidden sm:block" />
              an AI partner
            </h2>
          </motion.div>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-5">
              <p className="text-slate-700 leading-relaxed">
                AI-driven development environments are redefining how enterprises
                build and modernize software — coordinating analysis, conversion,
                and verification across the SDLC so teams can migrate faster,
                upgrade legacy systems continuously, and maintain the security and
                governance organizations require.
              </p>
              <button
                onClick={() => setActivePage("converter")}
                className="border border-sky-600 text-sky-600 px-5 py-2.5 text-sm font-semibold hover:bg-sky-50 transition inline-flex items-center gap-2 rounded"
              >
                Interactive demo <ExternalLink className="h-4 w-4" />
              </button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Lines Converted", value: "500M+" },
                { label: "OPEX Reduction", value: "65%" },
                { label: "Faster Deployment", value: "12x" },
                { label: "Failure Rate", value: "0.02%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-5"
                >
                  <p className="text-3xl font-extrabold text-sky-600">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4-column Benefits Grid */}
      <section className="bg-slate-50 border-b border-slate-200" id="benefits-section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {BENEFITS.map((benefit) => (
              <div key={benefit.title}>
                <div className="text-sky-600 mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section with Accordion */}
      <section className="bg-white border-b border-slate-200" id="features-section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              FEATURES
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight max-w-2xl">
              Built for scale, security and governance
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Accordion */}
            <motion.div
              variants={itemVariants}
              className="divide-y divide-slate-200 border-t border-slate-200"
            >
              {ACCORDION_ITEMS.map((item, i) => (
                <div key={item.title}>
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === i ? -1 : i)
                    }
                    className="w-full flex items-center justify-between py-5 text-left gap-4 cursor-pointer"
                  >
                    <span
                      className={`text-base font-semibold transition-colors ${
                        openAccordion === i ? "text-sky-600" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        openAccordion === i ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === i && (
                    <div className="pb-5">
                      <span className="inline-block text-xs font-bold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-100 mb-3">
                        {item.badge}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Robot Analyze Image */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-6"
            >
              <img
                src="/images/robot-analyze.png"
                alt="ALSM AI analyzing legacy codebase"
                className="w-full max-w-xs md:max-w-sm select-none"
                style={{ mixBlendMode: 'multiply' }}
              />
              {/* Mini code panel below image */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden shadow-lg">
                <div className="px-4 py-2.5 flex items-center gap-2 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 ml-1">
                    alsm.analyzer — live scan
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4 border-r border-slate-800">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-800 mb-2">
                      // COBOL Source
                    </p>
                    <pre className="text-indigo-300 text-[10px] leading-relaxed whitespace-pre-wrap font-mono">
                      {cobolSnippet}
                    </pre>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 pb-1.5 border-b border-slate-800 mb-2">
                      // Java Output
                    </p>
                    <pre className="text-emerald-400 text-[10px] leading-relaxed whitespace-pre-wrap font-mono">
                      {javaSnippet}
                    </pre>
                  </div>
                </div>
                <div className="px-4 py-2.5 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Live conversion ready</span>
                  <button
                    onClick={() => setActivePage("converter")}
                    className="text-[10px] bg-white text-slate-900 font-semibold px-2.5 py-1 rounded hover:bg-slate-100 transition cursor-pointer"
                  >
                    Go to Converter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Suite Cards */}
      <section className="bg-slate-50 border-b border-slate-200" id="suite-section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              SOLUTIONS
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">
              Core Modernization Suite
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUITE_CARDS.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-slate-300"
              >
                <div>
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-lg ${card.iconBg} ${card.iconColor}`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 ${card.badgeBg} ${card.badgeText} text-xs font-semibold px-2.5 py-1 rounded-full border ${card.badgeBorder}`}
                  >
                    {card.badge}
                  </span>
                  <button
                    onClick={() => setActivePage(card.page)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    Learn More <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-white border-b border-slate-200" id="case-studies-section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              CASE STUDIES
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-slate-900">
              Proven results
            </h2>
          </motion.div>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {CASE_STUDIES.map((study) => (
              <motion.div
                key={study.name}
                variants={itemVariants}
                className="border border-slate-200 rounded-xl p-8 transition-all hover:border-sky-200 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-sky-600">{study.name}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {study.description}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-6">
                  {study.stats.map((stat) => (
                    <div key={stat.value}>
                      <p className="text-4xl font-extrabold text-sky-600">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 leading-snug">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActivePage("auth-guide")}
                  className="mt-6 text-sm font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Read the client story <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources / Support Cards */}
      <section className="bg-slate-50 pb-16" id="resources-section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-slate-900 max-w-sm leading-tight">
              Find the support you need
            </h2>
            <p className="text-slate-500 text-sm max-w-xs md:text-right leading-relaxed">
              Explore guides, videos, and resources to learn how ALSM
              delivers value for your team.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESOURCES.map((resource) => (
              <motion.div
                key={resource.title}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between min-h-50 cursor-pointer hover:border-sky-300 hover:shadow-md transition-all group"
                onClick={() => setActivePage("data-mapping")}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {resource.type}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  {resource.external ? (
                    <ExternalLink className="h-5 w-5 text-sky-600" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-sky-600" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
