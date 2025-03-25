"use client";

import { useState } from "react";
import { useBatteries } from "@/lib/hooks/useBatteries";
import {
    BatteryFormValues,
    Battery as BatteryType,
    BatteryStatus,
} from "@/lib/db/schema";

import { Separator } from "@/components/ui/separator";
import { BatteryCharging, BatteryWarning, BatteryFull } from "lucide-react";
import { BatteryCard } from "@/components/battery-card";
import { BatteryForm } from "@/components/battery-form";
import { BatteryCardSkeleton } from "@/components/battery-skeleton";

export default function Home() {
    const { batteries, isLoading, updateBattery, cachedBatteryCount } =
        useBatteries();
    const [selectedBatteryId, setSelectedBatteryId] = useState<number | null>(
        null,
    );

    const selectedBattery = selectedBatteryId
        ? batteries.find((b) => b.id === selectedBatteryId) || null
        : null;

    const handleBatteryUpdate = async (id: number, data: BatteryFormValues) => {
        return await updateBattery(id, data);
    };

    const sortedBatteries = [...batteries].sort((a, b) => a.id - b.id);

    const batteriesByStatus = sortedBatteries.reduce(
        (groups, battery) => {
            groups[battery.status].push(battery);
            return groups;
        },
        {
            charged: [] as BatteryType[],
            charging: [] as BatteryType[],
            "needs-charging": [] as BatteryType[],
        },
    );

    const renderStatusGroup = (
        status: BatteryStatus,
        icon: React.ReactNode,
        title: string,
    ) => {
        const statusBatteries = batteriesByStatus[status];

        if (statusBatteries.length === 0) {
            return null;
        }

        const sortedStatusBatteries = [...statusBatteries].sort(
            (a, b) => a.id - b.id,
        );

        return (
            <div className="mb-6">
                <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                    {icon}
                    {title}{" "}
                    <span className="text-muted-foreground font-mono">
                        {sortedStatusBatteries.length}
                    </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {sortedStatusBatteries.map((battery) => (
                        <BatteryCard
                            key={battery.id}
                            battery={battery}
                            isSelected={selectedBatteryId === battery.id}
                            onClick={() => setSelectedBatteryId(battery.id)}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="text-center pb-4">
                <h1 className="text-2xl font-bold pb-2">Manage Batteries</h1>
                <Separator />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Battery Pool</h2>
                    {isLoading ? (
                        <div>
                            <div className="mb-6">
                                <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                                    <BatteryFull className="h-5 w-5 text-gray-300" />
                                    Loading batteries...
                                </h3>
                                <BatteryCardSkeleton
                                    count={cachedBatteryCount}
                                />
                            </div>
                        </div>
                    ) : batteries.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No batteries found
                        </div>
                    ) : (
                        <div>
                            {renderStatusGroup(
                                "charged",
                                <BatteryFull className="h-5 w-5 text-green-500" />,
                                "Fully Charged",
                            )}

                            {renderStatusGroup(
                                "charging",
                                <BatteryCharging className="h-5 w-5 text-blue-500" />,
                                "Currently Charging",
                            )}

                            {renderStatusGroup(
                                "needs-charging",
                                <BatteryWarning className="h-5 w-5 text-yellow-500" />,
                                "Needs Charging",
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Battery Details
                    </h2>
                    <BatteryForm
                        battery={selectedBattery}
                        onCloseAction={() => setSelectedBatteryId(null)}
                        onSubmitAction={handleBatteryUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
