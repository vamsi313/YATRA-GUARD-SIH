import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

type Preference = 'Family' | 'Senior citizens' | 'Children' | 'Photography' | 'Religious' | 'Nature' | 'Food' | 'Budget' | 'Accessibility';

type YatraContextValue = {
  favorites: string[];
  preferences: Preference[];
  toggleFavorite: (id: string) => void;
  togglePreference: (preference: Preference) => void;
  isFavorite: (id: string) => boolean;
};

const YatraContext = createContext<YatraContextValue | null>(null);
const FAVORITES_KEY = 'yatraguard-favorites';
const PREFS_KEY = 'yatraguard-preferences';

export function YatraProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>(['Family', 'Religious']);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(FAVORITES_KEY), AsyncStorage.getItem(PREFS_KEY)]).then(([storedFavorites, storedPrefs]) => {
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites) as string[]);
      if (storedPrefs) setPreferences(JSON.parse(storedPrefs) as Preference[]);
    });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      void AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const togglePreference = (preference: Preference) => {
    setPreferences((current) => {
      const next = current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference];
      void AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({
    favorites,
    preferences,
    toggleFavorite,
    togglePreference,
    isFavorite: (id: string) => favorites.includes(id),
  }), [favorites, preferences]);

  return <YatraContext.Provider value={value}>{children}</YatraContext.Provider>;
}

export function useYatra() {
  const context = useContext(YatraContext);
  if (!context) throw new Error('useYatra must be used within YatraProvider');
  return context;
}