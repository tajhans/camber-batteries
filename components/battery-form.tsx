"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Battery,
    BatteryCharging,
    BatteryWarning,
    BatteryFull,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Battery as BatteryType,
    BatteryFormValues,
    batteryFormSchema,
} from "@/lib/schema";

interface BatteryFormProps {
    battery: BatteryType | null;
    onClose: () => void;
    onSubmit: (id: number, data: BatteryFormValues) => Promise<boolean>;
}

export function BatteryForm({ battery, onClose, onSubmit }: BatteryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formChanged, setFormChanged] = useState(false);

    const form = useForm<BatteryFormValues>({
        resolver: zodResolver(batteryFormSchema),
        defaultValues: battery
            ? {
                  status: battery.status,
                  voltage: battery.voltage,
              }
            : {
                  status: "needs-charging",
                  voltage: 0,
              },
    });

    const formValues = form.watch();

    useEffect(() => {
        if (battery) {
            const isDifferent =
                formValues.status !== battery.status ||
                formValues.voltage !== battery.voltage;

            setFormChanged(isDifferent);
        }
    }, [formValues, battery]);

    useEffect(() => {
        if (battery) {
            form.reset({
                status: battery.status,
                voltage: battery.voltage,
            });
        } else {
            form.reset({
                status: "needs-charging",
                voltage: 0,
            });
        }
    }, [battery, form]);

    const handleSubmit = async (values: BatteryFormValues) => {
        if (!battery) return;

        setIsSubmitting(true);
        try {
            const success = await onSubmit(battery.id, values);
            if (success) {
                form.reset(values);
                setFormChanged(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!battery) {
        return (
            <Card className="p-6 flex flex-col items-center justify-center text-center h-[300px]">
                <Battery className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Battery Selected</h3>
                <p className="text-gray-500 mt-2">
                    Select a battery from the pool to view and edit its details.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <GetStatusIcon status={battery.status} />
                Battery #{battery.id}
            </h3>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="voltage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Voltage (V)</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="50"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                        />
                                        <span className="text-sm text-gray-500">
                                            Volts
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="flex flex-col space-y-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="charging"
                                                id="charging"
                                            />
                                            <Label
                                                htmlFor="charging"
                                                className="flex items-center gap-2"
                                            >
                                                <BatteryCharging className="h-4 w-4 text-blue-500" />
                                                Charging
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="needs-charging"
                                                id="needs-charging"
                                            />
                                            <Label
                                                htmlFor="needs-charging"
                                                className="flex items-center gap-2"
                                            >
                                                <BatteryWarning className="h-4 w-4 text-yellow-500" />
                                                Needs Charging
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="charged"
                                                id="charged"
                                            />
                                            <Label
                                                htmlFor="charged"
                                                className="flex items-center gap-2"
                                            >
                                                <BatteryFull className="h-4 w-4 text-green-500" />
                                                Fully Charged
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !formChanged}
                            className="flex-1"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Close
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    );
}

export function GetStatusIcon({ status }: { status: string }) {
    switch (status) {
        case "charging":
            return <BatteryCharging className="h-5 w-5 text-blue-500" />;
        case "needs-charging":
            return <BatteryWarning className="h-5 w-5 text-yellow-500" />;
        case "charged":
            return <BatteryFull className="h-5 w-5 text-green-500" />;
        default:
            return <Battery className="h-5 w-5" />;
    }
}
