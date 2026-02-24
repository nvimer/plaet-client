/**
 * CHANGE PASSWORD PAGE COMPONENT
 *
 * Page for authenticated users to change their password
 * Requires current password verification
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components";
import { authApi } from "@/services";
import { toast } from "sonner";
import axios from "axios";

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Ingresa tu contraseña actual";
    }

    if (!newPassword) {
      newErrors.newPassword = "Ingresa tu nueva contraseña";
    } else if (newPassword.length < 12) {
      newErrors.newPassword = "Mínimo 12 caracteres";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Al menos una mayúscula";
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword = "Al menos una minúscula";
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Al menos un número";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      newErrors.newPassword = "Al menos un carácter especial";
    }

    if (newPassword && newPassword.toLowerCase().includes("password")) {
      newErrors.newPassword = "No puede contener la palabra 'password'";
    }

    if (newPassword.length > 128) {
      newErrors.newPassword = "Máximo 128 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = "La nueva contraseña debe ser diferente";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthLabels = ["Muy débil", "Débil", "Regular", "Buena", "Fuerte"];
  const strengthColors = [
    "bg-error-500",
    "bg-warning-500",
    "bg-warning-400",
    "bg-success-400",
    "bg-success-500",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success("Contraseña actualizada correctamente");
      navigate("/profile");
    } catch (error: unknown) {
      let message = "";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || "";
      }

      if (message.toLowerCase().includes("current password")) {
        setErrors({ currentPassword: "Contraseña actual incorrecta" });
      } else {
        toast.error(message || "Error al cambiar la contraseña");
      }
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
              Cambiar Contraseña
            </h1>
            <p className="text-carbon-600 font-light">
              Ingresa tu contraseña actual y la nueva
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Contraseña Actual
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.currentPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-carbon-200 focus:ring-sage-green-200 focus:border-sage-green-500"
                  }`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-500 hover:text-carbon-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.newPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-carbon-200 focus:ring-sage-green-200 focus:border-sage-green-500"
                  }`}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-500 hover:text-carbon-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : "bg-carbon-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-carbon-500">
                    Fortaleza:{" "}
                    <span
                      className={
                        passwordStrength >= 4
                          ? "text-success-600"
                          : passwordStrength >= 3
                            ? "text-lime-600"
                            : passwordStrength >= 2
                              ? "text-yellow-600"
                              : "text-red-500"
                      }
                    >
                      {strengthLabels[passwordStrength - 1]}
                    </span>
                  </p>
                </div>
              )}

              {errors.newPassword && (
                <p className="mt-1 text-sm text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-carbon-900 mb-2"
              >
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-carbon-200 focus:ring-sage-green-200 focus:border-sage-green-500"
                  }`}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-500 hover:text-carbon-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword === confirmPassword && (
                <p className="mt-1 text-sm text-success-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Las contraseñas coinciden
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="bg-carbon-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-carbon-600 font-medium mb-2">
                Requisitos de contraseña:
              </p>
              <ul className="text-xs text-carbon-500 space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle
                    className={`w-3 h-3 ${
                      newPassword.length >= 12
                        ? "text-success-500"
                        : "text-carbon-300"
                    }`}
                  />
                  Mínimo 12 caracteres
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle
                    className={`w-3 h-3 ${
                      /[A-Z]/.test(newPassword)
                        ? "text-success-500"
                        : "text-carbon-300"
                    }`}
                  />
                  Una mayúscula
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle
                    className={`w-3 h-3 ${
                      /[a-z]/.test(newPassword)
                        ? "text-success-500"
                        : "text-carbon-300"
                    }`}
                  />
                  Una minúscula
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle
                    className={`w-3 h-3 ${
                      /[0-9]/.test(newPassword)
                        ? "text-success-500"
                        : "text-carbon-300"
                    }`}
                  />
                  Un número
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle
                    className={`w-3 h-3 ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                        ? "text-success-500"
                        : "text-carbon-300"
                    }`}
                  />
                  Un carácter especial
                </li>
              </ul>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Cambiar Contraseña
              </Button>
            </div>
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
            <span>Tu contraseña está encriptada</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
