"use client";
import Loading from "@/components/loading/loading";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useCompanyData } from "@/hooks/useCompanyData";
import React from "react";
import CompanyInfoForm from "@/components/pages/companyInfo/companyForm";

const CompanyInfoPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { company, loading } = useCompanyData(user?.companyId);
  if (status === "loading" || loading) return <Loading />;
  if (status === "unauthenticated" || !user) return notFound();
  if (!company) return notFound();
  return <CompanyInfoForm company={company} />;
};
export default CompanyInfoPage;
