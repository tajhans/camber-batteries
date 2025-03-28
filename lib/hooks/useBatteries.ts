import { useMemo, useEffect } from "react";
import useSWR from "swr";
import { Battery } from "../db/schema";
import { toast } from "sonner";

const BATTERY_COUNT_KEY = "battery-count";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || "An error occurred while fetching the data.",
    );
  }
  return res.json();
};

export function useBatteries() {
  const swrOptions = useMemo(
    () => ({
      refreshInterval: 10000, // Refresh every 10 seconds
      onError: (err: Error) => {
        toast.error("Failed to fetch batteries");
        console.error(err);
      },
    }),
    [],
  );

  const { data, error, isLoading, mutate } = useSWR<{ batteries: Battery[] }>(
    "/api/batteries",
    fetcher,
    swrOptions,
  );

  useEffect(() => {
    if (data?.batteries) {
      localStorage.setItem(BATTERY_COUNT_KEY, data.batteries.length.toString());
    }
  }, [data?.batteries]);

  const cachedBatteryCount = useMemo(() => {
    if (typeof window === "undefined") return 7;

    const count = localStorage.getItem(BATTERY_COUNT_KEY);
    return count ? parseInt(count, 10) : 7;
  }, []);

  const updateBattery = async (
    id: number,
    data: { status?: string; voltage?: number },
  ) => {
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update battery");
      }

      toast.success(`Battery #${id} updated successfully`);
      mutate(); // Refresh the data
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
      console.error(error);
      return false;
    }
  };

  return {
    batteries: data?.batteries || [],
    isLoading,
    error,
    updateBattery,
    mutate,
    cachedBatteryCount,
  };
}
