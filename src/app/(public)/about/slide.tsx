"use client"
import CompanyCard from "@/components/UI/CompanyCard"
import { Company } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const Slider: React.FC<{ companies: Company[] }> = ({ companies }) => {
    const [current, setCurrent] = useState(0);
    const visibleCards = 4;

    const nextSlide = () => {
        setCurrent(
            (prev) => (prev + 1) % (companies.length - (visibleCards - 1)),
        );
    };

    const prevSlide = () => {
        setCurrent(
            (prev) =>
                (prev - 1 + (companies.length - (visibleCards - 1))) %
                (companies.length - (visibleCards - 1)),
        );
    };
    return <div className="relative mb-4 w-full overflow-hidden rounded-2xl p-4">
        <div className="mb-8 flex justify-end gap-3">
            <div className="w-10">
                <button
                    onClick={prevSlide}
                    className="link-smooth flex h-10 w-10 items-center justify-center rounded-full border border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white hover:bg-secondary"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="w-10">
                <button
                    onClick={nextSlide}
                    className="link-smooth flex h-10 w-10 items-center justify-center rounded-full border border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white hover:bg-secondary"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
        <div className="flex w-full items-center justify-center">
            <div className="grid w-full grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-4">
                {companies
                    .slice(current, current + visibleCards)
                    .map((company, index) => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
            </div>
        </div>
    </div>
}

export default Slider