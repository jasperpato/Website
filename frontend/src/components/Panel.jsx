export default function Panel({ children }) {
  return (
    <div className="flex-1 rounded-lg border border-border p-4">
      {children}
    </div>
  );
}
