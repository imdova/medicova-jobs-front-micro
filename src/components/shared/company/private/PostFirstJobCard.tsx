import Image from "next/image";
import post from "@/components/images/post.svg";
import { Company } from "@/types";
import Guard from "@/components/auth/Guard";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { useState } from "react";
import QuickPostJobModal from "./QuickPostJobModal";
import { Button } from "@mui/material";
import { useAppSelector } from "@/store/hooks";

export const PostFirstJobCard = ({ company }: { company: Company }) => {
  const { data: jobs } = useAppSelector((state) => state.companyJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);

  if (jobs.length > 0) return null;
  return (
    <Guard permissions={[Permission_Keys.Employer_ManageJobs]}>
      <QuickPostJobModal
        key={"body-post-job"}
        companyId={company.id}
        isOpen={isModalOpen}
        onClose={onClose}
      />
      <div className="relative rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
        <div className="flex flex-col items-center gap-2">
          {/* Centered Image */}
          <Image
            src={post}
            alt="Login Cover"
            width={50}
            height={50}
            priority={true}
          />

          {/* Typography below the Image */}
          <p className="mb-2 text-center text-sm text-muted-foreground">
            You haven&apos;t posted any jobs yet.
            <br />
            Post a job for free and start attracting candidates.
          </p>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center">
          <Button onClick={onOpen} variant="contained">
            Post a job for free
          </Button>
        </div>
      </div>
    </Guard>
  );
};

export default PostFirstJobCard;
