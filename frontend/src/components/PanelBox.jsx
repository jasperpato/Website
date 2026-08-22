export default function PanelBox({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-base">{title}</h2>
      {children}
    </div>
  );
}
