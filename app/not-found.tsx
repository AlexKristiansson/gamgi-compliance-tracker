"use client";
import Link from "next/link";
import { Construction } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <Construction className="w-10 h-10 text-gray-300 mb-4" />
      <h2 className="text-lg font-semibold text-gray-700 mb-1">Under uppbyggnad</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-xs">
        Den här sidan är inte implementerad än. Fler moduler kommer snart.
      </p>
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Tillbaka till Dashboard
      </Link>
    </div>
  );
}
