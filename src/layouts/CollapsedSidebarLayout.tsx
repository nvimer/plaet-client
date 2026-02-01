import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarStore } from '@/contexts/SidebarContext';
import { Button, Input } from '@/components';
import { TableWizard } from '../components/TableWizard';
import { useCreateTable } from '../hooks';
import { ROUTES } from '@/app/routes';
import type { AxiosErrorWithResponse } from '@/types/common';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { X, Menu } from 'lucide-react';

/**
 * CollapsedSidebarLayout component
 * 
 * Layout for creation workflows with collapsed sidebar
 * Provides context while maximizing space for wizard
 */
export function CollapsedSidebarLayout({
  children,
  title,
  subtitle,
  backRoute,
  actions,
}: CollapsedSidebarLayoutProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebarStore();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Collapsed Sidebar - Desktop */}
      <div className="hidden lg:flex">
        <div className="w-16 bg-white border-r border-sage-border-subtle flex flex-col items-center py-6">
          {/* Logo/Icon */}
          <div className="w-10 h-10 bg-sage-green-500 rounded-lg flex items-center justify-center text-white font-bold mb-8">
            🍽️
          </div>
          
          {/* Navigation dots */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="w-2 h-2 bg-sage-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-carbon-300 rounded-full"></div>
            <div className="w-2 h-2 bg-carbon-300 rounded-full"></div>
            <div className="w-2 h-2 bg-carbon-300 rounded-full"></div>
          </div>
          
          {/* User avatar */}
          <div className="w-8 h-8 bg-carbon-200 rounded-full"></div>
        </div>
      </div>

      {/* Mobile Sidebar - Hidden by default */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-64 bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-sage-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  🍽️
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-carbon-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-sage-green-50 text-sage-green-700 rounded-lg">
                  <div className="w-2 h-2 bg-sage-green-500 rounded-full"></div>
                  <span className="font-medium">Crear Mesa</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-carbon-600 hover:bg-carbon-50 rounded-lg">
                  <div className="w-2 h-2 bg-carbon-300 rounded-full"></div>
                  <span>Mesas</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-carbon-600 hover:bg-carbon-50 rounded-lg">
                  <div className="w-2 h-2 bg-carbon-300 rounded-full"></div>
                  <span>Menú</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-carbon-600 hover:bg-carbon-50 rounded-lg">
                  <div className="w-2 h-2 bg-carbon-300 rounded-full"></div>
                  <span>Pedidos</span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-sage-border-subtle px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {/* Mobile menu button and back */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-carbon-100 rounded-lg"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <Button
                variant="ghost"
                onClick={handleBack}
                className="p-3 -ml-3"
                aria-label="Volver"
              >
                <X className="w-5 h-5" />
              </Button>
              
              {/* Desktop sidebar toggle */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block p-2 hover:bg-carbon-100 rounded-lg"
                aria-label={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                {title && (
                  <h1 className="text-2xl font-semibold text-carbon-900">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-carbon-600 font-light mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}