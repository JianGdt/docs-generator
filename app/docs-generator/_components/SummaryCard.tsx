"use client";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  value: number;
  label: string;
  variant?: "danger" | "warning" | "info" | "success";
  icon?: LucideIcon;
  className?: string;
}

const variantStyles = {
  danger: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-blue-600 dark:text-blue-400",
  success: "text-green-600 dark:text-green-400",
};

function SummaryCard({
  value,
  label,
  variant = "info",
  icon: Icon,
  className = "",
}: SummaryCardProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className={`text-2xl font-bold ${variantStyles[variant]}`}>
          {value}
        </div>
        {Icon && (
          <Icon className={`h-5 w-5 ${variantStyles[variant]} opacity-70`} />
        )}
      </div>
      <div className="text-md md:text-lg text-muted-foreground mt-1">
        {label}
      </div>
    </Card>
  );
}

export default SummaryCard;
