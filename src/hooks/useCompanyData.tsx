import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompany } from "@/store/slices/companySlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useCompanyData = (companyId?: string | null) => {
  const { data: session } = useSession();
  const user = session?.user;

  const id = companyId || user?.companyId || null;

  const dispatch = useAppDispatch();
  const { data: company, loading } = useAppSelector((state) => state.company);

  // Fetch company when ID changes
  useEffect(() => {
    if (!id) return;
    dispatch(fetchCompany(id));
  }, [id, dispatch]);

  return {
    company,
    loading,
  };
};
