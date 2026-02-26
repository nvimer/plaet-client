/**
 * RESET PASSWORD PAGE COMPONENT
 *
 * Password reset with token from email
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChefHat,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button, Input } from "@/components";
import { authApi } from "@/services";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-light rounded-3xl p-10 shadow-soft-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-carbon-900 mb-4">
            Enlace Inválido
          </h1>
          <p className="text-carbon-600 mb-6">
            El enlace de restauración ha expirado o es inválido.
          </p>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Volver al inicio de sesión
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Todos los campos son requeridos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 12) {
      setError("La contraseña debe tener al menos 12 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword(token, password);
      toast.success("Tu contraseña ha sido restaurada exitosamente");
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Tu contraseña ha sido cambiada exitosamente. Puedes iniciar sesión.",
          type: "success",
        },
      });
    } catch (_error) {
      setError(
        "Error al restaurar la contraseña. El enlace puede haber expirado.",
      );
    } finally {
      setIsLoading(false);
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
              Restablecer Contraseña
            </h1>
            <p className="text-carbon-600 font-light">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 12 caracteres"
                  disabled={isLoading}
                  fullWidth
                  className="pl-12 pr-12"
                  required
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  disabled={isLoading}
                  fullWidth
                  className="pl-12 pr-12"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-500 hover:text-carbon-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="bg-sage-50 rounded-lg p-4 text-sm text-carbon-600">
              <p className="font-semibold mb-2">Requisitos de contraseña:</p>
              <ul className="space-y-1 ml-2">
                <li className={password.length >= 12 ? "text-green-600" : ""}>
                  ✓ Mínimo 12 caracteres
                </li>
                <li className="text-carbon-500">• Una letra mayúscula</li>
                <li className="text-carbon-500">• Una letra minúscula</li>
                <li className="text-carbon-500">• Un número</li>
                <li className="text-carbon-500">• Un carácter especial</li>
              </ul>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              isLoading={isLoading}
              className="mt-2"
            >
              Restablecer Contraseña
            </Button>
          </form>
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
