# 💹 KharchaPro — Personal Expense Tracker

> A modern, folder-based personal finance tracker built with React. Track every rupee with folders, categories, charts, and CSV export — completely free to use.

![KharchaPro](https://img.shields.io/badge/Built%20With-React-61dafb?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Deploy](https://img.shields.io/badge/Deployed%20On-GitHub%20Pages-black?style=flat-square&logo=github)

---

## 🌐 Live Demo

👉 **[https://arfanpedekar.github.io/kharcha-pro](https://arfanpedekar.github.io/kharcha-pro)**

---

## 📸 Screenshots

| Dashboard | Folders | Analytics |
|-----------|---------|-----------|
| Overview with stats, charts & folder progress | Create folders with title, amount & color | Pie chart, bar graph & budget breakdown |

---

## ✨ Features

### 📁 Folder System
- Create folders with a **title**, **target amount**, and optional **note**
- Assign any transaction to a folder
- Each folder tracks: amount used, remaining balance, over-budget alerts
- Visual progress bar per folder
- Delete folders safely — transactions move to Unassigned

### 💰 Transactions
- Add **Income** or **Expense** transactions
- Fields: Amount, Date, Description, Category, Notes, Folder
- **Edit** and **Delete** any transaction
- Filter by Type, Category, Month, and Folder
- Full-text search across all transactions

### 📊 Dashboard
- Total Income, Total Expenses, Balance, Savings Rate
- Recent transactions feed
- Spending by category (donut chart)
- Folder progress overview
- Top 5 spending categories with budget indicators

### 📈 Analytics
- Pie chart — spending by category
- Bar chart — monthly income vs expenses
- Category breakdown table vs set budgets
- Folder summary with budget status

### 📄 Reports
- Monthly financial summary
- Full transaction log
- Category analysis with percentages
- **Export all data to CSV** (works with Excel & Google Sheets)

### ⚙️ Settings
- Set monthly **budget limits** per category
- **Dark / Light mode** toggle
- Data export from settings

### 🔔 Smart Alerts
- ⚠️ Low balance warning banner
- Over-budget indicators on folders and categories

---

## 🗂️ Categories

| Icon | Category | Icon | Category |
|------|----------|------|----------|
| 🍱 | Food | 💊 | Medical |
| ⛽ | Petrol | 👕 | Clothing |
| 📱 | Recharge | 📶 | Internet/WiFi |
| 🏠 | Household | 📄 | Documents |
| ✈️ | Travel | 🔖 | Other |
| 💻 | Electronics | 💰 | Income |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/arfanpedekar/kharcha-pro.git
cd kharcha-pro

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Recharts** | Charts & data visualization |
| **GitHub Pages** | Free hosting & deployment |
| **CSS-in-JS** | Dynamic theming (dark/light mode) |

---

## 📁 Project Structure

```
kharcha-pro/
├── src/
│   ├── App.jsx          # Main application (all components)
│   └── main.jsx         # React entry point
├── public/
├── index.html
├── vite.config.js       # Vite + GitHub Pages config
└── package.json
```

---

## 🧑‍💻 How to Use

1. **Create a Folder** — Go to Folders → New Folder. Give it a name like *"March Salary"* or *"Goa Trip"* and set a budget amount.
2. **Add Transactions** — Click *+ Add Transaction*, fill in the amount, category, and assign it to a folder.
3. **Track Progress** — The dashboard shows folder progress bars, charts, and balance at a glance.
4. **Set Budgets** — Go to Settings to set monthly spending limits per category.
5. **Export** — Go to Reports → Download CSV to get all your data in Excel format.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 👤 Author

**Arfan Pedekar**
- GitHub: [@arfanpedekar](https://github.com/arfanpedekar)
- LinkedIn: [linkedin.com/in/arfanpedekar](https://linkedin.com/in/arfanpedekar)

---

<p align="center">Made with ❤️ by Arfan Pedekar</p>
