import type { ReactNode } from "react";
import { Button } from "@/components";

export interface MenuSectionToolbarProps {
  /** e.g. "5 productos" or "3 categorías" */
  countLabel: string;
  /** Primary action label, e.g. "Nuevo Producto" */
  primaryLabel: string;
  /** Primary action handler */
  onPrimaryAction: () => void;
  /** Optional slot for filters (e.g. category select) */
  children?: ReactNode;
  /** Optional icon name for primary button - pass as React node */
  primaryIcon?: ReactNode;
}

/**
 * Reusable toolbar for menu sections (productos / categorías).
 * Touch-friendly: primary button min-h 44px.
 * Use for consistent layout and easy restaurant use.
 */
export function MenuSectionToolbar({
  countLabel,
  primaryLabel,
  onPrimaryAction,
  children,
  primaryIcon,
}: MenuSectionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm font-medium text-carbon-600">{countLabel}</p>
        {children}
      </div>
      <Button
        size="lg"
        variant="primary"
        onClick={onPrimaryAction}
        className="w-full sm:w-auto min-h-[44px] touch-manipulation"
        aria-label={primaryLabel}
      >
        {primaryIcon && <span className="flex-shrink-0 mr-2">{primaryIcon}</span>}
        {primaryLabel}
      </Button>
    </div>
  );
}
