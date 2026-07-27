export interface ProfileCompletionInput {
  profileImage: string | null;
  phone: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  highestQualification: string | null;
}

export interface ProfileCompletionItem {
  key: string;
  label: string;
  done: boolean;
  anchor: string;
}

export interface ProfileCompletion {
  percent: number;
  completed: number;
  total: number;
  items: ProfileCompletionItem[];
}

export function getProfileCompletion(student: ProfileCompletionInput): ProfileCompletion {
  const items: ProfileCompletionItem[] = [
    { key: "photo", label: "Add a profile photo", done: Boolean(student.profileImage), anchor: "section-personal" },
    { key: "phone", label: "Add your phone number", done: Boolean(student.phone), anchor: "section-personal" },
    { key: "dob", label: "Add your date of birth", done: Boolean(student.dateOfBirth), anchor: "section-personal" },
    { key: "gender", label: "Select your gender", done: Boolean(student.gender), anchor: "section-personal" },
    {
      key: "address",
      label: "Add your address details",
      done: Boolean(student.country && student.state && student.city && student.pincode),
      anchor: "section-address",
    },
    {
      key: "education",
      label: "Add your highest qualification",
      done: Boolean(student.highestQualification),
      anchor: "section-education",
    },
  ];

  const completed = items.filter((item) => item.done).length;
  const percent = Math.round((completed / items.length) * 100);

  return { percent, completed, total: items.length, items };
}
