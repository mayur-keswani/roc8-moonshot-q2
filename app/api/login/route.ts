import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        return NextResponse.json(
            { message: "Successfullt login!" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update Emails" },
            { status: 500 }
        );
    }
}