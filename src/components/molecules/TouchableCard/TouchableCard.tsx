import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * TouchableCard Props
 * 
 * Card component optimized for touch interactions.
 * Provides haptic feedback, animations, and visual feedback.
 */
export interface TouchableCardProps {
  children: React.ReactNode;
  onPress: () => void;
  hapticFeedback?: boolean;
  soundFeedback?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  selected?: boolean;
  className?: string;
}

/**
 * TouchableCard Component
 * 
 * A card component optimized for touch interactions, similar to
 * mobile app interfaces. Provides visual and haptic feedback
 * when pressed.
 * 
 * Features:
 * - Scale animation on press
 * - Haptic feedback (vibration) on mobile devices
 * - Optional sound feedback
 * - Large touch targets for better UX
 * - Visual selection state
 * 
 * @example
 * ```tsx
 * <TouchableCard
 *   onPress={() => handleSelect(product)}
 *   size="large"
 *   hapticFeedback
 *   selected={isSelected}
 * >
 *   <ProductImage />
 *   <ProductName />
 * </TouchableCard>
 * ```
 */
export function TouchableCard({
  children,
  onPress,
  hapticFeedback = true,
  soundFeedback = false,
  disabled = false,
  size = "medium",
  selected = false,
  className,
}: TouchableCardProps) {
  /**
   * Handles the press interaction
   */
  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback (vibration on mobile devices)
    if (hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(10);
    }

    // Sound feedback (optional, can be implemented later)
    if (soundFeedback) {
      // TODO: Implement sound feedback
    }

    onPress();
  };

  const sizeClasses = {
    small: "p-4 min-h-[80px]",
    medium: "p-6 min-h-[120px]",
    large: "p-8 min-h-[160px]",
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-2xl shadow-md",
        "cursor-pointer select-none",
        "transition-all duration-200",
        sizeClasses[size],
        selected && "ring-4 ring-sage-400 ring-offset-2",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg active:shadow-md",
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={handlePress}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </motion.div>
  );
}
