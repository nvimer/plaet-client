import React, { useState, useRef } from "react";
import { Camera, X, Upload, ImageIcon } from "lucide-react";
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
 * ImageUpload Component
 * 
 * Handles file selection and preview for images.
 * Supports both URL strings (for existing images) and File objects (for new uploads).
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
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes (e.g. initial load)
  React.useEffect(() => {
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
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-semibold text-carbon-800">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          preview 
            ? "border-sage-300 bg-white" 
            : "border-sage-200 bg-sage-50/50 hover:bg-sage-100/50 hover:border-sage-400",
          error ? "border-error-300 bg-error-50/30" : "",
          previewClassName || "aspect-video flex items-center justify-center"
        )}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-carbon-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="button" 
                size="sm" 
                variant="primary" 
                className="rounded-full bg-white text-carbon-900 hover:bg-white/90"
              >
                <Camera className="w-4 h-4 mr-2" />
                Cambiar
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="danger" 
                className="rounded-full"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white shadow-soft-sm flex items-center justify-center text-sage-500 mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-carbon-700">Subir imagen</p>
            <p className="text-xs text-carbon-400 mt-1">PNG, JPG o WEBP (Máx. 5MB)</p>
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
        <p className="text-xs font-bold text-error-600 px-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
