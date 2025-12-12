import { JobSearchFilter } from "@/types/jobs";

export const featuredSection: {
  title: {
    text: string;
    featured: string;
  };
  jobsFilter: JobSearchFilter;
} = {
  title: {
    text: "Featured Jobs For",
    featured: "Healthcare Providers",
  },
  jobsFilter: {
    q: "",
    industryId: [],
    specialityId: [],
    categoryId: [],
    careerLevelId: [],
    employmentTypeId: [],
    workPlace: [],
    gender: [],
    educationLevel: [],
    countryCode: [],
    stateCode: [],
    salaryFrom: null,
    salaryTo: null,
    ageFrom: null,
    ageTo: null,
    page: 1,
    limit: 10,
  },
};

export const statsSection = {
  rating: {
    text: "Rated Excellent",
    value: 3,
    source: "Trust Pilot",
  },
  stats: [
    "3500+",
    "Employers",
    "45K +",
    "Jobs",
    "45K +",
    "Job Seeker",
    "92 country",
  ],
};

export const adsSection = {
  HOME_PAGE_VERTICAL_BANNER_1: {
    name: "Vertical Banner 1",
    adType: "HOME_PAGE_VERTICAL_BANNER_1",
    targetGroup: "All healthcare professionals",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    link: "/employer/search",
    image: "/images/ad-panner-1.jpg",
  },
  HOME_PAGE_VERTICAL_BANNER_2: {
    name: "Vertical Banner 2",
    adType: "HOME_PAGE_VERTICAL_BANNER_1",
    targetGroup: "All healthcare professionals",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    link: "/employer/search",
    image: "/images/ad-panner-2.jpg",
  },
  HOME_PAGE_HORIZONTAL_BANNER_1: {
    name: "Horizontal Banner 1",
    adType: "HOME_PAGE_VERTICAL_BANNER_2",
    targetGroup: "Employers",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    link: "/employer/dashboard",
    image: "/images/ad-panner-3.jpg",
  },
  HOME_PAGE_HORIZONTAL_BANNER_2: {
    name: "Horizontal Banner 2",
    adType: "HOME_PAGE_HORIZONTAL_BANNER_1",
    targetGroup: "Job seekers",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    link: "/search",
    image: "/images/ad-panner-4.png",
  },
};

