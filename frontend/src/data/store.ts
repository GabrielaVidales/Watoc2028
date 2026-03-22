import type { CongressRegistrationValues } from "@/schemas/registration-confirmation-schema";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import localforage from "localforage";


type RegistrationConfirmationState = Partial<CongressRegistrationValues> & {
    setData: (data: Partial<CongressRegistrationValues>) => void
    clearData: () => void

    setStudentProof: (file: File) => Promise<void>
    getStudentProof: () => Promise<File | null>
}

export const useRegistrationStore = create<RegistrationConfirmationState>()(
    persist(
        (set) => ({
            setData: (data) => set((state) => ({ ...state, ...data })),
            
            clearData: () => set({}),

            setStudentProof: async (file) => {
                await localforage.setItem('studentProofKey', file)
            },
            getStudentProof: async () => {
                const file = await localforage.getItem<File>('studentProofKey')
                return file
            },
        }),
        {
            name: 'registration-confirmation',
            storage: createJSONStorage(() => localforage),
        }
    )
)   