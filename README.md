<div align="center">

<img src="./screenshots/banner.svg" width="100%" alt="KharchaPro banner" />

# 💹 KharchaPro

**A modern, folder-based personal finance tracker — track every rupee with folders, categories, charts, and CSV export.**

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-8884D8?style=for-the-badge&logo=chartdotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)

[![License: MIT](https://img.shields.io/github/license/arfanpedekar/kharcha-pro?style=flat-square&color=green)](./LICENSE)
![Last Commit](https://img.shields.io/github/last-commit/arfanpedekar/kharcha-pro?style=flat-square&color=blue)
![Repo Size](https://img.shields.io/github/repo-size/arfanpedekar/kharcha-pro?style=flat-square&color=orange)
![Stars](https://img.shields.io/github/stars/arfanpedekar/kharcha-pro?style=flat-square&color=yellow)

**[🌐 Live Demo](https://arfanpedekar.github.io/kharcha-pro)** · **[📸 Screenshots](#-screenshots)** · **[🚀 Getting Started](#-getting-started)** · **[✨ Features](#-features)**

</div>

---

## 📖 Table of Contents

- [Screenshots](#-screenshots)
- [Features](#-features)
- [Categories](#️-categories)
- [Getting Started](#-getting-started)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [How to Use](#-how-to-use)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📸 Screenshots

<div align="center">

| Dashboard | Folders |
|:---:|:---:|
| <img src="./screenshots/dashboard.svg" width="420" alt="Dashboard preview" /> | <img src="./screenshots/folders.svg" width="420" alt="Folders preview" /> |

<img src="./screenshots/analytics.svg" width="850" alt="Analytics preview" />

**Analytics** — spending breakdown & income vs expense trend

</div>

> These previews are rebuilt from the app's real colors and components (`src/App.jsx`), not live captures. Swap them for real screenshots anytime — run `npm run dev`, capture each view, and drop the images into `/screenshots`.

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 📁 Folders
- Title, target amount & note
- Assign transactions to folders
- Used / remaining / over-budget tracking
- Visual progress bar per folder
- Safe delete → moves txns to Unassigned

</td>
<td width="33%" valign="top">

### 💰 Transactions
- Income or Expense entries
- Amount, date, description, category, notes, folder
- Edit & delete anytime
- Filter by type, category, month, folder
- Full-text search

</td>
<td width="33%" valign="top">

### 📊 Dashboard
- Income, expenses, balance, savings rate
- Recent transactions feed
- Spending-by-category donut chart
- Folder progress overview
- Top 5 categories vs budget

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 📈 Analytics
- Pie chart — spend by category
- Bar chart — income vs expense by month
- Category breakdown vs budgets
- Folder summary with status

</td>
<td width="33%" valign="top">

### 📄 Reports
- Monthly financial summary
- Full transaction log
- Category % analysis
- **Export to CSV** (Excel / Sheets ready)

</td>
<td width="33%" valign="top">

### ⚙️ Settings & Alerts
- Monthly budget limits per category
- Dark / light mode toggle
- ⚠️ Low balance warnings
- Over-budget indicators everywhere

</td>
</tr>
</table>

---

## 🗂️ Categories

<div align="center">

![Food](https://img.shields.io/badge/🍱_Food-f59e0b?style=flat-square&labelColor=1a1d27&color=f59e0b)
![Petrol](https://img.shields.io/badge/⛽_Petrol-ef4444?style=flat-square&labelColor=1a1d27&color=ef4444)
![Recharge](https://img.shields.io/badge/📱_Recharge-8b5cf6?style=flat-square&labelColor=1a1d27&color=8b5cf6)
![Household](https://img.shields.io/badge/🏠_Household-06b6d4?style=flat-square&labelColor=1a1d27&color=06b6d4)
![Travel](https://img.shields.io/badge/✈️_Travel-3b82f6?style=flat-square&labelColor=1a1d27&color=3b82f6)
![Electronics](https://img.shields.io/badge/💻_Electronics-6366f1?style=flat-square&labelColor=1a1d27&color=6366f1)

![Medical](https://img.shields.io/badge/💊_Medical-ec4899?style=flat-square&labelColor=1a1d27&color=ec4899)
![Clothing](https://img.shields.io/badge/👕_Clothing-f97316?style=flat-square&labelColor=1a1d27&color=f97316)
![Internet/WiFi](https://img.shields.io/badge/📶_Internet-14b8a6?style=flat-square&labelColor=1a1d27&color=14b8a6)
![Documents](https://img.shields.io/badge/📄_Documents-84cc16?style=flat-square&labelColor=1a1d27&color=84cc16)
![Other](https://img.shields.io/badge/🔖_Other-64748b?style=flat-square&labelColor=1a1d27&color=64748b)
![Income](https://img.shields.io/badge/💰_Income-22c55e?style=flat-square&labelColor=1a1d27&color=22c55e)

</div>

---

## 🚀 Getting Started

### Prerequisites
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm_or_yarn-CB3837?style=flat-square&logo=npm&logoColor=white)

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

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Build & Deploy

```bash
npm run build     # production build → /dist
npm run deploy    # publish to GitHub Pages
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|:---|:---|
| ⚛️ **React 18** | UI framework |
| ⚡ **Vite** | Build tool & dev server |
| 📊 **Recharts** | Charts & data visualization |
| 🌐 **GitHub Pages** | Free hosting & deployment |
| 🎨 **CSS-in-JS** | Dynamic theming (dark/light mode) |

---

## 📁 Project Structure

```
kharcha-pro/
├── src/
│   ├── App.jsx          # Main application (all components)
│   └── main.jsx         # React entry point
├── public/
├── screenshots/         # README preview images
├── index.html
├── vite.config.js       # Vite + GitHub Pages config
└── package.json
```

---

## 🧑‍💻 How to Use

| Step | Action |
|:---:|:---|
| 1️⃣ | **Create a folder** — Folders → New Folder. Name it *"March Salary"* or *"Goa Trip"* and set a budget. |
| 2️⃣ | **Add a transaction** — Tap *+ Add Transaction*, fill in amount, category, and assign a folder. |
| 3️⃣ | **Track progress** — Dashboard shows folder bars, charts, and balance at a glance. |
| 4️⃣ | **Set budgets** — Settings → set monthly limits per category. |
| 5️⃣ | **Export** — Reports → Download CSV for Excel or Google Sheets. |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
git checkout -b feature/your-feature
git commit -m 'Add your feature'
git push origin feature/your-feature
```
Then open a Pull Request 🎉

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute.

---

## 👤 Author

<div align="center">

**Arfan Pedekar**

[![GitHub](https://img.shields.io/badge/GitHub-@arfanpedekar-181717?style=for-the-badge&logo=github)](https://github.com/arfanpedekar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-arfanpedekar-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/arfanpedekar)

Made with ❤️ and ☕

</div>
