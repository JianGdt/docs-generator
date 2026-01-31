"use client";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { LucideIcon, CheckCircle } from "lucide-react";

type ReviewCardProps = {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
  badgeVariant?: "default" | "destructive" | "outline";
  badgeClassName?: string;
  dotColor: string;
  checkIconColor: string;
  showHoverCheck?: boolean;
};

export function ReviewCard({
  title,
  description,
  items,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  hoverColor,
  badgeVariant = "outline",
  badgeClassName = "",
  dotColor,
  checkIconColor,
  showHoverCheck = true,
}: ReviewCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <Card>
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <Icon className={`w-7 h-7 hidden md:flex ${iconColor}`} />
          <div className="flex-1">
            <h3 className="text-md md:text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm md:text-lg text-muted-foreground">
              {description}
            </p>
            <Badge variant={badgeVariant} className={`mt-2 ${badgeClassName}`}>
              {items.length}{" "}
              {title.toLowerCase().includes("strength")
                ? "strength"
                : title.toLowerCase().includes("warning")
                  ? "warning"
                  : title.toLowerCase().includes("missing")
                    ? "section"
                    : "suggestion"}
              {items.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className={`${showHoverCheck ? "group" : ""} flex items-start gap-3 p-4 rounded-xl ${bgColor} border ${borderColor} ${
                showHoverCheck ? hoverColor : ""
              } transition-colors`}
            >
              {showHoverCheck ? (
                <>
                  <div className={`w-2 h-2 rounded-full ${dotColor} mt-2`} />
                  <span className="text-sm md:text-lg flex-1">{item}</span>
                  <CheckCircle
                    className={`w-5 h-5 ${checkIconColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </>
              ) : (
                <>
                  <CheckCircle className={`w-5 h-5 ${checkIconColor} mt-0.5`} />
                  <span className="text-sm md:text-lg flex-1">{item}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
