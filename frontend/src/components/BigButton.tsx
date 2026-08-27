interface BigButtonProps {
    text: string,
    onClick?: () => void,
    borderColor?: string,
    textColor?: string,
    color?: string,
}

export default function BigButton({ text, onClick, textColor, borderColor, color }: BigButtonProps) {
    return (
        <button
            onClick={onClick}
            style={color ? { color, borderColor: color } : undefined}
            className={`${textColor ?? ''} ${borderColor ?? ''} bg-white border-2 rounded-lg px-8 py-4 w-48 text-xl font-bold cursor-pointer transition-opacity hover:opacity-80`}
        >
            {text}
        </button>
    )
}