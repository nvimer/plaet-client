/**
 * FORGOT PASSWORD PAGE COMPONENT
 *
 * Password recovery request form
 * Sends reset email to user
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Mail,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Button, Input } from "@/components";
import { authApi } from "@/services";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
      toast.success(
        "Si tu correo está registrado, recibirás un enlace para restaurar tu contraseña",
      );
    } catch (_error) {
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
            className="absolute top-20 left-10 w-96 h-96 bg-sage-200 rounded-full blur-3xl opacity-30"
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
            className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-sage-100 rounded-full blur-3xl opacity-20"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div className="glass-light rounded-3xl p-10 shadow-soft-xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-sage flex items-center justify-center shadow-soft-md">
                  <ChefHat className="w-8 h-8 text-sage-600" />
                </div>
              </motion.div>

              <h1 className="text-3xl font-bold text-carbon-900 mb-2 tracking-tight">
                Correo Enviado
              </h1>
              <p className="text-carbon-600 font-light">
                Revisa tu bandeja de entrada
              </p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-10 h-10 text-success-600" />
              </motion.div>

              <p className="text-carbon-600 text-center">
                Hemos enviado un enlace de recuperación a{" "}
                <span className="font-semibold text-carbon-900">{email}</span>
              </p>
              <p className="text-carbon-500 text-sm mt-2 text-center">
                El enlace expirará en 1 hora por seguridad
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
              <span>Conexión segura y encriptada</span>
            </div>
          </motion.div>
        </motion.div>
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
          className="absolute top-20 left-10 w-96 h-96 bg-sage-200 rounded-full blur-3xl opacity-30"
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
          className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-sage-100 rounded-full blur-3xl opacity-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-light rounded-3xl p-10 shadow-soft-xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-sage flex items-center justify-center shadow-soft-md">
                <ChefHat className="w-8 h-8 text-sage-600" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-carbon-900 mb-2 tracking-tight">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-carbon-600 font-light">
              Ingresa tu correo y te enviaremos un enlace para restaurarla
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  fullWidth
                  className="pl-12"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              isLoading={isLoading}
              className="mt-6"
            >
              Enviar enlace de recuperación
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-carbon-600 font-light">
              ¿Recordaste tu contraseña?{" "}
              <Link
                to="/login"
                className="text-sage-600 font-semibold hover:text-sage-700 transition-colors"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
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
