import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
    try {
        const batteryIds = await redis.smembers("battery:ids");

        if (!batteryIds.length) {
            // Initialize default batteries if none exist
            const defaultBatteries = Array.from({ length: 7 }, (_, i) => ({
                id: i + 1,
                status: "needs-charging",
                voltage: 0,
            }));

            await Promise.all(
                defaultBatteries.map(async (battery) => {
                    await redis.sadd("battery:ids", battery.id);
                    await redis.hset(`battery:${battery.id}`, battery);
                }),
            );

            return NextResponse.json({ batteries: defaultBatteries });
        }

        const batteriesPromises = batteryIds.map(async (id) => {
            const battery = await redis.hgetall(`battery:${id}`);

            if (!battery || !Object.keys(battery).length) {
                return null;
            }

            return {
                ...battery,
                id: Number(battery.id),
                voltage: Number(battery.voltage),
            };
        });

        const batteriesWithNulls = await Promise.all(batteriesPromises);
        const batteries = batteriesWithNulls.filter(
            (battery) => battery !== null,
        );

        return NextResponse.json({ batteries });
    } catch (error) {
        console.error("Error fetching batteries:", error);
        return NextResponse.json(
            { error: "Failed to fetch batteries" },
            { status: 500 },
        );
    }
}
