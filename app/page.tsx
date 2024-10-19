"use client";
import { useContext, useEffect, useState } from "react";
import BarChart from "./components/BarChart";
import {
  ChartCategoriesType,
  FilterCategoryType,
  FiltersType,
  excelDataType,
} from "./types/custTypes";
import LineChart from "./components/LineChat";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { getCookie, setCookie } from "./helper";
import { useSearchParams, useRouter } from "next/navigation";
import Select from "react-select";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [excelData, setExcelData] = useState<excelDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLineChart, setShowLineChart] =
    useState<ChartCategoriesType | null>(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [filters, setFilters] = useState<FiltersType[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear() - 3, 0, 1),
    endDate: new Date(),
  });
  const {
    onLogout,
    auth: { username },
  } = useContext(AuthContext);
  const handleRangeChange = (ranges: any) => {
    console.log({ ranges });
    setDateRange({
      startDate: ranges.range1.startDate,
      endDate: ranges.range1.endDate,
    });
    setShowDateRangePicker(false);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { data: excelData },
      } = await axios.get("http://localhost:3000/api/excel-data");
      setExcelData(excelData);
      setIsLoading(false);
    } catch (error) {
      alert("Failed to load excel file!");
      setIsLoading(false);
    }
  };

  const onFilterChange = (selectedOptions: any) => {
    console.log({ selectedOptions });
    // Allow to select only one option from one optgroup
    const uniqueByGroup = selectedOptions.reduce(
      (acc: FiltersType[], currentOption: { group: string }) => {
        const groupExists = acc.find(
          (option: FiltersType) => option.group === currentOption.group
        );
        if (groupExists) {
          // Replace existing option in the same group
          return acc.map((option) =>
            option.group === currentOption.group ? currentOption : option
          );
        } else {
          return [...acc, currentOption];
        }
      },
      []
    );
    setFilters(uniqueByGroup);

    setCookie("filters", JSON.stringify(uniqueByGroup));

    const params = new URLSearchParams();
    if (selectedOptions?.length === 0) {
      router.push("/");
    }
    selectedOptions.forEach((option: FiltersType) => {
      params.set(option.group, option.value);
      router.push(`?${params.toString()}`); // Use shallow to avoid full page reload
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        await fetchData();
        let queryParamsArray: FiltersType[] = [];
        if (searchParams.size > 0) {
          searchParams.forEach((value, key) => {
            queryParamsArray.push({
              label: value,
              value,
              group: key as FilterCategoryType,
            });
          });
          setCookie("filters", JSON.stringify(queryParamsArray));
          setFilters(queryParamsArray);
        } else {
          let cookieFilters = getCookie("filters");
          setFilters(cookieFilters);
        }
      })();
    }
  }, []);

  const options: {
    label: FilterCategoryType;
    options: { value: string; label: string; group: FilterCategoryType }[];
  }[] = [
    {
      label: "Age",
      options: [
        { value: "15-25", label: "15-25", group: "Age" },
        { value: ">25", label: ">25", group: "Age" },
      ],
    },
    {
      label: "Gender",
      options: [
        { value: "male", label: "male", group: "Gender" },
        { value: "female", label: "female", group: "Gender" },
      ],
    },
  ];

  return (
    <div className="Analytics">
      <header className="flex justify-end items-center">
        <span className="text-gray-900">Hello {username}!</span>
        <button
          className="p-2 m-2 bg-red-600 text-white font-semibold"
          onClick={() => {
            onLogout();
          }}
        >
          Logout
        </button>
      </header>
      <main>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="flex flex-col gap-2 m-3 px-3">
              <div>
                <label
                  htmlFor="chartFilter"
                  className="text-slate-700 font-semibold"
                >
                  Filter:
                </label>
                <Select
                  options={options}
                  isMulti
                  value={filters}
                  onChange={onFilterChange}
                  closeMenuOnSelect={false} // Keeps dropdown open when selecting multiple
                  placeholder="Select Filters"
                />
              </div>

              {/* DATE FILTER */}
              <div>
                <label
                  htmlFor="chartFilter"
                  className="text-slate-700 font-semibold mx-2"
                >
                  Select Date Range
                </label>
                <button
                  className="bg-gray-6000"
                  onClick={() => setShowDateRangePicker((prev) => !prev)}
                >
                  <i className="fa fa-calendar" />{" "}
                  {`${format(dateRange.startDate, "MMMM d, yyyy")} - ${format(
                    dateRange.endDate,
                    "MMMM d, yyyy"
                  )}`}
                </button>
                {showDateRangePicker && (
                  <DateRangePicker
                    ranges={[dateRange]}
                    onChange={handleRangeChange}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    direction="horizontal"
                  />
                )}
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-2`}>
              <div className={`${!setExcelData && "col-span-2"}`}>
                <BarChart
                  excelData={excelData}
                  onSelect={(category: ChartCategoriesType) => {
                    setShowLineChart(category);
                  }}
                  filters={filters}
                  dateRange={dateRange}
                />
              </div>
              {excelData && showLineChart && (
                <LineChart
                  excelData={excelData}
                  category={showLineChart}
                  filters={filters}
                  dateRange={dateRange}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
