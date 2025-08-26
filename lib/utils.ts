import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export const siteUrl = process.env.SITE_URL || 'https://green-news.ro'
