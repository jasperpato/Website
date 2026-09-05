import { useState } from "react";
import { LucideProps } from "lucide-react";

export const IconSize = Object.freeze({
    SMALL: 16,
    DEFAULT: 20,
    LARGE: 28,
})

type IconSize = typeof IconSize[keyof typeof IconSize]

interface IconButtonProps {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    color: string,
    onClick?: () => void,
    disabled?: boolean,
    size?: IconSize,
    className?: string,
    background?: string
}

export default function IconButton({ icon: Icon, color, onClick, disabled = false, size = IconSize.DEFAULT, className = "", background }: IconButtonProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                color: disabled ? undefined : color,
                backgroundColor: !disabled && hovered ? `color-mix(in srgb, ${color} 12%, ${background ?? 'transparent'})` : (background ?? 'transparent'),
            }}
            className={`rounded-full p-2 border-none flex items-center justify-center transition-colors ${disabled ? 'text-muted cursor-default' : 'cursor-pointer'} ${className}`}
        >
            <Icon size={size} />
        </button>
    );
}