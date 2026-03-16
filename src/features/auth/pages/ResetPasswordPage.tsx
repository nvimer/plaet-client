/**
 * RESET PASSWORD PAGE COMPONENT
 *
 * Password reset with token from email
 * Includes password strength indicator and refined validation
 */

import { Button, Input } from "@/components";
import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChefHat,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Check,
} from "lucide-react";
import { authApi } from "@/services";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

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

  // Password requirements state
  const requirements = useMemo(() => [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Una letra mayúscula", met: /[A-Z]/.test(password) },
    { label: "Una letra minúscula", met: /[a-z]/.test(password) },
    { label: "Un número", met: /[0-9]/.test(password) },
    { label: "Un carácter especial", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    if (!password) return 0;
    return requirements.filter(req => req.met).length;
  }, [password, requirements]);

  const strengthColor = useMemo(() => {
    if (strength <= 1) return "bg-error-500";
    if (strength <= 3) return "bg-warning-500";
    if (strength <= 4) return "bg-info-500";
    return "bg-success-500";
  }, [strength]);

  const strengthText = useMemo(() => {
    if (!password) return "";
    if (strength <= 1) return "Muy débil";
    if (strength <= 3) return "Débil";
    if (strength <= 4) return "Media";
    return "Fuerte";
  }, [password, strength]);

  if (!token) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-light rounded-3xl p-10 shadow-soft-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-error-600" />
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

    if (strength < 5) {
      setError("La contraseña no cumple con todos los requisitos de seguridad.");
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
                  placeholder="Mínimo 8 caracteres"
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

              {/* Strength Meter */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-carbon-400">Seguridad:</span>
                    <span className={cn(
                      strength <= 1 ? "text-error-600" :
                      strength <= 3 ? "text-warning-600" :
                      strength <= 4 ? "text-info-600" :
                      "text-success-600"
                    )}>
                      {strengthText}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-carbon-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "h-full flex-1 transition-all duration-500",
                          strength >= step ? strengthColor : "bg-carbon-100"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
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

            {/* Password requirements list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-white/50 border border-carbon-100 rounded-2xl">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                    req.met ? "bg-success-100 text-success-600" : "bg-carbon-100 text-carbon-300"
                  )}>
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  </div>
                  <span className={cn(
                    "text-[11px] font-medium transition-colors",
                    req.met ? "text-carbon-900" : "text-carbon-400"
                  )}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-error-50 border-2 border-error-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error-700">{error}</p>
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
