import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToElement(id: string, yOffset: number = 0) {
  const element = document.getElementById(id);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - yOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = obj[key];
    return acc;
  }, {} as Record<string, any>);
};


export const getFileSize = (file: File | number) => {
  let i = 0;
  let size = file instanceof File ? file.size : file;
  while (size > 900) {
    size /= 1024;
    i++;
  }
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const exactSize = (Math.round(size * 100) / 100) + ' ' + units[i];
  return exactSize;
};


export const countWords = (input: string) => {
  if (!input) return 0

  return input
    .split(/\s+/)
    .filter(Boolean)
    .length
}

export const countWordsBelowLimit = (input: string, limit: number) => countWords(input) <= limit
