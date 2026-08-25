import React from 'react';

interface TextInputProps {
    value: string;
    onChange: (s: string) => void;
    placeholder: string;
    disabled?: boolean;
}

export default function TextInput({ onChange, disabled = false, ...props }: TextInputProps) {
    const inputClass = "border border-border rounded px-3 py-2 w-full outline-none focus:border-secondary"
    return <input className={inputClass} {...props} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
}
