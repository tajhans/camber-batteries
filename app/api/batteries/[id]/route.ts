import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { batteryFormSchema } from "@/lib/schema";

export async function GET(
    request: NextRequest,
) {
    try {
        const id = request.nextUrl.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json(
                { error: "Battery ID is missing" },
                { status: 400 }
            );
        }
        
        const battery = await redis.hgetall(`battery:${id}`);

        if (!battery || !Object.keys(battery).length) {
            return NextResponse.json(
                { error: "Battery not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            battery: {
                ...battery,
                id: Number(battery.id),
                voltage: Number(battery.voltage),
            },
        });
    } catch (error) {
        console.error("Error fetching battery:", error);
        return NextResponse.json(
            { error: "Failed to fetch battery" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: NextRequest,
) {
    try {
        const id = request.nextUrl.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json(
                { error: "Battery ID is missing" },
                { status: 400 }
            );
        }
        
        const body = await request.json();

        const result = batteryFormSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid battery data",
                    details: result.error.format(),
                },
                { status: 400 },
            );
        }

        const exists = await redis.sismember("battery:ids", id);
        if (!exists) {
            return NextResponse.json(
                { error: "Battery not found" },
                { status: 404 },
            );
        }

        const validatedData = result.data;
        await redis.hset(`battery:${id}`, {
            id,
            status: validatedData.status,
            voltage: validatedData.voltage,
        });

        const updatedBattery = await redis.hgetall(`battery:${id}`);

        if (!updatedBattery || !Object.keys(updatedBattery).length) {
            return NextResponse.json(
                { error: "Failed to retrieve updated battery" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            battery: {
                ...updatedBattery,
                id: Number(updatedBattery.id),
                voltage: Number(updatedBattery.voltage),
            },
        });
    } catch (error) {
        console.error("Error updating battery:", error);
        return NextResponse.json(
            { error: "Failed to update battery" },
            { status: 500 },
        );
    }
}
