import { useAuth } from "@/hooks";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, ChefHat, Lock, Mail } from "lucide-react";
import { Button, Input } from "@/components";

/**
 * Login Component
 */
export default function LoginPage() {
  // ================= HOOKS ==================
  const { login } = useAuth();
  const navigate = useNavigate();

  // ============= STATE ===============
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI States
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ============== HANDLERS =================
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous error
    setError(null);

    // Validate fields
    if (!email || !password) {
      setError("Todos los campos son requeridos.");
      return;
    }

    // Start Loading
    setIsLoading(true);

    try {
      // Attempt login
      await login({ email, password });

      // Navigate to dashboard on success
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
      // Stop loading
      setIsLoading(false);
    }
  };

  // ================== RENDER ====================
  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      {/* Decorative background orbs */}
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

      {/* ================= LOGIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="glass-light rounded-[2rem] p-10 shadow-soft-xl">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            {/* Logo */}
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

            {/* Title */}
            <h1 className=" text-3xl font-bold text-carbon-900 mb-2 tracking-tight">
              Plaet
            </h1>
            <p className="text-carbon-600 font-light">
              Sistema de Gestión de Restaurantes
            </p>
          </div>

          {/* ================= FORM ==================== */}
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
                {/* Icon  */}
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                {/* Input using component */}
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
                {/* Icon */}
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />

                {/* Input using component */}
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  fullWidth
                  className="pl-12"
                  required
                />
              </div>
            </div>

            {/* ==================== ERROR MESSAGE ======================= */}
            {/* Display error if exists  */}
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

            {/* ================== SUBMIT BUTTON ===================  */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              isLoading={isLoading}
              className="group mt-6 shadow-soft-lg hover:shadow-soft-xl"
            >
              {!isLoading && (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* =========== FOOTER LINKS ============= */}
          <div className="mt-8 text-center">
            <p className="text-sm text-carbon-600 font-light">
              ¿Primera vez aquí?{" "}
              <Link
                to="/register"
                className="text-sage-green-600 font-semibold hover:to-sage-green-700 transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* =========== TRUST BADGE ============= */}
        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p>
            <Lock />
            Conexión segura y encriptada
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
