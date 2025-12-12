"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import { Download, Edit, Eye } from "lucide-react";
import { ToggleButton } from "@/components/UI/ToggleButton";
import DataTable from "@/components/UI/data-table";
import { ColumnConfig } from "@/types";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight: boolean;
};
type OrderRecord = {
  id: number;
  orders: string;
  name: string;
  revenue: string;
  amount: number;
  status: string;
  recipt: number;
};
type PricingRecord = {
  id: number;
  features: string;
  basic: string;
  pro: string;
  gold: string;
  platinum: string;
};
const plans: Plan[] = [
  {
    name: "Basic",
    price: "3,500",
    description: "Best for small companies with less than 2 employees",
    features: [
      "Unlimited Views",
      "90 Unlocks",
      "6 Jobs",
      "30 Invitations",
      "2 Users",
      "Access unlocked profiles for up to 3 months",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "5,500",
    description: "Best for small companies hiring 1-2 people per month",
    features: [
      "Unlimited Views",
      "150 Unlocks",
      "60 Invitations",
      "3 Users",
      "Premium Support",
      "Access unlocked profiles for up to 3 months",
    ],
    highlight: false,
  },
  {
    name: "Gold",
    price: "8,400",
    description:
      "Best for companies with medium hiring needs or changing roles on the team",
    features: [
      "Unlimited Views",
      "300 Unlocks",
      "15 Jobs",
      "105 Invitations",
      "25 Users",
      "Featured Support",
      "Premium Support",
      "Access unlocked profiles for up to 3 months 0",
    ],
    highlight: true,
  },
  {
    name: "Platinum",
    price: "12,000",
    description:
      "Best for companies with large hiring needs or needing support with",
    features: [
      "Unlimited Views",
      "750+ Unlocks",
      "60+ Jobs",
      "300+ Invitations",
      "Premium Support",
      "Access unlocked profiles",
    ],
    highlight: true,
  },
];

// Order Plans dummy data
const Orederplans: OrderRecord[] = [
  {
    id: 1,
    orders: "2",
    name: "Jack",
    revenue: "25,000K",
    amount: 8.12,
    status: "Active",
    recipt: 209,
  },
  {
    id: 2,
    orders: "2",
    name: "Jack",
    revenue: "25,000K",
    amount: 8.12,
    status: "Active",
    recipt: 209,
  },
  {
    id: 3,
    orders: "2",
    name: "Jack",
    revenue: "25,000K",
    amount: 8.12,
    status: "Active",
    recipt: 209,
  },
  {
    id: 4,
    orders: "2",
    name: "Jack",
    revenue: "25,000K",
    amount: 8.12,
    status: "Active",
    recipt: 209,
  },
];
// Plan Setting dummy data
const pricingRecords: PricingRecord[] = [
  {
    id: 1,
    features: "Price",
    basic: "$3.733",
    pro: "$5.533",
    gold: "$8.533",
    platinum: "$209",
  },
  {
    id: 2,
    features: "Discount",
    basic: "5%",
    pro: "10%",
    gold: "15%",
    platinum: "20%",
  },
  {
    id: 3,
    features: "Storage",
    basic: "50GB",
    pro: "100GB",
    gold: "200GB",
    platinum: "1TB",
  },
  {
    id: 4,
    features: "Support",
    basic: "Email",
    pro: "Chat & Email",
    gold: "Phone, Chat & Email",
    platinum: "24/7 Priority Support",
  },
  {
    id: 5,
    features: "Custom Reports",
    basic: "No",
    pro: "Yes",
    gold: "Yes",
    platinum: "Yes",
  },
];

// Plan Setting Columns
const PlanSettingColumns: ColumnConfig<PricingRecord>[] = [
  {
    header: "#",
    render: (_plan: PricingRecord, index: number) => <span>{index + 1}</span>,
  },
  {
    key: "features",
    header: "Features",
    render: (Plan: PricingRecord) => {
      return <span className="text-sm">{Plan.features || "-"}</span>;
    },
  },
  {
    key: "basic",
    header: "Basic",
    render: (Plan: PricingRecord) => {
      return <span className="text-sm">{Plan.basic || "-"}</span>;
    },
  },
  {
    key: "pro",
    header: "Pro",
    render: (Plan: PricingRecord) => {
      return <span className="text-sm">{Plan.pro || "-"}</span>;
    },
  },
  {
    key: "gold",
    header: "gold",
    render: (Plan: PricingRecord) => {
      return <span className="text-sm">{Plan.gold || "-"}</span>;
    },
  },
  {
    key: "platinum",
    header: "platinum",
    render: (Plan: PricingRecord) => {
      return <span className="text-sm">{Plan.platinum || "-"}</span>;
    },
  },
  {
    header: "Action",
    render: () => (
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-700">
          <Edit size={17} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-700">
          <Download size={17} />
        </button>
      </div>
    ),
  },
];

// Order Plans Columns
const OrderPlansColumns: ColumnConfig<OrderRecord>[] = [
  {
    header: "#",
    render: (_plan: OrderRecord, index: number) => <span>{index + 1}</span>,
  },
  {
    key: "name",
    header: "Plan Name",
    render: (Plan: OrderRecord) => {
      return <span className="text-sm">{Plan.name || "-"}</span>;
    },
  },
  {
    key: "orders",
    header: "Orders",
    render: (Plan: OrderRecord) => {
      return <span className="text-sm">{Plan.orders || "-"}</span>;
    },
  },
  {
    header: "Payment Method",
    render: () => {
      return (
        <AvatarGroup
          className="flex h-full items-center justify-center"
          sx={{
            "& .MuiAvatar-root": {
              width: 30,
              height: 30,
            },
          }}
          max={4}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://remosnextjs.vercel.app/images/avatar/user-12.png"
          />
          <Avatar
            alt="Travis Howard"
            src="https://remosnextjs.vercel.app/images/avatar/user-12.png"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://remosnextjs.vercel.app/images/avatar/user-12.png"
          />
          <Avatar
            alt="Agnes Walker"
            src="https://remosnextjs.vercel.app/images/avatar/user-12.png"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://remosnextjs.vercel.app/images/avatar/user-12.png"
          />
        </AvatarGroup>
      );
    },
  },
  {
    key: "revenue",
    header: "Revenue",
    render: (Plan: OrderRecord) => {
      return <span className="text-sm">{Plan.revenue || "-"}</span>;
    },
  },
  {
    key: "status",
    header: "Status",
    render: (Plan: OrderRecord) => {
      return (
        <span
          className={`rounded-xl px-3 py-1 text-sm ${Plan.status === "active" ? "bg-green-100 text-green-700" : "bg-red-200 text-red-700"}`}
        >
          {Plan.status}
        </span>
      );
    },
  },
  {
    header: "Action",
    render: () => (
      <div className="flex items-center gap-4">
        <ToggleButton />
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-700">
          <Eye size={17} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-700">
          <Download size={17} />
        </button>
      </div>
    ),
  },
];

const OldSubscriptionPlansPage: React.FC = () => {
  const [selectedAccess, setSelectedAccess] =
    useState<string>("1 Month Access");
  const [orderRecordSelected, setOrderRecordSelected] = useState<
    (number | string)[]
  >([]);
  const [PricingRecordselected, setPricingRecordSelected] = useState<
    (number | string)[]
  >([]);

  const handleAccessSelection = (access: string) => {
    setSelectedAccess(access);
  };

  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [plansData, setPlansData] = useState<Plan[]>(plans);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPlans = Orederplans?.filter((plans) => {
    // Search filter
    const query = searchQuery.toLowerCase();
    const searchMatch = !query || plans.name.toLowerCase().includes(query);
    return searchMatch;
  });
  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setPlansData(plans);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading Plans data...
      </div>
    );
  }

  return (
    <Box sx={{ pt: 2 }}>
      {/* Table total Plans */}
      <div className="mb-6">{/* <TotalPlansTable endPoint={""} /> */}</div>
      <div className="mb-6 space-y-4 rounded-xl border bg-white p-3 shadow-soft">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-lg font-semibold">
            Total Plans: {Orederplans.length}
          </h2>
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable<OrderRecord>
          data={filteredPlans}
          columns={OrderPlansColumns}
          isSelectable
          searchQuery={searchQuery}
          selected={orderRecordSelected}
          setSelected={setOrderRecordSelected}
        />
      </div>
      {/* Heading */}
      <Typography
        variant="h4"
        textAlign="center"
        className="text-main"
        fontWeight={600}
        mb={2}
      >
        Ready to get started?
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        className="text-muted-foreground"
        mb={4}
      >
        14 days unlimited free trial. No contract or credit card required.
      </Typography>

      {/* Access Buttons */}
      <Box
        className="flex-col bg-primary/10 md:flex-row"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 1,
          width: "60%",
          margin: "0 auto",
          borderRadius: 5,
        }}
      >
        {[
          "1 Month Access",
          "3 Months Access",
          "6 Months Access",
          "1 Year Access",
        ].map((access) => (
          <Button
            key={access}
            onClick={() => handleAccessSelection(access)}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor:
                selectedAccess === access ? "white" : "transparent",
              color: selectedAccess === access ? "#000" : "#333",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              },
            }}
          >
            {access}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 3, mb: 4 }}>
        {plansData.map((plan, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 1, // Reduced padding for a smaller overall card size
                position: "relative",
                border:
                  index === 3
                    ? "1px solid transparent" // Reduced border size
                    : index === 2
                      ? "none" // Remove border for the third card
                      : plan.name === "Platinum"
                        ? "2px solid #4CAF50" // Green border for Platinum plan
                        : plan.highlight && plan.name === "Gold"
                          ? "2px solid green"
                          : plan.highlight
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0", // Default border style for others
                borderRadius: "18px", // Slightly smaller radius for a more compact look
                backgroundColor:
                  index === 0
                    ? "white"
                    : index === 1
                      ? "#D9D9D933"
                      : index === 2
                        ? "#d4ecd1" // Background color for the third card
                        : index === 3
                          ? "white" // Optional background color for the last card
                          : "white", // Default white background for others
                boxShadow:
                  plan.name === "Platinum"
                    ? "0 4px 12px rgba(76, 175, 80, 0.5)" // Green shadow for Platinum plan
                    : plan.highlight
                      ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                      : "",
                ...(index === 3 && {
                  backgroundImage:
                    "linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(90deg, #FFFFFF 0%, #2BA149 80%, #82C341 90%, #7BC48D 100%)", // Adjusted gradient stops for smaller border
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                }),
              }}
            >
              {/* Top-right badge */}
              {index === 1 ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "var(--primary)", // Background color for "Simple Pack"
                    color: "white",
                    px: 2,
                    py: 1,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "20px",
                    borderTopRightRadius: "0",
                    display: "inline-block",
                  }}
                >
                  Simple Pack
                </Box>
              ) : (
                plan.highlight && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background:
                        plan.name === "Gold"
                          ? "#2BA149" // Background color for "Most Popular"
                          : plan.name === "Platinum"
                            ? "#2EAE7D" // Background color for "Highly Suggested"
                            : "#1976d2", // Default fallback
                      color: "white",
                      px: 2,
                      py: 1,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "20px",
                      borderTopRightRadius: "0",
                      display: "inline-block",
                    }}
                  >
                    {plan.name === "Gold"
                      ? "Most Popular"
                      : plan.name === "Platinum"
                        ? "Highly Suggested"
                        : ""}
                  </Box>
                )
              )}

              <CardContent>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    ...(plan.highlight &&
                      plan.name === "Gold" && {
                        background:
                          "linear-gradient(90deg, #185D43CC 0%, #82C341CC 60%)",
                        WebkitBackgroundClip: "text", // Apply gradient to the text
                        color: "transparent", // Make the text transparent so the gradient shows
                      }),
                  }}
                >
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {plan.description}
                </Typography>
                <Typography fontWeight={600}>
                  <span style={{ color: "black", fontSize: "24px" }}>
                    {plan.price}
                  </span>
                  <span style={{ color: "#AEAEAE", fontSize: "20px" }}>
                    {" "}
                    EGP/mo
                  </span>
                </Typography>

                {/* Total price section */}
                <Divider sx={{ my: 2 }} />
                {index === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "#000", marginTop: "8px" }}
                  >
                    Total price 11,700 EGP 11,200 EGP All prices are subject to
                    VAT
                  </Typography>
                ) : index === 1 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "#000", marginTop: "8px" }}
                  >
                    Total price 17,400 EGP 16,600 EGP All prices are subject to
                    VAT
                  </Typography>
                ) : index === 2 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "#000", marginTop: "8px" }}
                  >
                    Total price 26,250 EGP 25,000 EGP All prices are subject to
                    VAT
                  </Typography>
                ) : index === 3 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "#000", marginTop: "8px" }}
                  >
                    Total price 11,700 EGP 11,200 EGP All prices are subject to
                    VAT
                  </Typography>
                ) : null}

                {/* Add Excl. Vat Text */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", marginTop: "8px" }}
                >
                  Excl. Vat
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Button with custom background color */}
                <Button
                  fullWidth
                  sx={{
                    backgroundColor:
                      index === 0
                        ? "#000" // First card: black button
                        : index === 3
                          ? "white" // Last card: white button
                          : "var(--primary)", // Second and third cards: green button
                    color: index === 3 ? "var(--primary)" : "white", // Text color for last card
                    borderRadius: 3,
                    border: index === 3 ? "2px solid var(--primary)" : "none", // Border for last card
                    "&:hover": {
                      backgroundColor:
                        index === 0
                          ? "#000" // First card: no hover effect (keeps black button)
                          : index === 3
                            ? "white" // Last card: no hover effect (keeps white button)
                            : "var(--primary)", // Second and third cards: no hover effect (keeps green button)
                      boxShadow: "none", // Remove hover shadow effect
                    },
                  }}
                >
                  Get started
                </Button>

                <Typography variant="subtitle1" fontWeight={600} my={2}>
                  Features Included:
                </Typography>
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{ marginRight: "8px", color: "#185D43" }} // Add space between the text and the chip
                      >
                        {feature}
                      </Typography>
                      {/* Chips for First Card */}
                      {index === 0 && [0, 2, 4].includes(idx) && (
                        <Chip
                          label="New"
                          sx={{
                            backgroundColor: "#127E64", // Background color for the Chip
                            color: "white", // White text color
                            fontSize: "0.400rem", // Even smaller font size
                            height: "15px", // Smaller height
                            marginLeft: "8px", // Add space between chip and text
                            borderRadius: "10px", // Optionally adjust the border radius for a rounder look
                          }}
                        />
                      )}
                      {/* Chips for Second Card */}
                      {index === 1 && [1, 2, 4].includes(idx) && (
                        <Chip
                          label="New"
                          sx={{
                            backgroundColor: "#127E64", // Background color for the Chip
                            color: "white", // White text color
                            fontSize: "0.400rem", // Even smaller font size
                            height: "15px", // Smaller height
                            marginLeft: "8px", // Add space between chip and text
                            borderRadius: "10px", // Optionally adjust the border radius for a rounder look
                          }}
                        />
                      )}
                      {/* Chips for Third Card */}
                      {index === 2 && [0, 2, 3, 5, 6].includes(idx) && (
                        <Chip
                          label="New"
                          sx={{
                            backgroundColor: "#127E64", // Background color for the Chip
                            color: "white", // White text color
                            fontSize: "0.400rem", // Even smaller font size
                            height: "15px", // Smaller height
                            marginLeft: "8px", // Add space between chip and text
                            borderRadius: "10px", // Optionally adjust the border radius for a rounder look
                          }}
                        />
                      )}
                      {/* Chips for Last Card */}
                      {index === 3 && (
                        <Chip
                          label="New"
                          sx={{
                            backgroundColor: "#127E64", // Background color for the Chip
                            color: "white", // White text color
                            fontSize: "0.400rem", // Even smaller font size
                            height: "15px", // Smaller height
                            marginLeft: "8px", // Add space between chip and text
                            borderRadius: "10px", // Optionally adjust the border radius for a rounder look
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="mt-4 rounded-xl border bg-white shadow-soft">
        <h2 className="p-4 text-xl font-semibold">Plan Setting</h2>
        {/* Table */}
        <DataTable<PricingRecord>
          data={pricingRecords}
          columns={PlanSettingColumns}
          isSelectable
          selected={PricingRecordselected}
          setSelected={setPricingRecordSelected}
          className="border-none shadow-none"
        />
      </div>
    </Box>
  );
};

export default OldSubscriptionPlansPage;
