import { Badge } from "@/components/UI/Badge";
import StatCard from "@/components/UI/statCard";
import { Button } from "@mui/material";
import {
  BarChart3,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Briefcase,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Mock data for dashboard
const dashboardStats = {
  totalActiveAds: 12,
  employerAds: 5,
  seekerAds: 7,
  monthlyRevenue: 4250,
  totalClicks: 15420,
  totalImpressions: 245600,
};

const recentAds = [
  {
    id: "ad_001",
    name: "Tech Job Fair Promo",
    target: "seekers",
    type: "banner",
    status: "active",
    client: "internal",
    ctr: 3.75,
  },
  {
    id: "ad_002",
    name: "Premium Employer Package",
    target: "employers",
    type: "sponsored",
    status: "active",
    client: "external",
    ctr: 2.1,
  },
  {
    id: "ad_003",
    name: "Resume Builder Tool",
    target: "seekers",
    type: "sidebar",
    status: "paused",
    client: "internal",
    ctr: 1.8,
  },
];

const cards = [
  {
    icon: <Briefcase size={20} />,
    title: "Active Ads",
    value: dashboardStats.totalActiveAds.toLocaleString(),
    change: `${dashboardStats.employerAds} for employers, ${dashboardStats.seekerAds} for seekers`,
    bg: "bg-[#E4F8FFE5]",
    text: "text-[#55BEE6]",
  },
  {
    icon: <DollarSign size={20} />,
    title: "Monthly Revenue",
    value: `$${dashboardStats.monthlyRevenue.toLocaleString()}`,
    change: "From external advertisers",
    bg: "bg-[#DCFCE7]",
    text: "text-[#008236]",
  },
  {
    icon: <MousePointer size={20} />,
    title: "Total Clicks",
    value: dashboardStats.totalClicks.toLocaleString(),
    change: "Across all campaigns",
    bg: "bg-[#F3E8FF]",
    text: "text-[#7C3AED]",
  },
  {
    icon: <Eye size={20} />,
    title: "Impressions",
    value: dashboardStats.totalImpressions.toLocaleString(),
    change: "This month",
    bg: "bg-[#FFF7E6]",
    text: "text-[#F59E42]",
  },
];

export default function AdsDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ads Center</h1>
          <p className="text-muted-foreground">
            Manage your platform advertising campaigns
          </p>
        </div>

        <Button
          startIcon={<Plus size={14} />}
          href="/admin/ads/create"
          variant="contained"
          LinkComponent={Link}
        >
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cards.map((state, index) => (
          <StatCard key={index} {...state} />
        ))}
      </div>

      {/* Recent Ads */}
      <div className="shadow-base rounded-base border border-gray-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h6 className="text-xl font-bold">Recent Campaigns</h6>
          <Link
            href="/admin/ads/campaigns"
            className="rounded-base border border-gray-300 p-2 px-4 hover:bg-primary hover:text-white duration-200"
          >
            View All
          </Link>
        </div>
        <div>
          <div className="space-y-4">
            {recentAds.map((ad) => (
              <div
                key={ad.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {ad.target === "employers" ? (
                      <Briefcase className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Users className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <h4 className="font-medium">{ad.name}</h4>
                      <p className="text-muted-foreground text-sm">
                        {ad.type} • {ad.client} • CTR: {ad.ctr}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      ad.status === "active" ? "success" : "missing-description"
                    }
                  >
                    {ad.status}
                  </Badge>
                  <Link
                    href={`/admin/ads/campaigns/${ad.id}`}
                    className="px-4 text-sm hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
