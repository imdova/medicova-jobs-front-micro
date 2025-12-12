type TopCountry = {
  id: string;
  code?: string;
  name: string;
  job: number;
  users?: number;
  employers: number;
  revenue: number;
};

export const topCountriesData: TopCountry[] = [
  {
    id: "1",
    code: "EG",
    name: "Egypt",
    job: 18,
    employers: 35,
    users: 400,
    revenue: 75000,
  },
  {
    id: "2",
    code: "US",
    name: "United States",
    job: 120,
    employers: 250,
    users: 600,
    revenue: 1200000,
  },
  {
    id: "3",
    code: "IN",
    name: "India",
    job: 95,
    users: 600,
    employers: 180,
    revenue: 850000,
  },
  {
    id: "4",
    code: "DE",
    name: "Germany",
    job: 45,
    users: 600,
    employers: 90,
    revenue: 500000,
  },
  {
    id: "5",
    code: "JP",
    name: "Japan",
    job: 60,
    users: 600,
    employers: 110,
    revenue: 700000,
  },
  {
    id: "6",
    code: "AU",
    name: "Australia",
    job: 30,
    users: 600,
    employers: 65,
    revenue: 400000,
  },
];

export const topTypesData: TopCountry[] = [
  {
    id: "1",
    name: "Hospital",
    job: 120,
    employers: 250,
    revenue: 1200000,
  },
  {
    id: "2",
    name: "Medical Center",
    job: 95,
    employers: 180,
    revenue: 850000,
  },
  {
    id: "3",
    name: "Clinics and medical offices",
    job: 60,
    employers: 110,
    revenue: 700000,
  },
  {
    id: "4",
    name: "Rehabilitation Center",
    job: 45,
    employers: 90,
    revenue: 500000,
  },
  {
    id: "5",
    name: "Home Care",
    job: 30,
    employers: 65,
    revenue: 400000,
  },
  {
    id: "6",
    name: "Imaging and radiology center",
    job: 18,
    employers: 35,
    revenue: 75000,
  },
];