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
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Send Us Your Feedback
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium">
              Your Name (Optional)
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="feedback" className="block text-sm font-medium">
              Your Feedback
            </Label>
            <Textarea
              id="feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback here..."
              className="mt-1 min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
            disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
          {submissionStatus === "success" && (
            <p className="text-green-500 text-center">
              Thank you for your feedback!
            </p>
          )}
          {submissionStatus === "error" && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
