/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  khizanat as initialKhizanat,
  MANUSCRIPTS as initialManuscripts,
  users as initialUsers,
  MANUSCRIPTS,
  type Khizana,
} from "@/constants/index";
import type { ManuscriptType } from "@/types/common";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  khizana: string;
  isActive: boolean;
};

type Manuscript = any;

type StoreType = {
  users: User[];
  manuscripts: Manuscript[];
  khizanat: Khizana[];

  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
  toggleUserActive: (id: number) => void;

  addManuscript: (m: Manuscript) => void;
  updateManuscript: (m: Manuscript) => void;

  updateManuscriptStep: (id: string, step: number) => void;

  deleteManuscript: (id: string) => void;

  deleteManuscriptPage: (manuscriptId: string, pageId: number) => void;

  addManuscriptPages: (
    manuscriptId: string,
    pages: {
      id: number;
      size: string;
      status: string;
      url: string;
    }[],
  ) => void;

  reorderManuscriptPages: (
    manuscriptId: string,
    pages: {
      id: number;
      size: string;
      status: string;
      url: string;
    }[],
  ) => void;
};

export const useStorage = create<StoreType>()(
  persist(
    (set) => ({
      users: initialUsers,
      manuscripts: initialManuscripts,
      khizanat: initialKhizanat,

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u,
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      toggleUserActive: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, isActive: !u.isActive } : u,
          ),
        })),

      addManuscript: (m) =>
        set((state) => ({
          manuscripts: [...state.manuscripts, m],
        })),

      addManuscriptPages: (manuscriptId, newPages) =>
        set((state) => ({
          manuscripts: state.manuscripts.map((m) =>
            m.id === manuscriptId
              ? {
                  ...m,

                  pages: [...(m.pages || []), ...newPages],
                }
              : m,
          ),
        })),

      updateManuscript: (updated) =>
        set((state) => ({
          manuscripts: state.manuscripts.map((m) =>
            m.id === updated.id ? updated : m,
          ),
        })),

      updateManuscriptStep: (id, step) =>
        set((state) => ({
          manuscripts: state.manuscripts.map((m) =>
            m.id === id ? { ...m, currentStep: step } : m,
          ),
        })),

      deleteManuscript: (id) =>
        set((state) => ({
          manuscripts: state.manuscripts.filter((m) => m.id !== id),
        })),

      deleteManuscriptPage: (manuscriptId, pageId) =>
        set((state) => ({
          manuscripts: state.manuscripts.map((m) =>
            m.id === manuscriptId
              ? {
                  ...m,
                  pages: m.pages?.filter((p: any) => p?.id !== pageId),
                }
              : m,
          ),
        })),

      reorderManuscriptPages: (manuscriptId, newPages) =>
        set((state) => ({
          manuscripts: state.manuscripts.map((m) =>
            m.id === manuscriptId
              ? {
                  ...m,
                  pages: newPages,
                }
              : m,
          ),
        })),

      addKhizana: (khizana: any, managerId?: number) =>
        set((state) => {
          const updatedUsers = managerId
            ? state.users.map((u) =>
                u.id === managerId ? { ...u, khizana: khizana.value } : u,
              )
            : state.users;

          return {
            khizanat: [...state.khizanat, khizana],
            users: updatedUsers,
          };
        }),

      updateKhizana: (updated: any) =>
        set((state) => ({
          khizanat: state.khizanat.map((k) =>
            k.value === updated.value ? updated : k,
          ),
        })),

      deleteKhizana: (value: any) =>
        set((state) => ({
          khizanat: state.khizanat.filter((k) => k.value !== value),
        })),
    }),

    {
      name: "khizana-storage",
    },
  ),
);

export function getStorageData(): {
  manuscripts: ManuscriptType[];
  khizanat: Khizana[];
} {
  const data = localStorage.getItem("khizana-storage");
  if (data) {
    const parsed = JSON.parse(data).state;
    return {
      manuscripts: parsed.manuscripts || MANUSCRIPTS,
      khizanat: parsed.khizanat || initialKhizanat,
    };
  }
  return {
    manuscripts: MANUSCRIPTS,
    khizanat: initialKhizanat,
  };
}
export function getManuscripts(): { manuscripts: ManuscriptType[] } {
  const data = localStorage.getItem("khizana-storage");
  return data ? JSON.parse(data).state : { manuscripts: MANUSCRIPTS };
}
