export interface Registration {
  id: string;
  createdAt: string;
  youthFirstName: string;
  youthLastName: string;
  youthBirthdate: string;
  youthGender: string;
  ward: string;
  tshirtSize: string;
  allergies: string;
  medicalNotes: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  signatureName: string;
  signedAt: string;
  pdfFile: string; // filename stored on disk
}

export type NewRegistration = Omit<Registration, "id" | "createdAt" | "pdfFile" | "signedAt"> & {
  signatureDataUrl: string; // PNG data URL from the signature pad
};
