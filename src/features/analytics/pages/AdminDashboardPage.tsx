import { useState } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { motion, AnimatePresence } from "framer-motion";
import { transitions, variants } from "@/utils/motion";
import { LineChart, Activity, PieChart } from "lucide-react";

// Views
import { GeneralMetricsView } from "../components/GeneralMetricsView";
import { PredictionsView } from "../components/PredictionsView";
import { MenuEngineeringView } from "../components/MenuEngineeringView";

type Tab = "general" | "predictions" | "menu";

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const tabs = [
    { id: "general", label: "Métricas Generales", icon: Activity },
    { id: "predictions", label: "Predicciones", icon: LineChart },
    { id: "menu", label: "Ingeniería de Menú", icon: PieChart },
  ];

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">
            Hub Analítico
          </h1>
          <p className="text-carbon-500">
            Analiza el rendimiento, proyecta tus ventas y optimiza tu menú.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex space-x-2 bg-sage-50 p-1.5 rounded-2xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-carbon-900 shadow-sm"
                    : "text-carbon-500 hover:text-carbon-700 hover:bg-sage-100/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary-600" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants.fadeInUp}
                transition={transitions.soft}
              >
                <GeneralMetricsView />
              </motion.div>
            )}
            {activeTab === "predictions" && (
              <motion.div
                key="predictions"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants.fadeInUp}
                transition={transitions.soft}
              >
                <PredictionsView />
              </motion.div>
            )}
            {activeTab === "menu" && (
              <motion.div
                key="menu"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants.fadeInUp}
                transition={transitions.soft}
              >
                <MenuEngineeringView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SidebarLayout>
  );
};
