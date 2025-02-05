export const BASE_PATH = import.meta.env.VITE_BASE_PATH || ''

export const resolve = (url: string) => `${BASE_PATH}${url}`
