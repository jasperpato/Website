interface BigButtonProps {
    text: string,
    onClick?: () => void,
    color?: string,
    fullWidth?: boolean,
    small?: boolean,
    className?: string,
}

export default function BigButton({ text, onClick, color, fullWidth, small, className }: BigButtonProps) {
    return (
        <button
            onClick={onClick}
            style={color ? { color, borderColor: color, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` } : undefined}
            className={`border-2 rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-80 ${fullWidth ? 'w-full' : 'w-48'} ${small ? 'px-6 py-4 text-base' : 'px-8 py-4 text-xl'} ${className ?? ''}`}
        >
            {text}
        </button>
    )
}