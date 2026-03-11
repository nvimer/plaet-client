import { OrderType } from "@/types";
import type { ProteinOption, Replacement } from "../types/orderBuilder";

interface NoteBuilderParams {
  selectedOrderType: OrderType | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  selectedProtein: ProteinOption | null;
  replacements: Replacement[];
  manualNotes: string;
}

/**
 * Builds standardized order notes string combining customer info, replacements, and manual notes.
 */
export const buildOrderNotesString = ({
  selectedOrderType,
  customerName,
  customerPhone,
  deliveryAddress,
  selectedProtein,
  replacements,
  manualNotes,
}: NoteBuilderParams): string => {
  const sections: string[] = [];

  // 1. Customer Info Section
  if (selectedOrderType === OrderType.TAKE_OUT || selectedOrderType === OrderType.DELIVERY) {
    let customerInfo = `👤 CLIENTE: ${customerName} | 📞 TEL: ${customerPhone}`;
    if (selectedOrderType === OrderType.DELIVERY && deliveryAddress) {
      customerInfo += ` | 📍 DIR: ${deliveryAddress}`;
    }
    sections.push(customerInfo);
  }
  
  // 2. Replacements Section
  if (selectedProtein && replacements.length > 0) {
    const replText = replacements
      .map(r => `[-] Sin ${r.fromName} [+] Extra ${r.itemName}`)
      .join(" | ");
    sections.push(`🔄 CAMBIOS: ${replText}`);
  }
  
  // 3. Manual User Notes
  if (manualNotes.trim()) {
    sections.push(`📝 NOTAS: ${manualNotes.trim()}`);
  }
  
  return sections.join("\n-------------------\n");
};

/**
 * Extracts manual notes from a standardized notes string by stripping automated sections.
 */
export const extractManualNotes = (standardizedNotes: string): string => {
  if (!standardizedNotes) return "";
  
  const sections = standardizedNotes.split("\n-------------------\n");
  
  // Filter out sections that start with automated prefixes
  const manualParts = sections.filter(s => 
    !s.includes("👤 CLIENTE:") && 
    !s.includes("🔄 CAMBIOS:") &&
    !s.startsWith("📝 NOTAS:")
  );

  // Also look for the "📝 NOTAS:" prefix within a section and strip it
  return sections
    .find(s => s.includes("📝 NOTAS:"))
    ?.replace("📝 NOTAS:", "")
    .trim() || manualParts.join("\n").trim();
};
