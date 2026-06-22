import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export interface SearchSuggestion {
  id: string;
  label: string;
  value?: string;
  imageUrl?: string;
}

interface SearchBoxProps {
  suggestions: SearchSuggestion[];
  placeholder?: string;
  className?: string;
  onSearch?: (payload: { query: string; suggestion?: SearchSuggestion }) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  suggestions,
  placeholder = "Search products",
  className = "",
  onSearch,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = trimmedQuery.toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return suggestions
      .filter((suggestion) =>
        suggestion.label.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 6);
  }, [trimmedQuery, suggestions]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const clearSearch = () => {
    setQuery("");
    setActiveIndex(-1);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    setActiveIndex(-1);
    setIsOpen(false);
    onSelect?.(suggestion);
    onSearch?.({ query: suggestion.value ?? suggestion.label, suggestion });
  };

  const submitSearch = () => {
    const selectedSuggestion =
      activeIndex >= 0 ? filteredSuggestions[activeIndex] : undefined;

    if (selectedSuggestion) {
      selectSuggestion(selectedSuggestion);
      return;
    }

    const payload = { query: trimmedQuery };
    onSearch?.(payload);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex min-h-11 items-center gap-2 rounded-full border border-border-main bg-bg-main px-3 text-text-main shadow-sm">
        <Search size={17} className="shrink-0 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setActiveIndex(-1);
            setIsOpen(nextQuery.trim().length > 0);
          }}
          onFocus={() => setIsOpen(trimmedQuery.length > 0)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (filteredSuggestions.length === 0) return;
              setActiveIndex((currentIndex) =>
                Math.min(currentIndex + 1, filteredSuggestions.length - 1)
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (filteredSuggestions.length === 0) return;
              setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
            }

            if (event.key === "Enter") {
              event.preventDefault();
              submitSearch();
            }

            if (event.key === "Escape") {
              setIsOpen(false);
              setActiveIndex(-1);
            }
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-text-muted transition hover:bg-border-main hover:text-brand-red"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && trimmedQuery.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-border-main bg-bg-main shadow-xl">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <button
                type="button"
                key={suggestion.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
                  activeIndex === index
                    ? "bg-brand-red text-white"
                    : "text-text-main hover:bg-border-main"
                }`}
              >
                {suggestion.imageUrl ? (
                  <img
                    src={suggestion.imageUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-yellow/15 text-xs font-bold uppercase text-brand-yellow">
                    {suggestion.label.slice(0, 1)}
                  </span>
                )}
                <span className="truncate">{suggestion.label}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm font-medium text-text-muted">
              No result found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
