"use client";

import {
  API_GET_SEEKER_BY_USERNAME,
  API_GET_SEEKER_EDUCATION,
  API_RECALCULATE_COMPLETENESS,
} from "@/api/seeker";
import NotFoundPage from "@/app/not-found";
import useFetch from "@/hooks/useFetch";
import {
  Eye,
  ListOrdered,
  SquarePen,
  Mail,
  MessageSquare,
  MessageCircleMore,
  Phone,
  UsersRound,
  Bookmark,
  User,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Avatar from "@/components/UI/Avatar";
import Loading from "@/components/loading/loading";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { formatName } from "@/util";
import {
  calculateAge,
  formatLocation,
  getExperienceDetail,
  getOptionLabel,
  getProgressColor,
} from "@/util/general";
import { nationalitiesOptions } from "@/constants";
import InfoBlock from "@/components/UI/info-block";
import useUpdateApi from "@/hooks/useUpdateApi";
import { ChatInitiatorEnum, ChatParticipantEnum } from "@/types/chat";
import { useSession } from "next-auth/react";
import { API_START_CHAT } from "@/api/general";
import FormModal from "@/components/form/FormModal/FormModal";
import { FieldConfig } from "@/types";
import EditSeekerModal from "@/components/admin/forms/EditSeekerModal";
import ApplicationList from "@/components/admin/lists/ApplicationList";
import { ApplicationsType, EducationData, UserProfile } from "@/types/seeker";
import OverViewPublicProfile from "./OverViewPublicProfile";

interface SingleUserProps {
  params: {
    slug: string;
  };
}

type Tab = "seeker-overview" | "job-applications";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "seeker-overview",
    title: "Job Seeker Overview",
    icon: <User className="h-4 w-4" />,
  },
  {
    key: "job-applications",
    title: "Job Applications",
    icon: <ListOrdered className="h-4 w-4" />,
  },
];

const fields: FieldConfig[] = [
  {
    name: "message",
    label: "Message",
    type: "textArea",
  },
];

