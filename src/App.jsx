import { useState } from "react";
import AccountTable from "./components/AccountTable";
import AccountForm from "./components/AccountForm";

export default function App() {
  // "table" or "form" - decides which screen is visible
  const [tab, setTab] = useState("table");

  // Tailwind classes for the active / inactive tab buttons
  const activeTab = "px-4 py-2 rounded bg-indigo-600 text-white text-sm";
  const normalTab = "px-4 py-2 rounded bg-white text-gray-700 border border-gray-300 text-sm";

  return (
    // Light gray page background, content centered with a max width
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Two tabs, same as the design: Account and Create */}
        <div className="flex gap-2 mb-4">
          <button className={tab === "table" ? activeTab : normalTab} onClick={() => setTab("table")}>
            Account
          </button>
          <button className={tab === "form" ? activeTab : normalTab} onClick={() => setTab("form")}>
            Create
          </button>
        </div>

        {/* Show the table or the form. After saving the form we go back to the table. */}
        {tab === "table" ? <AccountTable /> : <AccountForm onSaved={() => setTab("table")} />}
      </div>
    </div>
  );
}
