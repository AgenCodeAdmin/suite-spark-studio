'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Creatable from 'react-select/creatable';
import { useToast } from '@/hooks/use-toast';

interface CreatableSelectProps {
  tableName: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isMulti?: boolean;
  className?: string;
}

interface Option {
  label: string;
  value: string;
}

export const CreatableSelect: React.FC<CreatableSelectProps> = ({ tableName, value, onChange, isMulti, className }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchOptions = async () => {
    const { data, error } = await supabase.from(tableName).select('name');
    if (error) {
      toast({ title: `Error fetching from ${tableName}`, description: error.message, variant: 'destructive' });
    } else {
      setOptions(data.map(item => ({ label: item.name, value: item.name })));
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [tableName]);

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.from(tableName).insert({ name: inputValue }).select().single();
    if (error) {
      toast({ title: `Error creating in ${tableName}`, description: error.message, variant: 'destructive' });
    } else {
      const newOption = { label: data.name, value: data.name };
      setOptions(prev => [...prev, newOption]);
      if (isMulti) {
        onChange([...(Array.isArray(value) ? value : []), newOption.value]);
      } else {
        onChange(newOption.value);
      }
    }
    setIsLoading(false);
  };

  const handleChange = (selectedOption: any) => {
    if (isMulti) {
      onChange(selectedOption ? selectedOption.map((opt: Option) => opt.value) : []);
    } else {
      onChange(selectedOption ? selectedOption.value : '');
    }
  };

  const selectValue = isMulti 
    ? options.filter(opt => Array.isArray(value) && value.includes(opt.value))
    : options.find(opt => opt.value === value);

  return (
    <Creatable
      className={className}
      isMulti={isMulti}
      options={options}
      value={selectValue}
      onChange={handleChange}
      onCreateOption={handleCreate}
      isLoading={isLoading}
      isClearable
      isSearchable
    />
  );
};
