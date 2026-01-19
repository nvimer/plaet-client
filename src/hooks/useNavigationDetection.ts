import { useEffect, useState, useMemo } from "react";

/**
 * Navigation Detection Hook
 * 
 * Automatically detects if there are contextual navigation buttons
 * (Cancel, Back, Close) to decide whether to show the back arrow.
 * 
 * @returns Object with detection state and visual decision
 */
export function useNavigationDetection() {
  const [hasCancelButton, setHasCancelButton] = useState(false);
  const [hasFunctionalCancel, setHasFunctionalCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Palabras clave para identificar botones de navegación contextual
  const navigationKeywords = useMemo(() => [
    'cancelar', 'cerrar', 'volver', 'regresar', 'salir', 'cancel',
    'close', 'back', 'return', 'exit'
  ], []);

  /**
   * Detects if an element is a contextual navigation button
   */
  const isNavigationButton = (element: HTMLElement): boolean => {
    const text = element.textContent?.toLowerCase().trim() || '';
    const buttonText = element.getAttribute('aria-label')?.toLowerCase() || '';
    const combinedText = `${text} ${buttonText}`;
    
    return navigationKeywords.some(keyword => combinedText.includes(keyword));
  };

  /**
   * Checks if a button is functional and accessible
   */
  const isButtonFunctional = (element: HTMLElement): boolean => {
    return !(element as HTMLButtonElement).disabled && 
           !element.hasAttribute('aria-disabled') &&
           element.offsetParent !== null &&
           element.getAttribute('tabindex') !== '-1';
  };

  /**
   * Performs button detection in the DOM
   */
  const detectNavigationButtons = () => {
    // Search for all buttons in the document
    const buttons = document.querySelectorAll('button, [role="button"]');
    
    let foundCancelButton = false;
    let foundFunctionalButton = false;
    let foundLoadingState = false;
    let foundErrorState = false;

    buttons.forEach(button => {
      const element = button as HTMLElement;
      
      // Detect contextual navigation button
      if (isNavigationButton(element)) {
        foundCancelButton = true;
        
        // Check if it's functional
        if (isButtonFunctional(element)) {
          foundFunctionalButton = true;
        }
      }
      
      // Detect loading/error states
      if (element.textContent?.toLowerCase().includes('cargando') || 
          element.querySelector('[class*="loading"], [class*="spinner"]')) {
        foundLoadingState = true;
      }
      
      // Detect error messages
      if (element.querySelector('[class*="error"], [class*="danger"]') ||
          element.closest('.bg-red-50, .border-red-200')) {
        foundErrorState = true;
      }
    });

    setHasCancelButton(foundCancelButton);
    setHasFunctionalCancel(foundFunctionalButton);
    setIsLoading(foundLoadingState);
    setHasError(foundErrorState);
  };

  /**
   * Decides whether to show the back button based on business rules
   */
  const shouldShowBackButton = useMemo(() => {
    // Rule 1: If there's a functional cancel button, don't show arrow
    if (hasFunctionalCancel) {
      return false;
    }
    
    // Rule 2: If there's loading or error, show arrow as fallback
    if (isLoading || hasError) {
      return true;
    }
    
    // Rule 3: If there's a cancel button but not functional, show arrow
    if (hasCancelButton && !hasFunctionalCancel) {
      return true;
    }
    
    // Rule 4: By default, show arrow if no cancel button
    return !hasCancelButton;
  }, [hasCancelButton, hasFunctionalCancel, isLoading, hasError]);

  /**
   * Mutation observer for dynamic changes
   */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Small delay to ensure DOM is updated
      setTimeout(detectNavigationButtons, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled', 'class']
    });

    // Initial detection
    detectNavigationButtons();

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [navigationKeywords]);

  return {
    hasCancelButton,
    hasFunctionalCancel,
    shouldShowBackButton,
    isLoading,
    hasError,
    navigationKeywords
  };
}