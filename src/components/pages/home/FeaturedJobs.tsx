import SectionTitle from "@/components/home/SectionTitle";
import MinJobCard from "@/components/UI/job-card-min";
import { adsSection, featuredSection } from "@/constants/pages/home";
import { searchJobs } from "@/lib/actions/job.actions";
import Image from "next/image";
import React from "react";

const FeaturedJobs = async () => {
    const result = await searchJobs(featuredSection.jobsFilter);
    const { data: jobs } = result.data || { data: [] };


    return <div className="bg-opacity-10 bg-[url('/images/specialty-bg.png')] bg-cover bg-center">
        <div className="bg-neutral-100/60">
            <div className="container mx-auto p-2 pt-16 lg:max-w-[1170px]">
                <SectionTitle
                    title={featuredSection.title.text}
                    featured={featuredSection.title.featured}
                />
                <div className="flex gap-3">
                    <div className="hidden w-1/4 space-y-3 md:block">
                        <div className="aspect-[9/16] w-full">
                            <a href={adsSection.HOME_PAGE_VERTICAL_BANNER_1.link}>
                                <Image
                                    src={adsSection.HOME_PAGE_VERTICAL_BANNER_1.image}
                                    alt="ad"
                                    height={600}
                                    width={400}
                                    className="h-full w-full rounded-base object-cover"
                                />
                            </a>
                        </div>
                        <div className="aspect-square w-full">
                            <a href={adsSection.HOME_PAGE_VERTICAL_BANNER_2.link}>
                                <Image
                                    src={adsSection.HOME_PAGE_VERTICAL_BANNER_2.image}
                                    alt="ad"
                                    height={600}
                                    width={400}
                                    className="h-full w-full rounded-base object-cover"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="grid h-fit grid-cols-2 gap-3 md:w-3/4 md:grid-cols-3">
                        {jobs.map((job) => (
                            <MinJobCard key={job.id} item={job} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

export default FeaturedJobs;