/**
 * ACCOUNT LOCKOUT PAGE COMPONENT
 *
 * Displayed when user account is temporarily locked due to
 * failed login attempts (HTTP 423 Locked)
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChefHat, Lock, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components";

interface LockoutInfo {
  lockedAt: Date;
  expiresAt: Date;
  remainingSeconds: number;
}

export default function AccountLockoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [lockoutInfo, setLockoutInfo] = useState<LockoutInfo | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const email = searchParams.get("email");
  const expiresAtParam = searchParams.get("expiresAt");

  useEffect(() => {
    if (!email || !expiresAtParam) {
      navigate("/login");
      return;
    }

    const expiresAt = new Date(parseInt(expiresAtParam, 10));
    const now = new Date();

    setLockoutInfo({
      lockedAt: now,
      expiresAt,
      remainingSeconds: Math.max(
        0,
        Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
      ),
    });

    setIsChecking(false);
  }, [email, expiresAtParam, navigate]);

  useEffect(() => {
    if (!lockoutInfo || lockoutInfo.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockoutInfo((prev) => {
        if (!prev || prev.remainingSeconds <= 0) return prev;

        const newRemaining = prev.remainingSeconds - 1;

        if (newRemaining <= 0) {
          navigate("/login");
          return null;
        }

        return {
          ...prev,
          remainingSeconds: newRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutInfo, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-sage-green-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-sage-green-100 rounded-full blur-3xl opacity-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-light rounded-[2rem] p-10 shadow-soft-xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-sage flex items-center justify-center shadow-soft-md">
                <ChefHat className="w-8 h-8 text-sage-green-600" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-carbon-900 mb-2 tracking-tight">
              Cuenta Bloqueada
            </h1>
            <p className="text-carbon-600 font-light">
              Demasiados intentos de inicio de sesión fallidos
            </p>
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6"
          >
            <Lock className="w-12 h-12 text-amber-600" />
          </motion.div>

          <div className="bg-carbon-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-sage-green-600" />
              <span className="text-sm font-semibold text-carbon-700">
                Tiempo restante
              </span>
            </div>
            <motion.div
              key={lockoutInfo?.remainingSeconds || 0}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-bold text-carbon-900 text-center font-mono"
            >
              {lockoutInfo ? formatTime(lockoutInfo.remainingSeconds) : "--:--"}
            </motion.div>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-carbon-600 text-sm text-center">
              Tu cuenta ha sido bloqueada temporalmente por seguridad. Esto
              sucede después de varios intentos fallidos de inicio de sesión.
            </p>
            <p className="text-carbon-500 text-xs text-center">
              Por favor espera el tiempo indicado o contacta al administrador si
              necesitas acceso inmediato.
            </p>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio de sesión
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-carbon-500 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Protección de cuenta activa</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
