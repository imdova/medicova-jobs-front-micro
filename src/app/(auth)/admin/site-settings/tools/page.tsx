"use client";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";

import { Separator } from "@/components/UI/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import {
  BrushCleaning,
  Folder,
  Lock,
  Pen,
  Plus,
  Trash,
  Wrench,
} from "lucide-react";

const tabs = [
  {
    name: "Sitemap",
    value: "sitemap",
  },
  {
    name: "Clear cache",
    value: "clear-cache",
  },
  {
    name: "System backup",
    value: "system-backup",
  },
  {
    name: "Database backup",
    value: "database-backup",
  },
  {
    name: "Maintenance",
    value: "maintenance",
  },
  {
    name: "Public profiles",
    value: "public-profiles",
  },
];

const data = [
  {
    name: "sitemap18725604.xml",
    url: "https://localhost/crms",
  },
];

const backupData = [
  {
    name: "crm_customers_backup_2025-05-26",
    created_at: "2022-01-01",
  },
];

const page = () => {
  return (
    <Tabs defaultValue="sitemap" className="flex-row">
      <Card className="w-full max-w-52">
        <CardHeader>
          <CardTitle>Other Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <TabsList className="h-full flex-col gap-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full justify-start text-left"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </CardContent>
      </Card>
      <TabsContent value="sitemap">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap</CardTitle>
            <CardAction>
              <Button variant="outline">
                <Plus /> Generate Sitemap
              </Button>
            </CardAction>
          </CardHeader>
          <Separator className="my-5" />
          <CardContent>
            <AdvancedDataTable
              columns={[
                {
                  header: "URL",
                  accessorKey: "url",
                },
                {
                  header: "File Name",
                  accessorKey: "name",
                },
                {
                  id: "actions",
                  header: "Actions",
                  size: 24,
                  enableHiding: false,
                  cell: () => (
                    <div className="flex w-fit items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Pen />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  ),
                },
              ]}
              data={data}
              tableClassName="border"
              cellClassName="py-5"
              defaultSorting={{
                id: "url",
                desc: false,
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="clear-cache">
        <Card>
          <CardHeader>
            <CardTitle className="py-3">Clear Cache</CardTitle>
            <Separator />
            <CardDescription>
              Clearing the cache may improve performance but will remove
              temporary files, stored preferences, and cached data from websites
              and applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-3">
            <Button>
              <BrushCleaning /> Clear Cache
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="system-backup">
        <Card>
          <CardHeader>
            <CardTitle>System Backup</CardTitle>
            <CardAction>
              <Button variant="outline">
                <Folder /> Generate Backup
              </Button>
            </CardAction>
          </CardHeader>
          <Separator className="my-5" />
          <CardContent>
            <AdvancedDataTable
              columns={[
                {
                  header: "name",
                  accessorKey: "name",
                },
                {
                  header: "created at",
                  accessorKey: "created_at",
                },
                {
                  id: "actions",
                  header: "Actions",
                  size: 24,
                  enableHiding: false,
                  cell: () => (
                    <div className="flex w-fit items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  ),
                },
              ]}
              data={backupData}
              tableClassName="border"
              cellClassName="py-5"
              defaultSorting={{
                id: "name",
                desc: false,
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="database-backup">
        <Card>
          <CardHeader>
            <CardTitle>Database Backup</CardTitle>
            <CardAction>
              <Button variant="outline">
                <Folder /> Generate Backup
              </Button>
            </CardAction>
          </CardHeader>
          <Separator className="my-5" />
          <CardContent>
            <AdvancedDataTable
              columns={[
                {
                  header: "name",
                  accessorKey: "name",
                },
                {
                  header: "created at",
                  accessorKey: "created_at",
                },
                {
                  id: "actions",
                  header: "Actions",
                  size: 24,
                  enableHiding: false,
                  cell: () => (
                    <div className="flex w-fit items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  ),
                },
              ]}
              data={backupData}
              tableClassName="border"
              cellClassName="py-5"
              defaultSorting={{
                id: "name",
                desc: false,
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="maintenance">
        <Card>
          <CardHeader>
            <CardTitle className="py-3">Maintenance</CardTitle>
            <Separator />
            <CardDescription>
              Maintenance mode is a feature that allows you to temporarily
              disable your website or application to perform maintenance or
              updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-3">
            <Button>
              <Wrench /> Enable Maintenance
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="public-profiles">
        <Card>
          <CardHeader>
            <CardTitle className="py-3">Public Profiles</CardTitle>
            <Separator />
            <CardDescription>
              Allowing seekers&apos; contact information to be public for
              employers eliminates the need for employers to unlock the
              seeker&apos;s profile to access their contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-3">
            <Button>
              <Lock /> Enable Public Profiles
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default page;
