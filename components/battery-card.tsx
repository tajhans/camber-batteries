import { Battery } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";
import { GetStatusIcon } from "@/components/battery-form";

interface BatteryCardProps {
  battery: Battery;
  isSelected: boolean;
  onClick: () => void;
}

export function BatteryCard({
  battery,
  isSelected,
  onClick,
}: BatteryCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Battery #{battery.id}</h3>
        <GetStatusIcon status={battery.status} />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-medium">
            {battery.status.replace("-", " ")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Voltage:</span>
          <span className="font-medium">{battery.voltage}V</span>
        </div>
      </div>
    </Card>
  );
}
