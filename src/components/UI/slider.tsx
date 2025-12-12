"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export interface StoryType {
  _id: string;
  image: string;
  start?: string;
  end?: string;
  url?: string;
}
const Slider = ({ stories = [] }: { stories: StoryType[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollLeft;
        const index = Math.round(
          scrollPosition / containerRef.current.offsetWidth,
        );
        setCurrentIndex(index);
      }
    };
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }
    const currentRef = containerRef.current;
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(scrollToNext, 5000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const scrollToNext = () => {
    const nextScrollIndex = (currentIndex + 1) % stories.length;
    if (containerRef.current) {
      const nextScrollLeft = containerRef.current.offsetWidth * nextScrollIndex;
      containerRef.current.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth",
      });
    }
  };
  const scrollToPrev = () => {
    if (containerRef.current && currentIndex > 0) {
      containerRef.current.scrollBy({
        left: -containerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="group relative aspect-[68/100] h-full w-full overflow-hidden sm:rounded-[35px]">
      <button
        onClick={scrollToPrev}
        className={`${currentIndex === 0 ? "hidden" : ""} absolute left-1 top-0 z-20 flex h-full w-10 items-center justify-center text-3xl`}
      >
        <div className="hidden h-6 w-6 items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white group-hover:flex">
          <ChevronRight />
        </div>
      </button>
      <div
        ref={containerRef}
        className="scroll-bar-hidden flex aspect-[68/100] h-full snap-x snap-mandatory flex-row overflow-x-auto"
      >
        {stories.map((story, index) => (
          <div
            key={index}
            className="relative aspect-[68/100] h-full min-w-full snap-center"
          >
            <Image
              src={story.image}
              alt="shop image"
              fill
              priority={index === 0}
              sizes="100%"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={scrollToNext}
        className={`${currentIndex === stories.length - 1 ? "hidden" : "hidden group-hover:flex"} absolute right-1 top-0 z-20 h-full w-10 items-center justify-center text-3xl`}
      >
        <div className="hidden h-6 w-6 items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white group-hover:flex">
          <ChevronLeft />
        </div>
      </button>
      <div className="absolute bottom-2 z-10 flex w-full justify-center gap-[2px]">
        {stories.map((_, index) => (
          <div key={index} className="w-full">
            <div
              className={` ${currentIndex === index ? "w-0 transition-[width] duration-[5s]" : "w-full"} h-[2px] ${index <= currentIndex ? "bg-white" : "bg-white/50"} ease-linear`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
