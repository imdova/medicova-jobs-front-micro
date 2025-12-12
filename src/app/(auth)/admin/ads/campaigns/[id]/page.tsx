import {
  Eye,
  MousePointer,
  DollarSign,
  TrendingUp,
  Edit,
  Play,
  Pause,
  Copy,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/UI/Badge";
import { Button, LinearProgress } from "@mui/material";

// Mock campaign data
const campaignData = {
  id: "ad_001",
  name: "Tech Job Fair Promo",
  client: "internal",
  targetGroup: "seekers",
  type: "banner",
  status: "active",
  startDate: "2025-06-01",
  endDate: "2025-07-01",
  budget: {
    daily: 50,
    total: 1000,
  },
  spend: 300,
  impressions: 12000,
  clicks: 450,
  ctr: 3.75,
  conversions: 23,
  placement: "homepage_banner",
  targeting: {
    location: ["US", "UK"],
    device: ["desktop", "mobile"],
    category: ["technology"],
  },
  creative: {
    headline: "Join the Tech Job Fair 2025",
    description: "Connect with top tech companies and find your dream job",
    imageUrl: "/placeholder.svg?height=200&width=400",
    cta: "Register Now",
    link: "/jobfair-2025",
  },
};

export default function CampaignDetailPage() {
  const budgetUsed = (campaignData.spend / campaignData.budget.total) * 100;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{campaignData.name}</h1>
          <p className="text-muted-foreground">
            Campaign Details & Performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outlined">
            <Copy className="mr-2 h-4 w-4" />
            Clone
          </Button>
          <Button variant="outlined">
            {campaignData.status === "active" ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {campaignData.status === "active" ? "Pause" : "Resume"}
          </Button>
          <Link href={`/admin/ads/edit/${campaignData.id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="shadow-base rounded-base border border-gray-200 p-4 lg:col-span-2">
          <div>
            <div>Campaign Information</div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    className={
                      campaignData.status === "active" ? "bg-green-500" : ""
                    }
                  >
                    {campaignData.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Client Type
                </label>
                <p className="mt-1 capitalize">{campaignData.client}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Target Group
                </label>
                <p className="mt-1 capitalize">{campaignData.targetGroup}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Ad Type
                </label>
                <p className="mt-1 capitalize">{campaignData.type}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Start Date
                </label>
                <p className="mt-1">
                  {new Date(campaignData.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  End Date
                </label>
                <p className="mt-1">
                  {new Date(campaignData.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Budget Usage
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${campaignData.spend} spent</span>
                  <span>${campaignData.budget.total} total</span>
                </div>
                <LinearProgress value={budgetUsed} className="h-2" />
                <p className="text-muted-foreground text-xs">
                  Daily budget: ${campaignData.budget.daily}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Preview */}
        <div className="shadow-base rounded-base border border-gray-200 p-4">
          <div>
            <div>Creative Preview</div>
          </div>
          <div>
            <div className="space-y-4">
              <Image
                src={campaignData.creative.imageUrl || "/placeholder.svg"}
                alt="Ad Creative"
                width={400}
                height={200}
                className="w-full rounded-lg border"
              />
              <div>
                <h4 className="font-semibold">
                  {campaignData.creative.headline}
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  {campaignData.creative.description}
                </p>
                <Button className="mt-2">{campaignData.creative.cta}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="shadow-base rounded-base border border-gray-200 p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Impressions</div>
            <Eye className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {campaignData.impressions.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Total views</p>
          </div>
        </div>

        <div className="shadow-base rounded-base border border-gray-200 p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Clicks</div>
            <MousePointer className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {campaignData.clicks.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Total clicks</p>
          </div>
        </div>

        <div className="shadow-base rounded-base border border-gray-200 p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">CTR</div>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">{campaignData.ctr}%</div>
            <p className="text-muted-foreground text-xs">Click-through rate</p>
          </div>
        </div>

        <div className="shadow-base rounded-base border border-gray-200 p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Conversions</div>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">{campaignData.conversions}</div>
            <p className="text-muted-foreground text-xs">Total conversions</p>
          </div>
        </div>
      </div>

      {/* Targeting Details */}
      <div className="shadow-base rounded-base border border-gray-200 p-4">
        <div>
          <div>Targeting & Placement</div>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-medium">Audience Targeting</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Locations:</span>
                  <p className="text-muted-foreground text-sm">
                    {campaignData.targeting.location.join(", ")}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Devices:</span>
                  <p className="text-muted-foreground text-sm">
                    {campaignData.targeting.device.join(", ")}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Categories:</span>
                  <p className="text-muted-foreground text-sm">
                    {campaignData.targeting.category.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-medium">Placement</h4>
              <p className="text-muted-foreground text-sm">
                {campaignData.placement
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
