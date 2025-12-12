import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel, { SpecialtyCard } from "@/components/UI/Carousel";
import Rating from "@/components/UI/Rating";
import { Button, Tab, Tabs } from "@mui/material";
import HomeHeader from "@/components/home/HomeHeader";
import SectionTitle from "@/components/home/SectionTitle";
import { ArrowRight, ChevronRight } from "lucide-react";
import YouTubePlayer from "@/components/UI/youtube-video-player";
import Footer from "@/components/Layout/Footer/footer";
import { adsSection, callToActionSection, hiringCompaniesSection, howWorks, JobCategoriesSection, statsSection, videoSection } from "@/constants/pages/home";
import FeaturedJobs from "@/components/pages/home/FeaturedJobs";
import SummarizedJobs from "@/components/pages/home/summrizedJobs";



const HomePage = () => {

  return (
    <div>
      <HomeHeader />
      <main>
        {/* featuredSection */}
        <Suspense fallback={<div>Loading...</div>}>
          <FeaturedJobs />
        </Suspense>
        {/* statsSection */}
        <div className="my-4 flex flex-wrap justify-center gap-8 bg-[#0B2441] p-6 text-white md:flex-nowrap">
          <div className="flex justify-center gap-2 border-r border-gray-500 pr-4">
            <p>{statsSection.rating.text}</p>
            <Rating rating={statsSection.rating.value} size={14} />
            <div className="flex gap-2">
              <svg
                width={20}
                className={"ms-1 fill-current"}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              {statsSection.rating.source}
            </div>
          </div>
          {statsSection.stats.map((stat, index) => (
            <div key={index} className="flex justify-center gap-2 pr-4">
              {stat}
            </div>
          ))}
        </div>
        {/* Discover Who is hiring on */}
        <div className="pt-16">
          <SectionTitle
            title={hiringCompaniesSection.title.text}
            featured={hiringCompaniesSection.title.featured}
          />
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee flex min-w-[2000px] whitespace-nowrap py-12">
              {hiringCompaniesSection.companies.map((company, index) => (
                <Image
                  key={index}
                  src={company.src}
                  alt={company.name}
                  height={200}
                  width={200}
                  className="h-[200px] w-[200px] object-contain"
                />
              ))}
            </div>
            <div className="animate-marquee2 absolute top-0 flex min-w-[2000px] whitespace-nowrap py-12">
              {hiringCompaniesSection.companies.map((company, index) => (
                <Image
                  key={index}
                  src={company.src}
                  alt={company.name}
                  height={200}
                  width={200}
                  className="h-[200px] w-[200px] object-contain"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Call to Action Section */}
        <div className="flex flex-col justify-between bg-[#E5F1D7] md:flex-row">
          <div className="flex flex-1 flex-col items-center justify-center p-6 py-10">
            <h5 className="text-xl font-semibold">{callToActionSection.leftSection.title}</h5>
            <p className="text-muted-foreground">
              {callToActionSection.leftSection.description}
            </p>
            <Button
              LinkComponent={Link}
              href={callToActionSection.leftSection.button.href}
              variant="contained"
              className="mt-4"
            >
              {callToActionSection.leftSection.button.text}
            </Button>
          </div>
          <div
            style={{
              clipPath: "polygon(80px 0, 0 80px, 0 100%, 100% 100%, 100% 0)",
            }}
            className="flex flex-1 flex-col items-center justify-center bg-[#D2E7BB] p-6 py-10"
          >
            <h5 className="text-xl font-semibold">
              {callToActionSection.rightSection.title}
            </h5>
            <p className="text-muted-foreground">{callToActionSection.rightSection.description}</p>
            <Button
              LinkComponent={Link}
              href={callToActionSection.rightSection.button.href}
              variant="contained"
              className="mt-4"
            >
              {callToActionSection.rightSection.button.text}
            </Button>
          </div>
        </div>

        <SummarizedJobs />

        <div className="relative aspect-[16/4] w-full bg-gray-300">
          <Image
            src={adsSection.HOME_PAGE_HORIZONTAL_BANNER_1.image}
            alt="Banner"
            fill
            className="object-cover"
          />
        </div>

        <div className="bg-opacity-10 bg-[url('/images/specialty-bg.png')] bg-cover bg-center">
          <div className="bg-neutral-100/60">
            <div className="container mx-auto  p-2 pt-16 lg:max-w-[1170px]">
              <div className="flex justify-center p-4">
                <div className="rounded-full bg-primary px-6 py-2 text-primary-foreground">
                  {JobCategoriesSection.label}
                </div>
              </div>
              <SectionTitle title={JobCategoriesSection.title.text} featured={JobCategoriesSection.title.featured} />
              <p className="mx-auto mb-16 max-w-[700px] text-center text-2xl text-muted-foreground">
                {JobCategoriesSection.description}
              </p>

              {/* TODO Improve this cards */}
              <div className="mb-6 grid grid-cols-1 grid-rows-1">
                <div className="z-[1] col-start-1 row-start-1 w-full rounded-full bg-gray-50 p-4">
                  <div className="flex items-center">
                    <Carousel
                      items={JobCategoriesSection.specialists}
                      CustomCard={SpecialtyCard}
                      responsive={[
                        { breakpoint: 640, itemsToShow: 1 }, // Extra small screens
                        { breakpoint: 1024, itemsToShow: 3 }, // Small screens
                        { breakpoint: Infinity, itemsToShow: 6 }, // Medium screens
                      ]}
                    />
                  </div>
                </div>
                <div className="z-0 col-start-1 row-start-1 h-full w-full translate-y-2 rounded-full bg-primary"></div>
              </div>
              <h5 className="mt-10 text-center text-4xl font-semibold text-main">
                {JobCategoriesSection.popularSearchesTitle}
              </h5>
              <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
                {JobCategoriesSection.popularSearches.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="rounded-full border border-gray-400 px-4 py-2 transition-colors duration-300 hover:bg-primary hover:text-white focus:ring-2 focus:ring-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto px-6 lg:max-w-[1170px]">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Video Thumbnail */}

              <div className="flex aspect-video w-full justify-center rounded-3xl border-2 border-dotted border-primary p-2">
                <YouTubePlayer
                  className="-translate-x-5 translate-y-5"
                  thumbnailUrl={videoSection.video.thumbnailUrl}
                  videoUrl={videoSection.video.videoUrl}
                />
              </div>
              {/* Text Content */}
              <div className="space-y-6">
                <span className="rounded-full bg-primary px-4 py-2 text-white">
                  {videoSection.content.label}
                </span>
                <h3 className={"max-w-[350px] text-3xl font-bold"}>
                  {videoSection.content.title.text.split(videoSection.content.title.highlight.text)[0]}
                  <span
                    className={"bg-primary px-6 py-3 text-xl text-white"}
                    style={{
                      borderRadius: "92% 8% 93% 7% / 10% 86% 14% 90%",
                      display: "inline-block",
                    }}
                  >
                    {videoSection.content.title.highlight.text}
                  </span>
                  {videoSection.content.title.text.split(videoSection.content.title.highlight.text)[1]}
                </h3>
                <p className="text-muted-foreground">
                  {videoSection.content.description}
                </p>
                <ul className="my-4 space-y-4">
                  {videoSection.content.features.map((feature, index) =>
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                          <ChevronRight size={16} />
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        {feature}
                      </span>
                    </li>
                  )}
                </ul>
                <a href={videoSection.content.button.linkUrl} className="flex w-fit items-center gap-3 rounded-full bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700">
                  {videoSection.content.button.text}<ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="relative aspect-[16/4] w-full bg-gray-300">
          <Image
            src={adsSection.HOME_PAGE_HORIZONTAL_BANNER_2.image}
            alt={adsSection.HOME_PAGE_HORIZONTAL_BANNER_2.name}
            fill
            className="object-cover"
          />
        </div>
        {/* Discover who is hiring on Medicova */}
        <section className="bg-[url('/images/jobs-background.jpg')] bg-cover bg-center">
          <div className="bg-white/80 px-4 py-16 sm:px-6 lg:px-8">
            <div className="container mx-auto px-2 text-center lg:max-w-[1170px]">
              <SectionTitle
                title={howWorks.title.text}
                featured={howWorks.title.featured}
              />
              <p className="mx-auto max-w-xl text-gray-600">{howWorks.description}</p>

              {/* Steps with connecting lines */}
              <div className="relative mb-20">
                <div className="flex flex-col gap-8 md:flex-row">
                  {howWorks.steps.map((step, index) => (
                    <div
                      key={index}
                      className="z-10 flex flex-1 flex-col items-center lg:[&:nth-child(2)]:mt-28"
                    >
                      <div className="relative">
                        <Image
                          className="rounded-full"
                          src={step.image}
                          width={200}
                          height={200}
                          alt=""
                        />
                        <div className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  ))}
                  <Image
                    className="absolute bottom-40 left-72 hidden h-40 w-72 lg:block"
                    src={"/images/Ellipse1.png"}
                    width={200}
                    height={200}
                    alt=""
                  />
                  <Image
                    className="absolute bottom-44 right-64 hidden h-40 w-80 lg:block"
                    src={"/images/Ellipse2.png"}
                    width={200}
                    height={200}
                    alt=""
                  />
                </div>
              </div>
              {/* Stats */}
              <div className="flex flex-col items-center justify-between rounded-2xl bg-[#4CAF50] p-4 shadow-md sm:flex-row">
                {howWorks.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-grow flex-col items-center justify-center border-[#ffffff4b] p-8 text-4xl text-white last-of-type:border-none sm:border-r"
                  >
                    <h2 className="text-5xl font-medium text-white">
                      {stat.value}
                    </h2>
                    <span className="block text-xs text-white">
                      {stat.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
