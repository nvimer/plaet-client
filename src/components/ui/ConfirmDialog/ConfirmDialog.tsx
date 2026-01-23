import { X } from "lucide-react";
import { Button } from "../Button/Button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

// Component
export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    isLoading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: "bg-red-50 text-red-600",
            title: "text-carbon-900",
            button: "bg-red-600 text-white hover:bg-red-700",
        },
        warning: {
            icon: "bg-yellow-50 text-yellow-600",
            title: "text-carbon-900",
            button: "bg-yellow-600 text-white hover:bg-yellow-700",
        },
        info: {
            icon: "bg-sage-green-50 text-sage-green-600",
            title: "text-carbon-900",
            button: "bg-sage-green-600 text-carbon-900 hover:bg-sage-green-400",
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop  */}
            <div
                className="absolute inset-0 bg-carbon-900 bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-soft-xl max-w-md w-full mx-4 p-6 animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-carbon-500 hover:text-carbon-700 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon  */}
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${variantStyles[variant].icon}`}
                >
                    <span className="text-2xl">⚠️</span>
                </div>

                {/* Tittle */}
                <h3 className={`text-xl font-bold mb-2 ${variantStyles[variant].icon}`}>
                    {title}
                </h3>

                {/* Message */}
                <p className="text-carbon-700 mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        fullWidth
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className={variantStyles[variant].button}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
