export interface Registration {
  id: string;
  createdAt: string;

  // Youth
  youthFirstName: string;
  youthLastName: string;
  youthBirthdate: string;
  youthGender: string;
  ward: string;
  tshirtSize: string;

  // Address
  address: string;
  city: string;
  state: string;

  // Medical
  hasAllergies: boolean;
  allergies: string;
  medications: string;
  specialDiet: boolean;
  dietExplanation: string;
  selfAdminMeds: boolean;
  recentSurgery: boolean;
  surgeryExplanation: string;
  chronicIllness: boolean;
  illnessExplanation: string;
  otherLimitations: string;

  // Contacts
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;

  // Signature
  signatureName: string;
  signedAt: string;
  pdfFile: string;
}

export type NewRegistration = Omit<
  Registration,
  "id" | "createdAt" | "pdfFile" | "signedAt"
> & {
  signatureDataUrl: string;
};
