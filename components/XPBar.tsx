export function XPBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="xpbar">
      <div
        className="xpbar-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}