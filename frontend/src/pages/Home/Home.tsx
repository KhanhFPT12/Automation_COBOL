import { GridItem } from "../../components/GridSystem";
import { Helmet } from "react-helmet";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <>
      <Helmet>
        <title>Home - Professional Dashboard</title>
      </Helmet>
      
      <motion.div
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        variants={containerVariants}
        className="w-full h-full flex flex-col space-y-8 pb-12"
      >
        {/* HERO SECTION */}
        <GridItem row={1} col={2} className="w-full p-8 md:p-12 rounded-3xl bg-white shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-60"></div>
          
          <motion.div variants={itemVariants} className="text-center z-10 max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              v2.0 is now live
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Manage your business with <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                absolute precision
              </span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              The ultimate platform for automating your workflow, tracking analytics in real-time, and scaling your enterprise without limits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center shadow-lg shadow-blue-200"
              >
                Get Started <ArrowRight size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                View Documentation
              </motion.button>
            </div>
          </motion.div>
        </GridItem>

        {/* STATS SECTION */}
        <GridItem row={1} col={2} className="bg-transparent border-none shadow-none p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Active Users", value: "10,000+", icon: <Users size={24} className="text-blue-500"/> },
              { label: "Uptime", value: "99.99%", icon: <Zap size={24} className="text-amber-500"/> },
              { label: "Transactions", value: "$2M+", icon: <BarChart3 size={24} className="text-emerald-500"/> },
              { label: "Security", value: "Bank Grade", icon: <Shield size={24} className="text-indigo-500"/> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <h4 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h4>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </GridItem>

        {/* FEATURES GRID */}
        <GridItem row={1} col={2} className="w-full p-8 rounded-3xl bg-white shadow-sm border border-slate-100">
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Core Features</h3>
            <p className="text-slate-500 mt-2">Everything you need to run your operations smoothly.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Real-time Analytics", desc: "Monitor your KPIs and metrics as they happen with sub-second latency updates." },
              { title: "Automated Workflows", desc: "Connect your favorite tools and let our engine handle the repetitive tasks." },
              { title: "Team Collaboration", desc: "Built-in chat, shared spaces, and granular permission controls for your entire team." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-100 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <h3 className="font-semibold text-slate-800 text-lg">{feature.title}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </GridItem>
      </motion.div>
    </>
  );
}
