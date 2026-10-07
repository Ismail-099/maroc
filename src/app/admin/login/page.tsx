import { Lock } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { login } from "./actions";

export const metadata = { title: "Admin - Connexion" };

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const password = process.env.ADMIN_PASSWORD;
  if (password) {
    const token = cookies().get("admin_session")?.value;
    const expected = crypto.createHash("sha256").update(password).digest("hex");
    if (token === expected) redirect("/admin");
  }

  return (
    <div className="max-w-sm mx-auto py-24 px-4">
      <div className="border border-stone-200 bg-white p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-serif font-bold text-stone-900">Administration</h1>
        </div>
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              placeholder="Mot de passe admin"
            />
          </div>
          {searchParams.error === "1" && (
            <p className="text-sm text-red-600">Mot de passe incorrect.</p>
          )}
          {searchParams.error === "config" && (
            <p className="text-sm text-red-600">ADMIN_PASSWORD n&apos;est pas configure dans .env.</p>
          )}
          <button
            type="submit"
            className="w-full bg-stone-900 text-white py-2.5 text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
