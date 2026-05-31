import { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Food","Petrol","Recharge","Household","Travel","Electronics","Medical","Clothing","Internet/WiFi","Documents","Other"];
const CAT_ICONS  = { Food:"🍱",Petrol:"⛽",Recharge:"📱",Household:"🏠",Travel:"✈️",Electronics:"💻",Medical:"💊",Clothing:"👕","Internet/WiFi":"📶",Documents:"📄",Other:"🔖",Income:"💰",Unassigned:"📌" };
const CAT_COLORS = { Food:"#f59e0b",Petrol:"#ef4444",Recharge:"#8b5cf6",Household:"#06b6d4",Travel:"#3b82f6",Electronics:"#6366f1",Medical:"#ec4899",Clothing:"#f97316","Internet/WiFi":"#14b8a6",Documents:"#84cc16",Other:"#64748b",Income:"#22c55e" };
const FOLDER_COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#ec4899","#8b5cf6","#f97316","#14b8a6","#84cc16","#a855f7","#0ea5e9"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = n => "₹" + Number(n||0).toLocaleString("en-IN");
const today = () => new Date().toISOString().split("T")[0];
let _uid = 1; const uid = () => String(_uid++);

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    const fn = e => e.key==="Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box${wide?" wide":""}`} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── FOLDER FORM ──────────────────────────────────────────────────────────────
function FolderForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || { title:"", amount:"", note:"", color:FOLDER_COLORS[0] });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const ok = f.title.trim() && parseFloat(f.amount) > 0;
  return (
    <div className="form-grid">
      <div className="form-field full">
        <label>Folder Title *</label>
        <input type="text" value={f.title} onChange={e=>s("title",e.target.value)} placeholder="e.g. Monthly Salary, Eid Budget, Trip Fund…" />
      </div>
      <div className="form-field">
        <label>Total Amount (₹) *</label>
        <input type="number" min="0" value={f.amount} onChange={e=>s("amount",e.target.value)} placeholder="0" />
      </div>
      <div className="form-field">
        <label>Folder Color</label>
        <div className="color-picker">
          {FOLDER_COLORS.map(c=>(
            <button key={c} className={`color-dot${f.color===c?" sel":""}`} style={{background:c}} onClick={()=>s("color",c)} />
          ))}
        </div>
      </div>
      <div className="form-field full">
        <label>Note <span style={{fontWeight:400,textTransform:"none"}}>(optional)</span></label>
        <textarea rows={2} value={f.note} onChange={e=>s("note",e.target.value)} placeholder="e.g. March salary disbursement, trip to Goa…" />
      </div>
      <div className="form-row-2">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-save" disabled={!ok} onClick={()=>ok&&onSave({...f,amount:parseFloat(f.amount)})}>
          {initial ? "Update Folder" : "Create Folder"}
        </button>
      </div>
    </div>
  );
}

