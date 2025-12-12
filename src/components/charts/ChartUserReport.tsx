import { AxisConfig, BarChart, ChartsXAxisProps } from "@mui/x-charts";

type ChartUserProps = {
  labelX: string;
  category: string[];
  endPoint: string;
  newEmployers: number[];
};

const ChartUserReport: React.FC<ChartUserProps> = ({
  labelX,
  category,
  newEmployers,
  endPoint,
}) => {
  return (
    <>
      <div className="flex w-full items-center justify-between p-4">
        <div>
          <span className="text-muted-foreground mb-2">Statistics</span>
          <h2>Employer Report</h2>
        </div>
        {/* <NestedMenu /> */}
      </div>
      <BarChart
        sx={{
          ".MuiChartsAxis-line": {
            display: "none",
          },

          ".MuiChartsAxis-tick": {
            display: "none",
          },
          ".MuiChartsAxis-tickLabel tspan": {
            fontSize: "8px",
          },
        }}
        margin={{ top: 30 }}
        grid={{ horizontal: true }}
        borderRadius={6} // Adds rounded corners
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
            hidden: true,
          }, //  Positions the legend at the bottom-middle and aligns it in a row.
        }}
        xAxis={[
          {
            id: "months",
            scaleType: "band",
            data: category,
            barGapRatio: 0.8,
            categoryGapRatio: 0.6,
          } as AxisConfig<"band", unknown, ChartsXAxisProps>,
        ]}
        series={[
          {
            label: labelX,
            data: newEmployers, // Data matches each x-axis category
            color: "#2ba149e5",
          },
        ]}
        height={400}
      />
    </>
  );
};

export default ChartUserReport;
