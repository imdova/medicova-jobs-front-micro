"use client";

import { Avatar, AvatarGroup, Box, Container } from "@mui/material";
import RegisterForm from "./RegisterForm";
import Image from "next/image";

const users = [
  {
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    image: "https://randomuser.me/api/portraits/men/88.jpg",
  },
  {
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    image: "https://randomuser.me/api/portraits/men/64.jpg",
  },
  {
    image: "https://randomuser.me/api/portraits/men/24.jpg",
  },
];

const Register = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center pt-[60px] md:px-5">
      {/* Main Content */}
      <div className="container mx-auto my-2 flex items-center justify-between gap-5 lg:max-w-[1170px]">
        {/* Right Section: Register Form */}
        <RegisterForm />
        <div className="relative m-2 hidden max-h-[80%] min-h-[500px] flex-1 flex-col justify-between bg-gradient-to-b from-secondary to-primary md:flex">
          <div className="ml-6 mt-5 xl:ml-12">
            <h3>
              <span className="mr-20 text-[30px] font-bold text-primary-foreground xl:text-[42px]">
                Find new pathways
              </span>
              <br />
              <span className="mr-2 text-[30px] font-bold text-primary-foreground xl:text-[42px]">
                to
              </span>
              <span className="text-[30px] font-bold text-main xl:text-[42px]">
                Healthcare Professionals
              </span>
              <br />
              <span className="text-[30px] font-bold text-primary-foreground xl:text-[42px]">
                “
              </span>
            </h3>
            <p className="max-w-lg text-lg leading-9 text-primary-foreground xl:text-2xl">
              “Search for healthcare professionals from more than 300000 CVs.
              Use 35+ robust filters and shortlist candidates faster. Hire top
              talent faster and smarter. “
            </p>
          </div>
          <div className="m-8 mb-24 ml-[8%] max-w-[366px] bg-white p-6 pr-14">
            <h4 className="mb-2 text-lg font-bold text-main xl:text-2xl">
              Trusted by 12,000 organizations, including:
            </h4>
            <div className="flex flex-col items-center xl:flex-row">
              <p className="flex-1 text-muted-foreground xl:text-lg">
                Saudi German Hospital ,DAF Hospital Alsalam International
                Hospital
              </p>

              <AvatarGroup max={5}>
                {users.slice(0, 3).map((user, index) => (
                  <Avatar
                    key={index}
                    alt={`Avatar n°${index + 1}`}
                    src={user.image}
                    sx={{
                      width: 30,
                      height: 30,
                    }}
                  />
                ))}
                <Avatar
                  sx={{
                    backgroundColor: "#03353C",
                    color: "white",
                    width: 30,
                    height: 30,
                  }}
                >
                  +{users.length - 3}
                </Avatar>
              </AvatarGroup>
            </div>
          </div>

          {/* Background */}
          <div className="absolute right-10 top-1/3">
            <Image
              src="/images/vector-2.svg"
              alt="background"
              width={300}
              height={155}
            />
          </div>
          <div className="absolute bottom-0 left-0 h-20 w-20 bg-white"></div>
          <div className="absolute right-0 top-0 h-20 w-20 bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
