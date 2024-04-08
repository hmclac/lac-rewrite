'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';

import { cn } from '@/actions/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = React.HTMLAttributes<HTMLElement> & {
  startingOptions: string[];
  optionName: string;
  signal: Signal<string>;
};

export const ComboSelector = (props: Props) => {
  useSignals();
  const { startingOptions, optionName, signal, ...otherProps } = props;
  const [options, setOptions] = React.useState(startingOptions);
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');

  const handleSelect = (optionValue: string) => {
    // setValue(optionValue);
    setOpen(false);
    signal.value = optionValue;
    if (
      !options.map((x) => x.toLowerCase()).includes(optionValue.toLowerCase())
    ) {
      setOptions([...options, optionValue]);
    }
  };

  const handleSubmit = (e: any) => {
    if (e.key === 'Enter' && searchInput) {
      const option = options.find(
        (o) => o.toLowerCase() === searchInput.toLowerCase()
      );
      if (option) handleSelect(option);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...otherProps}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-min *:justify-between'
        >
          {signal.value ? options.find((o) => o === signal.value) : `...`}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-min p-0'>
        <Command label={`Search ${optionName}...`}>
          <CommandInput
            placeholder={`Search ${optionName}...`}
            value={searchInput}
            onChangeCapture={(e) => setSearchInput(e.currentTarget.value)}
            onKeyDown={handleSubmit}
          />
          <CommandEmpty className='p-0 m-0 relative justify-between align-middle w-auto'>
            <Button
              onClick={() => handleSelect(searchInput)}
              className="relative w-auto bg-inherit hover:bg-slate-900 text-inherit hover:text-inherit aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50"
            >
              Add new: {searchInput}
            </Button>
          </CommandEmpty>

          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={(e) => handleSelect(option)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    signal.value === option ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
