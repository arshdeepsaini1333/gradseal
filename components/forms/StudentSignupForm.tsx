"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users as GenderIcon,
  Globe,
  Map,
  Building,
  Hash,
  GraduationCap,
  School,
  Briefcase,
  BookOpen,
  Upload,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import SectionCard from "@/components/ui/SectionCard";
import ProgressSteps from "@/components/auth/ProgressSteps";
import PasswordField from "@/components/auth/PasswordField";
import { registerStudent } from "@/actions/auth";
import {
  personalInfoSchema,
  addressSchema,
  educationSchema,
  accountSchema,
  GENDER_OPTIONS,
  QUALIFICATION_OPTIONS,
} from "@/lib/validations/student-signup";

const STEPS = ["Personal", "Address", "Education", "Account"];

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  address: string;
  highestQualification: string;
  collegeOrUniversity: string;
  currentOccupation: string;
  fieldOfStudy: string;
  password: string;
  confirmPassword: string;
};

const INITIAL_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  address: "",
  highestQualification: "",
  collegeOrUniversity: "",
  currentOccupation: "",
  fieldOfStudy: "",
  password: "",
  confirmPassword: "",
};

const STEP_SCHEMAS = [personalInfoSchema, addressSchema, educationSchema, accountSchema];

const STEP_FIELDS: string[][] = [
  ["firstName", "lastName", "email", "phone", "dateOfBirth", "gender"],
  ["country", "state", "city", "pincode", "address"],
  ["highestQualification", "collegeOrUniversity", "currentOccupation", "fieldOfStudy"],
  ["password", "confirmPassword"],
];

function extractFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): Record<string, string> {
  const { fieldErrors } = error.flatten();
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, msgs]) => msgs && msgs.length > 0)
      .map(([field, msgs]) => [field, msgs![0]])
  );
}

function flattenServerErrors(serverErrors: Record<string, string[]>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(serverErrors).map(([field, msgs]) => [field, msgs[0]])
  );
}

