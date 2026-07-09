"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100).optional()
});

type SignUpData = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
  const { register, handleSubmit, formState } = useForm<SignUpData>({ resolver: zodResolver(SignUpSchema) });

  const onSubmit = async (data: SignUpData) => {
    const res = await fetch("/api/auth/signup", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
    if (res.ok) {
      // redirect to sign-in
      window.location.href = "/sign-in";
    } else {
      const json = await res.json();
      alert(json.error || "Sign up failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 block w-full rounded-md border-gray-300" {...register("name")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300" {...register("email")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300" {...register("password")} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Create account
        </button>
      </form>
    </div>
  );
}
