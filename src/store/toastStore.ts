import { create } from 'zustand';

interface ToastState {
  message: string;
  show: boolean;
  notify: (message: string, timeout?: number) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  show: false,
  notify: (message, timeout = 1500) => {
    set({ message: message, show: true });
    setTimeout(() => set({ show: false }), timeout);
  },
  clear: () => {
    set({ message: '', show: false });
  },
}));
