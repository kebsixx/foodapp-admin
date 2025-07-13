"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPasswordContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      // Jika ada email dari query param, gunakan flow reset password
      if (email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        toast.success("Password reset link has been sent to your email");
        return;
      }

      // Jika tidak ada email (langsung dari halaman reset)
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast.success("Password has been reset successfully");
      form.reset();
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
      console.error(error);
    }
  };

  useEffect(() => {
    if (email) {
      toast.error(`Password reset link has been sent to ${email}`);
    }
  }, [email]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">
          {email ? "Request Password Reset" : "Reset Password"}
        </h1>
        <p className="text-gray-500">
          {email
            ? `We'll send a reset link to ${email}`
            : "Enter your new password below"}
        </p>
      </div>

      {email ? (
        <Button
          onClick={() => onSubmit({ password: "", confirmPassword: "" })}
          className="w-full">
          Send Reset Link
        </Button>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={<div className="space-y-6 max-w-md mx-auto">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
