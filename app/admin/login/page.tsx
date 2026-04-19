export const dynamic = "force-dynamic";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Admin login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the admin password to view registrations.
      </p>
      <form method="POST" action="/api/admin/login" className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="field"
          />
        </div>
        {error ? (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            Incorrect password.
          </p>
        ) : null}
        <button className="btn-primary w-full py-2.5">Sign in</button>
      </form>
    </main>
  );
}
