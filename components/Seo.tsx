"use client";
import { useEffect } from 'react';
import { useSeo } from './SeoProvider';
import { normalizeSeo } from '@/lib/seo';

type SeoData = ReturnType<typeof normalizeSeo>;

export default function Seo({ data }: { data: SeoData }) {
  const { setData } = useSeo();
  useEffect(() => {
    setData(data);
  }, [data, setData]);
  return null;
}
