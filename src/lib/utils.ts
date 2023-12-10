import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sha256(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function isValidID(id: string) {
  // check if id is alphanumeric + hiphen
  return /^[a-z0-9-]+$/i.test(id)
}
