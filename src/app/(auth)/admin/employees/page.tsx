"use client";
import { Building2, LayoutList, Settings } from "lucide-react";
import TeamList from "@/components/admin/lists/TeamList";
import RolesTab from "@/components/settings/RolesTab";
import DepartmentTab from "@/components/settings/DepartmentsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Card } from "@/components/UI/card";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Loading from "@/components/loading/loading";
import { notFound } from "next/navigation";

const EmployeesPage: React.FC = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "unauthenticated") {
    return notFound();
  }
  return (
    <div className="my-8 space-y-3 px-4">
      <Tabs defaultValue="employees-list" className="w-full">
        <Card className="p-1">
          <TabsList>
            <TabsTrigger value="employees-list">
              <LayoutList />
              Employees List
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Building2 />
              Departments
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Settings />
              Roles
            </TabsTrigger>
          </TabsList>
        </Card>
        <TabsContent value="employees-list">
          <TeamList user={user} />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentTab />
        </TabsContent>
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesPage;
