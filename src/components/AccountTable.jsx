import { useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

// Number of rows shown on each page
const PAGE_SIZE = 10;

// Table columns: "key" is the field name in the data, "label" is the heading shown
const columns = [
  { key: "accountName", label: "Account Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone No." },
  { key: "website", label: "Website" },
  { key: "industry", label: "Industry" },
  { key: "accountStatus", label: "Account Status" },
  { key: "remark", label: "Remark" },
];

export default function AccountTable() {
  // 1. Get the table data from the Redux store
  const accounts = useSelector((state) => state.accounts.list);

  // 2. Local state for search, sorting and pagination
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(""); // column currently sorted
  const [sortDir, setSortDir] = useState("asc"); // "asc" or "desc"
  const [page, setPage] = useState(1); // current page number (starts at 1)

  // 3. GLOBAL FILTER: keep a row if any column contains the search text
  const filtered = accounts.filter((row) => {
    const rowText = columns
      .map((col) => String(row[col.key])) // turn every value into text
      .join(" ")
      .toLowerCase();
    return rowText.includes(search.toLowerCase());
  });

  // 4. SORTING: copy the array first (never change the original), then sort it
  const sorted = [...filtered];
  if (sortKey) {
    sorted.sort((a, b) => {
      const first = String(a[sortKey]).toLowerCase();
      const second = String(b[sortKey]).toLowerCase();
      if (first < second) return sortDir === "asc" ? -1 : 1;
      if (first > second) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  // 5. PAGINATION: cut out only the 10 rows of the current page
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(start, start + PAGE_SIZE);

  // Called when a column heading is clicked
  const handleSort = (key) => {
    if (sortKey === key) {
      // same column clicked again: flip the direction
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      // new column: start with ascending
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Called when the user types in the search box
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // go back to page 1 because the result list changed
  };

  // "Go to page" box: keep the number between 1 and the last page
  const handleGoToPage = (e) => {
    const number = Number(e.target.value);
    if (number >= 1 && number <= totalPages) setPage(number);
  };

  // 6. EXCEL DOWNLOAD: uses "sorted" (all filtered rows, not only the current page)
  // so if a search is applied, only the filtered data is exported.
  const handleDownload = () => {
    // Build plain objects with nice column names for the sheet
    const excelRows = sorted.map((row) => ({
      "Account Name": row.accountName,
      Email: row.email,
      "Phone No.": row.phone,
      Website: row.website,
      Industry: row.industry,
      "Account Status": String(row.accountStatus),
      Remark: row.remark,
    }));

    const sheet = XLSX.utils.json_to_sheet(excelRows); // rows -> sheet
    const book = XLSX.utils.book_new(); // empty workbook
    XLSX.utils.book_append_sheet(book, sheet, "Accounts"); // add sheet to workbook
    XLSX.writeFile(book, "accounts.xlsx"); // download the file
  };

  // Small arrow shown next to the sorted column heading
  const arrow = (key) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "▲" : "▼";
  };

  // Classes shared by the pagination buttons
  const pageBtn = "px-2 py-1 border border-gray-300 rounded disabled:opacity-40";

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* ---------- Top bar: title, Excel button, search box ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Account Lists</h2>
          <p className="text-sm text-gray-500">Here's a list of your accounts.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={sorted.length === 0}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-40"
          >
            Excel
          </button>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search here..."
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 md:w-64"
          />
        </div>
      </div>

      {/* ---------- Table ----------
          overflow-x-auto lets the table scroll sideways on small phones,
          so every column stays readable and sortable on all devices */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm text-left">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              {/* Click a heading to sort that column (asc, then desc) */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-3 cursor-pointer whitespace-nowrap"
                >
                  {col.label} {arrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3">
                    {String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message when nothing matches the search */}
      {pageRows.length === 0 && (
        <p className="text-center text-gray-500 py-6">No matching records found.</p>
      )}

      {/* ---------- Pagination: Page X of Y | Go to page | « ‹ › » ---------- */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-4 text-sm">
        <span>Page {page} of {totalPages}</span>
        <label className="flex items-center gap-1">
          Go to page:
          <input
            type="number"
            min="1"
            max={totalPages}
            value={page}
            onChange={handleGoToPage}
            className="w-16 border border-gray-300 rounded px-2 py-1"
          />
        </label>
        <div className="flex gap-1">
          <button className={pageBtn} onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className={pageBtn} onClick={() => setPage(page - 1)} disabled={page === 1}>‹</button>
          <button className={pageBtn} onClick={() => setPage(page + 1)} disabled={page === totalPages}>›</button>
          <button className={pageBtn} onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}
