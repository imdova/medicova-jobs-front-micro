import Avatar from "@/components/UI/Avatar";
import DropMenu from "@/components/UI/drop-down";
import InfoBlock from "@/components/UI/info-block";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDrawer, setDefaultValues } from "@/store/slices/admins.slice";
import { Company } from "@/types";
import { AdminUser } from "@/types/admin";
import { Tooltip } from "@mui/material";
import { SquarePen } from "lucide-react";

const AdminOverViewCard: React.FC<{
  admins: AdminUser[];
  admin: AdminUser;
  superVisor?: AdminUser;
  companies?: Company[];
}> = ({ admins, admin, superVisor, companies }) => {
  const dispatch = useAppDispatch();
  const onEdit = () => {
    dispatch(setDefaultValues(admin));
    dispatch(openDrawer());
  };

  const { data: roles } = useAppSelector((state) => state.roles);
  const adminCompanies =
    companies?.filter((x) => admin.companyIds?.includes(x.id)) || [];

  const adminUsers =
    admins?.filter((x) => admin.adminIds?.includes(x.id)) || [];

  const adminRoles = roles?.filter((x) => admin.rolesIds?.includes(x.id)) || [];
  const permissions = adminRoles?.map((role) => role.permissions).flat();
  return (
    <div className="rounded-base border bg-white p-4 shadow-soft">
      <div className="relative flex justify-between">
        <div className="flex w-full flex-col items-center gap-6 lg:flex-row">
          <Avatar
            src={admin.avatar}
            size={120}
            alt={admin.firstName}
            // lastSeen={admin.lastSeen}
          />
          <div className="flex-1">
            {/* Header Section */}
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Company Name */}
              <div>
                <h2 className="max-w-[400px] text-center text-lg font-bold text-main lg:text-start">
                  {`${admin.firstName} ${admin.lastName}`}
                </h2>
                <h6 className="text-sm">
                  {admin.title || admin.rolesIds?.[0]}
                </h6>
              </div>
              {superVisor && (
                <InfoBlock
                  label="Super visor"
                  value={
                    <div className="flex flex-col gap-1">
                      <h6 className="line-clamp-1 cursor-pointer text-sm underline hover:text-primary hover:no-underline">
                        {superVisor?.firstName} {superVisor?.lastName}
                      </h6>
                      <div className="flex items-center gap-2 text-xs text-main">
                        <a
                          href={`mailto:${superVisor?.email}`}
                          className="text-xs underline hover:text-primary"
                        >
                          {superVisor?.email}
                        </a>
                        <a
                          href={`tel:${superVisor?.phone}`}
                          className="text-xs underline hover:text-primary"
                        >
                          {superVisor?.phone}
                        </a>
                      </div>
                    </div>
                  }
                />
              )}

              {/* Action Buttons */}

              <div className="flex">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 rounded-lg rounded-r-none border bg-white px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <SquarePen size={14} />
                  Quick Edit
                </button>
                <DropMenu
                  className="block min-w-0 rounded-lg rounded-l-none border border-gray-200 border-l-transparent p-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
                  options={[
                    {
                      label: "Assign Companies",
                      action: () => {},
                    },
                    {
                      label: "Assign Users",
                      action: () => {},
                    },
                    {
                      label: "Message",
                      action: () => {},
                    },
                    {
                      label: "force logout",
                      action: () => {},
                    },
                    {
                      label: "reset password",
                      action: () => {},
                    },
                    {
                      label: "Delete",
                      action: () => {},
                    },
                  ]}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-5 text-center sm:flex-row sm:justify-start sm:gap-8 sm:text-left">
              <InfoBlock
                label="Companies"
                value={<CompaniesList companies={adminCompanies} />}
              />
              <InfoBlock
                label="Users"
                value={
                  <CompaniesList
                    companies={adminUsers as unknown as Company[]}
                  />
                }
              />

              {admin.departmentId && (
                <InfoBlock label="Department" value={admin.departmentId} />
              )}
              <InfoBlock
                label="Permissions"
                value={permissions?.length || 0 + " permissions"}
              />

              {admin.created_at && (
                <InfoBlock
                  label="Date"
                  value={new Date(admin.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverViewCard;

const CompaniesList = ({ companies }: { companies: Company[] }) => {
  return (
    <div className="flex -space-x-3">
      {companies?.length === 0 && 0}
      {companies?.slice(0, 4)?.map((company) => (
        <Tooltip key={company.id} title={company.name}>
          <div className="rounded-full transition-all hover:z-10 hover:scale-125 hover:outline hover:outline-1 hover:outline-primary">
            <Avatar size={30} src={company.avatar} alt={company.name} />
          </div>
        </Tooltip>
      ))}
      {companies?.length > 4 ? (
        <Tooltip
          title={companies
            .slice(4)
            ?.map((company) => company.name)
            .join(", ")}
        >
          <div className="rounded-full transition-all hover:z-10 hover:scale-125 hover:outline hover:outline-1 hover:outline-primary">
            <Avatar
              className="bg-gray-300"
              size={30}
              fallback={"+" + (companies?.length - 4).toString() || ""}
            />
          </div>
        </Tooltip>
      ) : null}
    </div>
  );
};
