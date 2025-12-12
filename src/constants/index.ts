import {
  CompanyItem,
  Doctor,
  Folder,
  Job,
  NotificationItem,
  Option,
  Specialty,
} from "@/types";
import {
  Book,
  Build,
  CheckCircleOutline,
  Edit,
  Search,
} from "@mui/icons-material";
import { CompanySize } from "./enums/company-size.enum";
import { Nationalities } from "./enums/nationalities.enum";
import { Gender } from "./enums/gender.enum";
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const DEFAULT_COVER_IMAGE =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export const passwordRules = {
  required: "Password is required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters",
  },
  pattern: {
    value:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    message:
      "Password must include at least one lowercase letter, one uppercase letter, one number, and one symbol",
  },
};

export const filterSections: FilterType[] = [
  {
    name: "Residency (Location)",
    sectionKey: "loc",
    items: [
      { label: "Egypt", count: 3, value: "egypt" },
      { label: "Qatar", count: 2, value: "Qatar" },
    ],
  },
  {
    name: "Education Level",
    sectionKey: "edu",
    items: [
      { label: "Technical Institute", count: 50, value: "institute" },
      { label: "Bachelor's Degree", count: 100, value: "bachelor" },
      { label: "Doctorate Degree", count: 70, value: "doctorate" },
      { label: "Fellowship", count: 30, value: "fellowship" },
    ],
  },
  {
    name: "Years Of Experience",
    sectionKey: "exp",
    items: [
      { label: "1-3", count: 50, value: "1-3" },
      { label: "3-5", count: 40, value: "3-5" },
      { label: "5-10", count: 30, value: "5-10" },
      { label: "+10", count: 30, value: "10+" },
    ],
  },
];
export const searchFilters: FilterType[] = [
  {
    name: "Residency (Location)",
    sectionKey: "loc",
    items: [
      { label: "Egypt", count: 3, value: "egypt" },
      { label: "Qatar", count: 2, value: "Qatar" },
    ],
  },
  {
    name: "City",
    sectionKey: "city",
    items: [
      { label: "Cairo", count: 3, value: "cairo" },
      { label: "Riyadh", count: 2, value: "riyadh" },
    ],
  },
  {
    name: "Nationality",
    sectionKey: "nat",
    items: [
      { label: "Egyptian", count: 3, value: "egyptian" },
      { label: "Saudi Arabian", count: 2, value: "saudi arabian" },
    ],
  },
  {
    name: "Industry",
    sectionKey: "ind",
    items: [
      { label: "Physicians", count: 10, value: "Physicians" },
      { label: "Dentists", count: 100, value: "Dentists" },
      { label: "Physiotherapists", count: 50, value: "Physiotherapists" },
      { label: "Pharmacists", count: 30, value: "Pharmacists" },
      { label: "Nurses", count: 10, value: "Nurses" },
    ],
  },
  {
    name: "Category",
    sectionKey: "cat",
    items: [
      { label: "Doctor", count: 100, value: "doctor" },
      { label: "Nurse", count: 50, value: "nurse" },
      { label: "Pharmaceutical", count: 30, value: "pharmaceutical" },
      { label: "Physical Therapy", count: 10, value: "physical therapy" },
      { label: "Specialized", count: 10, value: "specialized" },
    ],
  },
  {
    name: "Education Level",
    sectionKey: "edu",
    items: [
      { label: "Institute", count: 50, value: "institute" },
      { label: "Bachelor's Degree", count: 100, value: "bachelor" },
      { label: "Master's Degree", count: 100, value: "master" },
      { label: "Doctorate Degree", count: 70, value: "doctorate" },
      { label: "Fellowship", count: 30, value: "fellowship" },
    ],
  },
  {
    name: "Years Of Experience",
    sectionKey: "exp",
    items: [
      { label: "1-3", count: 50, value: "1-3" },
      { label: "3-5", count: 40, value: "3-5" },
      { label: "5-10", count: 30, value: "5-10" },
      { label: "+10", count: 30, value: "10+" },
    ],
  },
  {
    name: "Gender",
    sectionKey: "gen",
    items: [
      { label: "Male", count: 200, value: "male" },
      { label: "Female", count: 100, value: "female" },
    ],
  },
  {
    name: "Age",
    sectionKey: "age",
    items: [
      { label: "18-25", count: 40, value: "18-25" },
      { label: "26-35", count: 50, value: "26-35" },
      { label: "36-45", count: 30, value: "36-45" },
      { label: "46-60", count: 20, value: "46-60" },
      { label: "60+", count: 10, value: "60+" },
    ],
  },
];

