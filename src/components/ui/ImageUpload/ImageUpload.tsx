import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Upload, ImageIcon, ImagePlus, RefreshCw, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "../Button/Button";

interface ImageUploadProps {
  value?: string | File | null;
  onChange: (file: File | null) => void;
  onClear?: () => void;
  label?: string;
  error?: string;
  className?: string;
  previewClassName?: string;
}

/**
 * ImageUpload Component - Premium Version
 * 
 * High-end UI for image selection and preview.
 * Designed for professional management interfaces.
 */
export function ImageUpload({
  value,
  onChange,
  onClear,
  label,
  error,
  className,
  previewClassName,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes
  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (!value) {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB.");
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (onClear) onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-sm font-bold text-carbon-800 ml-1">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-3xl border-3 border-dashed transition-all duration-500",
          preview 
            ? "border-sage-200 bg-white shadow-soft-md" 
            : "border-sage-200 bg-sage-50/30 hover:bg-white hover:border-sage-400 hover:shadow-soft-lg hover:ring-8 hover:ring-sage-500/5",
          error ? "border-error-300 bg-error-50/10" : "",
          previewClassName || "aspect-video flex items-center justify-center"
        )}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className={cn(
                "w-full h-full object-cover transition-transform duration-700",
                isHovered ? "scale-110 blur-[2px]" : "scale-100"
              )}
            />
            
            {/* Overlay on Hover */}
            <div className={cn(
              "absolute inset-0 bg-carbon-900/40 transition-all duration-500 flex flex-col items-center justify-center gap-3",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="primary" 
                  className="rounded-2xl bg-white text-carbon-900 hover:bg-white/90 shadow-xl border-none font-bold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Cambiar
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="danger" 
                  className="rounded-2xl shadow-xl border-none"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Resolución optimizada</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-soft-lg flex items-center justify-center text-sage-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-sage-100">
                <ImagePlus className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-sage-600 text-white flex items-center justify-center shadow-md animate-pulse">
                <Plus className="w-4 h-4 stroke-[3px]" />
              </div>
            </div>
            <p className="text-sm font-black text-carbon-800 uppercase tracking-wider">Cargar Imagen</p>
            <p className="text-[11px] text-carbon-400 mt-2 font-medium">Recomendado: 800x600px (Max 5MB)</p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs font-bold text-error-600 px-2 animate-fade-in flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-error-600" />
          {error}
        </p>
      )}
    </div>
  );
}
