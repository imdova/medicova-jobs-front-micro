import { AxisConfig, BarChart, ChartsXAxisProps } from "@mui/x-charts";

type ChartEarningsProps = {
  labelX: string;
};

const ChartEarnings: React.FC<ChartEarningsProps> = ({ labelX }) => {
  return (
    <>
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
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            barGapRatio: 0.8,
            categoryGapRatio: 0.5,
          } as AxisConfig<"band", unknown, ChartsXAxisProps>,
        ]}
        series={[
          {
            label: labelX,
            data: [
              2423, 2200, 2100, 2500, 1900, 2300, 2500, 1200, 800, 500, 1800,
              650,
            ],
            color: "#2ba149e5",
          },
        ]}
        height={250}
      />
    </>
  );
};

export default ChartEarnings;
