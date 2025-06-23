// Medicine entity type
export type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  category: MedicineCategory;
  manufacturer: string;
  dosageForm: DosageForm;
  strength: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Medicine categories enum from Prisma schema
export enum MedicineCategory {
  ANTIBIOTIC = "ANTIBIOTIC",
  PAIN_RELIEF = "PAIN_RELIEF",
  ANTACID = "ANTACID",
  VITAMIN = "VITAMIN",
  SUPPLEMENT = "SUPPLEMENT",
  COLD_FLU = "COLD_FLU",
  BLOOD_PRESSURE = "BLOOD_PRESSURE",
  DIABETES = "DIABETES",
  HEART_MEDICATION = "HEART_MEDICATION",
  SKIN_CARE = "SKIN_CARE",
  EYE_DROPS = "EYE_DROPS",
  ANTISEPTIC = "ANTISEPTIC",
  COUGH_SYRUP = "COUGH_SYRUP",
  ALLERGY = "ALLERGY",
  DIGESTIVE = "DIGESTIVE",
  MENTAL_HEALTH = "MENTAL_HEALTH",
  ANESTHETICS = "ANESTHETICS",
  CONTRACEPTIVE = "CONTRACEPTIVE",
  ANTI_INFLAMMATORY = "ANTI_INFLAMMATORY",
}

// Dosage forms enum from Prisma schema
export enum DosageForm {
  TABLET = "TABLET",
  CAPSULE = "CAPSULE",
  SYRUP = "SYRUP",
  INJECTION = "INJECTION",
  CREAM = "CREAM",
  OINTMENT = "OINTMENT",
  DROPS = "DROPS",
  SPRAY = "SPRAY",
  POWDER = "POWDER",
  LIQUID = "LIQUID",
  GEL = "GEL",
  PATCH = "PATCH",
  INHALER = "INHALER",
  SUPPOSITORY = "SUPPOSITORY",
  LOTION = "LOTION",
  SOLUTION = "SOLUTION",
  SUSPENSION = "SUSPENSION",
}

// Query parameters for filtering medicines
export type MedicineQueryParams = {
  searchTerm?: string;
  category?: MedicineCategory;
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string;
  dosageForm?: DosageForm;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// Request data for creating medicine
export type CreateMedicineData = {
  name: string;
  description: string;
  price: number;
  inStock: number;
  category: MedicineCategory;
  manufacturer: string;
  dosageForm: DosageForm;
  strength?: string;
  isActive?: boolean;
};

// Request data for updating medicine
export type UpdateMedicineData = Partial<CreateMedicineData>;

// Request data for updating stock
export type UpdateStockData = {
  quantity: number;
  operation: "increase" | "decrease";
};

// API Response types
export type MedicineResponse = {
  success: boolean;
  message: string;
  data: Medicine[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SingleMedicineResponse = {
  success: boolean;
  message: string;
  data: Medicine;
};

export type MedicineStatsResponse = {
  success: boolean;
  message: string;
  data: {
    totalMedicines: number;
    lowStockMedicines: number;
    outOfStockMedicines: number;
    totalStockValue: number;
    categoriesCount: Array<{
      category: MedicineCategory;
      _count: {
        category: number;
      };
    }>;
  };
};

// Cart related types
export type CartItem = {
  medicine: Medicine;
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};
