"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ password: z.string().min(8), confirm: z.string().min(8) }).refine((data) => data.password === data.confirm, { message: "Passwords do not match", path: ["confirm"] });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const pid = params.get("pid") || "";
  const token = params.get("token") || "";
  const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/auth/password-reset/reset", { method: "POST", body: JSON.stringify({ pid, token, password: data.password }), headers: { "Content-Type": "application/json" } });
    if (res.ok) {
      alert("Password reset. You can now sign in with your new password.");
      window.location.href = "/sign-in";
    } else {
      const json = await res.json();
      setError(json.error || "Password reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reset password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300" {...register("password")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm new password</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300" {...register("confirm")} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Set new password</button>
      </form>
    </div>
  );
}
