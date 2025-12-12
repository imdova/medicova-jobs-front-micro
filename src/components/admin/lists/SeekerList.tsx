"use client";

import useFetch from "@/hooks/useFetch";
import { API_GET_SEEKERS } from "@/api/seeker";
import { Suspense } from "react";
import SeekersTable from "@/components/admin/overviews/OverviewSeekersTable";
import { UserProfile } from "@/types/seeker";

const SeekerList: React.FC = () => {
  const { data: Seeker, setData } =
    useFetch<PaginatedResponse<UserProfile>>(API_GET_SEEKERS);
  return (
    <>
      <div className="box-content !p-0">
        {/* Seekers Table */}
        <Suspense>
          <SeekersTable />
        </Suspense>
      </div>
    </>
  );
};

export default SeekerList;
