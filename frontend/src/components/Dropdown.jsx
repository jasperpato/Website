import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

export default function Dropdown({ options, value, onChange, placeholder = 'Select...', disabled = false }) {
  const selected = options.find(o => o.value === value) || null;

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <ListboxButton className={`w-full flex justify-between items-center border border-border rounded px-3 py-2 outline-none focus:border-secondary bg-[Canvas] ${disabled ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}>
          <span className={`flex items-center gap-2 ${selected ? '' : 'text-muted'}`}>
            {selected?.color && <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: selected.color }} />}
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={16} className="text-muted" />
        </ListboxButton>
        <ListboxOptions className="absolute z-10 mt-1 w-full bg-[Canvas] border border-border rounded shadow-sm">
          {options.map(o => (
            <ListboxOption
              key={o.value}
              value={o.value}
              className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              {({ selected }) => (
                <>
                  <span className="flex items-center gap-2">
                    {o.color && <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: o.color }} />}
                    {o.label}
                  </span>
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
