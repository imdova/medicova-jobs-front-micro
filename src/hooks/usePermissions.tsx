import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDepartments } from "@/store/slices/departments.slice";
import { fetchPermissions } from "@/store/slices/permissions";
import { fetchRolesByUserType } from "@/store/slices/roles.slice";
import { useEffect } from "react";

export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const { data: roles } = useAppSelector((state) => state.roles);
  const { data: permissions } = useAppSelector((state) => state.permissions);
  const { data: departments } = useAppSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchRolesByUserType({ userType: "admin" }));
    dispatch(fetchPermissions("admin"));
    dispatch(fetchDepartments());
  }, [dispatch]);

  return {
    permissions,
    roles,
    departments,
  };
};
