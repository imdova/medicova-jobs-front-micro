import React, { Suspense } from "react";
import Link from "next/link";
import SearchForm from "@/components/UI/search-form";

// Example frequent and recent search topics
const frequentSearchTopics = [
  "Registered Nurses",
  "Physician Assistants",
  "Therapists",
  "Medical Technicians",
  "Healthcare Administrators",
];

const recentSearchTopics: string[] = []; // Example: Change this to test recent searches

const SearchPage = () => {
  return (
    <div>
      <div className="bg-[url('/images/search-background.jpg')] bg-cover bg-center">
        <div className="bg-gradient-to-b from-secondary/80 to-primary/70 px-4 pt-[70px] shadow-md">
          <div className="container mx-auto my-8 flex w-full flex-col gap-3 p-2 md:flex-row lg:max-w-[1170px]">
            <p className="mb-4 w-full text-center !font-dmSerifDisplay text-[26px] text-white md:w-1/4 md:text-left">
              Discover more than 2 million healthcare Providers CVs
            </p>
            <div className="w-full md:w-3/4">
              <Suspense>
                <SearchForm
                  fields={["Search"]}
                  button={"Search CVs"}
                  pathname="/employer/search"
                />
              </Suspense>
              <p className="my-4 text-white">
                Struggling to find the right candidate for your role? Search our
                database of over 2 million healthcare professionals and connect
                with your next top hire.
              </p>
              <div className="mt-8 flex flex-col gap-4 md:flex-row">
                <h6 className="mb-4 text-white">
                  {recentSearchTopics.length > 0
                    ? "Recent Search Topics"
                    : "Frequent Search Topics"}
                </h6>

                <ul className="group flex flex-row flex-wrap gap-2">
                  {(recentSearchTopics.length > 0
                    ? recentSearchTopics
                    : frequentSearchTopics
                  ).map((topic, index) => (
                    <li key={index}>
                      <Link href={`/employer/search?q=${topic}`}>
                        <button className="rounded-full border border-white p-2 px-4 text-white duration-300 hover:!opacity-100 group-hover:opacity-20">
                          {topic}
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
    </div>
  );
};

export default SearchPage;