export const searchJopFilters: FilterType[] = [
  {
    name: "Job Level",
    multiple: true,
    sectionKey: "clv",
    items: [
      { label: "General", count: 57, value: "general" },
      { label: "Specialist", count: 3, value: "specialist" },
      { label: "Consultant", count: 5, value: "consultant" },
      { label: "Director", count: 12, value: "director" },
      { label: "CEO", count: 8, value: "ceo" },
    ],
  },
  {
    name: "Work Type",
    multiple: true,
    sectionKey: "emp",
    items: [
      { label: "Full-time", count: 3, value: "full_time" },
      { label: "Part-Time", count: 5, value: "part_time" },
    ],
  },
  {
    name: "Work Place",
    multiple: true,
    sectionKey: "wrk",
    items: [
      { label: "Remote", count: 2, value: "remote" },
      { label: "On site", count: 24, value: "on_site" },
      { label: "Hybrid", count: 3, value: "hybrid" },
    ],
  },
  {
    name: "Salary Range",
    sectionKey: "sal",
    items: [
      { label: "$700 - $1000", count: 4, value: "700_1000" },
      { label: "$100 - $1500", count: 6, value: "100_1500" },
      { label: "$1500 - $2000", count: 10, value: "1500_2000" },
      { label: "$3000 or above", count: 4, value: "3000_above" },
    ],
  },
  {
    name: "Gender",
    multiple: true,
    sectionKey: "gen",
    items: [
      { label: "Male", count: 100, value: "male" },
      { label: "Female", count: 80, value: "female" },
    ],
  },

  {
    name: "Age Range",
    sectionKey: "age",
    items: [
      { label: "18-25", count: 10, value: "18_25" },
      { label: "26-35", count: 20, value: "26_35" },
      { label: "36-45", count: 15, value: "36_45" },
      { label: "46-60", count: 8, value: "46_60" },
    ],
  },
  {
    name: "Education Level",
    multiple: true,
    sectionKey: "edu",
    items: [
      { label: "Bachelor's Degree", count: 30, value: "bachelor" },
      { label: "Master's Degree", count: 20, value: "master" },
      { label: "Doctorate Degree", count: 10, value: "doctorate" },
      { label: "Diploma", count: 5, value: "diploma" },
    ],
  },
];
export const employerFilters: FilterType[] = [
  {
    name: "Country",
    sectionKey: "country",
    items: [{ label: "Egypt", count: 4, value: "EG" }],
  },
  {
    name: "Sector",
    sectionKey: "sector",
    items: [{ label: "Hospital", count: 3, value: "hospital" }],
  },
  {
    name: "Status",
    sectionKey: "status",
    items: [
      { label: "Active", count: 1, value: "active" },
      { label: "Inactive", count: 4, value: "inactive" },
    ],
  },
  {
    name: "Plan",
    sectionKey: "plan",
    items: [{ label: "Premium", count: 4, value: "premium" }],
  },
  {
    name: "Jobs",
    sectionKey: "jobs",
    items: [{ label: "25 Jobs", count: 4, value: "25" }],
  },
];

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Cardiologist Consultant",
    location: "Cairo, Egypt",
    education: "Master’s Degree in Medicine",
    specialty: "Cardiology & Vascular Health",
    features: ["Full time | Onsite", "EX (5+ years)", "Age (35-45)"],
    timeStamps: new Date("2024-12-26T00:00:00Z"),
    description:
      "Seeking a senior cardiologist consultant to provide expert care in diagnosing and treating cardiovascular diseases, focusing on heart and vascular health.",
    requirements: [
      "At least 5 years of experience in cardiology",
      "Master’s degree in Medicine or equivalent",
      "Proven expertise in cardiovascular health management",
      "Ability to work in a high-pressure environment",
      "Strong communication and interpersonal skills",
    ],
    additionalDetails:
      "This role offers an excellent salary package and benefits, including health insurance and flexible work hours.",
    skills: [
      "Cardiology",
      "Cardiovascular Diseases",
      "Patient Care",
      "Diagnostic Imaging",
      "Emergency Care",
      "Heart Surgery",
    ],
    relatedSearch: [
      "Cardiologist Jobs",
      "Heart Specialist Jobs",
      "Vascular Health Careers",
      "Medical Consultant Jobs",
      "Senior Cardiologist Positions",
    ],
    company: {
      name: "HealthCare Excellence",
      industry: "Healthcare",
      website: "www.healthcareexcellence.com",
      contact: "contact@healthcareexcellence.com",
    },
  },
  {
    id: "2",
    title: "Consultant Cardiologist (Specialist)",
    location: "Alexandria, Egypt",
    education: "MD in Cardiology",
    specialty: "Cardiovascular Diseases",
    features: [
      "Full time | Onsite",
      "EX (3-7 years)",
      "Age (30-40)",
      "Flexible Start Date",
    ],
    timeStamps: new Date("2024-12-20T00:00:00Z"),
    description:
      "We are looking for a specialist cardiologist to join our team, providing comprehensive care for patients with heart conditions, including diagnosis and treatment planning.",
    requirements: [
      "At least 3 years of experience in cardiology",
      "MD in Cardiology or related field",
      "Strong background in diagnosing cardiovascular diseases",
      "Ability to work effectively in a team-oriented environment",
      "Proficiency in medical technologies and diagnostic tools",
    ],
    additionalDetails:
      "The role includes working in a state-of-the-art facility with a supportive team, offering opportunities for professional development.",
    skills: [
      "Cardiology",
      "Heart Disease Treatment",
      "Patient Diagnosis",
      "Vascular Disease Management",
      "Medical Consultation",
    ],
    relatedSearch: [
      "Cardiologist Jobs in Alexandria",
      "Medical Consultant Positions",
      "Vascular Specialist Careers",
      "Full-time Cardiologist Jobs",
    ],
    company: {
      name: "MedCare Health Systems",
      industry: "Healthcare",
      website: "www.medcarehealth.com",
      contact: "hr@medcarehealth.com",
    },
  },
  {
    id: "3",
    title: "Cardiologist Consultant (Experienced)",
    location: "Cairo, Egypt",
    education: "Master’s Degree in Cardiology",
    specialty: "Cardio-vascular Health",
    features: [
      "Full time | Onsite",
      "EX (3-5 years)",
      "Age (35-40)",
      "Monday to Friday",
    ],
    timeStamps: new Date("2024-12-16T00:00:00Z"),
    description:
      "Join our team as a cardiology consultant where you will be responsible for managing and treating patients with heart and vascular issues, providing expert guidance and care.",
    requirements: [
      "Experience in cardiology for at least 3-5 years",
      "Master’s degree in Cardiology",
      "Strong skills in patient care and diagnosis",
      "Ability to lead and collaborate with a medical team",
      "Excellent communication skills",
    ],
    additionalDetails:
      "We offer competitive salary packages, professional growth, and a dynamic work environment focused on delivering top-tier patient care.",
    skills: [
      "Cardiovascular Health",
      "Patient Management",
      "Electrocardiography",
      "Heart Disease Treatment",
      "Cardiac Care",
    ],
    relatedSearch: [
      "Consultant Cardiologist Cairo",
      "Heart Disease Specialist Jobs",
      "Cardiology Consultant Roles",
      "Cardiovascular Jobs Cairo",
    ],
    company: {
      name: "CardioCare Specialists",
      industry: "Healthcare",
      website: "www.cardiocarespecialists.com",
      contact: "hr@cardiocarespecialists.com",
    },
  },
  {
    id: "4",
    title: "Lead Cardiologist - Full Time",
    location: "Giza, Egypt",
    education: "PhD in Cardiovascular Medicine",
    specialty: "Heart and Vascular Care",
    features: [
      "Full time | Onsite",
      "EX (4-6 years)",
      "Age (40-45)",
      "Weekend Off",
    ],
    timeStamps: new Date("2024-11-23T00:00:00Z"),
    description:
      "A lead cardiologist is needed to oversee cardiovascular care, provide leadership to the medical team, and ensure excellent patient outcomes in the treatment of heart diseases.",
    requirements: [
      "At least 4-6 years of cardiology experience",
      "PhD in Cardiovascular Medicine",
      "Leadership experience in a medical setting",
      "Expertise in both diagnostic and therapeutic cardiovascular treatments",
      "Ability to work with cross-functional healthcare teams",
    ],
    additionalDetails:
      "This position offers an attractive salary, benefits package, and a work-life balance with weekends off.",
    skills: [
      "Cardiology",
      "Leadership",
      "Cardiac Surgery",
      "Patient Care",
      "Vascular Treatment",
      "Heart Disease Prevention",
    ],
    relatedSearch: [
      "Lead Cardiologist Jobs",
      "Cardiology Leadership Roles",
      "Full-Time Heart Specialist Jobs",
      "Senior Cardiologist Giza",
    ],
    company: {
      name: "VascularCare Hospitals",
      industry: "Healthcare",
      website: "www.vascularcarehospitals.com",
      contact: "info@vascularcarehospitals.com",
    },
  },
  {
    id: "5",
    title: "Junior Cardiologist",
    location: "Dubai, UAE",
    education: "Bachelor’s Degree in Medicine",
    specialty: "Cardiology",
    features: ["Full time | Onsite", "EX (1-3 years)", "Age (25-35)"],
    timeStamps: new Date("2024-11-22T00:00:00Z"),
    description:
      "We are seeking a junior cardiologist to join our team, providing support in diagnosing and treating cardiovascular diseases under the supervision of senior consultants.",
    requirements: [
      "1-3 years of experience in cardiology",
      "Bachelor’s degree in Medicine",
      "Basic knowledge of cardiovascular health",
      "Willingness to learn and adapt",
      "Good communication skills",
    ],
    additionalDetails:
      "This role offers a great opportunity for growth and learning in a supportive environment with competitive salary and benefits.",
    skills: [
      "Cardiology",
      "Patient Care",
      "Diagnostic Skills",
      "Team Collaboration",
      "Basic Surgical Skills",
    ],
    relatedSearch: [
      "Junior Cardiologist Jobs",
      "Entry-Level Cardiology Positions",
      "Cardiology Jobs Dubai",
      "Healthcare Jobs UAE",
    ],
    company: {
      name: "HeartCare Clinic",
      industry: "Healthcare",
      website: "www.heartcareclinic.com",
      contact: "careers@heartcareclinic.com",
    },
  },
  {
    id: "6",
    title: "Cardiology Fellow",
    location: "Riyadh, Saudi Arabia",
    education: "MD in Cardiology",
    specialty: "Cardiovascular Medicine",
    features: [
      "Full time | Onsite",
      "EX (2-4 years)",
      "Age (28-38)",
      "Flexible Start Date",
    ],
    timeStamps: new Date("2024-10-21T00:00:00Z"),
    description:
      "Looking for a cardiology fellow to join our esteemed medical team, focusing on advanced cardiovascular treatments and patient care.",
    requirements: [
      "2-4 years of experience in cardiology",
      "MD in Cardiology",
      "Strong background in cardiovascular treatments",
      "Ability to work in a fast-paced environment",
      "Excellent teamwork and communication skills",
    ],
    additionalDetails:
      "The position offers a competitive salary, professional development opportunities, and a collaborative work environment.",
    skills: [
      "Cardiovascular Medicine",
      "Patient Diagnosis",
      "Advanced Cardiac Care",
      "Medical Research",
      "Team Collaboration",
    ],
    relatedSearch: [
      "Cardiology Fellow Jobs",
      "Cardiovascular Medicine Positions",
      "Healthcare Jobs Riyadh",
      "Medical Fellowships Saudi Arabia",
    ],
    company: {
      name: "Riyadh Heart Institute",
      industry: "Healthcare",
      website: "www.riyadhheartinstitute.com",
      contact: "jobs@riyadhheartinstitute.com",
    },
  },
  {
    id: "7",
    title: "Cardiothoracic Surgeon",
    location: "Cairo, Egypt",
    education: "Master’s Degree in Cardiothoracic Surgery",
    specialty: "Cardiothoracic Surgery",
    features: ["Full time | Onsite", "EX (5+ years)", "Age (35-45)"],
    timeStamps: new Date("2024-09-22T00:00:00Z"),
    description:
      "We are seeking a cardiothoracic surgeon to join our medical team, providing expert care in cardiothoracic surgical operations, including heart transplants and other cardiovascular procedures.",
    requirements: [
      "At least 5 years of experience in cardiothoracic surgery",
      "Master’s degree in Cardiothoracic Surgery",
      "Strong background in cardiothoracic surgical techniques",
      "Ability to work in a high-pressure environment",
      "Excellent teamwork and communication skills",
    ],
    additionalDetails:
      "This position offers a competitive salary, professional development opportunities, and a collaborative work environment.",
    skills: [
      "Cardiothoracic Surgery",
      "Heart Transplant",
      "Cardiovascular Surgical Techniques",
      "Patient Care",
      "Team Collaboration",
    ],
    relatedSearch: [
      "Cardiothoracic Surgeon Jobs",
      "Heart Transplant Surgeon Roles",
      "Cardiothoracic Surgery Jobs Cairo",
      "Full-time Cardiothoracic Surgeon Jobs",
    ],
    company: {
      name: "Cairo Heart Institute",
      industry: "Healthcare",
      website: "www.cairoheartinstitute.com",
      contact: "info@cairoheartinstitute.com",
    },
  },
  {
    id: "8",
    title: "Vascular Surgeon",
    location: "Jeddah, Saudi Arabia",
    education: "Master’s Degree in Vascular Surgery",
    specialty: "Vascular Surgery",
    features: [
      "Full time | Onsite",
      "EX (5+ years)",
      "Age (35-45)",
      "Flexible Start Date",
    ],
    timeStamps: new Date("2024-08-22T00:00:00Z"),
    description:
      "We are looking for a vascular surgeon to join our team, providing expert care in vascular surgical operations, including vascular reconstruction and endovascular procedures.",
    requirements: [
      "At least 5 years of experience in vascular surgery",
      "Master’s degree in Vascular Surgery",
      "Strong background in vascular surgical techniques",
      "Ability to work in a high-pressure environment",
      "Excellent teamwork and communication skills",
    ],
    additionalDetails:
      "The position offers a competitive salary, professional development opportunities, and a collaborative work environment.",
    skills: [
      "Vascular Surgery",
      "Vascular Reconstruction",
      "Endovascular Procedures",
      "Patient Care",
      "Team Collaboration",
    ],
    relatedSearch: [
      "Vascular Surgeon Jobs",
      "Vascular Surgery Roles",
      "Vascular Surgery Jobs Jeddah",
      "Full-time Vascular Surgeon Jobs",
    ],
    company: {
      name: "Jeddah Vascular Institute",
      industry: "Healthcare",
      website: "www.jeddahvascularinstitute.com",
      contact: "careers@jeddahvascularinstitute.com",
    },
  },
  {
    id: "9",
    title: "Interventional Cardiologist",
    location: "Abu Dhabi, UAE",
    education: "Master’s Degree in Interventional Cardiology",
    specialty: "Interventional Cardiology",
    features: ["Full time | Onsite", "EX (5+ years)", "Age (35-45)"],
    timeStamps: new Date("2024-07-22T00:00:00Z"),
    description:
      "We are seeking an interventional cardiologist to join our medical team, providing expert care in interventional cardiology procedures, including angioplasty and stenting.",
    requirements: [
      "At least 5 years of experience in interventional cardiology",
      "Master’s degree in Interventional Cardiology",
      "Strong background in interventional cardiology procedures",
      "Ability to work in a high-pressure environment",
      "Excellent teamwork and communication skills",
    ],
    additionalDetails:
      "This position offers a competitive salary, professional development opportunities, and a collaborative work environment.",
    skills: [
      "Interventional Cardiology",
      "Angioplasty",
      "Stenting",
      "Patient Care",
      "Team Collaboration",
    ],
    relatedSearch: [
      "Interventional Cardiologist Jobs",
      "Interventional Cardiology Roles",
      "Interventional Cardiology Jobs Abu Dhabi",
      "Full-time Interventional Cardiologist Jobs",
    ],
    company: {
      name: "Abu Dhabi Heart Institute",
      industry: "Healthcare",
      website: "www.abudhabiheartinstitute.com",
      contact: "info@abudhabiheartinstitute.com",
    },
  },
];

