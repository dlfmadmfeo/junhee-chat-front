import { create } from 'zustand';

interface ToastState {
  message: string;
  show: boolean;
  notify: (message: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  show: false,
  notify: (message) => {
    set({ message: message, show: true });
    setTimeout(() => set({ show: false }), 1500);
  },
  clear: () => {
    set({ message: '', show: false });
  },
}));
