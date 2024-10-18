import { useRef, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  excelDataType,
  FilterCategoryType,
  FiltersType,
} from "../types/custTypes";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import { paredExcelDateCode } from "../helper";
import { LiaEthereum } from "react-icons/lia";
import { isAfter, isBefore, parse } from "date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  zoomPlugin
);

type LineChatPagePropsType = {
  excelData: excelDataType[];
  category: string;
  filters: FiltersType[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
};

const LineChart: React.FC<LineChatPagePropsType> = ({
  excelData,
  category,
  filters,
  dateRange,
}) => {
  const chartRef = useRef(null);

  let lineData = useMemo(() => {
    let filterObj: Partial<Record<FilterCategoryType, string>> = {};
    filters?.forEach((filter) => {
      filterObj[filter.group] = filter.value;
    });

    let categoryData = excelData.map((row: any) => {
      return {
        date: row["Day"]?.toString(),
        value: row[category],
        Age: row["Age"],
        Gender: row["Gender"],
        Day: paredExcelDateCode(row.Day),
      };
    });

    let filteredData = categoryData?.filter((record) => {
      if (dateRange?.startDate || dateRange.endDate) {
        // Parse the string into a Date object
        const parsedDate = parse(record.date, "d/m/y", new Date());
        if (
          isBefore(parsedDate, dateRange.startDate) ||
          isAfter(parsedDate, dateRange.endDate)
        ) {
          return false;
        }
      }

      if (
        (filterObj.Age && record.Age !== filterObj.Age) ||
        (filterObj.Gender &&
          record.Gender?.toLowerCase() !== filterObj.Gender?.toLowerCase())
      ) {
        return false;
      } else return true;
    });

    return {
      labels: filteredData.map((item: any) => item.date),
      datasets: [
        {
          label: `Time Trend for Category ${category}`,
          data: filteredData.map((item: any) => item.value),
          fill: false,
          borderColor: "#4CAF50",
          tension: 0.1,
        },
      ],
    };
  }, [excelData, category, filters, dateRange.startDate, dateRange.endDate]);

  const handleZoomIn = () => {
    const chart: any = chartRef.current;
    if (chart) {
      chart.zoom(1.1); // Zoom in by 10%
    }
  };

  const handleZoomOut = () => {
    const chart: any = chartRef.current;
    if (chart) {
      chart.zoom(0.9); // Zoom out by 10%
    }
  };

  const handleResetZoom = () => {
    const chart: any = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <Line
        ref={chartRef}
        data={lineData}
        style={{ height: "400px" }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Hours",
              },
            },
          },
        }}
      />
      <div className="mt-4 space-x-2">
        <button
          onClick={handleZoomIn}
          className="p-2  bg-gray-800 text-white rounded"
        >
          <MdOutlineZoomInMap />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <MdOutlineZoomOutMap />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <RxReset />
        </button>
      </div>
    </div>
  );
};

export default LineChart;
