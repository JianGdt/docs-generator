"use client";

import { Input } from "../../../components/ui/input";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by title or document type...",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [debouncedValue] = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
