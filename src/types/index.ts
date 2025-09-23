export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt: string;
}

export const SearchCategory = {
  NAME: "name",
  CITY: "city",
  DEGREE: "degree",
  SPECIALITIES: "specialities",
  YEARS_OF_EXPERIENCE: "yearsOfExperience",
  PHONE_NUMBER: "phoneNumber"
} as const;

export type SearchCategoryType =
  (typeof SearchCategory)[keyof typeof SearchCategory];

export const categoryPlaceholders: Record<SearchCategoryType, string> = {
  [SearchCategory.NAME]: "Search by name...",
  [SearchCategory.CITY]: "Search by city...",
  [SearchCategory.DEGREE]: "Search by degree...",
  [SearchCategory.SPECIALITIES]: "Search by specialities...",
  [SearchCategory.YEARS_OF_EXPERIENCE]: "Search by years of experience...",
  [SearchCategory.PHONE_NUMBER]: "Search by phone number..."
};

export type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;
