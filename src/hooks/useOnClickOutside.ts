import { useEffect, RefObject } from 'react';

// Tipe untuk argumen hook
type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>, // Ref ke elemen yang ingin kita pantau
  handler: (event: Event) => void // Fungsi yang akan dipanggil saat klik terjadi di luar
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref.current;

      // Lakukan apa-apa jika elemen tidak ada atau jika yang diklik adalah elemen itu sendiri (atau di dalamnya)
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      // Panggil handler jika klik terjadi di luar
      handler(event);
    };

    // Tambahkan event listener ke dokumen
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup: hapus event listener saat komponen di-unmount
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Jalankan ulang efek ini hanya jika ref atau handler berubah
};