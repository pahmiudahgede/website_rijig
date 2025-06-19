// ===components/date-picker.tsx=== (FIXED DARK MODE VERSION WITH DD-MM-YYYY FORMAT)
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  maxDate,
  minDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  const isDateDisabled = (checkDate: Date): boolean => {
    if (maxDate && checkDate > maxDate) return true;
    if (minDate && checkDate < minDate) return true;
    return false;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          {date ? format(date, "dd-MM-yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" 
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          initialFocus
          captionLayout="dropdown"
          fromYear={1920}
          toYear={new Date().getFullYear()}
          classNames={{
            dropdown_root: "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md bg-white dark:bg-gray-700",
            dropdown: "absolute inset-0 opacity-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
            caption_label: "select-none font-medium rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 text-gray-900 dark:text-white bg-white dark:bg-gray-700 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// ===Enhanced DatePicker with better dark mode support and DD-MM-YYYY format===
export function EnhancedDatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  maxDate,
  minDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  const isDateDisabled = (checkDate: Date): boolean => {
    if (maxDate && checkDate > maxDate) return true;
    if (minDate && checkDate < minDate) return true;
    return false;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          {date ? (
            <span className="text-gray-900 dark:text-white">
              {format(date, "dd-MM-yyyy")}
            </span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg" 
        align="start"
        sideOffset={4}
      >
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
            captionLayout="dropdown"
            fromYear={1920}
            toYear={new Date().getFullYear()}
            className="rounded-md"
            classNames={{
              // Fix dropdown styling for dark mode
              dropdown_root: cn(
                "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
                "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              ),
              dropdown: cn(
                "absolute inset-0 opacity-0",
                "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ),
              caption_label: cn(
                "select-none font-medium rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8",
                "text-gray-900 dark:text-white bg-white dark:bg-gray-700",
                "[&>svg]:text-muted-foreground [&>svg]:size-3.5"
              ),
              // Additional fixes for better contrast
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                "text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600",
                "hover:bg-gray-100 dark:hover:bg-gray-600"
              ),
              table: "w-full border-collapse",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
              ),
              day_selected: cn(
                "bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
                "focus:bg-blue-600 focus:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              ),
              day_today: cn(
                "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white",
                "data-[selected=true]:bg-blue-600 data-[selected=true]:text-white"
              ),
              day_outside: cn(
                "text-gray-400 dark:text-gray-500 opacity-50",
                "aria-selected:bg-gray-100/50 dark:aria-selected:bg-gray-700/50",
                "aria-selected:text-gray-400 dark:aria-selected:text-gray-500 aria-selected:opacity-30"
              ),
              day_disabled: "text-gray-400 dark:text-gray-500 opacity-50",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}