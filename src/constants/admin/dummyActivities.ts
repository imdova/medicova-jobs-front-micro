interface Activity {
  date: string;
  time: string;
  actions: {
    description: string;
    ipAddress: string;
  }[];
}

// Dummy data
export const activitiesDummyData: Activity[] = [
  {
    date: "February 24, 2025",
    time: "8:08 PM",
    actions: [
      {
        description: "Ahmed Habib logged in on www.facebook.com.",
        ipAddress: "197.133.11.163",
      },
    ],
  },
  {
    date: "February 16, 2025",
    time: "8:54 PM",
    actions: [
      {
        description:
          "Ahmed Habib applied to ( Paediatric Consultant - Saudi Arabia ) Job",
        ipAddress: "197.134.184.179",
      },
      {
        description: "Ahmed Habib logged in on www.facebook.com.",
        ipAddress: "197.134.184.179",
      },
    ],
  },
  {
    date: "December 24, 2024",
    time: "3:03 PM",
    actions: [
      {
        description:
          "Ahmed Habib withdrawal application from ( Paediatric Consultant - Saudi Arabia ) Job",
        ipAddress: "196.129.111.129",
      },
    ],
  },
  {
    date: "November 16, 2024",
    time: "11:09 PM",
    actions: [
      {
        description: "Ahmed Habib logged out of www.facebook.com.",
        ipAddress: "197.134.188.61",
      },
    ],
  },
];