export default function StudentSignupForm() {
  const [state, formAction, isPending] = useActionState(registerStudent, undefined);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImageName, setProfileImageName] = useState<string | null>(null);

  const serverErrors = state?.errors ? flattenServerErrors(state.errors) : null;
  const displayErrors = serverErrors ? { ...errors, ...serverErrors } : errors;

  // useActionState's `state` only changes after a real form submission
  // completes on the server, so reacting to it here is subscribing to that
  // external event (not deriving render-time state) — jump to whichever step
  // the server found a problem in, and surface non-field errors as a toast.
  useEffect(() => {
    if (!state?.errors) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a completed server action, not a render-time derivation
    setStep((current) => {
      const index = STEP_FIELDS.findIndex((fields) =>
        fields.some((field) => state.errors![field])
      );
      return index === -1 ? current : index + 1;
    });
  }, [state?.errors]);

  useEffect(() => {
    if (state?.message) toast.error(state.message);
  }, [state?.message]);

  function setField(name: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validateCurrentStep(): boolean {
    const schema = STEP_SCHEMAS[step - 1];
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors((prev) => {
        const next = { ...prev };
        for (const field of STEP_FIELDS[step - 1]) delete next[field];
        return next;
      });
      return true;
    }
    const fieldErrors = extractFieldErrors(result.error);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
    return false;
  }

  function handleNext() {
    if (validateCurrentStep()) setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!validateCurrentStep()) {
      e.preventDefault();
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <ProgressSteps steps={STEPS} currentStep={step} />
      </div>

      <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Step 1: Personal Information */}
        <div className={step === 1 ? "" : "hidden"}>
          <SectionCard
            icon={User}
            title="Personal Information"
            description="Tell us a bit about yourself"
          >
            <Input
              label="First Name"
              name="firstName"
              icon={User}
              required
              autoComplete="given-name"
              value={values.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              name="lastName"
              icon={User}
              required
              autoComplete="family-name"
              value={values.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              error={errors.lastName}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              required
              autoComplete="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              error={errors.email}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              icon={Phone}
              required
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              error={errors.phone}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              icon={Calendar}
              required
              autoComplete="bday"
              max={new Date().toISOString().split("T")[0]}
              value={values.dateOfBirth}
              onChange={(e) => setField("dateOfBirth", e.target.value)}
              error={errors.dateOfBirth}
            />
            <Select
              label="Gender"
              name="gender"
              icon={GenderIcon}
              required
              options={GENDER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              value={values.gender}
              onChange={(e) => setField("gender", e.target.value)}
              error={errors.gender}
            />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                Profile Picture <span className="text-[#94A3B8]">(optional)</span>
              </label>
              <label
                htmlFor="profileImage"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-[#64748B] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                <Upload className="h-4.5 w-4.5" aria-hidden="true" />
                {profileImageName || "Upload a JPEG, PNG, or WEBP (max 2MB)"}
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => setProfileImageName(e.target.files?.[0]?.name ?? null)}
              />
            </div>
          </SectionCard>
        </div>

        {/* Step 2: Address Information */}
        <div className={step === 2 ? "" : "hidden"}>
          <SectionCard
            icon={Map}
            title="Address Information"
            description="Where should we reach you?"
          >
            <Input
              label="Country"
              name="country"
              icon={Globe}
              required
              autoComplete="country-name"
              value={values.country}
              onChange={(e) => setField("country", e.target.value)}
              error={errors.country}
            />
            <Input
              label="State"
              name="state"
              icon={Map}
              required
              autoComplete="address-level1"
              value={values.state}
              onChange={(e) => setField("state", e.target.value)}
              error={errors.state}
            />
            <Input
              label="City"
              name="city"
              icon={Building}
              required
              autoComplete="address-level2"
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
              error={errors.city}
            />
            <Input
              label="Pincode"
              name="pincode"
              icon={Hash}
              required
              autoComplete="postal-code"
              value={values.pincode}
              onChange={(e) => setField("pincode", e.target.value)}
              error={errors.pincode}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Full Address"
                name="address"
                autoComplete="street-address"
                placeholder="House / street / locality"
                value={values.address}
                onChange={(e) => setField("address", e.target.value)}
                error={errors.address}
              />
            </div>
          </SectionCard>
        </div>

        {/* Step 3: Educational Information */}
        <div className={step === 3 ? "" : "hidden"}>
          <SectionCard
            icon={GraduationCap}
            title="Educational Information"
            description="Help us tailor your learning path"
          >
            <Select
              label="Highest Qualification"
              name="highestQualification"
              icon={GraduationCap}
              required
              options={QUALIFICATION_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              value={values.highestQualification}
              onChange={(e) => setField("highestQualification", e.target.value)}
              error={errors.highestQualification}
            />
            <Input
              label="College / University"
              name="collegeOrUniversity"
              icon={School}
              autoComplete="organization"
              value={values.collegeOrUniversity}
              onChange={(e) => setField("collegeOrUniversity", e.target.value)}
              error={errors.collegeOrUniversity}
            />
            <Input
              label="Current Occupation"
              name="currentOccupation"
              icon={Briefcase}
              value={values.currentOccupation}
              onChange={(e) => setField("currentOccupation", e.target.value)}
              error={errors.currentOccupation}
            />
            <Input
              label="Field of Study"
              name="fieldOfStudy"
              icon={BookOpen}
              value={values.fieldOfStudy}
              onChange={(e) => setField("fieldOfStudy", e.target.value)}
              error={errors.fieldOfStudy}
            />
          </SectionCard>
        </div>

        {/* Step 4: Account Information */}
        <div className={step === 4 ? "" : "hidden"}>
          <SectionCard
            icon={ShieldCheck}
            title="Account Information"
            description="Secure your account with a strong password"
          >
            <PasswordField
              label="Password"
              name="password"
              required
              showStrength
              value={values.password}
              onChange={(v) => setField("password", v)}
              error={errors.password}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              required
              value={values.confirmPassword}
              onChange={(v) => setField("confirmPassword", v)}
              error={errors.confirmPassword}
            />
          </SectionCard>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < STEPS.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" loading={isPending} disabled={isPending}>
              Create Account
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
