"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type SignatureCanvas from "react-signature-canvas";

const SignaturePad = dynamic(() => import("./ClientSignaturePad"), {
  ssr: false,
});

interface Props {
  wards: string[];
  sizes: string[];
}

export default function RegistrationForm({ wards, sizes }: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const pad = sigRef.current;
    if (!pad || pad.isEmpty()) {
      setError("Please sign the permission slip before submitting.");
      return;
    }
    const signatureDataUrl = pad.getCanvas().toDataURL("image/png");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;

    const bool = (name: string) => fd.get(name) === "yes";
    const body = {
      ...raw,
      specialDiet: bool("specialDiet"),
      selfAdminMeds: bool("selfAdminMeds"),
      recentSurgery: bool("recentSurgery"),
      chronicIllness: bool("chronicIllness"),
      signatureDataUrl,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Something went wrong");
      }
      const json = (await res.json()) as { id: string };
      setDone(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h2 className="text-lg font-semibold text-green-800">
          You&apos;re registered!
        </h2>
        <p className="mt-2 text-green-700">
          Thanks — we&apos;ve recorded the permission slip. You can download a
          signed copy below for your records.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            className="btn-primary"
            href={`/api/pdf/${done.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Download signed PDF
          </a>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setDone(null);
              sigRef.current?.clear();
            }}
          >
            Register another youth
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Section title="Youth information">
        <Grid>
          <Field label="First name" name="youthFirstName" required />
          <Field label="Last name" name="youthLastName" required />
          <Field label="Birthdate" name="youthBirthdate" type="date" required />
          <Select label="Gender" name="youthGender" required options={["Male", "Female"]} />
          <Select label="Ward / branch" name="ward" required options={wards} />
          <Select label="T-shirt size" name="tshirtSize" required options={sizes} />
        </Grid>
      </Section>

      <Section title="Address">
        <Field label="Street address" name="address" required />
        <Grid>
          <Field label="City" name="city" required />
          <Field label="State" name="state" required />
        </Grid>
      </Section>

      <Section title="Medical">
        <Field
          label="Allergies"
          name="allergies"
          placeholder="List any food or environmental allergies"
        />
        <Field
          label="List of medications"
          name="medications"
          placeholder="Prescription or over-the-counter medications"
        />

        <CheckboxWithExplanation
          name="specialDiet"
          explanationName="dietExplanation"
          label="Special diet"
          placeholder="Describe the dietary needs"
        />
        <Checkbox
          name="selfAdminMeds"
          label="Youth can self-administer medications"
        />
        <CheckboxWithExplanation
          name="recentSurgery"
          explanationName="surgeryExplanation"
          label="Recent surgery"
          placeholder="When and what kind"
        />
        <CheckboxWithExplanation
          name="chronicIllness"
          explanationName="illnessExplanation"
          label="Chronic illness"
          placeholder="Describe the condition"
        />

        <Field
          label="Special needs"
          name="specialNeeds"
          placeholder="Anything leaders should accommodate"
        />
        <Field
          label="Other limitations"
          name="otherLimitations"
          placeholder="Physical or other limitations"
        />
      </Section>

      <Section title="Parent / guardian">
        <Grid>
          <Field label="Full name" name="parentName" required />
          <Field label="Email" name="parentEmail" type="email" required />
          <Field label="Phone" name="parentPhone" type="tel" required />
        </Grid>
      </Section>

      <Section title="Emergency contact">
        <Grid>
          <Field label="Name" name="emergencyName" required />
          <Field label="Phone" name="emergencyPhone" type="tel" required />
        </Grid>
      </Section>

      <Section title="Permission & signature">
        <p className="text-sm text-slate-600">
          By signing below I give permission for my youth to attend the
          Nyssa Youth Spectacular, and I authorize leaders to seek emergency
          medical care if needed.
        </p>

        <div>
          <label className="label" htmlFor="signatureName">
            Signed by (typed name)
          </label>
          <input id="signatureName" name="signatureName" required className="field" />
        </div>

        <div>
          <label className="label">Signature</label>
          <div className="rounded-md border border-slate-300 bg-white">
            <SignaturePad
              onReady={(r) => {
                sigRef.current = r;
              }}
              canvasProps={{
                className: "w-full h-40 rounded-md",
              }}
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="text-sm text-slate-500 underline"
              onClick={() => sigRef.current?.clear()}
            >
              Clear signature
            </button>
          </div>
        </div>
      </Section>

      {error ? (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
        {submitting ? "Submitting…" : "Sign & register"}
      </button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <select id={name} name={name} required={required} className="field" defaultValue="">
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        value="yes"
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

function CheckboxWithExplanation({
  name,
  explanationName,
  label,
  placeholder,
}: {
  name: string;
  explanationName: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Checkbox name={name} label={label} />
      <input
        name={explanationName}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}