// ─── TRANSACTION FORM ─────────────────────────────────────────────────────────
function TxnForm({ initial, folders, defaultFolderId, onSave, onCancel }) {
  const [f, setF] = useState(initial || {
    type:"expense", amount:"", date:today(), description:"", category:"Food",
    notes:"", folderId: defaultFolderId || ""
  });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const ok = parseFloat(f.amount)>0 && f.description.trim() && f.date;
  return (
    <div className="form-grid">
      <div className="form-row-2">
        <button className={`type-btn${f.type==="income"?" act-in":""}`} onClick={()=>s("type","income")}>💰 Income</button>
        <button className={`type-btn${f.type==="expense"?" act-ex":""}`} onClick={()=>s("type","expense")}>💸 Expense</button>
      </div>
      <div className="form-field">
        <label>Amount (₹) *</label>
        <input type="number" min="0" value={f.amount} onChange={e=>s("amount",e.target.value)} placeholder="0.00" />
      </div>
      <div className="form-field">
        <label>Date *</label>
        <input type="date" value={f.date} onChange={e=>s("date",e.target.value)} />
      </div>
      <div className="form-field full">
        <label>Description *</label>
        <input type="text" value={f.description} onChange={e=>s("description",e.target.value)} placeholder={f.type==="income"?"e.g. Salary, Freelance…":"e.g. Grocery, Petrol…"} />
      </div>
      {f.type==="expense" && (
        <div className="form-field">
          <label>Category</label>
          <select value={f.category} onChange={e=>s("category",e.target.value)}>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      )}
      <div className="form-field">
        <label>Assign to Folder</label>
        <select value={f.folderId||""} onChange={e=>s("folderId",e.target.value||"")}>
          <option value="">— Unassigned —</option>
          {folders.map(fl=><option key={fl.id} value={fl.id}>📁 {fl.title} · {fmt(fl.amount)}</option>)}
        </select>
      </div>
      <div className="form-field full">
        <label>Notes <span style={{fontWeight:400,textTransform:"none"}}>(optional)</span></label>
        <textarea rows={2} value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="Additional details…" />
      </div>
      <div className="form-row-2">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-save" disabled={!ok} onClick={()=>ok&&onSave({...f,amount:parseFloat(f.amount)})}>
          {initial?"Update":"Save Transaction"}
        </button>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card" style={{borderTop:`3px solid ${color}`}}>
      <div className="stat-icon" style={{background:color+"22",color}}>{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{color}}>{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

// ─── TOOLTIPS ─────────────────────────────────────────────────────────────────
function PieTip({ active, payload }) {
  if (!active||!payload?.length) return null;
  const d = payload[0];
  return <div className="tip"><strong>{d.name}</strong><br/>{fmt(d.value)} ({(d.payload.percent*100).toFixed(1)}%)</div>;
}
function BarTip({ active, payload, label }) {
  if (!active||!payload?.length) return null;
  return <div className="tip"><strong>{label}</strong>{payload.map(p=><div key={p.name} style={{color:p.color}}>{p.name}: {fmt(p.value)}</div>)}</div>;
}

// ─── FOLDER CARD ──────────────────────────────────────────────────────────────
function FolderCard({ folder, txns, onOpen, onEdit, onDelete }) {
  const spent  = txns.filter(t=>t.folderId===folder.id&&t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const income = txns.filter(t=>t.folderId===folder.id&&t.type==="income").reduce((s,t)=>s+t.amount,0);
  const count  = txns.filter(t=>t.folderId===folder.id).length;
  const pct    = folder.amount>0 ? Math.min((spent/folder.amount)*100,100) : 0;
  const over   = spent > folder.amount;
  const left   = folder.amount - spent;
  return (
    <div className="folder-card" onClick={onOpen} style={{borderTop:`3px solid ${folder.color}`}}>
      <div className="fc-top">
        <div className="fc-icon" style={{background:folder.color+"18",color:folder.color}}>📁</div>
        <div className="fc-actions" onClick={e=>e.stopPropagation()}>
          <button className="icon-btn" onClick={onEdit} title="Edit">✏️</button>
          <button className="icon-btn" onClick={onDelete} title="Delete">🗑️</button>
        </div>
      </div>
      <div className="fc-title">{folder.title}</div>
      <div className="fc-amount" style={{color:folder.color}}>{fmt(folder.amount)}</div>
      {folder.note && <div className="fc-note">{folder.note}</div>}
      <div className="fc-bar-bg"><div className="fc-bar" style={{width:pct+"%",background:over?"#ef4444":folder.color}}/></div>
      <div className="fc-stats">
        <span className="fc-spent">−{fmt(spent)}</span>
        <span style={{color:over?"#ef4444":"#22c55e",fontWeight:600,fontSize:12}}>
          {over ? `Over ${fmt(-left)}` : `${fmt(left)} left`}
        </span>
      </div>
      <div className="fc-meta">{count} txn{count!==1?"s":""}{income>0?` · +${fmt(income)} in`:""}</div>
    </div>
  );
}

// ─── FOLDER DETAIL PAGE ───────────────────────────────────────────────────────
function FolderDetail({ folder, txns, folders, onBack, onAddTxn, onEditTxn, onDeleteTxn }) {
  const ftxns  = useMemo(()=>[...txns.filter(t=>t.folderId===folder.id)].sort((a,b)=>new Date(b.date)-new Date(a.date)),[txns,folder.id]);
  const spent  = ftxns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const income = ftxns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const pct    = folder.amount>0?Math.min((spent/folder.amount)*100,100):0;
  const over   = spent > folder.amount;
  const bycat  = useMemo(()=>{
    const m={};
    ftxns.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount});
    return Object.entries(m).map(([name,value])=>({name,value,color:CAT_COLORS[name]||"#888",percent:spent>0?value/spent:0})).sort((a,b)=>b.value-a.value);
  },[ftxns,spent]);

  return (
    <div className="page">
      <div className="page-header" style={{flexWrap:"wrap",gap:10}}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="fc-icon sm" style={{background:folder.color+"18",color:folder.color}}>📁</span>
        <div><h1>{folder.title}</h1>{folder.note&&<span className="subtitle">{folder.note}</span>}</div>
        <button className="btn-primary" style={{marginLeft:"auto"}} onClick={onAddTxn}>+ Add Transaction</button>
      </div>

      {/* Hero bar */}
      <div className="fd-hero" style={{borderLeft:`4px solid ${folder.color}`}}>
        <div className="fd-row">
          <div className="fdh-stat"><span>Folder Amount</span><strong style={{color:folder.color}}>{fmt(folder.amount)}</strong></div>
          <div className="fdh-stat"><span>Total Spent</span><strong style={{color:"#ef4444"}}>{fmt(spent)}</strong></div>
          <div className="fdh-stat"><span>Income Added</span><strong style={{color:"#22c55e"}}>{fmt(income)}</strong></div>
          <div className="fdh-stat"><span>{over?"Over By":"Remaining"}</span><strong style={{color:over?"#ef4444":"#3b82f6"}}>{fmt(Math.abs(folder.amount-spent))}</strong></div>
        </div>
        <div className="fd-bar-bg"><div className="fd-bar" style={{width:pct+"%",background:over?"#ef4444":folder.color}}/></div>
        <div className="fd-pct">{pct.toFixed(1)}% of folder amount used{over&&" — over budget!"}</div>
      </div>

      <div className="dash-grid">
        <div className="card no-pad">
          <div className="card-head" style={{padding:"16px 20px 0"}}>
            <span>Transactions ({ftxns.length})</span>
          </div>
          {ftxns.length===0
            ? <div className="empty">No transactions yet — add one above!</div>
            : ftxns.map(t=>(
              <div key={t.id} className="txn-row-full">
                <span className="cat-icon big">{CAT_ICONS[t.category]||"🔖"}</span>
                <div className="txn-meta">
                  <span className="txn-desc">{t.description}</span>
                  <span className="txn-date">
                    {t.date}
                    {t.type==="expense"&&<> · <span className="cat-pill" style={{background:(CAT_COLORS[t.category]||"#888")+"33",color:CAT_COLORS[t.category]||"#888"}}>{t.category}</span></>}
                  </span>
                  {t.notes&&<span className="txn-notes">{t.notes}</span>}
                </div>
                <div className="txn-right">
                  <span className={`txn-amt ${t.type}`}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  <div className="txn-actions">
                    <button className="icon-btn" onClick={()=>onEditTxn(t)}>✏️</button>
                    <button className="icon-btn" onClick={()=>onDeleteTxn(t.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {bycat.length>0&&(
          <div className="card">
            <div className="card-head"><span>Spending Breakdown</span></div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={bycat} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2}>
                {bycat.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie><Tooltip content={<PieTip/>}/></PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {bycat.map(d=>(
                <div key={d.name} className="legend-item">
                  <span className="ldot" style={{background:d.color}}/><span>{d.name}</span>
                  <span className="lval">{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]   = useState(true);
  const [page, setPage]   = useState("dashboard");
  const [txns, setTxns]   = useState([]);         // starts empty
  const [folders, setFolders] = useState([]);     // starts empty

  // folder modals
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [editFolder, setEditFolder]       = useState(null);
  const [delFolder,  setDelFolder]        = useState(null);
  const [openFolder, setOpenFolder]       = useState(null); // id

  // txn modals
  const [showAddTxn, setShowAddTxn]   = useState(false);
  const [addFolderCtx, setAddFolderCtx] = useState(""); // pre-fill folder
  const [editTxn, setEditTxn]         = useState(null);
  const [delTxnId, setDelTxnId]       = useState(null);

  // filters
  const [search, setSearch]         = useState("");
  const [filterCat, setFilterCat]   = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterMon, setFilterMon]   = useState("All");
  const [filterFol, setFilterFol]   = useState("All");
  const [budgets, setBudgets]       = useState({Food:3000,Petrol:3000,Recharge:1000,Household:20000,Travel:5000,Electronics:5000,Medical:2000,Clothing:3000,"Internet/WiFi":1000,Documents:3000,Other:3000});

  // ── derived ──
  const totalIncome  = useMemo(()=>txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[txns]);
  const totalExpense = useMemo(()=>txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[txns]);
  const balance      = totalIncome - totalExpense;

  const byCategory = useMemo(()=>{
    const m={}; txns.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount});
    return Object.entries(m).map(([name,value])=>({name,value,color:CAT_COLORS[name]||"#888"})).sort((a,b)=>b.value-a.value);
  },[txns]);

  const monthlyData = useMemo(()=>{
    const m={};
    txns.forEach(t=>{ const mn=MONTHS[new Date(t.date+"T00:00:00").getMonth()]; if(!m[mn])m[mn]={month:mn,income:0,expense:0}; if(t.type==="income")m[mn].income+=t.amount; else m[mn].expense+=t.amount; });
    return Object.values(m);
  },[txns]);

  const filtered = useMemo(()=>{
    return txns.filter(t=>{
      if(filterType!=="All"&&t.type!==filterType.toLowerCase())return false;
      if(filterCat!=="All"&&t.category!==filterCat)return false;
      if(filterMon!=="All"){ const m=MONTHS[new Date(t.date+"T00:00:00").getMonth()]; if(m!==filterMon)return false; }
      if(filterFol!=="All"){ if(filterFol==="none"&&t.folderId)return false; if(filterFol!=="none"&&t.folderId!==filterFol)return false; }
      if(search){ const q=search.toLowerCase(); return t.description.toLowerCase().includes(q)||t.category.toLowerCase().includes(q)||String(t.amount).includes(q); }
      return true;
    }).sort((a,b)=>new Date(b.date)-new Date(a.date));
  },[txns,search,filterCat,filterType,filterMon,filterFol]);

  const recent    = useMemo(()=>[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5),[txns]);
  const pieData   = byCategory.map(d=>({...d,percent:totalExpense>0?d.value/totalExpense:0}));
  const lowBal    = balance < 5000 && txns.length > 0;

  // ── folder actions ──
  const saveFolder = form => {
    if(editFolder){ setFolders(fs=>fs.map(f=>f.id===editFolder.id?{...f,...form}:f)); setEditFolder(null); }
    else{ setFolders(fs=>[...fs,{...form,id:uid()}]); setShowNewFolder(false); }
  };
  const confirmDelFolder = () => {
    setTxns(ts=>ts.map(t=>t.folderId===delFolder.id?{...t,folderId:""}:t));
    setFolders(fs=>fs.filter(f=>f.id!==delFolder.id));
    if(openFolder===delFolder.id) setOpenFolder(null);
    setDelFolder(null);
  };

  // ── txn actions ──
  const saveTxn = form => {
    const cat = form.type==="income"?"Income":form.category;
    if(editTxn){
      setTxns(ts=>ts.map(t=>t.id===editTxn.id?{...t,...form,amount:parseFloat(form.amount),category:cat}:t));
      setEditTxn(null);
    } else {
      const fid = addFolderCtx || form.folderId || "";
      setTxns(ts=>[...ts,{...form,id:uid(),amount:parseFloat(form.amount),category:cat,folderId:fid}]);
      setShowAddTxn(false); setAddFolderCtx("");
    }
  };
  const confirmDelTxn = () => { setTxns(ts=>ts.filter(t=>t.id!==delTxnId)); setDelTxnId(null); };

  const exportCSV = () => {
    const rows=[["ID","Type","Amount","Category","Date","Description","Notes","Folder"],...txns.map(t=>[t.id,t.type,t.amount,t.category,t.date,t.description,t.notes||"",folders.find(f=>f.id===t.folderId)?.title||"Unassigned"])];
    const csv=rows.map(r=>r.map(v=>JSON.stringify(v)).join(",")).join("\n");
    const a=document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="kharcha-pro.csv"; a.click();
  };

  const goPage = p => { setPage(p); setOpenFolder(null); };
  const activeFolderObj = openFolder ? folders.find(f=>f.id===openFolder) : null;

  // ── theme ──
  const T = {
    bg:      dark?"#0f1117":"#f0f2f8",
    surface: dark?"#1a1d27":"#ffffff",
    surf2:   dark?"#21253a":"#f7f8fc",
    border:  dark?"#2a2f45":"#e2e6f0",
    text:    dark?"#e8eaf6":"#1a1d2e",
    muted:   dark?"#6b7280":"#8892a4",
    accent:  "#6366f1"
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:T.bg}}>
      <style>{css(T)}</style>

      {/* ── MOBILE TOP BAR (hidden on desktop via CSS) ── */}
      <div className="mobile-topbar">
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.text}}>Kharcha<span style={{color:T.accent}}>Pro</span></span>
        <button onClick={()=>setDark(d=>!d)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,padding:6,color:T.muted}}>
          {dark?"☀️":"🌙"}
        </button>
      </div>

      <div className="app">

      {/* ── SIDEBAR ── */}
      <nav className="sidebar">
        <div className="brand">
          <span className="bi">💹</span>
          <span className="bn">Kharcha<span>Pro</span></span>
        </div>
        <div className="nav-links">
          {[["dashboard","🏠","Dashboard"],["folders","📁","Folders"],["transactions","📋","Transactions"],["analytics","📊","Analytics"],["reports","📄","Reports"],["settings","⚙️","Settings"]].map(([id,ic,lb])=>(
            <button key={id} className={`nav-btn${page===id?" active":""}`} onClick={()=>goPage(id)}>
              <span>{ic}</span><span className="nav-label">{lb}</span>
              {id==="folders"&&folders.length>0&&<span className="nav-badge">{folders.length}</span>}
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={()=>setShowAddTxn(true)}>＋ Add Transaction</button>
        <button className="theme-btn" onClick={()=>setDark(d=>!d)}>{dark?"☀️ Light":"🌙 Dark"}</button>
      </nav>

      {/* ── MAIN ── */}
      <main className="main">
        {lowBal&&<div className="warn-bar">⚠️ Low balance — {fmt(balance)} remaining. Review your spending.</div>}

        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div className="page">
            <div className="page-header"><h1>Dashboard</h1><span className="subtitle">Overview</span></div>
            <div className="stat-grid">
              <StatCard icon="💰" label="Total Income"   value={fmt(totalIncome)}  color="#22c55e" sub="All time" />
              <StatCard icon="💸" label="Total Expenses" value={fmt(totalExpense)} color="#ef4444" sub={`${byCategory.length} categories`} />
              <StatCard icon="🏦" label="Balance"        value={fmt(balance)} color={balance>=0?"#3b82f6":"#ef4444"} sub={balance>=0?"In the green":"Overspent!"} />
              <StatCard icon="📁" label="Folders"        value={folders.length} color="#8b5cf6" sub={`${txns.length} transactions`} />
            </div>

            {txns.length===0 ? (
              <div className="empty-state">
                <div className="es-icon">💹</div>
                <h3>Welcome to KharchaPro</h3>
                <p>Start by creating a folder (e.g. "Monthly Salary", "Trip to Goa"), then add transactions inside it to track every rupee.</p>
                <div className="es-actions">
                  <button className="btn-primary" onClick={()=>setShowNewFolder(true)}>📁 Create Folder</button>
                  <button className="btn-sec" onClick={()=>setShowAddTxn(true)}>＋ Add Transaction</button>
                </div>
              </div>
            ):(
              <>
                <div className="dash-grid">
                  <div className="card">
                    <div className="card-head"><span>Recent Transactions</span><button className="link-btn" onClick={()=>goPage("transactions")}>View All →</button></div>
                    {recent.length===0
                      ? <div className="empty">No transactions yet.</div>
                      : recent.map(t=>{ const fl=folders.find(f=>f.id===t.folderId); return (
                          <div key={t.id} className="txn-row">
                            <span className="cat-icon">{CAT_ICONS[t.category]||"🔖"}</span>
                            <div className="txn-meta">
                              <span className="txn-desc">{t.description}</span>
                              <span className="txn-date">{t.date}{fl&&<> · <span style={{color:fl.color}}>📁 {fl.title}</span></>}</span>
                            </div>
                            <span className={`txn-amt ${t.type}`}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                          </div>
                        );})
                    }
                  </div>
                  {pieData.length>0&&(
                    <div className="card">
                      <div className="card-head"><span>Spending by Category</span></div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2}>
                          {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                        </Pie><Tooltip content={<PieTip/>}/></PieChart>
                      </ResponsiveContainer>
                      <div className="legend">
                        {pieData.slice(0,6).map(d=>(
                          <div key={d.name} className="legend-item">
                            <span className="ldot" style={{background:d.color}}/><span>{d.name}</span><span className="lval">{fmt(d.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Folder progress mini */}
                {folders.length>0&&(
                  <div className="card">
                    <div className="card-head"><span>Folder Progress</span><button className="link-btn" onClick={()=>goPage("folders")}>Manage →</button></div>
                    <div className="fp-grid">
                      {folders.map(fl=>{
                        const sp=txns.filter(t=>t.folderId===fl.id&&t.type==="expense").reduce((s,t)=>s+t.amount,0);
                        const p=fl.amount>0?Math.min((sp/fl.amount)*100,100):0;
                        const ov=sp>fl.amount;
                        return (
                          <div key={fl.id} className="fp-item" onClick={()=>{setPage("folders");setOpenFolder(fl.id);}}>
                            <div className="fp-head">
                              <span style={{color:fl.color}}>📁 {fl.title}</span>
                              <span style={{fontSize:11,color:ov?"#ef4444":"#22c55e",fontWeight:600}}>{ov?`Over ${fmt(sp-fl.amount)}`:`${fmt(fl.amount-sp)} left`}</span>
                            </div>
                            <div className="fp-sub">{fmt(sp)} of {fmt(fl.amount)}</div>
                            <div className="fp-bar-bg"><div className="fp-bar" style={{width:p+"%",background:ov?"#ef4444":fl.color}}/></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {byCategory.length>0&&(
                  <div className="card">
                    <div className="card-head"><span>Top Categories</span></div>
                    <div className="top-cats">
                      {byCategory.slice(0,5).map((c,i)=>(
                        <div key={c.name} className="top-cat-row">
                          <span className="rank">#{i+1}</span>
                          <span className="cat-icon">{CAT_ICONS[c.name]||"🔖"}</span>
                          <div className="cat-bar-wrap">
                            <div className="cat-bar-label"><span>{c.name}</span><span>{fmt(c.value)}</span></div>
                            <div className="cat-bar-bg"><div className="cat-bar-fill" style={{width:(c.value/byCategory[0].value*100)+"%",background:c.color}}/></div>
                          </div>
                          {budgets[c.name]&&<span className={`budget-tag${c.value>budgets[c.name]?" over":""}`}>{c.value>budgets[c.name]?"Over budget":"In budget"}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* FOLDERS LIST */}
        {page==="folders"&&!activeFolderObj&&(
          <div className="page">
            <div className="page-header">
              <h1>Folders</h1>
              <span className="subtitle">{folders.length} folder{folders.length!==1?"s":""}</span>
              <button className="btn-primary" style={{marginLeft:"auto"}} onClick={()=>setShowNewFolder(true)}>📁 New Folder</button>
            </div>

            {folders.length===0 ? (
              <div className="empty-state">
                <div className="es-icon">📁</div>
                <h3>No folders yet</h3>
                <p>Folders help you group transactions by purpose. Each folder has a <strong>title</strong>, a <strong>target amount</strong>, and an optional note. Transactions are then assigned to folders to track usage.</p>
                <button className="btn-primary" onClick={()=>setShowNewFolder(true)}>Create your first folder</button>
              </div>
            ):(
              <div className="folder-grid">
                {folders.map(fl=>(
                  <FolderCard key={fl.id} folder={fl} txns={txns}
                    onOpen={()=>setOpenFolder(fl.id)}
                    onEdit={()=>setEditFolder(fl)}
                    onDelete={()=>setDelFolder(fl)}
                  />
                ))}
                <div className="folder-add-card" onClick={()=>setShowNewFolder(true)}>
                  <span className="fac-plus">＋</span>
                  <span>New Folder</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOLDER DETAIL */}
        {page==="folders"&&activeFolderObj&&(
          <FolderDetail
            folder={activeFolderObj} txns={txns} folders={folders}
            onBack={()=>setOpenFolder(null)}
            onAddTxn={()=>{ setAddFolderCtx(activeFolderObj.id); setShowAddTxn(true); }}
            onEditTxn={setEditTxn}
            onDeleteTxn={setDelTxnId}
          />
        )}

        {/* TRANSACTIONS */}
        {page==="transactions"&&(
          <div className="page">
            <div className="page-header"><h1>Transactions</h1><button className="btn-primary" onClick={()=>setShowAddTxn(true)}>＋ Add</button></div>
            <div className="filter-bar">
              <input className="search-input" placeholder="🔍 Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
              <select value={filterType} onChange={e=>setFilterType(e.target.value)}><option>All</option><option>Income</option><option>Expense</option></select>
              <select value={filterCat}  onChange={e=>setFilterCat(e.target.value)}><option>All</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
              <select value={filterMon}  onChange={e=>setFilterMon(e.target.value)}><option>All</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
              <select value={filterFol}  onChange={e=>setFilterFol(e.target.value)}>
                <option value="All">All Folders</option>
                <option value="none">Unassigned</option>
                {folders.map(fl=><option key={fl.id} value={fl.id}>📁 {fl.title}</option>)}
              </select>
            </div>
            <div className="txn-count">{filtered.length} transaction{filtered.length!==1?"s":""}</div>
            <div className="card no-pad">
              {filtered.length===0
                ? <div className="empty">{txns.length===0?"No transactions yet. Create a folder and add one!":"No results."}</div>
                : filtered.map(t=>{ const fl=folders.find(f=>f.id===t.folderId); return (
                    <div key={t.id} className="txn-row-full">
                      <span className="cat-icon big">{CAT_ICONS[t.category]||"🔖"}</span>
                      <div className="txn-meta">
                        <span className="txn-desc">{t.description}</span>
                        <span className="txn-date">
                          {t.date}
                          {t.type==="expense"&&<> · <span className="cat-pill" style={{background:(CAT_COLORS[t.category]||"#888")+"33",color:CAT_COLORS[t.category]||"#888"}}>{t.category}</span></>}
                          {fl ? <> · <span className="folder-chip" style={{color:fl.color,borderColor:fl.color+"55"}}>📁 {fl.title}</span></> : <span className="unassigned-chip"> · Unassigned</span>}
                        </span>
                        {t.notes&&<span className="txn-notes">{t.notes}</span>}
                      </div>
                      <div className="txn-right">
                        <span className={`txn-amt ${t.type}`}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                        <div className="txn-actions">
                          <button className="icon-btn" onClick={()=>setEditTxn(t)}>✏️</button>
                          <button className="icon-btn" onClick={()=>setDelTxnId(t.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  );})
              }
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {page==="analytics"&&(
          <div className="page">
            <div className="page-header"><h1>Analytics</h1><span className="subtitle">Spending Insights</span></div>
            {txns.length===0
              ? <div className="empty-state"><div className="es-icon">📊</div><h3>No data yet</h3><p>Add transactions to see charts and insights.</p></div>
              : <>
                  <div className="dash-grid">
                    <div className="card">
                      <div className="card-head"><span>Spending by Category</span></div>
                      {pieData.length===0
                        ? <div className="empty">No expense data</div>
                        : <><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" paddingAngle={2}>{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip content={<PieTip/>}/></PieChart></ResponsiveContainer>
                          <div className="legend">{pieData.map(d=><div key={d.name} className="legend-item"><span className="ldot" style={{background:d.color}}/><span>{d.name}</span><span className="lval">{fmt(d.value)}</span></div>)}</div></>
                      }
                    </div>
                    <div className="card">
                      <div className="card-head"><span>Monthly Income vs Expenses</span></div>
                      {monthlyData.length===0
                        ? <div className="empty">No data</div>
                        : <ResponsiveContainer width="100%" height={260}><BarChart data={monthlyData} margin={{top:5,right:5,left:0,bottom:5}}><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>"₹"+v/1000+"k"}/><Tooltip content={<BarTip/>}/><Legend/><Bar dataKey="income" name="Income" fill="#22c55e" radius={[4,4,0,0]}/><Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
                      }
                    </div>
                  </div>
                  {folders.length>0&&(
                    <div className="card">
                      <div className="card-head"><span>Folder Summary</span></div>
                      <div className="breakdown-table">
                        <div className="bt-head"><span>Folder</span><span>Budget</span><span>Spent</span><span>Status</span></div>
                        {folders.map(fl=>{
                          const sp=txns.filter(t=>t.folderId===fl.id&&t.type==="expense").reduce((s,t)=>s+t.amount,0);
                          const ok=sp<=fl.amount;
                          return (
                            <div key={fl.id} className="bt-row" style={{cursor:"pointer"}} onClick={()=>{setPage("folders");setOpenFolder(fl.id);}}>
                              <span><span style={{color:fl.color}}>📁</span> {fl.title}</span>
                              <span style={{color:fl.color}}>{fmt(fl.amount)}</span>
                              <span style={{color:"#ef4444"}}>{fmt(sp)}</span>
                              <span><span className={`status-tag${ok?" ok":" over"}`}>{ok?`${fmt(fl.amount-sp)} left`:`Over ${fmt(sp-fl.amount)}`}</span></span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
            }
          </div>
        )}

        {/* REPORTS */}
        {page==="reports"&&(
          <div className="page">
            <div className="page-header"><h1>Reports</h1><span className="subtitle">Export & Summary</span></div>
            <div className="report-grid">
              <div className="card report-card">
                <div className="report-icon">📊</div>
                <h3>Financial Summary</h3>
                <div className="report-stats">
                  <div><span>Income</span><strong style={{color:"#22c55e"}}>{fmt(totalIncome)}</strong></div>
                  <div><span>Expenses</span><strong style={{color:"#ef4444"}}>{fmt(totalExpense)}</strong></div>
                  <div><span>Balance</span><strong style={{color:"#3b82f6"}}>{fmt(balance)}</strong></div>
                  <div><span>Folders</span><strong>{folders.length}</strong></div>
                </div>
              </div>
              <div className="card report-card">
                <div className="report-icon">📥</div>
                <h3>Export CSV</h3>
                <p>Download all transactions with folder names for Excel or Google Sheets.</p>
                <button className="btn-export" onClick={exportCSV}>⬇️ Download CSV</button>
              </div>
              <div className="card report-card">
                <div className="report-icon">📁</div>
                <h3>Folder Snapshot</h3>
                {folders.length===0 ? <p style={{fontSize:13}}>No folders created yet.</p>
                  : folders.slice(0,5).map(fl=>{ const sp=txns.filter(t=>t.folderId===fl.id&&t.type==="expense").reduce((s,t)=>s+t.amount,0); return (
                      <div key={fl.id} className="rep-cat"><span style={{color:fl.color}}>📁 {fl.title}</span><span>{fmt(sp)} / {fmt(fl.amount)}</span></div>
                    );})
                }
              </div>
            </div>
            <div className="card">
              <div className="card-head"><span>Full Transaction Log</span></div>
              {txns.length===0
                ? <div className="empty">No transactions yet.</div>
                : <div className="breakdown-table">
                    <div className="bt-head"><span>Date</span><span>Description</span><span>Folder</span><span>Amount</span></div>
                    {[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(t=>{ const fl=folders.find(f=>f.id===t.folderId); return (
                      <div key={t.id} className="bt-row">
                        <span>{t.date}</span>
                        <span>{t.description} <span className="cat-pill" style={{background:(CAT_COLORS[t.category]||"#888")+"33",color:CAT_COLORS[t.category]||"#888",marginLeft:4}}>{t.category}</span></span>
                        <span>{fl?<span style={{color:fl.color}}>📁 {fl.title}</span>:<span style={{opacity:.5}}>—</span>}</span>
                        <span className={t.type}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                      </div>
                    );})
                    }
                  </div>
              }
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {page==="settings"&&(
          <div className="page">
            <div className="page-header"><h1>Settings</h1><span className="subtitle">Preferences & Budgets</span></div>
            <div className="card">
              <div className="card-head"><span>Category Budgets</span><span className="subtitle">Monthly spending limits</span></div>
              <div className="budget-grid">
                {CATEGORIES.map(c=>(
                  <div key={c} className="budget-item">
                    <label>{CAT_ICONS[c]} {c}</label>
                    <div className="budget-wrap"><span>₹</span><input type="number" min="0" value={budgets[c]||""} onChange={e=>setBudgets(b=>({...b,[c]:parseFloat(e.target.value)||0}))} placeholder="0"/></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-head"><span>Appearance</span></div>
              <div className="setting-row"><span>Theme</span><button className="btn-toggle" onClick={()=>setDark(d=>!d)}>{dark?"🌙 Dark":"☀️ Light"}</button></div>
            </div>
            <div className="card">
              <div className="card-head"><span>Data</span></div>
              <div className="setting-row"><span>Export all transactions</span><button className="btn-export" onClick={exportCSV}>⬇️ Export CSV</button></div>
              <div className="setting-row"><span>Transactions</span><strong>{txns.length}</strong></div>
              <div className="setting-row"><span>Folders</span><strong>{folders.length}</strong></div>
            </div>
          </div>
        )}
      </main>
      </div>{/* end .app */}

      {/* ── MOBILE FAB ── */}
      <button className="mobile-fab" onClick={()=>setShowAddTxn(true)}>＋</button>

      {/* ── BOTTOM NAV (mobile only) ── */}
      <nav className="bottom-nav">
        {[["dashboard","🏠","Home"],["folders","📁","Folders"],["transactions","📋","Txns"],["analytics","📊","Charts"],["settings","⚙️","More"]].map(([id,ic,lb])=>(
          <button key={id} className={`bn-btn${page===id?" active":""}`} onClick={()=>goPage(id)}>
            <span className="bn-icon">{ic}</span>
            <span>{lb}</span>
            {id==="folders"&&folders.length>0&&<span className="bn-badge">{folders.length}</span>}
          </button>
        ))}
      </nav>

      {/* ── MODALS ── */}
      <Modal open={showNewFolder} onClose={()=>setShowNewFolder(false)} title="New Folder">
        <FolderForm onSave={saveFolder} onCancel={()=>setShowNewFolder(false)}/>
      </Modal>
      <Modal open={!!editFolder} onClose={()=>setEditFolder(null)} title="Edit Folder">
        {editFolder&&<FolderForm initial={editFolder} onSave={saveFolder} onCancel={()=>setEditFolder(null)}/>}
      </Modal>
      <Modal open={!!delFolder} onClose={()=>setDelFolder(null)} title="Delete Folder">
        {delFolder&&(
          <div style={{textAlign:"center",padding:"8px 0 4px"}}>
            <div style={{fontSize:48,marginBottom:12}}>🗑️</div>
            <p style={{marginBottom:6}}><strong>Delete "{delFolder.title}"?</strong></p>
            <p style={{fontSize:13,opacity:.7,marginBottom:20}}>All transactions in this folder will become Unassigned.</p>
            <div className="form-row-2">
              <button className="btn-cancel" onClick={()=>setDelFolder(null)}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelFolder}>Delete Folder</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={showAddTxn} onClose={()=>{setShowAddTxn(false);setAddFolderCtx("");}} title="Add Transaction" wide>
        <TxnForm folders={folders} defaultFolderId={addFolderCtx} onSave={saveTxn} onCancel={()=>{setShowAddTxn(false);setAddFolderCtx("");}}/>
      </Modal>
      <Modal open={!!editTxn} onClose={()=>setEditTxn(null)} title="Edit Transaction" wide>
        {editTxn&&<TxnForm initial={editTxn} folders={folders} onSave={saveTxn} onCancel={()=>setEditTxn(null)}/>}
      </Modal>
      <Modal open={!!delTxnId} onClose={()=>setDelTxnId(null)} title="Delete Transaction">
        <div style={{textAlign:"center",padding:"8px 0 4px"}}>
          <div style={{fontSize:48,marginBottom:12}}>🗑️</div>
          <p style={{marginBottom:20,opacity:.7,fontSize:13}}>Remove this transaction? This cannot be undone.</p>
          <div className="form-row-2">
            <button className="btn-cancel" onClick={()=>setDelTxnId(null)}>Cancel</button>
            <button className="btn-delete" onClick={confirmDelTxn}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
function css({bg,surface,surf2,border,text,muted,accent}) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

/* ── RESET & FULLSCREEN BASE ── */
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{height:100%;height:100dvh}
body{height:100%;height:100dvh;overscroll-behavior:none;-webkit-overflow-scrolling:touch;overflow:hidden}
#root{height:100%;height:100dvh;display:flex;flex-direction:column}

.app{display:flex;height:100%;height:100dvh;background:${bg};color:${text};font-family:'Space Grotesk',sans-serif;overflow:hidden}

/* ── DESKTOP SIDEBAR ── */
.sidebar{width:220px;height:100%;background:${surface};border-right:1px solid ${border};display:flex;flex-direction:column;padding:24px 14px;gap:6px;flex-shrink:0;overflow-y:auto}
.brand{display:flex;align-items:center;gap:10px;padding:0 8px 18px;border-bottom:1px solid ${border};margin-bottom:6px}
.bi{font-size:24px}
.bn{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:${text}}
.bn span{color:${accent}}
.nav-links{display:flex;flex-direction:column;gap:2px;flex:1}
.nav-btn{display:flex;align-items:center;gap:9px;padding:9px 12px;border:none;background:transparent;color:${muted};border-radius:10px;cursor:pointer;font-size:13.5px;font-family:inherit;font-weight:500;transition:all .14s;text-align:left;width:100%;min-height:44px}
.nav-btn:hover{background:${surf2};color:${text}}
.nav-btn.active{background:${accent}20;color:${accent};font-weight:600}
.nav-label{flex:1}
.nav-badge{background:${accent};color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px}
.add-btn{margin-top:16px;padding:13px;background:${accent};color:#fff;border:none;border-radius:10px;cursor:pointer;font-size:13.5px;font-family:inherit;font-weight:600;min-height:44px}
.add-btn:hover{opacity:.88}
.theme-btn{margin-top:6px;padding:9px;background:${surf2};color:${muted};border:1px solid ${border};border-radius:10px;cursor:pointer;font-size:13px;font-family:inherit;min-height:40px}

/* ── MAIN SCROLL AREA ── */
.main{flex:1;overflow-y:auto;overflow-x:hidden;padding:24px 20px;padding-bottom:calc(24px + env(safe-area-inset-bottom));-webkit-overflow-scrolling:touch}
.page{display:flex;flex-direction:column;gap:18px;max-width:1100px}
.page-header{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.page-header h1{font-family:'Syne',sans-serif;font-size:25px;font-weight:800}
.subtitle{color:${muted};font-size:13px}
.btn-primary{padding:10px 18px;background:${accent};color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;min-height:44px}
.btn-primary:hover{opacity:.88}
.btn-sec{padding:10px 18px;background:${surf2};color:${text};border:1px solid ${border};border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;font-family:inherit;min-height:44px}
.back-btn{padding:9px 14px;background:${surf2};color:${muted};border:1px solid ${border};border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;min-height:44px}

/* ── STAT CARDS ── */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:${surface};border-radius:13px;padding:16px;display:flex;align-items:center;gap:13px;border:1px solid ${border}}
.stat-icon{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0}
.stat-label{font-size:11px;color:${muted};font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.stat-value{font-size:19px;font-weight:700;margin:2px 0}
.stat-sub{font-size:11px;color:${muted}}

/* ── GENERIC CARD ── */
.card{background:${surface};border-radius:13px;padding:18px;border:1px solid ${border}}
.card.no-pad{padding:0;overflow:hidden}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-weight:600;font-size:14px}
.link-btn{background:none;border:none;color:${accent};cursor:pointer;font-size:12px;font-family:inherit;min-height:44px;padding:4px 8px}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.empty{padding:36px;text-align:center;color:${muted};font-size:13px}

/* ── EMPTY STATE ── */
.empty-state{background:${surface};border:1px solid ${border};border-radius:16px;padding:48px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.es-icon{font-size:54px}
.empty-state h3{font-family:'Syne',sans-serif;font-size:20px}
.empty-state p{color:${muted};font-size:13.5px;max-width:380px;line-height:1.65}
.es-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}

/* ── FOLDER GRID ── */
.folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.folder-card{background:${surface};border:1px solid ${border};border-radius:14px;padding:16px;cursor:pointer;transition:transform .14s,box-shadow .14s;display:flex;flex-direction:column;gap:8px}
.folder-card:active{transform:scale(.98)}
.fc-top{display:flex;align-items:center;justify-content:space-between}
.fc-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid transparent}
.fc-icon.sm{width:34px;height:34px;border-radius:8px;font-size:18px;border:1px solid transparent;flex-shrink:0}
.fc-actions{display:flex;gap:4px}
.fc-title{font-size:15px;font-weight:700;line-height:1.3}
.fc-amount{font-size:20px;font-weight:800;font-family:'Syne',sans-serif}
.fc-note{font-size:12px;color:${muted};font-style:italic;line-height:1.4}
.fc-bar-bg{height:6px;background:${border};border-radius:3px;overflow:hidden}
.fc-bar{height:100%;border-radius:3px;transition:width .4s}
.fc-stats{display:flex;justify-content:space-between;font-size:12px}
.fc-spent{color:${muted}}
.fc-meta{font-size:11px;color:${muted}}
.folder-add-card{background:${surf2};border:2px dashed ${border};border-radius:14px;padding:16px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:${muted};font-size:13px;font-weight:500;min-height:160px;transition:border-color .14s,color .14s}
.folder-add-card:hover{border-color:${accent};color:${accent}}
.fac-plus{font-size:28px;font-weight:300}

/* ── FOLDER DETAIL ── */
.fd-hero{background:${surf2};border-radius:12px;padding:18px 20px;display:flex;flex-direction:column;gap:12px;border:1px solid ${border}}
.fd-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.fdh-stat{display:flex;flex-direction:column;gap:3px}
.fdh-stat span{font-size:11px;color:${muted};text-transform:uppercase;letter-spacing:.4px}
.fdh-stat strong{font-size:18px;font-weight:700}
.fd-bar-bg{height:8px;background:${border};border-radius:4px;overflow:hidden}
.fd-bar{height:100%;border-radius:4px;transition:width .5s}
.fd-pct{font-size:12px;color:${muted}}

/* ── FOLDER PROGRESS ── */
.fp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.fp-item{padding:12px 14px;background:${surf2};border-radius:10px;border:1px solid ${border};cursor:pointer;transition:background .12s}
.fp-item:active{background:${border}}
.fp-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;margin-bottom:3px}
.fp-sub{font-size:11px;color:${muted};margin-bottom:7px}
.fp-bar-bg{height:5px;background:${border};border-radius:3px;overflow:hidden}
.fp-bar{height:100%;border-radius:3px;transition:width .4s}

/* ── TRANSACTIONS ── */
.txn-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid ${border}}
.txn-row:last-child{border:none}
.txn-row-full{display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border-bottom:1px solid ${border};transition:background .1s;min-height:60px}
.txn-row-full:last-child{border:none}
.txn-row-full:active{background:${surf2}}
.txn-row-full .txn-actions{opacity:1}
.cat-icon{font-size:20px;flex-shrink:0}
.cat-icon.big{font-size:23px}
.txn-meta{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0}
.txn-desc{font-size:14px;font-weight:600}
.txn-date{font-size:12px;color:${muted};display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.txn-notes{font-size:12px;color:${muted};font-style:italic}
.txn-amt{font-size:15px;font-weight:700;white-space:nowrap}
.txn-amt.income,.income{color:#22c55e}
.txn-amt.expense,.expense{color:#ef4444}
.txn-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
.txn-actions{display:flex;gap:4px}
.cat-pill{padding:2px 7px;border-radius:20px;font-size:11px;font-weight:600}
.folder-chip{padding:2px 7px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}
.unassigned-chip{font-size:11px;opacity:.5}
.filter-bar{display:flex;gap:8px;flex-wrap:wrap}
.filter-bar select,.filter-bar input{padding:10px 11px;background:${surface};border:1px solid ${border};border-radius:8px;color:${text};font-size:13px;font-family:inherit;outline:none;min-height:44px}
.search-input{flex:1;min-width:160px}
.txn-count{font-size:12px;color:${muted}}

/* ── TOP CATS ── */
.top-cats{display:flex;flex-direction:column;gap:11px}
.top-cat-row{display:flex;align-items:center;gap:10px}
.rank{font-size:12px;color:${muted};width:20px;font-weight:600}
.cat-bar-wrap{flex:1}
.cat-bar-label{display:flex;justify-content:space-between;font-size:13px;font-weight:500;margin-bottom:4px}
.cat-bar-bg{height:6px;background:${border};border-radius:3px;overflow:hidden}
.cat-bar-fill{height:100%;border-radius:3px}
.budget-tag{font-size:11px;padding:2px 7px;border-radius:20px;background:#22c55e22;color:#22c55e;white-space:nowrap}
.budget-tag.over{background:#ef444422;color:#ef4444}

/* ── LEGEND ── */
.legend{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:10px}
.legend-item{display:flex;align-items:center;gap:6px;font-size:11.5px}
.ldot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.lval{margin-left:auto;color:${muted}}

/* ── TABLE ── */
.breakdown-table{display:flex;flex-direction:column}
.bt-head{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:9px 14px;font-size:11px;color:${muted};font-weight:600;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid ${border}}
.bt-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:12px 14px;font-size:13px;border-bottom:1px solid ${border};align-items:center}
.bt-row:last-child{border:none}
.bt-row:active{background:${surf2}}
.status-tag{padding:2px 7px;border-radius:20px;font-size:11px;font-weight:600}
.status-tag.ok{background:#22c55e22;color:#22c55e}
.status-tag.over{background:#ef444422;color:#ef4444}

/* ── REPORTS ── */
.report-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.report-card{text-align:center}
.report-icon{font-size:40px;margin-bottom:10px}
.report-card h3{font-size:15px;margin-bottom:7px}
.report-card p{font-size:12.5px;color:${muted};margin-bottom:14px}
.report-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}
.report-stats div{display:flex;flex-direction:column;gap:2px}
.report-stats span{font-size:11px;color:${muted};text-transform:uppercase}
.report-stats strong{font-size:15px;font-weight:700}
.btn-export{padding:11px 18px;background:#22c55e22;color:#22c55e;border:1px solid #22c55e44;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;min-height:44px}
.btn-export:active{background:#22c55e33}
.rep-cat{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${border};font-size:13px}

/* ── SETTINGS ── */
.budget-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-top:4px}
.budget-item{display:flex;flex-direction:column;gap:5px}
.budget-item label{font-size:13px;font-weight:500}
.budget-wrap{display:flex;align-items:center;gap:4px;background:${surf2};border:1px solid ${border};border-radius:8px;padding:8px 9px}
.budget-wrap span{color:${muted};font-size:13px}
.budget-wrap input{background:none;border:none;color:${text};font-size:14px;font-family:inherit;width:100%;outline:none;min-height:30px}
.setting-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid ${border};font-size:14px;min-height:52px}
.setting-row:last-child{border:none}
.btn-toggle{padding:9px 14px;background:${surf2};border:1px solid ${border};border-radius:8px;cursor:pointer;font-family:inherit;color:${text};font-size:13px;min-height:44px}

/* ── MODAL ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;z-index:1000;padding:0}
.modal-box{background:${surface};border-radius:20px 20px 0 0;width:100%;max-width:100%;border:1px solid ${border};box-shadow:0 -8px 40px rgba(0,0,0,.4);max-height:90dvh;display:flex;flex-direction:column}
.modal-box.wide{max-width:100%}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid ${border};flex-shrink:0}
.modal-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700}
.modal-close{background:none;border:none;color:${muted};cursor:pointer;font-size:22px;padding:4px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:8px}
.modal-body{padding:18px 20px;overflow-y:auto;padding-bottom:calc(18px + env(safe-area-inset-bottom));-webkit-overflow-scrolling:touch}

/* ── FORM ── */
.form-grid{display:flex;flex-direction:column;gap:14px}
.form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-field{display:flex;flex-direction:column;gap:6px}
.form-field.full{grid-column:1/-1}
.form-field label{font-size:11px;font-weight:700;color:${muted};text-transform:uppercase;letter-spacing:.4px}
.form-field input,.form-field select,.form-field textarea{padding:11px 12px;background:${surf2};border:1px solid ${border};border-radius:10px;color:${text};font-size:16px;font-family:inherit;outline:none;transition:border-color .14s;resize:none;min-height:46px;-webkit-appearance:none}
.form-field input:focus,.form-field select:focus,.form-field textarea:focus{border-color:${accent}}
.type-btn{padding:12px;background:${surf2};border:1px solid ${border};border-radius:10px;color:${muted};cursor:pointer;font-size:15px;font-family:inherit;font-weight:500;transition:all .14s;min-height:48px}
.type-btn.act-in{background:#22c55e22;border-color:#22c55e;color:#22c55e;font-weight:600}
.type-btn.act-ex{background:#ef444422;border-color:#ef4444;color:#ef4444;font-weight:600}
.btn-save{padding:13px;background:${accent};color:#fff;border:none;border-radius:10px;cursor:pointer;font-size:15px;font-weight:600;font-family:inherit;min-height:50px}
.btn-save:disabled{opacity:.35;cursor:not-allowed}
.btn-cancel{padding:13px;background:${surf2};color:${muted};border:1px solid ${border};border-radius:10px;cursor:pointer;font-size:15px;font-family:inherit;min-height:50px}
.btn-delete{padding:13px;background:#ef444420;color:#ef4444;border:1px solid #ef444440;border-radius:10px;cursor:pointer;font-size:15px;font-weight:600;font-family:inherit;min-height:50px}
.icon-btn{background:none;border:none;cursor:pointer;font-size:16px;padding:6px;border-radius:8px;min-width:36px;min-height:36px;display:flex;align-items:center;justify-content:center}
.icon-btn:active{background:${surf2}}
.color-picker{display:flex;gap:8px;flex-wrap:wrap;padding:3px 0}
.color-dot{width:28px;height:28px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .14s}
.color-dot:active{transform:scale(1.2)}
.color-dot.sel{border-color:#fff;box-shadow:0 0 0 2px ${accent};transform:scale(1.1)}
.tip{background:${surface};border:1px solid ${border};border-radius:8px;padding:9px 13px;font-size:13px;box-shadow:0 4px 18px rgba(0,0,0,.2)}
.warn-bar{background:#f59e0b1a;border:1px solid #f59e0b40;color:#f59e0b;border-radius:9px;padding:12px 15px;font-size:13px;font-weight:500;margin-bottom:2px}

/* ── BOTTOM NAV (mobile only) ── */
.bottom-nav{display:none}

/* ── TABLET ── */
@media(max-width:900px){
  .stat-grid{grid-template-columns:1fr 1fr}
  .dash-grid{grid-template-columns:1fr}
  .report-grid{grid-template-columns:1fr}
  .budget-grid{grid-template-columns:1fr 1fr}
  .fd-row{grid-template-columns:1fr 1fr}
}

/* ── MOBILE ── */
@media(max-width:640px){
  /* Hide desktop sidebar, show bottom nav */
  .sidebar{display:none}
  .bottom-nav{
    display:flex;
    position:fixed;
    bottom:0;left:0;right:0;
    height:calc(62px + env(safe-area-inset-bottom));
    padding-bottom:env(safe-area-inset-bottom);
    background:${surface};
    border-top:1px solid ${border};
    z-index:100;
    align-items:stretch;
  }
  .bn-btn{
    flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:3px;border:none;background:transparent;color:${muted};cursor:pointer;
    font-size:10px;font-family:inherit;font-weight:500;padding:6px 2px;
    transition:color .14s;position:relative;
  }
  .bn-btn.active{color:${accent}}
  .bn-btn .bn-icon{font-size:20px;line-height:1}
  .bn-btn .bn-badge{
    position:absolute;top:6px;right:calc(50% - 18px);
    background:${accent};color:#fff;font-size:9px;font-weight:700;
    padding:1px 5px;border-radius:99px;min-width:16px;text-align:center;
  }
  /* FAB for add transaction */
  .mobile-fab{
    position:fixed;bottom:calc(70px + env(safe-area-inset-bottom));right:18px;
    width:54px;height:54px;background:${accent};color:#fff;
    border:none;border-radius:50%;font-size:26px;cursor:pointer;
    box-shadow:0 4px 18px rgba(99,102,241,.5);z-index:99;
    display:flex;align-items:center;justify-content:center;
  }
  /* Main padding for bottom nav */
  .main{padding:16px 14px;padding-bottom:calc(80px + env(safe-area-inset-bottom))}
  /* Top bar on mobile */
  .mobile-topbar{
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 16px;padding-top:calc(12px + env(safe-area-inset-top));
    background:${surface};border-bottom:1px solid ${border};
    position:sticky;top:0;z-index:50;flex-shrink:0;
  }
  .mobile-topbar .bn{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:${text}}
  .mobile-topbar .bn span{color:${accent}}

  /* Layout adjustments */
  .stat-grid{grid-template-columns:1fr 1fr}
  .folder-grid{grid-template-columns:1fr 1fr}
  .fd-row{grid-template-columns:1fr 1fr}
  .bt-head,.bt-row{grid-template-columns:2fr 1fr}
  .bt-head span:nth-child(3),.bt-head span:nth-child(4),
  .bt-row span:nth-child(3),.bt-row span:nth-child(4){display:none}
  .report-grid{grid-template-columns:1fr}
  .budget-grid{grid-template-columns:1fr 1fr}
  .stat-value{font-size:16px}
  .page-header h1{font-size:21px}
  /* Modal slides up from bottom — already handled */
  .modal-box{border-radius:20px 20px 0 0}
}

/* ── Hide mobile topbar on desktop ── */
@media(min-width:641px){
  .mobile-topbar{display:none}
  .mobile-fab{display:none}
  .bottom-nav{display:none}
}
  `;
}
