import { NextResponse } from "next/server";
import path from "path";
import * as XLSX from "xlsx";
import { extractedExcelData } from "@/app/types/custTypes";
import { paredExcelDateCode } from "@/app/helper";
import fs from 'fs';
let filePath = path.join(process.cwd(),'public', "data.xlsx");

export async function GET(request: Request) {
  try {
    // Read the file synchronously
    const fileBuffer = fs.readFileSync(filePath);
    let workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData: extractedExcelData[] = XLSX.utils.sheet_to_json(sheet);
    let updatedJsonData = jsonData.map((record) => ({
      ...record,
      Day: paredExcelDateCode(record.Day),
    }));

    return NextResponse.json({ data: updatedJsonData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to Fetch Sheet Data" },
      { status: 500 }
    );
  }
}