export const companies: CompanyItem[] = [
  {
    id: 1,
    image: "/images/Sultan-qaboos-hospital.jpg",
    title: "Sultan Qaboos Hospital",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    tag: "healthcare",
  },
  {
    id: 2,
    image: "/images/Al-rumailah-hospital.jpg",
    title: "Al rumailah hospital",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    tag: "healthcare",
  },
  {
    id: 3,
    image: "/images/saudi-german-hospital.jpg",
    title: "Saudi German Hospital",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    tag: "healthcare",
  },
  {
    id: 4,
    image: "/images/Sultan-qaboos-hospital.jpg",
    title: "Al rumailah hospital",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    tag: "healthcare",
  },
  {
    id: 5,
    image: "/images/Sultan-qaboos-hospital.jpg",
    title: "Saudi German Hospital",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    tag: "healthcare",
  },
];

export const countries = [
  { name: "Egypt", code: "EG" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Qatar", code: "QA" },
  { name: "Kuwait", code: "KW" },
  { name: "Oman", code: "OM" },
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "United Kingdom", code: "gb" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "India", code: "IN" },
];

const now = new Date();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const november11th2024 = new Date(Date.UTC(2024, 10, 11, 0, 0, 0));

export const notifications: NotificationItem[] = [
  {
    title: "5 New Job Matches Found for 'Registered Nurse.'",
    description:
      "We found 5 jobs matching your preferences, including positions at ABC Healthcare and DEF Medical Center.",
    tags: [
      { status: "normal", text: "New" },
      { status: "normal", text: "Full-Time" },
      { status: "normal", text: "Remote" },
    ],
    timeStamp: now,
    isRead: false,
    category: "Job Recommendations",
    icon: Search,
    image:
      "https://www.gravatar.com/avatar/fd2db016ceeecd9303e31266a502d7ab?s=128&d=identicon&r=PG",
    readTime: null,
  },
  {
    title: "Application Submitted to XYZ Hospital.",
    description:
      "Your application for the Nurse position at XYZ Hospital has been successfully submitted. Click to view details.",
    tags: [
      { status: "success", text: "Pending" },
      { status: "normal", text: "Full-Time" },
    ],
    timeStamp: twoHoursAgo,
    isRead: false,
    category: "Application Updates",
    icon: CheckCircleOutline,
    image: "https://media.vanguardcommunications.net/Hospital-exterior.jpg",
    readTime: null,
  },
  {
    title: "ABC Healthcare Viewed Your Profile.",
    description:
      "An employer has viewed your profile. Make sure your profile is complete to increase your chances.",
    tags: [{ status: "warning", text: "Urgent" }],
    timeStamp: twentyHoursAgo,
    isRead: true,
    category: "Profile Updates",
    icon: Edit,
    image: "https://media.vanguardcommunications.net/Hospital-exterior.jpg",
    readTime: twentyHoursAgo,
  },
  {
    title: "Your Profile is 80% Complete.",
    description:
      "Add your certifications to increase your visibility to healthcare employers.",
    tags: [
      { status: "error", text: "Profile" },
      { status: "normal", text: "Action Required" },
    ],
    timeStamp: twoDaysAgo,
    isRead: true,
    category: "Reminders",
    icon: Build,
    image: "https://media.vanguardcommunications.net/Hospital-exterior.jpg",
    readTime: twoDaysAgo,
  },
  {
    title: "3 Steps to Improve Your Resume.",
    description:
      "Follow these steps to make your resume stand out to healthcare employers.",
    tags: [
      { status: "normal", text: "Tip" },
      { status: "normal", text: "Resource" },
    ],
    timeStamp: november11th2024,
    isRead: true,
    category: "Tips & Resources",
    icon: Book,
    image:
      "https://i.iheart.com/v3/re/new_assets/66844a33690c77c14847c03c?ops=contain(1480,0)",
    readTime: november11th2024,
  },
];