export const hiringCompaniesSection = {
  title: {
    text: "Discover Who is hiring on",
    featured: "MEDICOVA.NET",
  },
  companies: [
    {
      src: "/images/company-1.png",
      name: "company-1 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-2.png",
      name: "company-2 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-3.png",
      name: "company-3 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-4.png",
      name: "company-4 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-5.png",
      name: "company-5 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-6.png",
      name: "company-6 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-7.png",
      name: "company-7 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-8.png",
      name: "company-8 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-9.png",
      name: "company-9 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
    {
      src: "/images/company-10.png",
      name: "company-10 Image",
      height: 200,
      width: 200,
      className: "h-[200px] w-[200px] object-contain",
    },
  ],
  animation: ["animate-marquee", "animate-marquee2"],
};

export const callToActionSection = {
  leftSection: {
    title: "Post a Job in 5 Minutes!",
    description: "You are minutes away from the dream job.",
    button: {
      text: "Hire Healthcare Talent",
      href: "/employer/search",
    },
  },
  rightSection: {
    title: "Get hired for your dream job!",
    description: "Build your free resumé in minutes!",
    button: {
      text: "Browse 1,200+ Openings",
      href: "/search",
    },
  },
};

export const JobCategoriesSection = {
  label: "Job Categories",
  title: {
    text: "Explore Jobs",
    featured: "By Specialist",
  },
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
  specialists: [
    {
      id: 1,
      image: "/images/Physicians.svg",
      title: "Physicians",
      jobsNumber: 436,
      link: "#",
    },
    {
      id: 2,
      image: "/images/Dentists.svg",
      title: "Dentists",
      jobsNumber: 636,
      link: "#",
    },
    {
      id: 3,
      image: "/images/Physiontherapists.svg",
      title: "Physiontherapists",
      jobsNumber: 436,
      link: "#",
    },
    {
      id: 4,
      image: "/images/Pharmacists.svg",
      title: "Pharmacists",
      jobsNumber: 436,
      link: "#",
    },
    {
      id: 5,
      image: "/images/Nurses.svg",
      title: "Nurses",
      jobsNumber: 436,
      link: "#",
    },
    {
      id: 6,
      image: "/images/Technicians.svg",
      title: "Technicians",
      jobsNumber: 436,
      link: "#",
    },
    {
      id: 7,
      image: "/images/Technicians.svg",
      title: "Technicians",
      jobsNumber: 436,
      link: "#",
    },
    {
      id: 8,
      image: "/images/Technicians.svg",
      title: "Technicians",
      jobsNumber: 436,
      link: "#",
    },
  ],
  popularSearchesTitle: "Popular Job Search for Healthcare Professionals",
  popularSearches: [
    {
      title: "Pediatric Consultant",
      href: "/search?q=Pediatric Consultant",
    },
    {
      title: "ICU Nurse",
      href: "/search?q=ICU Nurse",
    },
    {
      title: "Obsteric Consultant Saudi Arabia",
      href: "/search?q=Obsteric+Consultant&country=SA",
    },
    {
      title: "Internal Medicine Registrar Oman",
      href: "/search?q=Internal Medicine&country=OM",
    },
    {
      title: "Cardiologist",
      href: "/search?q=Cardiologist",
    },
    {
      title: "Emergency Medicine Physician",
      href: "/search?q=Emergency Medicine Physician",
    },
    {
      title: "Radiologist UAE",
      href: "/search?q=Radiologist&country=AE",
    },
    {
      title: "Anesthesiologist Qatar",
      href: "/search?q=Anesthesiologist&country=QA",
    },
    {
      title: "General Surgeon",
      href: "/search?q=General Surgeon",
    },
  ],
};

export const videoSection = {
  video: {
    thumbnailUrl: "/images/thumbnail.jpg",
    videoUrl: "https://youtu.be/0iIOEIAM1hU?si=0tw9awGFSXOWLXoU",
  },
  content: {
    label: "Find Your Dream Job",
    title: {
      text: "Thousands Of Top Jobs Now in One Place",
      highlight: {
        text: "Jobs",
        className: "bg-primary px-6 py-3 text-xl text-white",
        style: {
          borderRadius: "92% 8% 93% 7% / 10% 86% 14% 90%",
          display: "inline-block",
        },
      },
      className: "max-w-[350px] text-3xl font-bold",
    },
    description:
      "Discover the best healthcare opportunities across the globe. Connect with top hospitals, clinics, and healthcare organizations looking for talented professionals like you.",
    features: [
      "Top Healthcare Employers",
      "Apply to Jobs Anywhere, Anytime",
      "Flexible Job Search Options",
    ],
    button: {
      text: "start free trail",
      linkUrl: "",
    },
  },
};

export const howWorks = {
  title: {
    text: "How medicova Works",
    featured: "Works",
  },
  description:
    "Medicova connects doctors, nurses, and allied health professionals with top hospitals in Saudi Arabia, UAE, and Qatar. 85% faster hiring through AI-powered matching.",
  steps: [
    {
      title: "Find Your Job",
      description:
        "Build your professional profile with your experience, skills, and preferences to help employers find you.",
      image: "/images/about-1.png",
    },
    {
      title: "Apply For Job",
      description:
        "Search through thousands of healthcare jobs and apply to positions that match your qualifications and career goals.",
      image: "/images/about-2.png",
    },
    {
      title: "Build Your Career",
      description:
        "Connect directly with top healthcare employers and get hired faster with our AI-powered matching system.",
      image: "/images/about-3.png",
    },
  ],

  stats: [
    {
      title: "Active Job Seekers",
      value: "45K+",
    },
    {
      title: "Available Jobs",
      value: "79+",
    },
    {
      title: "Employers",
      value: "156k+",
    },
    {
      title: "Countries",
      value: "92",
    },
  ],
};
