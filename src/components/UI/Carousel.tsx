"use client";
import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import { CompanyItem, Specialty } from "@/types";
import Link from "next/link";

interface DefaultCarouselItem {
  id: string | number;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  title: string;
  description: string;
}

interface ResponsiveBreakpoint {
  breakpoint: number;
  itemsToShow: number;
}

interface CarouselProps<T> {
  items: T[];
  responsive?: ResponsiveBreakpoint[];
  defaultItemsToShow?: number;
  className?: string;
  cardClassName?: string;
  navigationButtonClassName?: string;
  CustomCard?: React.ComponentType<{ item: T }>;
}

const defaultResponsive: ResponsiveBreakpoint[] = [
  { breakpoint: 768, itemsToShow: 1 }, // mobile
  { breakpoint: 1024, itemsToShow: 2 }, // tablet
  { breakpoint: Infinity, itemsToShow: 3 }, // desktop
];

const Carousel = <T extends { id: string | number }>({
  items,
  responsive = defaultResponsive,
  defaultItemsToShow = 3,
  className = "relative w-full overflow-hidden",
  cardClassName = "rounded-[10px] bg-white p-[15px]",
  navigationButtonClassName = "m-2 md:m-4 h-fit rounded-full bg-secondary p-3 md:p-6 text-white duration-300 hover:bg-primary",
  CustomCard,
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(defaultItemsToShow);

  useEffect(() => {
    const updateItemsToShow = () => {
      const screenWidth = window.innerWidth;
      // Sort breakpoints in ascending order
      const sortedBreakpoints = [...responsive].sort(
        (a, b) => a.breakpoint - b.breakpoint,
      );

      // Find the appropriate breakpoint for current screen width
      const activeBreakpoint = sortedBreakpoints.find(
        (bp) => screenWidth <= bp.breakpoint,
      );
      // If no breakpoint matches (shouldn't happen with Infinity), use the last one
      setItemsToShow(activeBreakpoint?.itemsToShow || defaultItemsToShow);
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [responsive, defaultItemsToShow]);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + itemsToShow;
      if (nextIndex >= items.length) {
        return 0;
      }
      if (nextIndex + itemsToShow > items.length) {
        return items.length - itemsToShow;
      }
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - itemsToShow;
      if (prevIndex < 0) {
        if (items.length >= itemsToShow) {
          const lastPossibleIndex = items.length - itemsToShow - prev;
          return Math.max(0, lastPossibleIndex);
        }
        return 0;
      }
      return prevIndex;
    });
  };

  useEffect(() => {
    if (currentIndex + itemsToShow > items.length) {
      const newIndex = Math.max(0, items.length - itemsToShow);
      setCurrentIndex(newIndex);
    }
  }, [items.length, itemsToShow, currentIndex]);

  const getVisibleItems = () => {
    let visibleItems = items.slice(currentIndex, currentIndex + itemsToShow);
    if (visibleItems.length < itemsToShow) {
      const remainingCount = itemsToShow - visibleItems.length;
      visibleItems = [...visibleItems, ...items.slice(0, remainingCount)];
    }
    return visibleItems;
  };

  // Default card now checks if the item has the required properties

  const MinimalCard = ({ item }: { item: T }) => {
    const defaultItem = item as unknown as DefaultCarouselItem;
    return (
      <div
        className={cardClassName}
        style={{ flex: `0 0 ${100 / itemsToShow}%` }}
      >
        <h6>{defaultItem.title}</h6>
        <p>{defaultItem.description}</p>
      </div>
    );
  };

  const getCardComponent = () => {
    if (CustomCard) {
      return CustomCard;
    }
    return MinimalCard;
  };

  const CardComponent = getCardComponent();
  const visibleItems = getVisibleItems();

  if (items.length === 0) {
    return null;
  }

  const showNavigation = items.length > itemsToShow;

  return (
    <div className={className}>
      <div className="flex items-center justify-center px-[35px] md:px-[75px]">
        {visibleItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`w-full px-2`}
            style={{ width: `${100 / itemsToShow}%` }}
          >
            <CardComponent item={item} />
          </div>
        ))}
      </div>

      {showNavigation && (
        <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between">
          <IconButton
            onClick={handlePrev}
            className={navigationButtonClassName}
            disabled={currentIndex === 0 && items.length <= itemsToShow}
          >
            <ArrowBack className="h-4 w-4 md:h-5 md:w-5" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            className={navigationButtonClassName}
            disabled={
              currentIndex + itemsToShow >= items.length && currentIndex === 0
            }
          >
            <ArrowForward className="h-4 w-4 md:h-5 md:w-5" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Carousel;

export const SpecialtyCard: React.FC<{ item: Specialty }> = ({ item }) => {
  const { image, jobsNumber, link, title } = item;
  return (
    <div className="mx-auto flex w-36 flex-col items-center justify-center text-center">
      <div className="bg-primary text-primary-foreground block h-fit w-fit rounded-full p-6">
        <Image
          src={image}
          width={80}
          height={80}
          alt="specialty icon "
          className="h-20 w-20"
        />
      </div>
      <h6 className="my-1 text-xl font-bold">{title}</h6>
      <p className="text-secondary text-sm">{jobsNumber} jobs available</p>
      <Link href={link} className="text-muted-foreground group hover:underline">
        View all{" "}
        <ArrowForward className="text-secondary transition-transform duration-300 group-hover:translate-x-2" />
      </Link>
    </div>
  );
};

export const CompanyCard = ({ item }: { item: CompanyItem }) => {
  return (
    <div className="mb-8 rounded-[10px] bg-white p-[15px] shadow-xl">
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          width={280}
          height={180}
          className="aspect-[350/240] w-full rounded-[5px] border border-gray-100 object-cover shadow-lg"
        />
      )}
      <h6 className="text-main my-3 text-2xl font-semibold">{item.title}</h6>
      <p className="text-muted-foreground mb-4">{item.description}</p>
      <div className="mb-4">
        <span className="border-secondary text-secondary rounded-full border px-4 py-2">
          {item.tag}
        </span>
      </div>
    </div>
  );
};
