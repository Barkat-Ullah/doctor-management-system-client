import { MedicineCategory, DosageForm } from "@/types/medicine";

export const MEDICINE_CATEGORIES = [
  { value: MedicineCategory.ANTIBIOTIC, label: "Antibiotic" },
  { value: MedicineCategory.PAIN_RELIEF, label: "Pain Relief" },
  { value: MedicineCategory.ANTACID, label: "Antacid" },
  { value: MedicineCategory.VITAMIN, label: "Vitamin" },
  { value: MedicineCategory.SUPPLEMENT, label: "Supplement" },
  { value: MedicineCategory.COLD_FLU, label: "Cold & Flu" },
  { value: MedicineCategory.BLOOD_PRESSURE, label: "Blood Pressure" },
  { value: MedicineCategory.DIABETES, label: "Diabetes" },
  { value: MedicineCategory.HEART_MEDICATION, label: "Heart Medication" },
  { value: MedicineCategory.SKIN_CARE, label: "Skin Care" },
  { value: MedicineCategory.EYE_DROPS, label: "Eye Drops" },
  { value: MedicineCategory.ANTISEPTIC, label: "Antiseptic" },
  { value: MedicineCategory.COUGH_SYRUP, label: "Cough Syrup" },
  { value: MedicineCategory.ALLERGY, label: "Allergy" },
  { value: MedicineCategory.DIGESTIVE, label: "Digestive" },
  { value: MedicineCategory.MENTAL_HEALTH, label: "Mental Health" },
  { value: MedicineCategory.ANESTHETICS, label: "Anesthetics" },
  { value: MedicineCategory.CONTRACEPTIVE, label: "Contraceptive" },
  { value: MedicineCategory.ANTI_INFLAMMATORY, label: "Anti-Inflammatory" },
];

export const DOSAGE_FORMS = [
  { value: DosageForm.TABLET, label: "Tablet" },
  { value: DosageForm.CAPSULE, label: "Capsule" },
  { value: DosageForm.SYRUP, label: "Syrup" },
  { value: DosageForm.INJECTION, label: "Injection" },
  { value: DosageForm.CREAM, label: "Cream" },
  { value: DosageForm.OINTMENT, label: "Ointment" },
  { value: DosageForm.DROPS, label: "Drops" },
  { value: DosageForm.SPRAY, label: "Spray" },
  { value: DosageForm.POWDER, label: "Powder" },
  { value: DosageForm.LIQUID, label: "Liquid" },
  { value: DosageForm.GEL, label: "Gel" },
  { value: DosageForm.PATCH, label: "Patch" },
  { value: DosageForm.INHALER, label: "Inhaler" },
  { value: DosageForm.SUPPOSITORY, label: "Suppository" },
  { value: DosageForm.LOTION, label: "Lotion" },
  { value: DosageForm.SOLUTION, label: "Solution" },
  { value: DosageForm.SUSPENSION, label: "Suspension" },
];

export const formatMedicineCategory = (category: MedicineCategory): string => {
  return (
    MEDICINE_CATEGORIES.find((c) => c.value === category)?.label ||
    category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export const formatDosageForm = (form: DosageForm): string => {
  return (
    DOSAGE_FORMS.find((f) => f.value === form)?.label ||
    form.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
  );
};
