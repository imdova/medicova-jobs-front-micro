"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchForm from "@/components/UI/search-form";

const popularJobSearches = [
  {
    title: "Pediatric Consultant",
    href: "/search?q=Pediatric Consultant",
  },
  {
    title: "ICU Nurse",
    href: "/search?q=ICU Nurse",
  },
  {
    title: "Obsteric Consultant Saudi Arabia",
    href: "/search?q=Obsteric+Consultant&country=SA",
  },
  {
    title: "Internal Medicine Registrar Oman",
    href: "/search?q=Internal Medicine&country=OM",
  },
];

const HomeHeader = () => {
  return (
    <div className="bg-[url('/images/search-background.jpg')] bg-cover bg-center">
      <div className="bg-gradient-to-b from-secondary/80 to-primary/70 p-4 shadow-md">
        <div className="container mx-auto mt-[70px] flex flex-col-reverse items-center gap-6 p-4 lg:max-w-[1170px] lg:flex-row">
          <div className="col-span-4 md:col-span-3">
            <h2 className="mb-6 text-[45px] font-black leading-none text-primary-foreground md:text-[60px]">
              <span className="text-[45px] font-black text-main md:text-[60px]">
                Discover
              </span>{" "}
              More <br />
              Than 5000
              <span className="text-[45px] font-black text-main md:text-[60px]">
                {" "}
                + Jobs
              </span>{" "}
            </h2>
            <Suspense>
              <SearchForm pathname="/search" fields={["Search", "Country"]} />
            </Suspense>
            <p className="mt-4 text-gray-100">
              {" "}
              <span className="font-bold text-primary-foreground">
                Popular
              </span>{" "}
              : Medical Claims Officer,Dental Designer, Healthcare- Presales
              specialist, Medical Ambassador
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-nowrap">
              {popularJobSearches.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="rounded-full border border-white px-4 py-2 text-sm text-primary-foreground transition-colors duration-300 hover:bg-white hover:text-primary focus:ring-2 focus:ring-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <Image
            src="/images/hero.png"
            alt="search background"
            width={400}
            height={400}
            className="col-span-1 h-auto w-[300px] object-contain md:w-[250px] xl:w-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
