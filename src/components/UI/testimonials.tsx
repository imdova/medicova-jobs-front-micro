"use client";
import Image from "next/image";
import { Ellipse6, IdeaIcon } from "../icons/icons";
import { useState } from "react";

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <div className="flex justify-center gap-5">
        <ReviewCard />
        <ReviewCard className="hidden md:flex" />
      </div>
      <div className="flex justify-center gap-2 py-6">
        {[1, 2, 3].map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`${i === activeTab ? "bg-primary-foreground w-8" : "w-3 bg-gray-700"} h-3 rounded-full duration-300`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

const ReviewCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={`card relative flex w-full overflow-hidden rounded-[16px] bg-white md:h-[215px] md:w-[570px] ${className}`}
    >
      <Ellipse6 className="text-secondary absolute -bottom-5 -left-5 z-0 h-20 w-32 md:h-auto md:w-auto" />
      <IdeaIcon className="absolute left-3 top-0 z-0 md:left-9 md:top-3" />
      <Image
        src="/images/doc.png"
        alt="doc"
        width={213}
        height={260}
        className="z-[1] w-1/3 object-cover md:w-auto"
      />
      <div className="px-4 py-6">
        <h6 className="text-main text-2xl font-semibold">Dr, Adam mark</h6>
        <p className="text-muted-foreground text-lg font-semibold">Specialist</p>
        <p className="text-muted-foreground my-6">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy
        </p>
      </div>
    </div>
  );
};
