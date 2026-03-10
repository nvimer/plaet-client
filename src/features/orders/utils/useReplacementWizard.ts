import { useState, useMemo, useCallback } from "react";
import type { Replacement } from "../components/ReplacementManager";
import { CATEGORY_NAMES, getReplaceableCategories, type CategoryInfo, type ReplacementCategory } from "./replacementConstants";

interface MenuOption {
  id: number;
  name: string;
}

interface UseReplacementWizardProps {
  availableItems: {
    soup: MenuOption[];
    principle: MenuOption[];
    salad: MenuOption[];
    drink: MenuOption[];
    extra: MenuOption[];
    rice?: MenuOption[];
  };
  replacements: Replacement[];
  onAddReplacement: (replacement: Replacement) => void;
}

interface UseReplacementWizardReturn {
  replaceableCategories: CategoryInfo[];
  availableTargets: CategoryInfo[];
  targetItems: MenuOption[];
  selectedFrom: string | null;
  selectedTo: string | null;
  selectedItem: number | null;
  currentStep: number;
  showAddModal: boolean;
  isCategoryReplaced: (categoryKey: string) => boolean;
  handleStartReplacement: () => void;
  handleCloseModal: () => void;
  handleSelectFrom: (categoryKey: string) => void;
  handleSelectTo: (categoryKey: string) => void;
  handleSelectItem: (itemId: number) => void;
  handleGoBack: () => void;
  handleConfirmReplacement: () => void;
}

export function useReplacementWizard({
  availableItems,
  replacements,
  onAddReplacement,
}: UseReplacementWizardProps): UseReplacementWizardReturn {
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const replaceableCategories = useMemo(() => {
    return getReplaceableCategories(availableItems);
  }, [availableItems]);

  const availableTargets = useMemo(() => {
    if (!selectedFrom) return [];
    return replaceableCategories.filter(
      (cat) =>
        cat.key !== selectedFrom &&
        !replacements.some((r) => r.from === selectedFrom && r.to === cat.key),
    );
  }, [selectedFrom, replaceableCategories, replacements]);

  const targetItems = useMemo(() => {
    if (!selectedTo) return [];
    return (availableItems as Record<string, MenuOption[]>)[selectedTo] || [];
  }, [selectedTo, availableItems]);

  const isCategoryReplaced = useCallback(
    (categoryKey: string) => {
      return replacements.some((r) => r.from === categoryKey);
    },
    [replacements]
  );

  const resetModalState = useCallback(() => {
    setCurrentStep(0);
    setSelectedFrom(null);
    setSelectedTo(null);
    setSelectedItem(null);
  }, []);

  const handleStartReplacement = useCallback(() => {
    setShowAddModal(true);
    resetModalState();
  }, [resetModalState]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    resetModalState();
  }, [resetModalState]);

  const handleSelectFrom = useCallback((categoryKey: string) => {
    setSelectedFrom(categoryKey);
    setCurrentStep(1);
  }, []);

  const handleSelectTo = useCallback((categoryKey: string) => {
    setSelectedTo(categoryKey);
    setCurrentStep(2);
  }, []);

  const handleSelectItem = useCallback((itemId: number) => {
    setSelectedItem(itemId);
  }, []);

  const handleGoBack = useCallback(() => {
    if (currentStep === 2) {
      setSelectedItem(null);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setSelectedTo(null);
      setCurrentStep(0);
    }
  }, [currentStep]);

  const handleConfirmReplacement = useCallback(() => {
    if (!selectedFrom || !selectedTo || !selectedItem) return;

    const fromName = CATEGORY_NAMES[selectedFrom as ReplacementCategory];
    const toName = CATEGORY_NAMES[selectedTo as ReplacementCategory];
    const item = targetItems.find((i) => i.id === selectedItem);

    if (!item) return;

    const newReplacement: Replacement = {
      id: Date.now().toString(),
      from: selectedFrom as Replacement["from"],
      fromName,
      to: selectedTo as Replacement["to"],
      toName,
      itemId: item.id,
      itemName: item.name,
    };

    onAddReplacement(newReplacement);
    handleCloseModal();
  }, [selectedFrom, selectedTo, selectedItem, targetItems, onAddReplacement, handleCloseModal]);

  return {
    replaceableCategories,
    availableTargets,
    targetItems,
    selectedFrom,
    selectedTo,
    selectedItem,
    currentStep,
    showAddModal,
    isCategoryReplaced,
    handleStartReplacement,
    handleCloseModal,
    handleSelectFrom,
    handleSelectTo,
    handleSelectItem,
    handleGoBack,
    handleConfirmReplacement,
  };
}
