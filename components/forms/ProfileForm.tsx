"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  User,
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
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import SectionCard from "@/components/ui/SectionCard";
import { updateStudentProfile } from "@/actions/profile";
import { studentProfileSchema } from "@/lib/validations/student-profile";
import { GENDER_OPTIONS, QUALIFICATION_OPTIONS } from "@/lib/validations/student-signup";

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
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
};

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
  return Object.fromEntries(Object.entries(serverErrors).map(([field, msgs]) => [field, msgs[0]]));
}

interface ProfileFormProps {
  initialValues: ProfileFormValues;
}

export default function ProfileForm({ initialValues }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateStudentProfile, undefined);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serverErrors = state?.errors ? flattenServerErrors(state.errors) : null;
  const displayErrors = serverErrors ? { ...errors, ...serverErrors } : errors;

  useEffect(() => {
    if (state?.success) toast.success(state.message ?? "Profile updated successfully.");
    else if (state?.message) toast.error(state.message);
  }, [state]);

  function setField(name: keyof ProfileFormValues, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const result = studentProfileSchema.safeParse(values);
    if (!result.success) {
      setErrors(extractFieldErrors(result.error));
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div id="section-personal" className="scroll-mt-24">
        <SectionCard icon={User} title="Personal Information" description="Keep your basic details up to date">
          <Input
            label="First Name"
            name="firstName"
            icon={User}
            required
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            error={displayErrors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            icon={User}
            required
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            error={displayErrors.lastName}
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
            error={displayErrors.phone}
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
            error={displayErrors.dateOfBirth}
          />
          <Select
            label="Gender"
            name="gender"
            icon={GenderIcon}
            required
            options={GENDER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={values.gender}
            onChange={(e) => setField("gender", e.target.value)}
            error={displayErrors.gender}
          />
        </SectionCard>
      </div>

      <div id="section-address" className="scroll-mt-24">
        <SectionCard icon={Map} title="Address Information" description="Where should we reach you?">
          <Input
            label="Country"
            name="country"
            icon={Globe}
            required
            autoComplete="country-name"
            value={values.country}
            onChange={(e) => setField("country", e.target.value)}
            error={displayErrors.country}
          />
          <Input
            label="State"
            name="state"
            icon={Map}
            required
            autoComplete="address-level1"
            value={values.state}
            onChange={(e) => setField("state", e.target.value)}
            error={displayErrors.state}
          />
          <Input
            label="City"
            name="city"
            icon={Building}
            required
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => setField("city", e.target.value)}
            error={displayErrors.city}
          />
          <Input
            label="Pincode"
            name="pincode"
            icon={Hash}
            required
            autoComplete="postal-code"
            value={values.pincode}
            onChange={(e) => setField("pincode", e.target.value)}
            error={displayErrors.pincode}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Full Address"
              name="address"
              autoComplete="street-address"
              placeholder="House / street / locality"
              value={values.address}
              onChange={(e) => setField("address", e.target.value)}
              error={displayErrors.address}
            />
          </div>
        </SectionCard>
      </div>

      <div id="section-education" className="scroll-mt-24">
        <SectionCard icon={GraduationCap} title="Educational Information" description="Help us tailor your learning path">
          <Select
            label="Highest Qualification"
            name="highestQualification"
            icon={GraduationCap}
            required
            options={QUALIFICATION_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={values.highestQualification}
            onChange={(e) => setField("highestQualification", e.target.value)}
            error={displayErrors.highestQualification}
          />
          <Input
            label="College / University"
            name="collegeOrUniversity"
            icon={School}
            autoComplete="organization"
            value={values.collegeOrUniversity}
            onChange={(e) => setField("collegeOrUniversity", e.target.value)}
            error={displayErrors.collegeOrUniversity}
          />
          <Input
            label="Current Occupation"
            name="currentOccupation"
            icon={Briefcase}
            value={values.currentOccupation}
            onChange={(e) => setField("currentOccupation", e.target.value)}
            error={displayErrors.currentOccupation}
          />
          <Input
            label="Field of Study"
            name="fieldOfStudy"
            icon={BookOpen}
            value={values.fieldOfStudy}
            onChange={(e) => setField("fieldOfStudy", e.target.value)}
            error={displayErrors.fieldOfStudy}
          />
        </SectionCard>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isPending} disabled={isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
