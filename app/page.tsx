import Link from "next/link";
import RegistrationForm from "./_components/RegistrationForm";
import { EVENT } from "@/lib/event";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt={EVENT.title}
          className="mx-auto h-56 w-auto"
        />
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-600">
          {EVENT.title}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Register your youth
        </h1>
        <div className="mx-auto mt-4 inline-block rounded-md border border-brand-200 bg-brand-50 px-5 py-3 text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            {EVENT.dateBannerLabel}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {EVENT.dateLine}
          </p>
          <p className="text-sm text-slate-700">{EVENT.timeLine}</p>
        </div>
        <p className="mt-4 text-slate-600">
          Fill out this form to sign your child up for {EVENT.shortName}. A
          parent or guardian must sign the permission slip at the bottom.
          You&apos;ll get a confirmation page when you&apos;re done.
        </p>
      </header>

      <RegistrationForm />

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
