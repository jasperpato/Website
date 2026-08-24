export default function PanelBox({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-base">{title}</h3>
      {children}
    </div>
  );
}
