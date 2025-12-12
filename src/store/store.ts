import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./slices/companySlice";
import { locationReducer } from "./slices/locationSlice";
import { modalReducer } from "./slices/modalSlice";
import { companyJobsReducer } from "./slices/jobSlice";
import { jobApplicationsReducer } from "./slices/applications.slice";
import { industryReducer } from "./slices/industriesSlice";
import { savedJobsReducer } from "./slices/savedJobs.slice";
import { permissionsReducer } from "./slices/permissions";
import { rolesReducer } from "./slices/roles.slice";
import { toastReducer } from "./slices/toastSlice";
import { sectorReducer } from "./slices/sectorsSlice";
import { notificationsReducer } from "./slices/notificationsSlice";
import { brandingReducer } from "./slices/brandingSlice";
import { userProfileReducer } from "./slices/profileSlice";
import { experienceReducer } from "./slices/experience.slice";
import { educationReducer } from "./slices/education.slice";
import { coursesReducer } from "./slices/courses.slice";
import { skillReducer } from "./slices/skills.slice";
import { activityReducer } from "./slices/activity.slice";
import { adminsReducer } from "./slices/admins.slice";
import { departmentsReducer } from "./slices/departments.slice";
import { companiesReducer } from "./slices/companies.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      company: companyReducer,
      profile: userProfileReducer,
      experience: experienceReducer,
      education: educationReducer,
      courses: coursesReducer,
      skills: skillReducer,
      activity: activityReducer,
      companyJobs: companyJobsReducer,
      location: locationReducer,
      industry: industryReducer,
      modal: modalReducer,
      jobApplications: jobApplicationsReducer,
      savedJobs: savedJobsReducer,
      permissions: permissionsReducer,
      roles: rolesReducer,
      departments: departmentsReducer,
      toast: toastReducer,
      sector: sectorReducer,
      branding: brandingReducer,
      notifications: notificationsReducer,

      /// admin
      admins: adminsReducer,
      companies: companiesReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
