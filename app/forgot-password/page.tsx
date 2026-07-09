"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // get recaptcha token (v3 expected)
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    let recaptchaToken = "";
    if (siteKey && typeof window !== "undefined" && (window as any).grecaptcha) {
      try {
        recaptchaToken = await (window as any).grecaptcha.execute(siteKey, { action: "password_reset" });
      } catch (e) {
        console.error("reCAPTCHA execution error", e);
      }
    }

    const res = await fetch("/api/auth/password-reset/request", { method: "POST", body: JSON.stringify({ ...data, recaptchaToken }), headers: { "Content-Type": "application/json" } });
    if (res.ok) {
      alert("If an account with that email exists, a password reset link has been sent.");
    } else if (res.status === 429) {
      alert("Too many requests. Please try again later.");
    } else {
      alert("Failed to request password reset.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Forgot password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300" {...register("email")} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Send reset link</button>
      </form>
    </div>
  );
}
