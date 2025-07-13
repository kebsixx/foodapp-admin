"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";

interface Feedback {
  id: string;
  created_at: string;
  feedback: string;
  user_id: string | null;
  user_email: string | null;
  status: string;
  name: string | null;
}

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("idle");
    setErrorMessage("");

    if (!feedbackText.trim()) {
      setErrorMessage("Mohon masukkan feedback Anda.");
      setIsSubmitting(false);
      setSubmissionStatus("error");
      return;
    }

    try {
      const newFeedback: Omit<Feedback, "id" | "created_at"> = {
        feedback: feedbackText,
        user_id: null,
        user_email: null,
        status: "pending",
        name: name || "Unknown",
      };

      const { error } = await supabase.from("feedbacks").insert([newFeedback]);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Feedback submitted:", newFeedback);
      setSubmissionStatus("success");
      setFeedbackText("");
      setName("");
    } catch (error: any) {
      setSubmissionStatus("error");
      setErrorMessage(
        error.message || "Terjadi kesalahan saat mengirimkan feedback Anda."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="w-full mx-auto px-4 py-24 sm:px-6 md:max-w-4xl"
      id="feedback">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 dark:text-white">
          Kirimkan Feedback Anda
        </h2>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          Kami sangat menghargai pendapat dan saran Anda untuk meningkatkan
          layanan kami
        </p>
      </div>

      <Card className="shadow-2xl shadow-green-200/50 dark:shadow-emerald-400/30 dark:bg-gray-800/90">
        <CardContent className="p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-base font-medium dark:text-gray-200">
                Nama Anda (Opsional)
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="mt-2 focus-visible:ring-[#7FCD91] dark:bg-gray-700/80 dark:border-gray-600 dark:text-white dark:focus-visible:ring-emerald-600 dark:placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label
                htmlFor="feedback"
                className="text-base font-medium dark:text-gray-200">
                Feedback Anda
              </Label>
              <Textarea
                id="feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Bagikan pengalaman atau saran Anda..."
                className="mt-2 min-h-[120px] sm:min-h-[150px] focus-visible:ring-[#7FCD91] dark:bg-gray-700/80 dark:border-gray-600 dark:text-white dark:focus-visible:ring-emerald-600 dark:placeholder:text-gray-400"
              />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className={cn(
                  "w-full bg-[#7FCD91] hover:bg-[#6ab97c] text-white font-medium py-2 sm:py-3 text-base dark:bg-emerald-600 dark:hover:bg-emerald-600 dark:shadow-lg dark:shadow-emerald-900/30",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
                disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Feedback"}
              </Button>
            </div>
            {submissionStatus === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 sm:p-4 rounded-md text-center dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300">
                Terima kasih atas feedback Anda! Kami sangat menghargainya.
              </div>
            )}
            {submissionStatus === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-md text-center dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default FeedbackForm;
