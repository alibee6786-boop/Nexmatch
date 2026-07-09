"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

type SignInData = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const { register, handleSubmit } = useForm<SignInData>({ resolver: zodResolver(SignInSchema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SignInData) => {
    const res = await fetch("/api/auth/callback/credentials", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
    if (res.ok) {
      window.location.href = "/";
    } else {
      const json = await res.json();
      setError(json.error || "Sign in failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300" {...register("email")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300" {...register("password")} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Sign in
        </button>
      </form>
    </div>
  );
}
