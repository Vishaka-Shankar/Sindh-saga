import { useEffect, useMemo, useRef, useState } from 'react';

import { searchItems, type CulturalItem } from '@/services/api';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      void (async () => {
        try {
          const results = await searchItems(query.trim());
          setSuggestions(results);
          setError(null);
        } catch (searchError) {
          setError(searchError instanceof Error ? searchError.message : 'Unable to complete search.');
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      })();
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (blurRef.current) {
        clearTimeout(blurRef.current);
      }
    },
    []
  );

  const handleFocus = () => {
    if (blurRef.current) {
      clearTimeout(blurRef.current);
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const showDropdown = useMemo(() => isFocused && (query.trim().length > 0 || loading), [isFocused, query, loading]);
  const noResults = useMemo(() => !loading && query.trim().length > 0 && suggestions.length === 0, [loading, query, suggestions]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    showDropdown,
    noResults,
    onFocus: handleFocus,
    onBlur: handleBlur,
    clearSearch: () => setQuery(''),
  };
}
