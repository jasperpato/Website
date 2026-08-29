interface ButtonProps {
  label: string
  onClick: () => void
  primary?: boolean
  enabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Button({ label, onClick, primary = false, enabled = true, className = "", style = undefined }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      style={style}
      className={`px-4 py-2 rounded border transition-opacity ${
        primary
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-muted border-border'
      } ${enabled ? 'cursor-pointer' : 'opacity-40'} ${className}`}
    >
      {label}
    </button>
  );
}
