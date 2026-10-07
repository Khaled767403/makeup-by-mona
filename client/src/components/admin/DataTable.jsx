export default function DataTable({ columns, rows, emptyMessage = "No records found." }) {
  if (!rows.length) {
    return <p className="py-10 text-center text-sm text-ink-soft">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-nude/40">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-nude/60 bg-blush/30 text-ink-soft">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-nude/40">
          {rows.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-blush/10">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
