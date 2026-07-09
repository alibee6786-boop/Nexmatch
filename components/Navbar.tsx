import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="text-xl font-semibold">NexMatch</a>
        </Link>
        <div className="space-x-4">
          <Link href="/discover"><a className="text-sm text-gray-600 hover:text-gray-900">Discover</a></Link>
          <Link href="/messages"><a className="text-sm text-gray-600 hover:text-gray-900">Messages</a></Link>
          <Link href="/profile"><a className="text-sm text-gray-600 hover:text-gray-900">Profile</a></Link>
        </div>
      </div>
    </nav>
  );
}
