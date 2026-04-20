import Link from "next/link";
import RegistrationForm from "./_components/RegistrationForm";
import { WARDS, TSHIRT_SIZES } from "@/lib/wards";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Nyssa Youth Spectacular
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Register your youth
        </h1>
        <p className="mt-2 text-slate-600">
          Fill out this form to sign your child up for NYS. A parent or
          guardian must sign the permission slip at the bottom. You&apos;ll
          get a confirmation page when you&apos;re done.
        </p>
      </header>

      <RegistrationForm wards={[...WARDS]} sizes={[...TSHIRT_SIZES]} />

      <footer className="mt-10 flex justify-center gap-4 text-center text-sm text-slate-500">
        <Link href="/share" className="underline hover:text-slate-700">
          Share / print
        </Link>
        <span>·</span>
        <Link href="/admin" className="underline hover:text-slate-700">
          Admin
        </Link>
      </footer>
    </main>
  );
}
