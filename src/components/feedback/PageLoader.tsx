import { motion } from "framer-motion";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-sage-50/50 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-sage-600 rounded-lg animate-pulse shadow-soft-lg" />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sage-600 font-black tracking-widest text-[10px] uppercase"
      >
        Cargando Plaet...
      </motion.p>
    </div>
  );
};
