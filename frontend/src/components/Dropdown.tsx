import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { ReactNode } from 'react';

interface DropdownOption {
  id: string,
  display: ReactNode,
  onClick: () => void,
}


interface DropdownProps {
  options: DropdownOption[],
  selectedId: string,
  placeholder?: string,
  disabled?: boolean
}


export default function Dropdown({ options, selectedId, placeholder = 'Select...', disabled = false }: DropdownProps) {
  const selected = options.find(o => o.id === selectedId) || null;

  const handleChange = (id: string) => {
    options.find(o => o.id === id)?.onClick();
  };

  return (
    <Listbox value={selectedId} onChange={handleChange} disabled={disabled}>
      <div className="relative">
        <ListboxButton className={`w-full flex justify-between items-center border border-border rounded px-3 py-2 outline-none focus:border-secondary bg-[Canvas] ${disabled ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>
          <span className={selected ? '' : 'text-muted'}>
            {selected ? selected.display : placeholder}
          </span>
          <ChevronDown size={16} className="text-muted" />
        </ListboxButton>
        <ListboxOptions className="absolute z-10 mt-1 w-full bg-[Canvas] border border-border rounded shadow-sm">
          {options.map(o => (
            <ListboxOption
              key={o.id}
              value={o.id}
              className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              {({ selected }) => (
                <>
                  {o.display}
                  {selected && <Check size={14} className="text-primary" />}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
