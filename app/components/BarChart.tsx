import { useEffect, useState, useRef, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
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
  ChartCategoriesType,
  FilterCategoryType,
  FiltersType,
  excelDataType,
} from "../types/custTypes";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import { paredExcelDateCode } from "../helper";
import { isAfter, isBefore, parse } from "date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  zoomPlugin
);

type BarChatPagePropType = {
  excelData: excelDataType[];
  onSelect: (category: ChartCategoriesType) => void;
  filters: FiltersType[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
};
const BarChart: React.FC<BarChatPagePropType> = ({
  excelData,
  onSelect,
  filters,
  dateRange,
}) => {
  const chartRef = useRef(null);
  const barData: { labels: ChartCategoriesType[]; datasets: any[] } =
    useMemo(() => {
      let totalTimeSpentOnA = 0;
      let totalTimeSpentOnB = 0;
      let totalTimeSpentOnC = 0;
      let totalTimeSpentOnD = 0;
      let totalTimeSpentOnE = 0;
      let totalTimeSpentOnF = 0;

      let filterObj: Partial<Record<FilterCategoryType, string>> = {};
      filters?.forEach((filter) => {
        filterObj[filter.group] = filter.value;
      });

      let parsedData = excelData.map((row: any) => {
        return {
          ...row,
          date: row["Day"]?.toString(),
          Age: row["Age"],
          Gender: row["Gender"],
          Day: paredExcelDateCode(row.Day),
        };
      });
      let filteredData = parsedData.filter((record: any) => {
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
        } else {
          return true;
        }
      });
      filteredData.forEach((record) => {
        totalTimeSpentOnA += record["A"];
        totalTimeSpentOnB += record["B"];
        totalTimeSpentOnC += record["C"];
        totalTimeSpentOnD += record["D"];
        totalTimeSpentOnE += record["E"];
        totalTimeSpentOnF += record["F"];
      });
      return {
        labels: ["A", "B", "C", "D", "E", "F"],
        datasets: [
          {
            label: "Total Hours Taken",
            data: [
              totalTimeSpentOnA,
              totalTimeSpentOnB,
              totalTimeSpentOnC,
              totalTimeSpentOnD,
              totalTimeSpentOnE,
              totalTimeSpentOnF,
            ],
            backgroundColor: [
              "#87CEEB",
              "#90EE90",
              "#F08080",
              "#FFA07A",
              "#c1c1c1",
              "#676767",
            ],
            // borderColor: ["#4682B4", "#32CD32", "#CD5C5C", "#FF4500"],
            borderWidth: 1,
          },
        ],
      };
    }, [excelData, filters, dateRange.startDate, dateRange.endDate]);

  // Handle the click event on the chart
  const handleBarClick = (event: any) => {
    const chart: any = chartRef.current;

    if (chart && barData?.labels) {
      const chartElement = chart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      );

      if (chartElement.length > 0 && barData?.labels) {
        const selectedBarIndex = chartElement[0].index;
        let category: ChartCategoriesType = barData.labels[selectedBarIndex];
        onSelect(category);
      }
    }
  };

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
      <Bar
        data={barData}
        ref={chartRef}
        options={{
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Hours",
              },
            },
            y: {
              title: {
                display: true,
                text: "Category",
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Zoomable Bar Chart",
            },
            zoom: {
              pan: {
                enabled: true,
                mode: "x",
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
              },
            },
          },
        }}
        onClick={handleBarClick}
        style={{ height: "400px" }}
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

export default BarChart;
