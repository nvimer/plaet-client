import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Rows,
} from "lucide-react";
import { Button } from "@/components";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: 10 | 20 | 50 | 100) => void;
  isLoading?: boolean;
  className?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [
  { value: 10, label: "10 por página" },
  { value: 20, label: "20 por página" },
  { value: 50, label: "50 por página" },
  { value: 100, label: "100 por página" },
] as const;

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
  className = "",
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleFirstPage = () => onPageChange(1);
  const handlePreviousPage = () => onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(totalPages);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        pages.push(2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // In the middle
        pages.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-white border-t border-sage-200 ${className}`}
    >
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <Rows className="w-4 h-4 text-carbon-500" />
        <select
          value={itemsPerPage}
          onChange={(e) =>
            onItemsPerPageChange(Number(e.target.value) as 10 | 20 | 50 | 100)
          }
          disabled={isLoading}
          className="text-sm border border-sage-200 rounded-lg px-3 py-1.5 bg-white text-carbon-700 focus:outline-none focus:ring-2 focus:ring-sage-400 disabled:opacity-50"
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-carbon-500">
          de <strong>{totalItems}</strong> productos
        </span>
      </div>

      {/* Page info */}
      <div className="text-sm text-carbon-600">
        {startItem}-{endItem} de {totalItems}
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFirstPage}
          disabled={currentPage === 1 || isLoading}
          className="min-w-[36px] h-9 px-2"
          aria-label="Ir a la primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
          className="min-w-[36px] h-9 px-2"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="px-2 text-carbon-400">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  className={`min-w-[36px] h-9 px-3 ${
                    currentPage === page ? "" : "text-carbon-600"
                  }`}
                  aria-label={`Ir a la página ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              )}
            </span>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
          className="min-w-[36px] h-9 px-2"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLastPage}
          disabled={currentPage === totalPages || isLoading}
          className="min-w-[36px] h-9 px-2"
          aria-label="Ir a la última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
