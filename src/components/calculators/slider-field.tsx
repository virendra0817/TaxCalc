"use client";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/index";
import { cn } from "@/lib/utils";

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue: (v: number) => string;
  className?: string;
}

export function SliderField({ label, value, min, max, step = 1, onChange, formatValue, className }: SliderFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
          {formatValue(value)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