export const companySizeList: { name: string; value: CompanySize }[] = [
  { name: "1 to 10 employees", value: CompanySize.MICRO },
  { name: "11 to 50 employees", value: CompanySize.SMALL },
  { name: "51 to 250 employees", value: CompanySize.MEDIUM },
  { name: "251 to 1000 employees", value: CompanySize.LARGE },
  { name: "1001+ employees", value: CompanySize.ENTERPRISE },
];
export const companySizeOptions: Option[] = [
  { value: CompanySize.MICRO, label: "1 to 10 employees" },
  { value: CompanySize.SMALL, label: "11 to 50 employees" },
  { value: CompanySize.MEDIUM, label: "51 to 250 employees" },
  { value: CompanySize.LARGE, label: "251 to 1000 employees" },
  { value: CompanySize.ENTERPRISE, label: "1001+ employees" },
];

enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

export const maritalStatusOptions: Option[] = Object.values(MaritalStatus).map(
  (status) => ({
    value: status as keyof typeof MaritalStatus,
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
  }),
);
export const nationalitiesOptions: Option[] = Object.values(Nationalities).map(
  (nationality) => ({
    value: nationality as keyof typeof Nationalities,
    label:
      nationality.charAt(0).toUpperCase() + nationality.slice(1).toLowerCase(),
  }),
);
export const gendersOptions: Option[] = Object.values(Gender).map((gender) => ({
  value: gender as keyof typeof Gender,
  label: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
}));
