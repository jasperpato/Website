interface BigButtonProps {
    text: string,
    onClick?: () => void,
    color?: string,
    fullWidth?: boolean,
    small?: boolean,
    className?: string,
    
    filled?: boolean,
    textColor?: string,
}

export default function BigButton({ text, onClick, color, fullWidth, small, className, filled = false, textColor = "var(--text)" }: BigButtonProps) {
    
    // const filledColor = `color-mix(in srgb, ${color} 92%, transparent)`
    const filledColor = color;
    const transparentColor = `color-mix(in srgb, ${color} 12%, transparent)`;

    return (
        <button
            onClick={onClick}
            style={
                filled ? {
                    color: textColor,
                    borderColor: filledColor,
                    backgroundColor: filledColor
                } :
                color ? {
                    color,
                    borderColor: color,
                    backgroundColor: transparentColor
                } : undefined
            }
            className={`border-2 rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-80 ${fullWidth ? 'w-full' : 'w-48'} ${small ? 'px-6 py-4 text-base' : 'px-8 py-4 text-xl'} ${className ?? ''}`}
        >
            {text}
        </button>
    )
}