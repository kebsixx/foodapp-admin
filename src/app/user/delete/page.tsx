"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUserAccount } from "@/actions/delete-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi form
    if (!email || !password) {
      setError("Harap isi email dan password");
      return;
    }

    if (!isConfirmed) {
      setError("Harap konfirmasi penghapusan akun");
      return;
    }

    // Tampilkan dialog konfirmasi
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const result = await deleteUserAccount(email, password);

      if (result.success) {
        toast.success("Akun berhasil dihapus");
        router.push("/goodbye");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Hapus Akun Anda</h1>
          <p className="text-muted-foreground mt-2">
            Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus
            permanen.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="confirm"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none">
              Saya mengerti bahwa semua data akan dihapus permanen dan tidak
              dapat dikembalikan
            </label>
          </div>

          <Button
            type="submit"
            variant="destructive"
            disabled={!isConfirmed || isLoading}
            className="w-full">
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Hapus Akun Saya"
            )}
          </Button>
        </form>
      </div>

      <ConfirmDeleteDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
