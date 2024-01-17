import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidID(id: string) {
  // check if id is alphanumeric + hiphen
  return /^[a-z0-9-]+$/i.test(id)
}

export const formatDate = (date: Date) => {
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  return date
    .toLocaleDateString('ja-JP', dateFormatOptions)
    .replaceAll('/', '-')
}

type ConvertSearchParamPageToIntegerReturnProps = {
  isValid: boolean
  fallback?: boolean
  page?: number
}

export const convertSearchParamPageToInteger = (
  page: string | string[] | undefined,
  max: number,
): ConvertSearchParamPageToIntegerReturnProps => {
  if (page === undefined) {
    return { isValid: true, page: 1 }
  }

  if (Array.isArray(page)) {
    const firstElement = page[0]
    return convertSearchParamPageToInteger(firstElement, max)
  }

  const parsedIntoInt = parseInt(page)
  const parsedIntoFloat = parseFloat(page)

  if (parsedIntoInt < 1) {
    return { isValid: false, fallback: true, page: 1 }
  } else if (parsedIntoInt > max) {
    return { isValid: false, fallback: true, page: max }
  }

  if (parsedIntoInt !== parsedIntoFloat) {
    return { isValid: false, fallback: true, page: parsedIntoInt }
  }

  return {
    isValid: true,
    page: parsedIntoInt,
  }
}

export const concatErrorMessages = (parent: string, child?: string): string => {
  if (child === undefined || child === '') {
    return parent
  }

  return `${parent}: ${child}`
}
