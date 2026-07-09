"use client";

import React from "react";

export default function SocialButton({ provider, href, children }: { provider: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-full inline-flex items-center justify-center space-x-2 border rounded-md px-4 py-2 hover:bg-gray-50"
      data-provider={provider}
    >
      <span className="text-sm font-medium">{children}</span>
    </a>
  );
}
