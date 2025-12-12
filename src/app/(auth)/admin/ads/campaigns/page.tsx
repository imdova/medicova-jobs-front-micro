"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  Trash2,
  SquarePen,
  Pen,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/UI/Badge";
import { Button, ListItemIcon, TextField } from "@mui/material";
import SelectField from "@/components/form/FormModal/fields/SelectField";
import DataTable from "@/components/UI/data-table";

// Mock campaigns data
const campaigns = [
  {
    id: "ad_001",
    name: "Tech Job Fair Promo",
    targetGroup: "seekers",
    status: "active",
    client: "internal",
    type: "banner",
    budget: 1000,
    spend: 300,
    period: "2025-06-01 to 2025-07-01",
    ctr: 3.75,
  },
  {
    id: "ad_002",
    name: "Premium Employer Package",
    targetGroup: "employers",
    status: "active",
    client: "external",
    type: "sponsored",
    budget: 2500,
    spend: 1200,
    period: "2025-05-15 to 2025-08-15",
    ctr: 2.1,
  },
  {
    id: "ad_003",
    name: "Resume Builder Tool",
    targetGroup: "seekers",
    status: "paused",
    client: "internal",
    type: "sidebar",
    budget: 500,
    spend: 150,
    period: "2025-06-10 to 2025-07-10",
    ctr: 1.8,
  },
  {
    id: "ad_004",
    name: "Healthcare Jobs Spotlight",
    targetGroup: "all",
    status: "active",
    client: "external",
    type: "native",
    budget: 1800,
    spend: 900,
    period: "2025-06-01 to 2025-09-01",
    ctr: 2.9,
  },
];

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [campaignsData, setCampaignsData] = useState(campaigns);

  const filteredCampaigns = campaignsData.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesTarget =
      targetFilter === "all" || campaign.targetGroup === targetFilter;
    const matchesClient =
      clientFilter === "all" || campaign.client === clientFilter;

    return matchesSearch && matchesStatus && matchesTarget && matchesClient;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "paused":
        return <Badge variant="neutral">Paused</Badge>;
      case "ended":
        return <Badge variant="complete">Ended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleToggleStatus = (id: string) => {
    setCampaignsData((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "active" ? "paused" : "active",
            }
          : c,
      ),
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground">
            Manage all your advertising campaigns
          </p>
        </div>
        <Link href="/admin/ads/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="shadow-base rounded-base border border-gray-200 p-4">
        <h5 className="mb-2 flex w-full items-center text-xl font-semibold text-main">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <TextField
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
          <SelectField
            field={{
              name: "status",
              type: "select",
              textFieldProps: {
                placeholder: "Status",
              },
              options: [
                { label: "All Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Paused", value: "paused" },
                { label: "Ended", value: "ended" },
              ],
            }}
            controllerField={{
              value: statusFilter,
              onChange: (value: string) => setStatusFilter(value),
            }}
          />
          <SelectField
            field={{
              name: "target",
              type: "select",
              textFieldProps: {
                placeholder: "Target Group",
              },
              options: [
                { label: "All Groups", value: "all" },
                { label: "Employers", value: "employers" },
                { label: "Job Seekers", value: "seekers" },
                { label: "All Visitors", value: "all" },
              ],
            }}
            controllerField={{
              value: targetFilter,
              onChange: (value: string) => setTargetFilter(value),
            }}
          />
          <SelectField
            field={{
              name: "type",
              type: "select",
              textFieldProps: {
                placeholder: "Client Type",
              },
              options: [
                { label: "all Clients", value: "all" },
                { label: "Internal", value: "internal" },
                { label: "External", value: "external" },
              ],
            }}
            controllerField={{
              value: targetFilter,
              onChange: (value: string) => setTargetFilter(value),
            }}
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="shadow-base rounded-base border border-gray-200">
        <h5 className="w-full p-4 text-xl font-semibold text-main">
          Campaigns
          <span className="ml-1 text-sm text-muted-foreground">
            ({filteredCampaigns.length})
          </span>
        </h5>
        <div>
          <DataTable
            data={filteredCampaigns}
            columns={[
              {
                key: "name",
                header: "Campaign Name",
                sortable: true,
                render: (campaign) => (
                  <Link
                    href={`/admin/ads/campaigns/${campaign.id}`}
                    className="hover:underline"
                  >
                    {campaign.name}
                  </Link>
                ),
              },
              {
                key: "targetGroup",
                header: "Target Group",
                sortable: true,
                render: (campaign) => (
                  <span className="capitalize">{campaign.targetGroup}</span>
                ),
              },

              {
                key: "client",
                header: "Client",
                sortable: true,
                render: (campaign) => (
                  <span className="capitalize">{campaign.client}</span>
                ),
              },
              {
                key: "type",
                header: "Type",
                sortable: true,
                render: (campaign) => (
                  <span className="capitalize">{campaign.type}</span>
                ),
              },
              {
                key: "budget",
                header: "Budget",
                sortable: true,
                render: (campaign) => `$${campaign.budget}`,
              },
              {
                key: "spend",
                header: "Spend",
                sortable: true,
                render: (campaign) => `$${campaign.spend}`,
              },
              {
                key: "ctr",
                header: "CTR",
                sortable: true,
                render: (campaign) => `${campaign.ctr}%`,
              },
              {
                key: "status",
                header: "Status",
                sortable: false,
                render: (campaign) => (
                  <button
                    onClick={() => handleToggleStatus(campaign.id)}
                    className="flex items-center justify-center rounded p-1 hover:bg-gray-100"
                    title={campaign.status === "active" ? "Pause" : "Resume"}
                  >
                    {campaign.status === "active" ? (
                      <Pause className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Play className="h-5 w-5 text-green-500" />
                    )}
                  </button>
                ),
              },
            ]}
            options={[
              {
                label: (campaign) => (
                  <div>
                    <ListItemIcon>
                      {campaign?.status === "active" ? (
                        <Pause className="mr-1 h-4 w-4" />
                      ) : (
                        <Play className="mr-1 h-4 w-4" />
                      )}
                    </ListItemIcon>
                    {campaign?.status === "active" ? "Pause" : "Resume"}
                  </div>
                ),
                action: (campaign) => {
                  campaign && handleToggleStatus(campaign?.id);
                },
              },
              {
                label: "edit",
                icon: <Pen size={15} />,
              },
              {
                label: <span className="text-red-500">Delete</span>,
                icon: <Trash2 size={15} className="text-red-500" />,
              },
            ]}
            cellClassName="p-2 px-4 text-sm"
            headerClassName="py-2 text-sm"
            className="rounded-none border-x-0"
            searchQuery={searchTerm}
            total={filteredCampaigns.length}
            isSelectable={false}
          />
        </div>
      </div>
    </div>
  );
}
