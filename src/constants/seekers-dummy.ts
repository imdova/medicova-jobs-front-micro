import { subDays, subMonths, subYears } from "@/util/date";

export interface User {
  id: number;
  type: "seeker" | "employer"; // 👈 Added this line
  country: string;
  category: string;
  age: number;
  registrationDate: string;
  educationLevel?: string;
  gender?: string;
  experience?: number;
  hasResume?: boolean;
  isCompleted?: boolean;
}

// Countries with realistic distribution
export const countries = [
  { name: "Egypt", weight: 25 },
  { name: "Saudi Arabia", weight: 20 },
  { name: "United Arab Emirates", weight: 15 },
  { name: "Kuwait", weight: 8 },
  { name: "Qatar", weight: 8 },
  { name: "Bahrain", weight: 7 },
  { name: "Oman", weight: 6 },
  { name: "Jordan", weight: 5 },
  { name: "Lebanon", weight: 4 },
  { name: "Iraq", weight: 2 },
];

// User categories
export const categoriesData = [
  "Doctors",
  "Dentists",
  "Physiotherapists",
  "Pharmacists",
  "Nurses",
  "Allied Health Professionals",
  "Manufacturing & production",
  "Research & development",
  "Pharmaceutical sales and Marketing",
  "Quality Management",
  "Medicine and Surgery",
  "Dentistry",
  "Pharmacy",
  "Nursing",
  "Physiotherapy",
];

const educationLevels = ["High School", "Diploma", "Bachelor", "Master", "PhD"];
const genders = ["Male", "Female"];

// Generate a weighted random country
const getRandomCountry = () => {
  const totalWeight = countries.reduce(
    (sum, country) => sum + country.weight,
    0,
  );
  let random = Math.random() * totalWeight;

  for (const country of countries) {
    if (random < country.weight) {
      return country.name;
    }
    random -= country.weight;
  }

  return countries[0].name; // Fallback
};

// Generate a random date within a range
const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

// Create a single random user
const createRandomUser = (id: number, startDate: Date, endDate: Date): User => {
  const registrationDate = getRandomDate(startDate, endDate);
  const userType: "seeker" | "employer" =
    Math.random() < 0.8 ? "seeker" : "employer"; // 80% seekers

  return {
    id,
    type: userType, // 👈 Added this line
    registrationDate: registrationDate.toISOString(),
    country: getRandomCountry(),
    category: categoriesData[Math.floor(Math.random() * categoriesData.length)],
    age: Math.floor(Math.random() * 50) + 18, // Ages 18-68
    educationLevel:
      educationLevels[Math.floor(Math.random() * educationLevels.length)],
    gender: genders[Math.floor(Math.random() * genders.length)],
    experience: Math.floor(Math.random() * 15), // 0-15 years experience
    hasResume: Boolean(Math.round(Math.random())),
    isCompleted: Boolean(Math.round(Math.random())),
  };
};

// Generate random user data
export const generateDummyData = (): User[] => {
  const today = new Date();
  const threeYearsAgo = subYears(today, 3);
  const users: User[] = [];

  // Generate base set of users
  const baseUserCount = 5000;
  for (let i = 0; i < baseUserCount; i++) {
    const user = createRandomUser(i + 1, threeYearsAgo, today);

    users.push(user);
  }

  // Add growth trend (more recent users)
  const sixMonthsAgo = subMonths(today, 6);
  const recentUserCount = 3000;
  for (let i = 0; i < recentUserCount; i++) {
    const user = createRandomUser(baseUserCount + i + 1, sixMonthsAgo, today);
    users.push(user);
  }

  // Add a spike in registrations in the last 30 days
  const thirtyDaysAgo = subDays(today, 30);
  const spikeUserCount = 2000;
  for (let i = 0; i < spikeUserCount; i++) {
    const user = createRandomUser(
      baseUserCount + recentUserCount + i + 1,
      thirtyDaysAgo,
      today,
    );
    // Increase weight for certain countries during the spike
    user.country = Math.random() < 0.6 ? "Egypt" : user.country;
    user.category = Math.random() < 0.7 ? "Doctors" : user.category;
    user.age = Math.floor(Math.random() * 30) + 25; // Bias towards 25-55 age range
    users.push(user);
  }

  // Add very recent users (last 7 days)
  const sevenDaysAgo = subDays(today, 7);
  const veryRecentUserCount = 1000;
  for (let i = 0; i < veryRecentUserCount; i++) {
    const user = createRandomUser(
      baseUserCount + recentUserCount + spikeUserCount + i + 1,
      sevenDaysAgo,
      today,
    );
    users.push(user);
  }

  // Add users for today specifically
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayUserCount = 200;
  for (let i = 0; i < todayUserCount; i++) {
    const hour = Math.floor(Math.random() * today.getHours());
    const todayWithHour = new Date(todayStart);
    todayWithHour.setHours(hour);
    const user = createRandomUser(
      baseUserCount +
        recentUserCount +
        spikeUserCount +
        veryRecentUserCount +
        i +
        1,
      todayWithHour,
      todayWithHour,
    );
    users.push(user);
  }

  return users;
};
