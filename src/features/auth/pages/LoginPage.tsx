/**
 * LOGIN PAGE COMPONENT
 *
 * User login with email and password
 * Includes password visibility toggle and "Forgot Password" link
 */

import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Button, Input, BrandName, Seo } from "@/components";
import { useAuth } from "@/hooks";
import { toast } from "sonner";

/**
 * Login Component
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessMessage = location.state?.message;
  const messageType = location.state?.type;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Todos los campos son requeridos.");
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("¡Bienvenido de nuevo!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { message?: string; error?: string } };
              }
            ).response?.data?.message ||
            (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error ||
            error.message
          : "Error al iniciar sesión. Verifica tus credenciales.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6 relative overflow-hidden">
      <Seo title="Iniciar Sesión" description="Ingresa a tu cuenta de Plaet para gestionar tu restaurante." />
      
      {/* Background decorations */}
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

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-light rounded-3xl p-10 shadow-soft-xl">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <img src="/plaet.png" alt="Plaet Logo" className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-carbon-900 mb-2 tracking-tight">
              <BrandName accentClassName="text-sage-600" />
            </h1>
            <p className="text-carbon-600 font-light">
              Sistema de Gestión de Restaurantes
            </p>
          </div>

          {/* Success message */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 mb-6 border-2 rounded-xl flex items-start gap-3 ${
                messageType === "success"
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-light">{showSuccessMessage}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  fullWidth
                  className="pl-12 pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-500 hover:text-carbon-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Error de Autenticación
                  </p>
                  <p className="text-sm text-red-700 font-light">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Forgot Password link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              isLoading={isLoading}
              className="group mt-2 shadow-soft-lg hover:shadow-soft-xl"
            >
              {!isLoading && (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer - Admin registration only */}
          <div className="mt-8 text-center">
            <p className="text-sm text-carbon-600 font-light">
              ¿Eres administrador?{" "}
              <Link
                to="/register"
                className="text-sage-600 font-semibold hover:text-sage-700 transition-colors"
              >
                Registra tu restaurante
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
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