export default function SingleSeekerOverview({ params }: SingleUserProps) {
  const slug = params.slug;
  const { data: session } = useSession();
  const user = session?.user;
  const {
    data: seeker,
    setData,
    loading,
  } = useFetch<UserProfile>(API_GET_SEEKER_BY_USERNAME + slug, {
    defaultLoading: true,
  });
  const { data: educations } = useFetch<EducationData[]>(
    seeker?.id ? API_GET_SEEKER_EDUCATION + seeker?.id : null,
  );

  const { data: percentage } = useFetch<number>(
    seeker?.id
      ? API_RECALCULATE_COMPLETENESS + seeker?.id + "/completence"
      : null,
  );

  const [activeTab, setActiveTab] = useState<Tab>("seeker-overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Messages
  const [userToSend, setUserToSend] = useState<
    ApplicationsType["applicant"] | null
  >(null);
  const onClose = () => setUserToSend(null);
  const { update, isLoading, error } = useUpdateApi();
  const sendMessage = async (formData: any) => {
    if (!user || !userToSend) return;
    const body = {
      initiatorId: user.id,
      participantId: userToSend.id,
      initiatorType: "system_admin" as ChatInitiatorEnum,
      participantType: "seeker" as ChatParticipantEnum,
      messageText: formData.message,
      senderUserId: user.id,
    };
    await update(API_START_CHAT, {
      method: "POST",
      body,
    });
    onClose();
  };

  /// data
  const age = seeker?.birthDate
    ? calculateAge(new Date(seeker?.birthDate))
    : "";
  const nationality = getOptionLabel(
    nationalitiesOptions,
    seeker?.nationality || "",
  );
  const title = getExperienceDetail(seeker?.title || "");
  const lastEducation = educations?.length ? educations[0] : null;

  const progressColor = getProgressColor(percentage || 0);

  const menuItems = [
    {
      id: 1,
      title: "Send Email",
      icon: <Mail size={16} className="text-green-500" />,
      action: () => (window.location.href = `mailto:${seeker?.email}`),
    },
    {
      id: 2,
      title: "Send Web Message",
      icon: <MessageSquare size={16} className="text-green-500" />,
      action: () =>
        setUserToSend(seeker as unknown as ApplicationsType["applicant"]),
    },
    {
      id: 3,
      title: "Chat on WhatsApp",
      icon: <MessageCircleMore size={16} className="text-green-500" />,
      action: () => window.open(`https://wa.me/${seeker?.whatsapp}`, "_blank"),
    },
    {
      id: 4,
      title: "Call",
      icon: <Phone size={16} className="text-green-500" />,
      action: () => (window.location.href = `tel:${seeker?.phone}`),
    },
  ];

  if (loading) return <Loading />;
  if (!seeker) return <NotFoundPage />;
  return (
    <>
      <EditSeekerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={seeker}
        onSave={setData}
      />
      {userToSend && (
        <FormModal
          open={Boolean(userToSend)}
          onClose={onClose}
          error={error?.message}
          loading={isLoading}
          onSubmit={sendMessage}
          fields={fields}
          description={
            <div className="flex items-center gap-2">
              <Avatar
                size={60}
                src={userToSend.avatar}
                alt={userToSend.firstName + "image"}
              />
              <div>
                <h6 className="font-bold hover:underline">
                  {formatName(userToSend, true)}
                </h6>
                <p className="text-sm font-thin text-muted-foreground">
                  {getExperienceDetail(userToSend.title || "")}
                </p>
              </div>
            </div>
          }
          submitButtonText={
            <div className="flex items-center gap-2">
              Send
              <Send className="h-4 w-4" />
            </div>
          }
        />
      )}
      <div className="my-8 w-full space-y-3 px-4 md:px-5">
        {/* Tab Buttons */}
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <div className="flex flex-1 flex-col items-center justify-between overflow-hidden rounded-base border border-gray-200 shadow-soft sm:flex-row md:items-center">
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              aria-label="responsive tabs example"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  value={tab.key}
                  label={
                    <span className="flex items-center gap-2 text-xs">
                      {tab.icon}
                      {tab.title}
                    </span>
                  }
                />
              ))}
            </Tabs>
          </div>
        </div>

        <div className="rounded-base border bg-white p-4 shadow-soft">
          <div className="relative flex justify-between">
            <div className="flex w-full flex-col items-center gap-6 lg:flex-row">
              <Avatar
                src={seeker.avatar}
                size={120}
                alt={`${formatName(seeker, true)}'s logo`}
              />
              <div className="flex-1">
                {/* Header Section */}
                <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Company Name */}
                  <div>
                    <h2 className="max-w-[400px] text-center text-lg font-bold text-main lg:text-start">
                      {formatName(seeker, true)}
                    </h2>
                    <h6 className="text-sm">{title}</h6>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition hover:border-primary hover:text-primary"
                    >
                      <SquarePen size={14} />
                      Edit
                    </button>

                    <Link
                      href={`/me/${seeker.userName}`}
                      className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition hover:border-primary hover:text-primary"
                    >
                      <Eye size={14} />
                      View Profile
                    </Link>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col gap-5 text-center sm:flex-row sm:justify-start sm:gap-8 sm:text-left">
                  {formatLocation(seeker) && (
                    <InfoBlock
                      label="Location"
                      value={formatLocation(seeker)}
                    />
                  )}

                  {age && <InfoBlock label="Age" value={age} />}

                  {nationality && (
                    <InfoBlock label="nationality" value={nationality} />
                  )}
                  {lastEducation && (
                    <InfoBlock
                      label="Education"
                      value={lastEducation.program}
                    />
                  )}

                  {seeker.created_at && (
                    <InfoBlock
                      label="Date"
                      value={new Date(seeker.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    />
                  )}
                  {/* {percentage && (
                    <InfoBlock
                      value={
                        
                      }
                    />
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#E4F8FFE5] text-[#55BEE6]">
              <UsersRound size={20} />
            </div>
            <div>
              <span className="block text-sm">Jobs Applided</span>
              <h1 className="font-bold">1,245</h1>
              <span className="block text-xs text-primary">
                +12% from last month
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#DCFCE7] text-[#008236]">
              <Bookmark size={20} />
            </div>
            <div>
              <span className="block text-sm">Saved Jobs</span>
              <h1 className="font-bold">450</h1>
              <span className="block text-xs text-primary">
                +8% from last month
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10">
              <div className="grid h-[45px] w-[45px] grid-cols-1 grid-rows-1">
                <CircularProgress
                  variant="determinate"
                  value={percentage || 0}
                  size={45}
                  sx={{
                    color: progressColor,
                  }}
                  className="col-start-1 row-start-1"
                />
                <div className="col-start-1 row-start-1 flex items-center justify-center">
                  <span className="font-black" style={{ color: progressColor }}>
                    {percentage || 0}%
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="block text-sm">Profile Completeness</span>
              <h1 className="font-bold">{percentage || 0}%</h1>
            </div>
          </div>
        </div>
        {activeTab === "seeker-overview" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <div className="lg:col-span-5">
              <ApplicationList seekerId={seeker?.id} />
              {/* Job applications Panel */}

              {/* Activity Panel */}
            </div>
            <div className="space-y-4 lg:col-span-2">
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <OverViewPublicProfile user={seeker} onUpdate={setData} />
              </div>

              <div className="overflow-hidden rounded-base border bg-white shadow-soft">
                <div className="p-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="flex w-full items-center px-4 py-3 text-left transition-colors duration-150 hover:bg-gray-50"
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium text-gray-800">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "job-applications" && (
          <ApplicationList seekerId={seeker?.id} />
        )}
      </div>
    </>
  );
}
