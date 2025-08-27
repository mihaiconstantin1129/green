"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import SeoHead from './SeoHead';
import { normalizeSeo } from '@/lib/seo';

type SeoData = ReturnType<typeof normalizeSeo>;

type SeoContextType = {
  data: SeoData;
  setData: (data: SeoData) => void;
};

const SeoContext = createContext<SeoContextType | undefined>(undefined);

export function SeoProvider({ children, defaultData }: { children: ReactNode; defaultData: SeoData }) {
  const [data, setData] = useState<SeoData>(defaultData);
  return (
    <SeoContext.Provider value={{ data, setData }}>
      <SeoHead data={data} />
      {children}
    </SeoContext.Provider>
  );
}

export function useSeo() {
  const ctx = useContext(SeoContext);
  if (!ctx) throw new Error('useSeo must be used within SeoProvider');
  return ctx;
}
