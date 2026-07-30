import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string) => void;
  dismissToast: (id: number) => void;
}

let nextId = 1;
const AUTO_DISMISS_MS = 4000;

/**
 * Transient, self-dismissing notifications (used for optimistic-update
 * rollbacks). Each toast auto-clears after a few seconds; the <Toaster> also
 * renders a dismiss button so they never pile up.
 */
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (message) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => get().dismissToast(id), AUTO_DISMISS_MS);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
