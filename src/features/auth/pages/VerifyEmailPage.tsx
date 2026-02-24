/**
 * VERIFY EMAIL PAGE COMPONENT
 *
 * Email verification page with token from email link
 * Handles verification success, error, and resend scenarios
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components";
import { authApi } from "@/services";
import { toast } from "sonner";
import axios from "axios";

type VerificationStatus =
  | "idle"
  | "verifying"
  | "success"
  | "error"
  | "expired";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      setStatus("verifying");

      try {
        await authApi.verifyEmail(token);
        setStatus("success");
        toast.success("¡Email verificado correctamente!");
      } catch (error: unknown) {
        let message = "";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || "";
        }

        if (message.includes("expired") || message.includes("invalid")) {
          setStatus("expired");
        } else {
          setStatus("error");
        }
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    setIsResending(true);

    try {
      await authApi.resendVerification(email);
      toast.success("Email de verificación reenviado");
    } catch {
      toast.error("Error al reenviar el email");
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
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
              Verificando...
            </h1>
            <p className="text-carbon-600 font-light">
              Estamos verificando tu correo electrónico
            </p>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mt-8"
            >
              <RefreshCw className="w-8 h-8 text-sage-green-600 mx-auto" />
            </motion.div>
          </div>
        );

      case "success":
        return (
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
              ¡Email Verificado!
            </h1>
            <p className="text-carbon-600 font-light">
              Tu correo ha sido verificado exitosamente
            </p>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mt-8 mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <p className="text-carbon-600 text-center mt-6">
              Ya puedes acceder a todas las funciones de tu cuenta
            </p>
          </div>
        );

      case "expired":
      case "error":
        return (
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
              {status === "expired"
                ? "Token Expirado"
                : "Error de Verificación"}
            </h1>
            <p className="text-carbon-600 font-light">
              {status === "expired"
                ? "El enlace de verificación ha expirado"
                : "No se pudo verificar tu correo"}
            </p>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mt-8 mx-auto"
            >
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </motion.div>

            {status === "expired" && (
              <div className="mt-8">
                <p className="text-carbon-600 text-sm mb-4">
                  Ingresa tu correo para reenviar el enlace de verificación
                </p>
                <div className="relative max-w-xs mx-auto">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-carbon-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500"
                  />
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isResending}
                  isLoading={isResending}
                  onClick={handleResendVerification}
                  className="mt-4"
                >
                  Reenviar Email de Verificación
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
        <div className="glass-light rounded-3xl p-10 shadow-soft-xl">
          {renderContent()}

          {(status === "success" ||
            status === "expired" ||
            status === "error") && (
            <Button
              variant="outline"
              fullWidth
              onClick={() =>
                status === "success"
                  ? navigate("/dashboard")
                  : navigate("/login")
              }
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {status === "success" ? "Ir al Dashboard" : "Volver al inicio"}
            </Button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-carbon-500 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Conexión segura y encriptada</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
