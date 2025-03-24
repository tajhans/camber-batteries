import { z } from "zod";

export const batteryStatusSchema = z.enum([
    "charging",
    "needs-charging",
    "charged",
]);

export const batterySchema = z.object({
    id: z.number(),
    status: batteryStatusSchema,
    voltage: z.number().min(0).max(50),
});

export type BatteryStatus = z.infer<typeof batteryStatusSchema>;
export type Battery = z.infer<typeof batterySchema>;

export const batteryFormSchema = z.object({
    status: batteryStatusSchema,
    voltage: z.number().min(0).max(50),
});

export type BatteryFormValues = z.infer<typeof batteryFormSchema>;
