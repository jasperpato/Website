export default function Button({ label, onClick, primary = false, enabled = true, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
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
