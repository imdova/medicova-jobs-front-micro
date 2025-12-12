import EmployersChart from "@/components/charts/employers-charts";
import FinanceCharts from "@/components/charts/finance-chart";
import JobCarts from "@/components/charts/jobs-chart";
import SeekerChart from "@/components/charts/seekers-charts";

const page = () => {
  return (
    <div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="relative min-h-[450px] rounded-base border bg-white shadow-soft">
          <FinanceCharts />
        </div>
        <div className="relative min-h-[450px] rounded-base border bg-white shadow-soft">
          <EmployersChart />
        </div>
        <div className="relative min-h-[450px] rounded-base border bg-white shadow-soft">
          <SeekerChart />
        </div>
        <div className="relative min-h-[450px] rounded-base border bg-white shadow-soft">
          <JobCarts />
        </div>
      </div>
    </div>
  );
};

export default page;
