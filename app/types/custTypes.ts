export type ChartCategoriesType = "A" | "B" | "C" | "D" | "E" | "F";

export type excelDataType = {
  Day: string;
  Age: string;
  Gender: string;
  A: number;
  B: number;
  c: number;
  D: number;
  E: number;
  F: number;
};

export type extractedExcelData = Omit<excelDataType, "Day"> & {
  Day: number;
};

export type FilterCategoryType= "Age" | "Gender"
export type FiltersType = {group:FilterCategoryType,label:string,value:string}
export type preDefinedDateRangeType =
  | "Today"
  | "Yesterday"
  | "Last 7 Days"
  | "Last 30 Days"
  | "This Month"
  | "Last Month";

export type AuthType = {
  isLoggedIn:Boolean;
  username:string;
}