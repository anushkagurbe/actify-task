# Actify Task - React Table

Built with React (Vite), Tailwind CSS, Redux Toolkit, React Hook Form and SheetJS (xlsx).

## Features
- Table with hardcoded dummy data, 10 rows per page
- Global search across all columns
- Ascending / descending sort on every column
- Responsive: scrolls sideways on small screens, form stacks on mobile
- Download Excel (exports only the filtered data)
- Create form with validation (React Hook Form)
- Table data stored globally with Redux Toolkit

## Run
    npm install
    npm run dev

## Structure
- src/data/dummyData.js - hardcoded data
- src/store/ - Redux store and accounts slice
- src/components/AccountTable.jsx - table, search, sort, pagination, Excel
- src/components/AccountForm.jsx - validated form
