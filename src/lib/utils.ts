import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidID(id: string) {
  // check if id is alphanumeric + hiphen
  return /^[a-z0-9-]+$/i.test(id)
}
