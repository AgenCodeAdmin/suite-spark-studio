'use client'

import * as React from 'react'
import { format, setHours, setMinutes, setSeconds } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface DatePickerProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [time, setTime] = React.useState({
    hour12: date ? parseInt(format(date, 'h')) : 12,
    minutes: date ? date.getMinutes() : 0,
    ampm: date ? format(date, 'a') : 'AM'
  });

  React.useEffect(() => {
    if (date) {
        setTime({
            hour12: parseInt(format(date, 'h')),
            minutes: date.getMinutes(),
            ampm: format(date, 'a').toUpperCase()
        });
    }
  }, [date]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
        onDateChange(undefined);
        return;
    }
    updateDate(newDate, time.hour12, time.minutes, time.ampm);
  }

  const handleTimeChange = (part: 'hour12' | 'minutes' | 'ampm', value: string | number) => {
    const newTime = { ...time, [part]: value };
    setTime(newTime);
    if (date) {
        updateDate(date, newTime.hour12, newTime.minutes, newTime.ampm as string);
    }
  }

  const updateDate = (baseDate: Date, hour12: number, minutes: number, ampm: string) => {
    let hours = hour12;
    if (ampm.toUpperCase() === 'PM' && hour12 < 12) {
        hours += 12;
    } else if (ampm.toUpperCase() === 'AM' && hour12 === 12) { // Midnight case
        hours = 0;
    }

    const newDate = setSeconds(setMinutes(setHours(baseDate, hours), minutes), 0);
    onDateChange(newDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="p-2 border-t border-border flex items-center justify-center gap-2">
            <Input 
                type="number"
                min="1"
                max="12"
                value={time.hour12}
                onChange={(e) => handleTimeChange('hour12', parseInt(e.target.value, 10))}
                className="w-14"
            />
            <span>:</span>
            <Input 
                type="number"
                min="0"
                max="59"
                value={String(time.minutes).padStart(2, '0')}
                onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value, 10))}
                className="w-14"
            />
            <ToggleGroup type="single" value={time.ampm} onValueChange={(value) => {if(value) handleTimeChange('ampm', value)}} variant="outline">
                <ToggleGroupItem value="AM">AM</ToggleGroupItem>
                <ToggleGroupItem value="PM">PM</ToggleGroupItem>
            </ToggleGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}
