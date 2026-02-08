import { create } from 'zustand'

const useMatchStore = create((set) => ({
    results: null,
    setResults: (results) => set({ results }),
    clearResults: () => set({ results: null }),
}))

export default useMatchStore
