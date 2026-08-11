type StatCardProps = {
  label: string
  value: number | string
}

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-medium text-slate-500">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-slate-900">
        {value}
      </h3>
    </div>
  )
}
