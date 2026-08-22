export default function Button({ label, onClick, primary = false, enabled = true }) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className={`px-4 py-2 rounded text-sm border w-32 transition-opacity ${
        primary
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-muted border-border'
      } ${enabled ? 'cursor-pointer' : 'opacity-40'}`}
    >
      {label}
    </button>
  );
}
