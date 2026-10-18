
export const setStorage =<T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const getStorage = <T>(key: string): T | null => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
}

export const deleteStorage = (key: string): void => {
    localStorage.removeItem(key)
}
