import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GoodbyePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
          Akun Anda Telah Dihapus
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Kami sedih melihat Anda pergi. Semua data Anda telah dihapus dari
          sistem kami.
        </p>
        <div className="mt-6">
          <Link href="/" legacyBehavior>
            <Button variant="outline">Kembali ke Halaman Utama</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
