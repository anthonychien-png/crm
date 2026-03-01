import React, { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES  (light mode)
═══════════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Lora:wght@600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#f1f5f9;color:#0f172a;font-size:14px;line-height:1.5}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:#f8fafc}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
  ::-webkit-scrollbar-thumb:hover{background:#94a3b8}
  ::selection{background:#dbeafe;color:#1e40af}

  /* ── Layout ── */
  .crm-wrap{display:flex;min-height:100vh}
  .sidebar{width:240px;background:#fff;border-right:1px solid #e2e8f0;flex-shrink:0;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto}
  .main{margin-left:240px;flex:1;padding:26px 28px;min-height:100vh;background:#f1f5f9;transition:padding-right .2s}
  .main.dp-open{padding-right:390px}

  /* ── Sidebar ── */
  .logo-wrap{padding:16px 14px 12px;border-bottom:1px solid #f1f5f9}
  .logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .logo-name{font-family:'Lora',serif;font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-.3px;line-height:1}
  .logo-sub{font-size:9px;color:#94a3b8;letter-spacing:1.8px;text-transform:uppercase;font-weight:600;margin-top:1px}
  .srch-wrap{padding:8px 10px}
  .srch-inner{position:relative}
  .srch-inp{width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:7px 10px 7px 28px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:#0f172a;outline:none;transition:border-color .15s}
  .srch-inp:focus{border-color:#3b82f6;background:#fff}
  .srch-ico{position:absolute;left:8px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none}
  .nav-sec{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1.4px;padding:12px 12px 3px}
  .ni{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;transition:all .12s;color:#475569;font-size:13.5px;font-weight:400;margin:1px 8px}
  .ni:hover{background:#f8fafc;color:#0f172a}
  .ni.on{background:#eff6ff;color:#1e40af;font-weight:600}
  .ni.on .nct{background:#dbeafe;color:#1e40af}
  .nct{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:11px;background:#f1f5f9;color:#94a3b8;border-radius:99px;padding:1px 7px}
  .sidebar-footer{padding:11px 14px;border-top:1px solid #f1f5f9;display:flex;align-items:center;gap:9px;margin-top:auto}
  .av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}

  /* ── Detail panel ── */
  .dp{position:fixed;right:0;top:0;bottom:0;width:374px;background:#fff;border-left:1px solid #e2e8f0;box-shadow:-4px 0 20px rgba(0,0,0,.05);z-index:90;overflow-y:auto;transform:translateX(100%);transition:transform .2s ease}
  .dp.open{transform:translateX(0)}
  .dp-head{padding:14px 16px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1}
  .dp-title{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px}
  .dp-body{padding:14px 16px}
  .dr{display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid #f8fafc}
  .dl{font-size:10.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;flex-shrink:0;margin-right:8px;padding-top:1px}
  .dv{font-size:13px;color:#0f172a;text-align:right;word-break:break-word}
  .dsec{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;margin:14px 0 6px}
  .dp-item{padding:7px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;margin-bottom:5px;cursor:pointer;transition:background .12s;display:flex;justify-content:space-between;align-items:center}
  .dp-item:hover{background:#eff6ff}
  .dp-note{padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;font-size:13px;color:#475569;line-height:1.6;margin-top:6px}
  .dp-actions{display:flex;gap:8px;padding:12px 16px;border-top:1px solid #e2e8f0;position:sticky;bottom:0;background:#fff}
  .dp-hero{padding:14px;background:linear-gradient(135deg,#eff6ff,#f5f3ff);border:1px solid #dbeafe;border-radius:10px;margin-bottom:14px}
  .pb-bg{background:#e2e8f0;border-radius:99px;height:6px;overflow:hidden;margin:4px 0}
  .pb-fill{height:100%;border-radius:99px;transition:width .4s}

  /* ── Cards & Tables ── */
  .page-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px}
  .page-title{font-family:'Lora',serif;font-size:24px;font-weight:700;color:#0f172a}
  .page-sub{font-size:13px;color:#94a3b8;margin-top:2px}
  .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;margin-bottom:22px}
  .stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.05);display:flex;align-items:center;gap:12px}
  .stat-icon{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .stat-val{font-size:21px;font-weight:700;line-height:1;font-family:'Lora',serif}
  .stat-lbl{font-size:11.5px;color:#94a3b8;font-weight:500;margin-top:2px}
  .tw{background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.05);overflow:hidden}
  table{width:100%;border-collapse:collapse}
  thead th{padding:9px 13px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap}
  tbody tr{border-bottom:1px solid #f1f5f9;transition:background .1s;cursor:pointer}
  tbody tr:last-child{border-bottom:none}
  tbody tr:hover{background:#f8faff}
  td{padding:10px 13px;vertical-align:middle;font-size:13.5px}
  td.mo{font-family:'JetBrains Mono',monospace;font-size:12.5px}
  td.mu{color:#64748b}

  /* ── Badges ── */
  .badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:600;letter-spacing:.3px;text-transform:uppercase;white-space:nowrap}
  .b-blue{background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe}
  .b-green{background:#f0fdf4;color:#065f46;border:1px solid #bbf7d0}
  .b-amber{background:#fffbeb;color:#92400e;border:1px solid #fde68a}
  .b-red{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
  .b-purple{background:#f5f3ff;color:#4c1d95;border:1px solid #ddd6fe}
  .b-gray{background:#f8fafc;color:#64748b;border:1px solid #e2e8f0}
  .b-teal{background:#ecfeff;color:#155e75;border:1px solid #a5f3fc}
  .b-orange{background:#fff7ed;color:#9a3412;border:1px solid #fed7aa}
  .b-pink{background:#fdf2f8;color:#9d174d;border:1px solid #fbcfe8}
  .tag{display:inline-block;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:500}
  .t-blue{background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe}
  .t-purple{background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe}
  .t-teal{background:#ecfeff;color:#0e7490;border:1px solid #a5f3fc}
  .t-amber{background:#fffbeb;color:#92400e;border:1px solid #fde68a}
  .t-green{background:#f0fdf4;color:#065f46;border:1px solid #bbf7d0}
  .t-red{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
  .t-gray{background:#f8fafc;color:#64748b;border:1px solid #e2e8f0}
  .t-pink{background:#fdf2f8;color:#9d174d;border:1px solid #fbcfe8}
  .t-orange{background:#fff7ed;color:#9a3412;border:1px solid #fed7aa}

  /* ── Buttons ── */
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:'Plus Jakarta Sans',sans-serif;transition:all .12s;line-height:1.4;white-space:nowrap}
  .btn:hover{transform:translateY(-1px)}
  .btn:active{transform:none}
  .btn-primary{background:#2563eb;color:#fff;box-shadow:0 1px 4px rgba(37,99,235,.25)}
  .btn-primary:hover{background:#1d4ed8}
  .btn-secondary{background:#fff;border:1px solid #e2e8f0;color:#475569}
  .btn-secondary:hover{border-color:#3b82f6;color:#2563eb}
  .btn-danger{background:#fef2f2;border:1px solid #fecaca;color:#dc2626}
  .btn-danger:hover{background:#fee2e2}
  .btn-sm{padding:5px 10px;font-size:12px}
  .btn-purple{background:#7c3aed;color:#fff}
  .btn-purple:hover{background:#6d28d9}
  .btn-teal{background:#0891b2;color:#fff}
  .btn-teal:hover{background:#0e7490}
  .btn-green{background:#059669;color:#fff}
  .btn-green:hover{background:#047857}

  /* ── Modal ── */
  .mo-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(3px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
  .mo-box{background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.15);width:100%;max-height:92vh;overflow-y:auto;animation:moin .16s ease}
  @keyframes moin{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:none}}
  .mo-head{padding:18px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:flex-start;position:sticky;top:0;background:#fff;z-index:1}
  .mo-title{font-family:'Lora',serif;font-size:19px;font-weight:700;color:#0f172a}
  .mo-sub{font-size:12px;color:#94a3b8;margin-top:2px}
  .mo-body{padding:18px 24px}
  .mo-foot{padding:12px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px;position:sticky;bottom:0;background:#fff}

  /* ── Forms ── */
  .fld{margin-bottom:13px}
  .fld.sp{grid-column:1/-1}
  .flbl{display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px}
  .inp{width:100%;padding:8px 11px;border:1px solid #e2e8f0;border-radius:7px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#0f172a;background:#fff;outline:none;transition:border-color .15s,box-shadow .15s}
  .inp:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
  select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
  textarea.inp{min-height:78px;resize:vertical}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:0 15px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 13px}
  .pk-grid{background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:9px;display:flex;flex-wrap:wrap;gap:6px;max-height:140px;overflow-y:auto}
  .chip{padding:4px 11px;border-radius:6px;font-size:12.5px;cursor:pointer;transition:all .12s;user-select:none;border:1px solid #e2e8f0;background:#fff;color:#64748b}
  .chip:hover{border-color:#93c5fd;color:#1e40af}
  .chip.sel{background:#eff6ff;border-color:#93c5fd;color:#1e40af;font-weight:500}
  .li-hd{display:grid;grid-template-columns:1fr 68px 122px 88px 34px;gap:7px;padding:3px 9px 5px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
  .li-row{display:grid;grid-template-columns:1fr 68px 122px 88px 34px;gap:7px;align-items:center;padding:6px 9px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;margin-bottom:5px}
  .li-tot{display:grid;grid-template-columns:1fr 68px 122px 88px 34px;gap:7px;padding:8px 9px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:7px}
  .act-row{display:flex;gap:6px;flex-wrap:wrap}
  .mod-banner{border-radius:10px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:14px}
  .mod-icon{width:46px;height:46px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .camp-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;transition:all .18s;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.05)}
  .camp-card:hover{border-color:#a78bfa;transform:translateY(-2px);box-shadow:0 6px 20px rgba(124,58,237,.1)}
  .ev-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;transition:all .18s;cursor:pointer}
  .ev-card:hover{border-color:#67e8f9;transform:translateY(-2px);box-shadow:0 6px 16px rgba(8,145,178,.09)}
  .rpt-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:20px}
  .rpt-tab{padding:7px 14px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid #e2e8f0;background:#fff;color:#64748b;transition:all .12s}
  .rpt-tab:hover{border-color:#3b82f6;color:#2563eb}
  .rpt-tab.on{background:#2563eb;color:#fff;border-color:#2563eb;box-shadow:0 2px 6px rgba(37,99,235,.2)}
  .rpt-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
  .rpt-bar-row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9}
  .rpt-bar-row:last-child{border-bottom:none}
  .rpt-bar-lbl{width:170px;font-size:13px;color:#475569;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .rpt-bar-bg{flex:1;background:#f1f5f9;border-radius:99px;height:10px;overflow:hidden}
  .rpt-bar-fill{height:100%;border-radius:99px;transition:width .5s ease}
  .rpt-bar-val{width:80px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;color:#0f172a;flex-shrink:0}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
  .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:2000;pointer-events:none}
  .toast-inner{background:#0f172a;color:#f8fafc;padding:9px 18px;border-radius:8px;font-size:13.5px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:9px;animation:tst .18s ease}
  .toast-inner.ok{background:#059669}
  .toast-inner.err{background:#dc2626}
  @keyframes tst{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .case-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:10px;border-left:4px solid #e2e8f0;transition:all .15s;cursor:pointer}
  .case-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.07)}
  .case-card.p-high{border-left-color:#dc2626}
  .case-card.p-medium{border-left-color:#d97706}
  .case-card.p-low{border-left-color:#059669}
  .case-card.p-critical{border-left-color:#7c3aed}
  .empty-state{text-align:center;padding:40px 20px;color:#94a3b8;font-size:14px}
  .divider-label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1.2px;padding:10px 0 4px}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */
const genId    = () => Math.random().toString(36).slice(2, 10);
const today    = () => new Date().toISOString().split("T")[0];
const liTotal  = li  => (+li.qty || 0) * (+li.unitPrice || 0);
const invTotal = inv => (inv.lineItems || []).reduce((s, li) => s + liTotal(li), 0);
const pct      = (c, t) => t > 0 ? Math.min(100, Math.round((c / t) * 100)) : 0;
const fmt$     = n => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtN     = n => `$${Number(n).toLocaleString()}`;

/* ═══════════════════════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════════════════════ */
const SEED = {
  companies: [
    { id:"c1", name:"ACME Corp",         industry:"Manufacturing", phone:"555-0100", email:"info@acmecorp.com",   website:"acmecorp.com",   address:"1 Industrial Way, Springfield, IL 62701", createdAt:"2023-03-15" },
    { id:"c2", name:"Globex Solutions",   industry:"Technology",    phone:"555-0200", email:"contact@globex.com",  website:"globex.com",     address:"200 Tech Park Dr, Austin, TX 73301",      createdAt:"2023-06-01" },
    { id:"c3", name:"Initech Ltd",        industry:"Finance",       phone:"555-0300", email:"hello@initech.com",   website:"initech.com",    address:"300 Finance Blvd, New York, NY 10001",    createdAt:"2023-09-10" },
    { id:"c4", name:"Umbrella Dynamics",  industry:"Consulting",    phone:"555-0400", email:"ops@umbrella.io",     website:"umbrella.io",    address:"404 Executive Dr, Chicago, IL 60601",     createdAt:"2024-01-20" },
  ],
  contacts: [
    { id:"ct1", name:"John Doe",    email:"john.doe@acmecorp.com",    phone:"555-1001", title:"VP of Operations",      companyId:"c1", createdAt:"2023-03-20" },
    { id:"ct2", name:"Jane Doe",    email:"jane.doe@acmecorp.com",    phone:"555-1002", title:"Head of Procurement",   companyId:"c1", createdAt:"2023-03-22" },
    { id:"ct3", name:"Bob Smith",   email:"bob.smith@globex.com",     phone:"555-2001", title:"CTO",                   companyId:"c2", createdAt:"2023-06-05" },
    { id:"ct4", name:"Alice Brown", email:"alice.brown@initech.com",  phone:"555-3001", title:"CFO",                   companyId:"c3", createdAt:"2023-09-15" },
    { id:"ct5", name:"Carlos Vega", email:"carlos@umbrella.io",       phone:"555-4001", title:"Managing Director",     companyId:"c4", createdAt:"2024-01-25" },
    { id:"ct6", name:"Linda Park",  email:"linda.park@freelance.com", phone:"555-5001", title:"Independent Consultant",companyId:null, createdAt:"2024-03-01" },
  ],
  employees: [
    { id:"emp1", name:"Sarah Johnson",  email:"s.johnson@acmecorp.com",  phone:"555-8001", title:"Sr. Account Executive", department:"Sales",     companyId:"c1", hiredAt:"2021-06-01", createdAt:"2021-06-01" },
    { id:"emp2", name:"Mike Chen",      email:"m.chen@acmecorp.com",     phone:"555-8002", title:"Sales Engineer",        department:"Sales",     companyId:"c1", hiredAt:"2022-01-15", createdAt:"2022-01-15" },
    { id:"emp3", name:"Rachel Torres",  email:"r.torres@globex.com",     phone:"555-8003", title:"Sales Director",        department:"Sales",     companyId:"c2", hiredAt:"2020-08-01", createdAt:"2020-08-01" },
    { id:"emp4", name:"David Park",     email:"d.park@initech.com",      phone:"555-8004", title:"Regional Manager",      department:"Sales",     companyId:"c3", hiredAt:"2021-11-01", createdAt:"2021-11-01" },
    { id:"emp5", name:"Lisa Wong",      email:"l.wong@acmecorp.com",     phone:"555-8005", title:"Marketing Director",    department:"Marketing", companyId:"c1", hiredAt:"2020-03-15", createdAt:"2020-03-15" },
    { id:"emp6", name:"Tom Bradley",    email:"t.bradley@umbrella.io",   phone:"555-8006", title:"Account Manager",       department:"Sales",     companyId:"c4", hiredAt:"2023-05-01", createdAt:"2023-05-01" },
  ],
  leads: [
    { id:"l1", contactId:"ct1", employeeId:"emp1", status:"Qualified",   source:"Website",    eventId:"ev1", notes:"John inquired about bulk widget orders for Q3. Budget confirmed at $50K+.",        createdAt:"2024-01-10", converted:true  },
    { id:"l2", contactId:"ct2", employeeId:"emp2", status:"Working",     source:"Trade Show", eventId:"ev2", notes:"Jane attended MfgExpo 2024. Interested in Premium Widget bundle.",                 createdAt:"2024-02-14", converted:false },
    { id:"l3", contactId:"ct3", employeeId:"emp3", status:"New",         source:"Referral",   eventId:null,  notes:"Bob referred by mutual contact. Exploring widget integration for dev infra.",       createdAt:"2024-03-05", converted:false },
    { id:"l4", contactId:"ct4", employeeId:"emp1", status:"Qualified",   source:"Cold Call",  eventId:"ev3", notes:"Alice requested full product demo before signing multi-year maintenance contract.", createdAt:"2024-03-20", converted:true  },
    { id:"l5", contactId:"ct5", employeeId:"emp2", status:"Working",     source:"Email",      eventId:"ev3", notes:"Carlos downloaded product catalogue. Followed up — high purchase intent for Q3.",  createdAt:"2024-04-08", converted:false },
    { id:"l6", contactId:"ct6", employeeId:"emp2", status:"Unqualified", source:"Social",     eventId:null,  notes:"Linda interested but budget constraints push deal to next fiscal year.",            createdAt:"2024-04-15", converted:false },
  ],
  opportunities: [
    { id:"o1", leadId:"l1", contactId:"ct1", employeeId:"emp1", title:"ACME Corp Q3 Widget Order",     value:52000, stage:"Negotiation/Review", productIds:["p1","p2","p3"], closeDate:"2024-07-31", createdAt:"2024-02-01" },
    { id:"o2", leadId:"l4", contactId:"ct4", employeeId:"emp1", title:"Initech Widget Pro Contract",   value:28500, stage:"Proposal",           productIds:["p2","p4"],      closeDate:"2024-08-15", createdAt:"2024-04-01" },
    { id:"o3", leadId:"l1", contactId:"ct1", employeeId:"emp2", title:"ACME Annual Maintenance Deal",  value:14400, stage:"Closed Won",         productIds:["p5"],           closeDate:"2024-05-01", createdAt:"2024-03-15" },
  ],
  products: [
    { id:"p1", name:"ACME Widget Standard",   sku:"WGT-001", price:149.99,  description:"Standard-grade all-purpose industrial widget. 12-month warranty included.",      createdAt:"2022-11-01" },
    { id:"p2", name:"ACME Widget Pro",         sku:"WGT-002", price:299.99,  description:"Professional-grade widget with enhanced torque rating and heat resistance.",      createdAt:"2022-11-01" },
    { id:"p3", name:"ACME Widget Premium",     sku:"WGT-003", price:499.99,  description:"Top-of-line widget with lifetime warranty and titanium alloy housing.",           createdAt:"2023-01-15" },
    { id:"p4", name:"Widget Mounting Kit",     sku:"KIT-001", price:49.99,   description:"Universal mounting hardware kit compatible with all ACME Widget models.",         createdAt:"2023-02-01" },
    { id:"p5", name:"Annual Maintenance Plan", sku:"SVC-001", price:1200.00, description:"Annual service contract — parts, labor & 2 on-site service visits.",              createdAt:"2023-03-01" },
    { id:"p6", name:"Widget Lubricant (6-pk)", sku:"SUP-001", price:24.99,   description:"OEM-approved lubricant pack, case of 6 canisters. Required for warranty upkeep.",createdAt:"2023-06-01" },
  ],
  invoices: [
    { id:"inv1", contactId:"ct1", employeeId:"emp1", status:"Paid",    dueDate:"2024-05-15", createdAt:"2024-04-15", lineItems:[{id:"li1a",productId:"p1",qty:50,unitPrice:149.99},{id:"li1b",productId:"p4",qty:50,unitPrice:49.99},{id:"li1c",productId:"p6",qty:10,unitPrice:24.99}] },
    { id:"inv2", contactId:"ct2", employeeId:"emp2", status:"Sent",    dueDate:"2024-07-01", createdAt:"2024-06-01", lineItems:[{id:"li2a",productId:"p2",qty:20,unitPrice:299.99},{id:"li2b",productId:"p3",qty:5,unitPrice:499.99}] },
    { id:"inv3", contactId:"ct4", employeeId:"emp1", status:"Draft",   dueDate:"2024-08-30", createdAt:"2024-06-20", lineItems:[{id:"li3a",productId:"p2",qty:15,unitPrice:299.99},{id:"li3b",productId:"p4",qty:15,unitPrice:49.99},{id:"li3c",productId:"p5",qty:1,unitPrice:1200}] },
    { id:"inv4", contactId:"ct1", employeeId:"emp2", status:"Overdue", dueDate:"2024-04-01", createdAt:"2024-03-01", lineItems:[{id:"li4a",productId:"p5",qty:1,unitPrice:1200}] },
    { id:"inv5", contactId:"ct3", employeeId:"emp3", status:"Paid",    dueDate:"2023-11-30", createdAt:"2023-11-01", lineItems:[{id:"li5a",productId:"p2",qty:10,unitPrice:299.99},{id:"li5b",productId:"p4",qty:8,unitPrice:49.99}] },
    { id:"inv6", contactId:"ct5", employeeId:"emp6", status:"Paid",    dueDate:"2023-12-28", createdAt:"2023-12-01", lineItems:[{id:"li6a",productId:"p1",qty:20,unitPrice:149.99}] },
    { id:"inv7", contactId:"ct1", employeeId:"emp1", status:"Paid",    dueDate:"2024-02-15", createdAt:"2024-01-15", lineItems:[{id:"li7a",productId:"p3",qty:6,unitPrice:499.99},{id:"li7b",productId:"p6",qty:12,unitPrice:24.99}] },
    { id:"inv8", contactId:"ct4", employeeId:"emp4", status:"Paid",    dueDate:"2024-03-20", createdAt:"2024-02-20", lineItems:[{id:"li8a",productId:"p5",qty:2,unitPrice:1200}] },
  ],
  serviceRequests: [
    { id:"cs1", requestNum:"SRQ-0001", subject:"Widget Standard — Premature Bearing Failure on Concrete Mixing Line", type:"Complaint", priority:"High",   status:"In Progress", contactId:"ct1", companyId:"c1", productIds:["p1"], description:"12 units installed on the concrete mixing production line show premature bearing wear after only 3 months. Manufacturer spec states 12-month minimum lifespan under standard load. Units span 3 production cells and are causing unplanned downtime averaging 4 hours per incident.", resolution:"", createdAt:"2024-04-10", updatedAt:"2024-04-15" },
    { id:"cs2", requestNum:"SRQ-0002", subject:"Widget Pro — High-Temperature Torque Loss in Industrial Kiln Application", type:"Complaint", priority:"Critical", status:"Escalated", contactId:"ct1", companyId:"c1", productIds:["p2"], description:"Customer reports 18–22% torque degradation in Widget Pro units operating adjacent to industrial kilns running at 850°C ambient surface temperature. Failure mode: seal compression leading to lubricant migration. This is causing rejected batches on the ceramic tile production run.", resolution:"Engineering team engaged. Root cause analysis underway. Interim fix: increase lubrication frequency to every 200 operating hours.", createdAt:"2024-03-28", updatedAt:"2024-04-18" },
    { id:"cs3", requestNum:"SRQ-0003", subject:"Inquiry — Widget Premium Compatibility with ISO 4414 Pneumatic Manifolds", type:"Inquiry", priority:"Medium", status:"Open", contactId:"ct2", companyId:"c1", productIds:["p3","p4"], description:"Procurement team is evaluating whether the ACME Widget Premium and Mounting Kit are certified to ISO 4414 (Pneumatic Fluid Power) for integration with the facility's compressed-air manifold system. Request for full technical specification sheets and compliance documentation.", resolution:"", createdAt:"2024-04-22", updatedAt:"2024-04-22" },
    { id:"cs4", requestNum:"SRQ-0004", subject:"Maintenance Plan — Delayed Service Visit for Stamping Press Floor", type:"Complaint", priority:"Medium", status:"Pending",  contactId:"ct2", companyId:"c1", productIds:["p5"], description:"The Q1 scheduled on-site service visit (under Annual Maintenance Plan SVC-001) for the stamping press floor was not fulfilled as per contract terms (within 30 days of request). Two follow-up calls went unanswered. Customer is requesting a credit or rescheduled priority visit.", resolution:"", createdAt:"2024-05-01", updatedAt:"2024-05-03" },
    { id:"cs5", requestNum:"SRQ-0005", subject:"Inquiry — Bulk Widget Standard Pricing for Q3 Infrastructure Build-Out", type:"Inquiry", priority:"Low",    status:"Resolved", contactId:"ct1", companyId:"c1", productIds:["p1","p6"], description:"Request for volume discount pricing on 500+ units of Widget Standard and Widget Lubricant (6-pk) for a large manufacturing facility expansion scheduled for Q3. Customer also requesting lead-time confirmation for delivery to Springfield, IL warehouse.", resolution:"Volume pricing sheet provided — 12% discount at 250 units, 18% at 500 units. Lead time confirmed at 14 business days. Customer accepted offer.", createdAt:"2024-01-15", updatedAt:"2024-01-22" },
    { id:"cs6", requestNum:"SRQ-0006", subject:"Widget Pro — Thread Stripping During Torque Calibration on Assembly Jig", type:"Complaint", priority:"High",   status:"In Progress", contactId:"ct3", companyId:"c2", productIds:["p2","p4"], description:"During installation of Widget Pro units on an automated assembly jig using the supplied Mounting Kit, the M16 mounting bolt threads on 4 of 8 units stripped at 75% of the specified installation torque (120 Nm). Suspect batch quality variance in the thread machining process.", resolution:"", createdAt:"2024-04-30", updatedAt:"2024-05-02" },
    { id:"cs7", requestNum:"SRQ-0007", subject:"Inquiry — ATEX Zone 2 Certification for Widget Premium in Petrochemical Plant", type:"Inquiry", priority:"Medium", status:"Open", contactId:"ct4", companyId:"c3", productIds:["p3"], description:"CFO is evaluating a capital expenditure for 40 Widget Premium units for a petrochemical refinery project. The application requires ATEX Zone 2 certification (explosive atmospheres). Request for ATEX documentation and confirmation of suitability for hydrocarbon vapour environments.", resolution:"", createdAt:"2024-05-05", updatedAt:"2024-05-05" },
    { id:"cs8", requestNum:"SRQ-0008", subject:"Widget Standard — Corrosion on Housing After 6 Weeks in Wet-Concrete Environment", type:"Complaint", priority:"Medium", status:"Resolved", contactId:"ct5", companyId:"c4", productIds:["p1"], description:"6 Widget Standard units installed in a wet-concrete poured-wall forming environment show surface corrosion on the widget housing after only 6 weeks. Concern raised over coating specification — customer states units were sold as suitable for damp industrial environments.", resolution:"Root cause confirmed: units shipped from batch WGT-001-B34 used standard powder coat rather than epoxy-primer coat spec. Replacement units from corrected batch shipped. Warranty claim approved.", createdAt:"2024-03-10", updatedAt:"2024-03-25" },
  ],
  campaigns: [
    { id:"camp1", name:"Q2 Widget Launch",          type:"Email",    status:"Active",    startDate:"2024-04-01", endDate:"2024-06-30", budget:12000, employeeIds:["emp5","emp1"], description:"Multi-touch email nurture campaign targeting manufacturing leads for the new Widget Pro line. Drip series of 6 emails over 8 weeks.", createdAt:"2024-03-20" },
    { id:"camp2", name:"MfgExpo 2024 Trade Show",   type:"Event",    status:"Completed", startDate:"2024-02-10", endDate:"2024-02-12", budget:25000, employeeIds:["emp1","emp2","emp5"], description:"Full trade show presence at MfgExpo 2024. Includes booth, sponsorship, speaking slot, and post-show follow-up sequences.", createdAt:"2024-01-15" },
    { id:"camp3", name:"Spring Webinar Series",     type:"Webinar",  status:"Active",    startDate:"2024-04-15", endDate:"2024-06-15", budget:4500,  employeeIds:["emp5","emp2"], description:"Bi-weekly product education webinars targeting mid-market prospects. Focus on ROI and integration use cases.", createdAt:"2024-03-28" },
    { id:"camp4", name:"Paid Search — Widget Pro",  type:"Paid Ads", status:"Paused",    startDate:"2024-03-01", endDate:"2024-09-30", budget:18000, employeeIds:["emp5"], description:"Google Ads and LinkedIn Sponsored Content campaign targeting procurement decision-makers in manufacturing and logistics.", createdAt:"2024-02-25" },
  ],
  events: [
    { id:"ev1", campaignId:"camp2", name:"MfgExpo 2024 — Main Booth",    type:"Trade Show", status:"Completed", date:"2024-02-10", endDate:"2024-02-12", location:"McCormick Place, Chicago, IL",     leadIds:["l1","l2"], employeeIds:["emp1","emp2"], description:"3-day trade show booth. 200+ attendees engaged. Live demo station with Widget Pro and Widget Premium displays.", createdAt:"2024-01-20" },
    { id:"ev2", campaignId:"camp2", name:"MfgExpo 2024 — Keynote Talk",  type:"Conference", status:"Completed", date:"2024-02-11", endDate:"2024-02-11", location:"McCormick Place — Hall B, Chicago", leadIds:["l2"],       employeeIds:["emp1"],        description:"30-minute keynote on 'The Future of Industrial Widgets'. Approx. 320 attendees. Recording available on website.", createdAt:"2024-01-20" },
    { id:"ev3", campaignId:"camp3", name:"Widget Pro Webinar — April",   type:"Webinar",    status:"Completed", date:"2024-04-18", endDate:"2024-04-18", location:"Zoom (Online)",                    leadIds:["l4","l5"], employeeIds:["emp5","emp2"], description:"Live product demo + Q&A session. 68 registrants, 41 attended live.", createdAt:"2024-04-01" },
    { id:"ev4", campaignId:"camp3", name:"Widget ROI Workshop — May",    type:"Workshop",   status:"Upcoming",  date:"2024-05-16", endDate:"2024-05-16", location:"Zoom (Online)",                    leadIds:[],          employeeIds:["emp5"],        description:"Interactive ROI calculator workshop for procurement managers. Max 30 attendees.", createdAt:"2024-04-20" },
    { id:"ev5", campaignId:"camp1", name:"Q2 Nurture — Discovery Calls", type:"Demo",       status:"Upcoming",  date:"2024-05-22", endDate:"2024-05-22", location:"Google Meet (Online)",             leadIds:[],          employeeIds:["emp1","emp2"], description:"Personalised 1:1 discovery call for hot leads from Q2 email sequence.", createdAt:"2024-04-25" },
  ],
  goals: [
    { id:"g1", campaignId:"camp1", name:"Qualified Leads Generated",  metric:"Leads Generated", targetValue:80,    currentValue:34,  unit:"leads",   dueDate:"2024-06-30", notes:"MQL threshold: opened ≥3 emails AND clicked CTA.", createdAt:"2024-03-20" },
    { id:"g2", campaignId:"camp1", name:"Pipeline Revenue Influenced", metric:"Revenue",         targetValue:150000,currentValue:94900,unit:"$",      dueDate:"2024-06-30", notes:"Tracks deals where contact received ≥1 email from campaign.", createdAt:"2024-03-20" },
    { id:"g3", campaignId:"camp2", name:"Booth Attendees",             metric:"Attendees",       targetValue:200,   currentValue:247, unit:"people",  dueDate:"2024-02-12", notes:"Unique badge scans at booth across 3 days.", createdAt:"2024-01-15" },
    { id:"g4", campaignId:"camp2", name:"Leads Captured at Show",      metric:"Leads Generated", targetValue:50,    currentValue:47,  unit:"leads",   dueDate:"2024-02-12", notes:"Business cards + badge scans via lead retrieval device.", createdAt:"2024-01-15" },
    { id:"g5", campaignId:"camp3", name:"Webinar Registrations",       metric:"Registrations",   targetValue:150,   currentValue:68,  unit:"signups", dueDate:"2024-06-15", notes:"Cumulative registrations across all sessions.", createdAt:"2024-03-28" },
    { id:"g6", campaignId:"camp3", name:"Avg Attendee Rating",         metric:"Satisfaction",    targetValue:4.5,   currentValue:4.7, unit:"/ 5",     dueDate:"2024-06-15", notes:"Post-session survey avg score.", createdAt:"2024-03-28" },
    { id:"g7", campaignId:"camp4", name:"Ad Click-Through Rate",       metric:"Clicks",          targetValue:3.5,   currentValue:2.1, unit:"% CTR",   dueDate:"2024-09-30", notes:"Target 3.5% CTR on LinkedIn Sponsored Content.", createdAt:"2024-02-25" },
    { id:"g8", campaignId:"camp4", name:"Cost Per Lead",               metric:"Cost Per Lead",   targetValue:120,   currentValue:165, unit:"$/lead",  dueDate:"2024-09-30", notes:"Target CPL ≤ $120. Currently above target.", createdAt:"2024-02-25" },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   BADGE / COLOR HELPERS
═══════════════════════════════════════════════════════════════════════════ */
const leadColors     = { New:"b-blue", Qualified:"b-green", Working:"b-amber", Unqualified:"b-gray", Converted:"b-purple" };
const invColors      = { Draft:"b-gray", Sent:"b-blue", Paid:"b-green", Overdue:"b-red", Cancelled:"b-gray" };
const srStatusColors = { Open:"b-blue", "In Progress":"b-amber", Pending:"b-orange", Escalated:"b-red", Resolved:"b-green", Closed:"b-gray" };
const srPriorityColors = { Low:"b-green", Medium:"b-amber", High:"b-red", Critical:"b-purple" };
const srTypeColors = { Complaint:"b-red", Inquiry:"b-blue", "Service Request":"b-teal", Bug:"b-purple", Other:"b-gray" };
const campStatus     = { Planning:"b-gray", Active:"b-green", Paused:"b-amber", Completed:"b-purple", Cancelled:"b-red" };
const eventStatus    = { Upcoming:"b-blue", "In Progress":"b-amber", Completed:"b-green", Cancelled:"b-red" };
const stageColor     = s => s==="Closed Won"?"b-green":s==="Closed Lost"?"b-red":s?.includes("Neg")?"b-amber":"b-purple";

const Bdg = ({ text, cls }) => <span className={`badge ${cls||"b-gray"}`}>{text}</span>;
const Tag = ({ text, cls }) => <span className={`tag ${cls||"t-gray"}`}>{text}</span>;

/* ═══════════════════════════════════════════════════════════════════════════
   ICON LIBRARY
═══════════════════════════════════════════════════════════════════════════ */
const SVG = ({ d, size=16, color="currentColor", fill="none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICONS = {
  dashboard:   <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  companies:   <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
  contacts:    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  employees:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  leads:       <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
  opps:        <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  products:    <><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  invoices:    <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  cases:       <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.22 2.41a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 6a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></>,
  campaigns:   <><path d="M3 11l19-9-9 19-2-8-8-2z"/></>,
  events:      <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  goals:       <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  reports:     <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  minus:       <><line x1="5" y1="12" x2="19" y2="12"/></>,
  edit:        <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></>,
  x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  check:       <><polyline points="20 6 9 17 4 12"/></>,
  search:      <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  convert:     <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></>,
  dollar:      <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
  list:        <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  back:        <><polyline points="15 18 9 12 15 6"/></>,
  alert:       <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  wrench:      <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>,
  info:        <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
};
const Ico = ({ name, size=15, color="currentColor" }) => <SVG d={ICONS[name]} size={size} color={color}/>;

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI ATOMS
═══════════════════════════════════════════════════════════════════════════ */

const Fld = ({ label, children, span }) => (
  <div className={`fld${span?" sp":""}`}>
    <label className="flbl">{label}</label>
    {children}
  </div>
);

const G2 = ({ children }) => <div className="g2">{children}</div>;

const PickerGrid = ({ items, selected, onToggle, getLabel }) => (
  <div className="pk-grid">
    {items.length === 0 && <span style={{fontSize:12,color:"#94a3b8"}}>No items available.</span>}
    {items.map(item => (
      <div key={item.id} className={`chip ${selected.includes(item.id) ? "sel" : ""}`} onClick={() => onToggle(item.id)}>
        {getLabel(item)}
      </div>
    ))}
  </div>
);

const PBar = ({ value, max, color="#2563eb" }) => {
  const pctVal = max > 0 ? Math.min(100, Math.round(value / max * 100)) : 0;
  return (
    <div className="pb-bg">
      <div className="pb-fill" style={{ width: `${pctVal}%`, background: pctVal >= 100 ? "#059669" : pctVal >= 60 ? color : "#d97706" }}/>
    </div>
  );
};

const EmptyState = ({ msg }) => <div className="empty-state">{msg || "No records found."}</div>;


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════════ */
export default function CRMApp() {
  const [companies,     setCompanies]     = useState(SEED.companies);
  const [contacts,      setContacts]      = useState(SEED.contacts);
  const [employees,     setEmployees]     = useState(SEED.employees);
  const [leads,         setLeads]         = useState(SEED.leads);
  const [opportunities, setOpportunities] = useState(SEED.opportunities);
  const [products,      setProducts]      = useState(SEED.products);
  const [invoices,      setInvoices]      = useState(SEED.invoices);
  const [serviceRequests,         setServiceRequests] = useState(SEED.serviceRequests);
  const [campaigns,     setCampaigns]     = useState(SEED.campaigns);
  const [events,        setEvents]        = useState(SEED.events);
  const [goals,         setGoals]         = useState(SEED.goals);

  const [view,   setView]   = useState("dashboard");
  const [modal,  setModal]  = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [toast,  setToast]  = useState(null);
  const [campView, setCampView] = useState(null);
  const [rptTab, setRptTab] = useState("rev-month");

  const showToast = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const closeModal = () => setModal(null);

  /* ── Lookups ── */
  const gc  = id => companies.find(x=>x.id===id);
  const gct = id => contacts.find(x=>x.id===id);
  const gem = id => employees.find(x=>x.id===id);
  const gp  = id => products.find(x=>x.id===id);
  const gl  = id => leads.find(x=>x.id===id);
  const gcam= id => campaigns.find(x=>x.id===id);
  const gev = id => events.find(x=>x.id===id);

  /* ── Setters map ── */
  const setters = () => ({
    companies:setCompanies, contacts:setContacts, employees:setEmployees,
    leads:setLeads, opportunities:setOpportunities, products:setProducts,
    invoices:setInvoices, serviceRequests:setServiceRequests, campaigns:setCampaigns,
    events:setEvents, goals:setGoals,
  });
  const store   = () => ({ companies, contacts, employees, leads, opportunities, products, invoices, serviceRequests, campaigns, events, goals });

  const saveRec = (type, data) => {
    const S = setters(); const L = store();
    if (data.id && (L[type]||[]).find(i=>i.id===data.id)) {
      S[type](prev => prev.map(i => i.id===data.id ? {...i,...data} : i));
    } else {
      S[type](prev => [...prev, {...data, id:genId(), createdAt:today()}]);
    }
    showToast("Record saved");
    closeModal();
  };

  const removeRec = (type, id) => {
    const S = setters();
    S[type](prev => prev.filter(i=>i.id!==id));
    setDetail(null);
    showToast("Record deleted","err");
  };

  const convertLead = lead => {
    setLeads(prev=>prev.map(l=>l.id===lead.id?{...l,converted:true,status:"Converted"}:l));
    setModal({type:"opportunities",data:{leadId:lead.id,contactId:lead.contactId,employeeId:lead.employeeId,productIds:[]}});
  };

  /* ── Search filter ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const F = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return store();
    const m = (x,...fields) => fields.some(f=>(f||"").toLowerCase().includes(q));
    return {
      companies:     companies.filter(x=>m(x,x.name,x.industry)),
      contacts:      contacts.filter(x=>m(x,x.name,x.email,x.title)),
      employees:     employees.filter(x=>m(x,x.name,x.email,x.title,x.department)),
      leads:         leads.filter(x=>m(x,gct(x.contactId)?.name,x.source,x.status)),
      opportunities: opportunities.filter(x=>m(x,x.title,x.stage)),
      products:      products.filter(x=>m(x,x.name,x.sku)),
      invoices:      invoices.filter(x=>m(x,gct(x.contactId)?.name,x.status)),
      serviceRequests: serviceRequests.filter(x=>m(x,x.subject,x.requestNum,x.type,x.status,x.priority,gct(x.contactId)?.name,gc(x.companyId)?.name)),
      campaigns:     campaigns.filter(x=>m(x,x.name,x.type,x.status)),
      events:        events.filter(x=>m(x,x.name,x.type,gcam(x.campaignId)?.name)),
      goals:         goals.filter(x=>m(x,x.name,x.metric,gcam(x.campaignId)?.name)),
    };
  },[search,companies,contacts,employees,leads,opportunities,products,invoices,serviceRequests,campaigns,events,goals]);

  /* ═══════════════════════════════════════════════════════════════════════
     FORMS
  ═══════════════════════════════════════════════════════════════════════ */
  const SaveBtns = ({onSave}) => (
    <div className="mo-foot">
      <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
      <button className="btn btn-primary" onClick={onSave}>Save Record</button>
    </div>
  );

  /* Company */
  const FormCompany = ({init={}}) => {
    const [f,sf]=useState({name:"",industry:"Manufacturing",phone:"",email:"",website:"",address:"",...init});
    return(<><div className="mo-body"><G2>
      <Fld label="Company Name"><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="ACME Corp"/></Fld>
      <Fld label="Industry"><select className="inp" value={f.industry} onChange={e=>sf({...f,industry:e.target.value})}>{["Manufacturing","Technology","Finance","Healthcare","Retail","Consulting","Education","Other"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      <Fld label="Phone"><input className="inp" value={f.phone} onChange={e=>sf({...f,phone:e.target.value})} placeholder="555-0100"/></Fld>
      <Fld label="Email"><input className="inp" value={f.email} onChange={e=>sf({...f,email:e.target.value})} placeholder="info@company.com"/></Fld>
      <Fld label="Website"><input className="inp" value={f.website} onChange={e=>sf({...f,website:e.target.value})} placeholder="company.com"/></Fld>
      <Fld label="Address"><input className="inp" value={f.address} onChange={e=>sf({...f,address:e.target.value})} placeholder="123 Main St, City, ST"/></Fld>
    </G2></div><SaveBtns onSave={()=>saveRec("companies",f)}/></>);
  };

  /* Contact */
  const FormContact = ({init={}}) => {
    const [f,sf]=useState({name:"",email:"",phone:"",title:"",companyId:"",...init});
    return(<><div className="mo-body"><G2>
      <Fld label="Full Name"><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="Jane Smith"/></Fld>
      <Fld label="Title / Role"><input className="inp" value={f.title} onChange={e=>sf({...f,title:e.target.value})} placeholder="VP of Sales"/></Fld>
      <Fld label="Email"><input className="inp" value={f.email} onChange={e=>sf({...f,email:e.target.value})} placeholder="jane@co.com"/></Fld>
      <Fld label="Phone"><input className="inp" value={f.phone} onChange={e=>sf({...f,phone:e.target.value})} placeholder="555-0100"/></Fld>
    </G2>
    <Fld label="Company (optional)"><select className="inp" value={f.companyId||""} onChange={e=>sf({...f,companyId:e.target.value||null})}><option value="">— No Company (Independent) —</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
    </div><SaveBtns onSave={()=>saveRec("contacts",f)}/></>);
  };

  /* Employee */
  const FormEmployee = ({init={}}) => {
    const [f,sf]=useState({name:"",email:"",phone:"",title:"",department:"Sales",companyId:companies[0]?.id||"",hiredAt:"",...init});
    return(<><div className="mo-body"><G2>
      <Fld label="Full Name"><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="Sarah Johnson"/></Fld>
      <Fld label="Title / Role"><input className="inp" value={f.title} onChange={e=>sf({...f,title:e.target.value})} placeholder="Account Executive"/></Fld>
      <Fld label="Email"><input className="inp" value={f.email} onChange={e=>sf({...f,email:e.target.value})} placeholder="employee@company.com"/></Fld>
      <Fld label="Phone"><input className="inp" value={f.phone} onChange={e=>sf({...f,phone:e.target.value})} placeholder="555-0100"/></Fld>
      <Fld label="Department"><select className="inp" value={f.department} onChange={e=>sf({...f,department:e.target.value})}>{["Sales","Marketing","Support","Engineering","Finance","Operations","HR","Management"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      <Fld label="Hired Date"><input className="inp" type="date" value={f.hiredAt} onChange={e=>sf({...f,hiredAt:e.target.value})}/></Fld>
    </G2>
    <Fld label="Company (required — one only)"><select className="inp" value={f.companyId} onChange={e=>sf({...f,companyId:e.target.value})}><option value="">— Select Company —</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
    </div><SaveBtns onSave={()=>saveRec("employees",f)}/></>);
  };

  /* Lead */
  const FormLead = ({init={}}) => {
    const [f,sf]=useState({contactId:contacts[0]?.id||"",employeeId:employees[0]?.id||"",status:"New",source:"Website",eventId:"",notes:"",converted:false,...init});
    return(<><div className="mo-body">
      <Fld label="Contact (required)"><select className="inp" value={f.contactId} onChange={e=>sf({...f,contactId:e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}</select></Fld>
      <Fld label="Assigned Employee / Owner (required)"><select className="inp" value={f.employeeId} onChange={e=>sf({...f,employeeId:e.target.value})}><option value="">— Select Employee —</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} ({e.title})</option>)}</select></Fld>
      <G2>
        <Fld label="Status"><select className="inp" value={f.status} onChange={e=>sf({...f,status:e.target.value})}>{["New","Working","Qualified","Unqualified"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Lead Source"><select className="inp" value={f.source} onChange={e=>sf({...f,source:e.target.value})}>{["Website","Referral","Cold Call","Email","Trade Show","Event","Social","Other"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      </G2>
      <Fld label="Associated Event (optional — zero or one)"><select className="inp" value={f.eventId||""} onChange={e=>sf({...f,eventId:e.target.value||null})}><option value="">— No Event —</option>{events.map(ev=><option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>)}</select></Fld>
      <Fld label="Notes"><textarea className="inp" value={f.notes} onChange={e=>sf({...f,notes:e.target.value})} placeholder="Lead context, next steps, budget details…"/></Fld>
    </div><SaveBtns onSave={()=>saveRec("leads",f)}/></>);
  };

  /* Opportunity */
  const FormOpportunity = ({init={}}) => {
    const [f,sf]=useState({title:"",value:0,stage:"Prospecting",productIds:[],closeDate:"",leadId:"",contactId:"",employeeId:employees[0]?.id||"",...init});
    const tog = pid => sf(p=>({...p,productIds:p.productIds.includes(pid)?p.productIds.filter(x=>x!==pid):[...p.productIds,pid]}));
    return(<><div className="mo-body">
      <Fld label="Opportunity Title"><input className="inp" value={f.title} onChange={e=>sf({...f,title:e.target.value})} placeholder="ACME Corp Q4 Widget Deal"/></Fld>
      <G2>
        <Fld label="Estimated Value ($)"><input className="inp" type="number" value={f.value} onChange={e=>sf({...f,value:+e.target.value})}/></Fld>
        <Fld label="Close Date"><input className="inp" type="date" value={f.closeDate} onChange={e=>sf({...f,closeDate:e.target.value})}/></Fld>
        <Fld label="Stage"><select className="inp" value={f.stage} onChange={e=>sf({...f,stage:e.target.value})}>{["Prospecting","Qualification","Proposal","Value Proposition","Id. Decision Makers","Proposal/Price Quote","Negotiation/Review","Closed Won","Closed Lost"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Contact"><select className="inp" value={f.contactId} onChange={e=>sf({...f,contactId:e.target.value})}><option value="">— Select —</option>{contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
      </G2>
      <Fld label="Assigned Employee / Owner (required)"><select className="inp" value={f.employeeId} onChange={e=>sf({...f,employeeId:e.target.value})}><option value="">— Select Employee —</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} ({e.title})</option>)}</select></Fld>
      <Fld label="Source Lead"><select className="inp" value={f.leadId} onChange={e=>sf({...f,leadId:e.target.value})}><option value="">— Select Lead —</option>{leads.map(l=><option key={l.id} value={l.id}>{gct(l.contactId)?.name} — {l.source} ({l.status})</option>)}</select></Fld>
      <Fld label="Products of Interest"><PickerGrid items={products} selected={f.productIds} onToggle={tog} getLabel={p=>`${p.name} — ${fmt$(p.price)}`}/></Fld>
    </div><SaveBtns onSave={()=>saveRec("opportunities",f)}/></>);
  };

  /* Product */
  const FormProduct = ({init={}}) => {
    const [f,sf]=useState({name:"",sku:"",price:0,description:"",...init});
    return(<><div className="mo-body"><G2>
      <Fld label="Product Name"><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="ACME Widget Pro"/></Fld>
      <Fld label="SKU / Part #"><input className="inp" value={f.sku} onChange={e=>sf({...f,sku:e.target.value})} placeholder="WGT-002"/></Fld>
      <Fld label="Unit Price ($)"><input className="inp" type="number" step="0.01" value={f.price} onChange={e=>sf({...f,price:+e.target.value})}/></Fld>
    </G2>
    <Fld label="Description"><textarea className="inp" value={f.description} onChange={e=>sf({...f,description:e.target.value})} placeholder="Product description…"/></Fld>
    </div><SaveBtns onSave={()=>saveRec("products",f)}/></>);
  };

  /* Invoice */
  const FormInvoice = ({init={}}) => {
    const blank = () => ({id:genId(),productId:products[0]?.id||"",qty:1,unitPrice:products[0]?.price||0});
    const [f,sf]=useState({contactId:contacts[0]?.id||"",employeeId:employees[0]?.id||"",status:"Draft",dueDate:"",...init,
      lineItems:(init.lineItems?.length>0)?init.lineItems.map(li=>({...li})):[blank()]});
    const upd=(idx,field,val)=>sf(prev=>({...prev,lineItems:prev.lineItems.map((li,i)=>{
      if(i!==idx)return li; const u={...li,[field]:val};
      if(field==="productId"){const p=products.find(p=>p.id===val);u.unitPrice=p?p.price:0;}
      return u;
    })}));
    const sub=f.lineItems.reduce((s,li)=>s+liTotal(li),0);
    return(<><div className="mo-body">
      <G2>
        <Fld label="Bill To — Contact"><select className="inp" value={f.contactId} onChange={e=>sf({...f,contactId:e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
        <Fld label="Status"><select className="inp" value={f.status} onChange={e=>sf({...f,status:e.target.value})}>{["Draft","Sent","Paid","Overdue","Cancelled"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Due Date"><input className="inp" type="date" value={f.dueDate} onChange={e=>sf({...f,dueDate:e.target.value})}/></Fld>
      </G2>
      <Fld label="Assigned Employee / Owner (required)"><select className="inp" value={f.employeeId} onChange={e=>sf({...f,employeeId:e.target.value})}><option value="">— Select Employee —</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} ({e.title})</option>)}</select></Fld>
      <div style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <label className="flbl" style={{margin:0}}>Line Items (each must link to a Product)</label>
          <button className="btn btn-secondary btn-sm" onClick={()=>sf(p=>({...p,lineItems:[...p.lineItems,blank()]}))}><Ico name="plus" size={12}/> Add Line</button>
        </div>
        <div className="li-hd"><span>Product</span><span style={{textAlign:"center"}}>Qty</span><span>Unit Price</span><span style={{textAlign:"right"}}>Total</span><span/></div>
        {f.lineItems.map((li,idx)=>(
          <div key={li.id} className="li-row">
            <select className="inp" style={{padding:"6px 8px",fontSize:13}} value={li.productId} onChange={e=>upd(idx,"productId",e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input className="inp" type="number" min="1" style={{padding:"6px 7px",fontSize:13,textAlign:"center"}} value={li.qty} onChange={e=>upd(idx,"qty",Math.max(1,+e.target.value))}/>
            <div style={{position:"relative"}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:13}}>$</span><input className="inp" type="number" step="0.01" style={{padding:"6px 8px 6px 18px",fontSize:13}} value={li.unitPrice} onChange={e=>upd(idx,"unitPrice",+e.target.value)}/></div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#2563eb",fontWeight:600,textAlign:"right"}}>{fmt$(liTotal(li))}</span>
            <button className="btn btn-danger btn-sm btn-icon" onClick={()=>sf(p=>({...p,lineItems:p.lineItems.filter((_,i)=>i!==idx)}))} disabled={f.lineItems.length===1}><Ico name="minus" size={11}/></button>
          </div>
        ))}
        <div className="li-tot">
          <span style={{fontSize:12,fontWeight:600,color:"#1e40af"}}>{f.lineItems.length} item{f.lineItems.length!==1?"s":""}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#1e40af",textAlign:"center"}}>{f.lineItems.reduce((s,li)=>s+(+li.qty||0),0)}</span>
          <span style={{fontSize:12,color:"#64748b"}}>Invoice Total:</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:17,color:"#1e40af",fontWeight:700,textAlign:"right"}}>{fmt$(sub)}</span><span/>
        </div>
      </div>
    </div><SaveBtns onSave={()=>saveRec("invoices",f)}/></>);
  };

  /* Case */
  const FormServiceRequest = ({init={}}) => {
    const nextNum = `SRQ-${String(serviceRequests.length+1).padStart(4,"0")}`;
    const [f,sf]=useState({requestNum:nextNum,subject:"",type:"Complaint",priority:"Medium",status:"Open",contactId:contacts[0]?.id||"",companyId:"",productIds:[],description:"",resolution:"",...init,updatedAt:today()});
    const tog = pid => sf(p=>({...p,productIds:p.productIds.includes(pid)?p.productIds.filter(x=>x!==pid):[...p.productIds,pid]}));
    return(<><div className="mo-body">
      <G2>
        <Fld label="Request #"><input className="inp" value={f.requestNum} readOnly style={{background:"#f8fafc",color:"#64748b"}}/></Fld>
        <Fld label="Type"><select className="inp" value={f.type} onChange={e=>sf({...f,type:e.target.value})}>{["Complaint","Inquiry","Service Request","Bug","Other"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      </G2>
      <Fld label="Subject"><input className="inp" value={f.subject} onChange={e=>sf({...f,subject:e.target.value})} placeholder="Describe the issue or inquiry…"/></Fld>
      <G2>
        <Fld label="Priority"><select className="inp" value={f.priority} onChange={e=>sf({...f,priority:e.target.value})}>{["Low","Medium","High","Critical"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Status"><select className="inp" value={f.status} onChange={e=>sf({...f,status:e.target.value})}>{["Open","In Progress","Pending","Escalated","Resolved","Closed"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      </G2>
      <Fld label="Contact (required — one)"><select className="inp" value={f.contactId} onChange={e=>sf({...f,contactId:e.target.value})}><option value="">— Select Contact —</option>{contacts.map(c=><option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}</select></Fld>
      <Fld label="Company (optional — zero or one)"><select className="inp" value={f.companyId||""} onChange={e=>sf({...f,companyId:e.target.value||null})}><option value="">— No Company / Independent —</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
      <Fld label="Products Involved (optional — zero to many)"><PickerGrid items={products} selected={f.productIds} onToggle={tog} getLabel={p=>`${p.name} (${p.sku})`}/></Fld>
      <Fld label="Description / Issue Details"><textarea className="inp" style={{minHeight:90}} value={f.description} onChange={e=>sf({...f,description:e.target.value})} placeholder="Full description of the issue, steps to reproduce, customer impact…"/></Fld>
      <Fld label="Resolution Notes"><textarea className="inp" value={f.resolution} onChange={e=>sf({...f,resolution:e.target.value})} placeholder="Steps taken, root cause, outcome…"/></Fld>
    </div><SaveBtns onSave={()=>saveRec("serviceRequests",f)}/></>);
  };

  /* Campaign */
  const FormCampaign = ({init={}}) => {
    const [f,sf]=useState({name:"",type:"Email",status:"Planning",startDate:"",endDate:"",budget:0,employeeIds:[],description:"",...init});
    return(<><div className="mo-body"><G2>
      <Fld label="Campaign Name" span><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="Q3 Widget Launch Campaign"/></Fld>
      <Fld label="Type"><select className="inp" value={f.type} onChange={e=>sf({...f,type:e.target.value})}>{["Email","Social","Event","Content","Paid Ads","Webinar","Direct Mail","Other"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      <Fld label="Status"><select className="inp" value={f.status} onChange={e=>sf({...f,status:e.target.value})}>{["Planning","Active","Paused","Completed","Cancelled"].map(x=><option key={x}>{x}</option>)}</select></Fld>
      <Fld label="Start Date"><input className="inp" type="date" value={f.startDate} onChange={e=>sf({...f,startDate:e.target.value})}/></Fld>
      <Fld label="End Date"><input className="inp" type="date" value={f.endDate} onChange={e=>sf({...f,endDate:e.target.value})}/></Fld>
      <Fld label="Budget ($)" span><input className="inp" type="number" step="100" value={f.budget} onChange={e=>sf({...f,budget:+e.target.value})}/></Fld>
    </G2>
    <Fld label="Assigned Employees (one to many)"><PickerGrid items={employees} selected={f.employeeIds} onToggle={eid=>sf(p=>({...p,employeeIds:p.employeeIds.includes(eid)?p.employeeIds.filter(x=>x!==eid):[...p.employeeIds,eid]}))} getLabel={e=>`${e.name} (${e.department})`}/></Fld>
    <Fld label="Description"><textarea className="inp" value={f.description} onChange={e=>sf({...f,description:e.target.value})} placeholder="Campaign overview, target audience, key messages…"/></Fld>
    </div><SaveBtns onSave={()=>saveRec("campaigns",f)}/></>);
  };

  /* Event */
  const FormEvent = ({init={}}) => {
    const [f,sf]=useState({name:"",campaignId:"",type:"Webinar",status:"Upcoming",date:"",endDate:"",location:"",description:"",leadIds:[],employeeIds:[],...init});
    return(<><div className="mo-body">
      <Fld label="Event Name"><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="Widget Pro Webinar — June"/></Fld>
      <G2>
        <Fld label="Parent Campaign (optional)"><select className="inp" value={f.campaignId||""} onChange={e=>sf({...f,campaignId:e.target.value||""})}><option value="">— No Campaign —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
        <Fld label="Event Type"><select className="inp" value={f.type} onChange={e=>sf({...f,type:e.target.value})}>{["Webinar","Conference","Trade Show","Workshop","Demo","Meetup","Networking","Other"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Status"><select className="inp" value={f.status} onChange={e=>sf({...f,status:e.target.value})}>{["Upcoming","In Progress","Completed","Cancelled"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Location / URL"><input className="inp" value={f.location} onChange={e=>sf({...f,location:e.target.value})} placeholder="Zoom / Convention Center, City"/></Fld>
        <Fld label="Start Date"><input className="inp" type="date" value={f.date} onChange={e=>sf({...f,date:e.target.value})}/></Fld>
        <Fld label="End Date"><input className="inp" type="date" value={f.endDate} onChange={e=>sf({...f,endDate:e.target.value})}/></Fld>
      </G2>
      <Fld label="Description"><textarea className="inp" value={f.description} onChange={e=>sf({...f,description:e.target.value})} placeholder="Event details, agenda, objectives…"/></Fld>
      <Fld label="Assigned Employees (one to many)"><PickerGrid items={employees} selected={f.employeeIds} onToggle={eid=>sf(p=>({...p,employeeIds:p.employeeIds.includes(eid)?p.employeeIds.filter(x=>x!==eid):[...p.employeeIds,eid]}))} getLabel={e=>`${e.name} (${e.title})`}/></Fld>
      <Fld label="Associated Leads (zero to many)"><PickerGrid items={leads} selected={f.leadIds} onToggle={lid=>sf(p=>({...p,leadIds:p.leadIds.includes(lid)?p.leadIds.filter(x=>x!==lid):[...p.leadIds,lid]}))} getLabel={l=>`${gct(l.contactId)?.name} (${l.source})`}/></Fld>
    </div><SaveBtns onSave={()=>saveRec("events",f)}/></>);
  };

  /* Goal */
  const FormGoal = ({init={}}) => {
    const [f,sf]=useState({name:"",campaignId:"",metric:"Leads Generated",targetValue:0,currentValue:0,unit:"leads",dueDate:"",notes:"",...init});
    return(<><div className="mo-body">
      <Fld label="Goal Name"><input className="inp" value={f.name} onChange={e=>sf({...f,name:e.target.value})} placeholder="Qualified Leads Generated"/></Fld>
      <G2>
        <Fld label="Parent Campaign (optional)"><select className="inp" value={f.campaignId||""} onChange={e=>sf({...f,campaignId:e.target.value||""})}><option value="">— No Campaign —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
        <Fld label="Metric Type"><select className="inp" value={f.metric} onChange={e=>sf({...f,metric:e.target.value})}>{["Leads Generated","Registrations","Revenue","Attendees","Impressions","Clicks","Conversions","Cost Per Lead","Satisfaction","Other"].map(x=><option key={x}>{x}</option>)}</select></Fld>
        <Fld label="Target Value"><input className="inp" type="number" step="any" value={f.targetValue} onChange={e=>sf({...f,targetValue:+e.target.value})}/></Fld>
        <Fld label="Current Value"><input className="inp" type="number" step="any" value={f.currentValue} onChange={e=>sf({...f,currentValue:+e.target.value})}/></Fld>
        <Fld label="Unit (e.g. leads, $, %)"><input className="inp" value={f.unit} onChange={e=>sf({...f,unit:e.target.value})} placeholder="leads"/></Fld>
        <Fld label="Due Date"><input className="inp" type="date" value={f.dueDate} onChange={e=>sf({...f,dueDate:e.target.value})}/></Fld>
      </G2>
      <Fld label="Notes"><textarea className="inp" value={f.notes} onChange={e=>sf({...f,notes:e.target.value})} placeholder="Measurement methodology, data sources…"/></Fld>
    </div><SaveBtns onSave={()=>saveRec("goals",f)}/></>);
  };


  /* ═══════════════════════════════════════════════════════════════════════
     DETAIL PANEL
  ═══════════════════════════════════════════════════════════════════════ */
  const DetailPanel = () => {
    if (!detail) return null;
    const st = store();
    const item = (st[detail.type]||[]).find(x=>x.id===detail.id);
    if (!item) return null;

    const DR = ({label, value, mono}) => (
      <div className="dr">
        <span className="dl">{label}</span>
        <span className={`dv${mono?" mo":""}`}>{value ?? <span style={{color:"#cbd5e1"}}>—</span>}</span>
      </div>
    );
    const DSec = ({label}) => <div className="dsec">{label}</div>;
    const DItem = ({left, sub, right, onClick}) => (
      <div className="dp-item" onClick={onClick}>
        <div><div style={{fontSize:13,fontWeight:500}}>{left}</div>{sub&&<div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{sub}</div>}</div>
        <div style={{flexShrink:0,marginLeft:8}}>{right}</div>
      </div>
    );

    const editBtn = () => { setDetail(null); setModal({type:detail.type,data:{...item}}); };
    const delBtn  = () => removeRec(detail.type, detail.id);

    return (
      <div className={`dp open`}>
        <div className="dp-head">
          <span className="dp-title">{detail.type==='serviceRequests'?'Service Request':detail.type.replace(/^\w/,c=>c.toUpperCase())} Detail</span>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={()=>setDetail(null)}><Ico name="x"/></button>
        </div>
        <div className="dp-body">

          {/* COMPANIES */}
          {detail.type==="companies" && <>
            <div className="dp-hero"><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700,marginBottom:4}}>{item.name}</div><Tag text={item.industry} cls="t-blue"/></div>
            <DR label="Email" value={item.email}/><DR label="Phone" value={item.phone} mono/><DR label="Website" value={item.website}/><DR label="Address" value={item.address}/><DR label="Created" value={item.createdAt}/>
            <DSec label={`Contacts (${contacts.filter(c=>c.companyId===item.id).length})`}/>
            {contacts.filter(c=>c.companyId===item.id).map(c=><DItem key={c.id} left={c.name} sub={c.title} right={<span style={{fontSize:11,color:"#94a3b8"}}>{c.email}</span>}/>)}
            <DSec label={`Employees (${employees.filter(e=>e.companyId===item.id).length})`}/>
            {employees.filter(e=>e.companyId===item.id).map(e=><DItem key={e.id} left={e.name} sub={`${e.department} · ${e.title}`} right={<Tag text={e.department} cls="t-purple"/>}/>)}
            <DSec label={`Service Requests (${serviceRequests.filter(c=>c.companyId===item.id).length})`}/>
            {serviceRequests.filter(c=>c.companyId===item.id).map(c=><DItem key={c.id} left={c.subject.slice(0,42)+"…"} sub={c.requestNum} right={<Bdg text={c.status} cls={srStatusColors[c.status]}/>} onClick={()=>setDetail({type:"serviceRequests",id:c.id})}/>)}
          </>}

          {/* CONTACTS */}
          {detail.type==="contacts" && <>
            <div className="dp-hero">
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:8}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontWeight:700,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.name[0]}</div>
                <div><div style={{fontFamily:"'Lora',serif",fontSize:17,fontWeight:700}}>{item.name}</div><div style={{fontSize:12,color:"#64748b"}}>{item.title}</div></div>
              </div>
            </div>
            <DR label="Email" value={item.email}/><DR label="Phone" value={item.phone} mono/>
            <DR label="Company" value={item.companyId?gc(item.companyId)?.name:"Independent"}/><DR label="Created" value={item.createdAt}/>
            <DSec label={`Service Requests (${serviceRequests.filter(c=>c.contactId===item.id).length})`}/>
            {serviceRequests.filter(c=>c.contactId===item.id).map(c=><DItem key={c.id} left={c.subject.slice(0,40)+"…"} sub={c.requestNum} right={<Bdg text={c.priority} cls={srPriorityColors[c.priority]}/>} onClick={()=>setDetail({type:"serviceRequests",id:c.id})}/>)}
            <DSec label={`Leads (${leads.filter(l=>l.contactId===item.id).length})`}/>
            {leads.filter(l=>l.contactId===item.id).map(l=><DItem key={l.id} left={l.source} sub={l.createdAt} right={<Bdg text={l.status} cls={leadColors[l.status]}/>}/>)}
          </>}

          {/* EMPLOYEES */}
          {detail.type==="employees" && <>
            <div className="dp-hero">
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:8}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#059669,#0891b2)",color:"#fff",fontWeight:700,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.name[0]}</div>
                <div><div style={{fontFamily:"'Lora',serif",fontSize:17,fontWeight:700}}>{item.name}</div><div style={{fontSize:12,color:"#64748b"}}>{item.title}</div></div>
              </div>
              <Tag text={item.department} cls="t-teal"/>
            </div>
            <DR label="Email" value={item.email}/><DR label="Phone" value={item.phone} mono/>
            <DR label="Company" value={gc(item.companyId)?.name}/><DR label="Hired" value={item.hiredAt}/>
            <DSec label={`Leads Owned (${leads.filter(l=>l.employeeId===item.id).length})`}/>
            {leads.filter(l=>l.employeeId===item.id).map(l=><DItem key={l.id} left={gct(l.contactId)?.name} sub={l.source} right={<Bdg text={l.status} cls={leadColors[l.status]}/>}/>)}
            <DSec label={`Opportunities Owned (${opportunities.filter(o=>o.employeeId===item.id).length})`}/>
            {opportunities.filter(o=>o.employeeId===item.id).map(o=><DItem key={o.id} left={o.title.slice(0,36)} sub={fmt$(o.value)} right={<Bdg text={o.stage} cls={stageColor(o.stage)}/>}/>)}
            <DSec label={`Invoices Owned (${invoices.filter(i=>i.employeeId===item.id).length})`}/>
            {invoices.filter(i=>i.employeeId===item.id).map(i=><DItem key={i.id} left={`INV-${i.id.toUpperCase()}`} sub={gct(i.contactId)?.name} right={<Bdg text={i.status} cls={invColors[i.status]}/>}/>)}
          </>}

          {/* LEADS */}
          {detail.type==="leads" && <>
            <DR label="Contact" value={<b>{gct(item.contactId)?.name}</b>}/>
            <DR label="Company" value={gc(gct(item.contactId)?.companyId)?.name}/>
            <DR label="Status" value={<Bdg text={item.status} cls={leadColors[item.status]}/>}/>
            <DR label="Source" value={<Tag text={item.source} cls="t-blue"/>}/>
            <DR label="Employee (Owner)" value={gem(item.employeeId)?.name}/>
            <DR label="Event" value={item.eventId?gev(item.eventId)?.name:null}/>
            <DR label="Converted" value={item.converted?"✓ Converted":"No"}/><DR label="Created" value={item.createdAt}/>
            {item.notes && <div className="dp-note" style={{marginTop:10}}>{item.notes}</div>}
            {!item.converted && <button className="btn btn-green" style={{marginTop:14,width:"100%",justifyContent:"center"}} onClick={()=>{setDetail(null);convertLead(item);}}><Ico name="convert" size={13}/> Convert to Opportunity</button>}
          </>}

          {/* OPPORTUNITIES */}
          {detail.type==="opportunities" && <>
            <div className="dp-hero"><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:"#1e40af",marginBottom:4}}>{fmt$(item.value)}</div><div style={{fontSize:14,fontWeight:600}}>{item.title}</div></div>
            <DR label="Stage" value={<Bdg text={item.stage} cls={stageColor(item.stage)}/>}/>
            <DR label="Contact" value={gct(item.contactId)?.name}/>
            <DR label="Employee (Owner)" value={gem(item.employeeId)?.name}/>
            <DR label="Source Lead" value={gl(item.leadId)?`${gl(item.leadId)?.source} (${gl(item.leadId)?.status})`:null}/>
            <DR label="Close Date" value={item.closeDate}/><DR label="Created" value={item.createdAt}/>
            <DSec label={`Products (${item.productIds?.length||0})`}/>
            {(item.productIds||[]).map(pid=>{const p=gp(pid);return p?<DItem key={pid} left={p.name} sub={p.sku} right={<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:"#2563eb"}}>{fmt$(p.price)}</span>}/>:null;})}
          </>}

          {/* PRODUCTS */}
          {detail.type==="products" && <>
            <div className="dp-hero"><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:"#1e40af",marginBottom:4}}>{fmt$(item.price)}</div><div style={{fontSize:14,fontWeight:600}}>{item.name}</div></div>
            <DR label="SKU" value={item.sku} mono/><DR label="Created" value={item.createdAt}/>
            <div className="dp-note" style={{marginTop:10}}>{item.description}</div>
          </>}

          {/* INVOICES */}
          {detail.type==="invoices" && <>
            <div className="dp-hero">
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:700,color:"#1e40af",marginBottom:2}}>{fmt$(invTotal(item))}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:"#64748b"}}>INV-{item.id.toUpperCase()}</span><Bdg text={item.status} cls={invColors[item.status]}/></div>
            </div>
            <DR label="Bill To" value={gct(item.contactId)?.name}/><DR label="Employee (Owner)" value={gem(item.employeeId)?.name}/><DR label="Due Date" value={item.dueDate}/>
            <DSec label={`Line Items (${(item.lineItems||[]).length})`}/>
            {(item.lineItems||[]).map((li,i)=>{const p=gp(li.productId);return <DItem key={li.id||i} left={p?.name||"—"} sub={p?.sku} right={<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:"#2563eb"}}>{li.qty}× {fmt$(liTotal(li))}</span>}/>;  })}
            <div style={{display:"flex",justifyContent:"space-between",padding:"9px 10px",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:7,marginTop:6}}>
              <span style={{fontWeight:700,fontSize:12,color:"#1e40af"}}>TOTAL</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:"#1e40af"}}>{fmt$(invTotal(item))}</span>
            </div>
          </>}

          {/* CASES */}
          {detail.type==="serviceRequests" && <>
            <div className="dp-hero" style={{background:`linear-gradient(135deg,${item.priority==="Critical"?"#f5f3ff,#fef2f2":item.priority==="High"?"#fef2f2,#fff7ed":"#f0fdf4,#f8fafc"})`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#64748b"}}>{item.requestNum}</span>
                <div style={{display:"flex",gap:5}}><Bdg text={item.priority} cls={srPriorityColors[item.priority]}/><Bdg text={item.status} cls={srStatusColors[item.status]}/></div>
              </div>
              <div style={{fontSize:14,fontWeight:600,lineHeight:1.4}}>{item.subject}</div>
            </div>
            <DR label="Type" value={<Bdg text={item.type} cls={srTypeColors[item.type]}/>}/>
            <DR label="Contact" value={gct(item.contactId)?.name}/>
            <DR label="Company" value={item.companyId?gc(item.companyId)?.name:"—"}/>
            <DR label="Created" value={item.createdAt}/><DR label="Updated" value={item.updatedAt}/>
            {(item.productIds||[]).length>0&&<><DSec label="Products Involved"/>{item.productIds.map(pid=>{const p=gp(pid);return p?<DItem key={pid} left={p.name} sub={p.sku} right={<Tag text={p.sku} cls="t-gray"/>}/>:null;})}</>}
            {item.description&&<><DSec label="Description"/><div className="dp-note">{item.description}</div></>}
            {item.resolution&&<><DSec label="Resolution"/><div className="dp-note" style={{background:"#f0fdf4",border:"1px solid #bbf7d0"}}>{item.resolution}</div></>}
          </>}

          {/* CAMPAIGNS */}
          {detail.type==="campaigns" && <>
            <div className="dp-hero" style={{background:"linear-gradient(135deg,#f5f3ff,#eff6ff)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><Tag text={item.type} cls="t-purple"/><Bdg text={item.status} cls={campStatus[item.status]}/></div>
              <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:700,marginBottom:4}}>{item.name}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:"#7c3aed"}}>{fmtN(item.budget)}</div>
            </div>
            <DR label="Budget" value={fmt$(item.budget)} mono/><DR label="Start" value={item.startDate}/><DR label="End" value={item.endDate}/>
            <DSec label="Assigned Employees"/>
            {(item.employeeIds||[]).map(eid=>{const e=gem(eid);return e?<DItem key={eid} left={e.name} sub={e.department} right={<Tag text={e.department} cls="t-teal"/>}/>:null;})}
            {(item.employeeIds||[]).length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No employees assigned.</p>}
            <DSec label={`Events (${events.filter(e=>e.campaignId===item.id).length})`}/>
            {events.filter(e=>e.campaignId===item.id).map(e=><DItem key={e.id} left={e.name} sub={`${e.type} · ${e.date}`} right={<Bdg text={e.status} cls={eventStatus[e.status]}/>} onClick={()=>setDetail({type:"events",id:e.id})}/>)}
            <DSec label={`Goals (${goals.filter(g=>g.campaignId===item.id).length})`}/>
            {goals.filter(g=>g.campaignId===item.id).map(g=>{const p=pct(g.currentValue,g.targetValue);return(
              <div key={g.id} className="dp-item" onClick={()=>setDetail({type:"goals",id:g.id})}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,marginBottom:4}}>{g.name}</div><PBar value={g.currentValue} max={g.targetValue}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#94a3b8",marginTop:2}}><span>{g.currentValue}/{g.targetValue} {g.unit}</span><span>{p}%</span></div></div>
              </div>
            );})}
            {item.description&&<><DSec label="Description"/><div className="dp-note">{item.description}</div></>}
          </>}

          {/* EVENTS */}
          {detail.type==="events" && <>
            <div className="dp-hero" style={{background:"linear-gradient(135deg,#ecfeff,#f0fdf4)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><Tag text={item.type} cls="t-teal"/><Bdg text={item.status} cls={eventStatus[item.status]}/></div>
              <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:700}}>{item.name}</div>
            </div>
            <DR label="Campaign" value={item.campaignId?gcam(item.campaignId)?.name:"—"}/>
            <DR label="Date" value={item.date===item.endDate?item.date:`${item.date} → ${item.endDate}`}/>
            <DR label="Location" value={item.location}/>
            <DSec label="Assigned Employees"/>
            {(item.employeeIds||[]).map(eid=>{const e=gem(eid);return e?<DItem key={eid} left={e.name} sub={e.title} right={<Tag text={e.department} cls="t-teal"/>}/>:null;})}
            {(item.employeeIds||[]).length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No employees assigned.</p>}
            <DSec label={`Leads Attending (${(item.leadIds||[]).length})`}/>
            {(item.leadIds||[]).map(lid=>{const l=gl(lid);const ct=l?gct(l.contactId):null;return l?<DItem key={lid} left={ct?.name||"—"} sub={`${l.source} · ${l.status}`} right={<Bdg text={l.status} cls={leadColors[l.status]}/>} onClick={()=>setDetail({type:"leads",id:l.id})}/>:null;})}
            {(item.leadIds||[]).length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No leads associated.</p>}
            {item.description&&<><DSec label="Description"/><div className="dp-note">{item.description}</div></>}
          </>}

          {/* GOALS */}
          {detail.type==="goals" && <>
            <div className="dp-hero" style={{background:"linear-gradient(135deg,#fffbeb,#f0fdf4)"}}>
              <Tag text={item.metric} cls="t-amber"/>
              <div style={{fontSize:15,fontWeight:700,margin:"6px 0"}}>{item.name}</div>
              <PBar value={item.currentValue} max={item.targetValue}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:13}}>
                <span style={{fontWeight:600}}>{item.currentValue} {item.unit}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:pct(item.currentValue,item.targetValue)>=100?"#059669":"#1e40af"}}>{pct(item.currentValue,item.targetValue)}%</span>
              </div>
            </div>
            <DR label="Campaign" value={item.campaignId?gcam(item.campaignId)?.name:"—"}/><DR label="Target" value={`${item.targetValue} ${item.unit}`}/><DR label="Current" value={`${item.currentValue} ${item.unit}`}/><DR label="Due Date" value={item.dueDate}/>
            {item.notes&&<div className="dp-note" style={{marginTop:10}}>{item.notes}</div>}
          </>}

        </div>
        <div className="dp-actions">
          <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={editBtn}><Ico name="edit" size={12}/> Edit</button>
          <button className="btn btn-danger btn-sm" style={{flex:1}} onClick={delBtn}><Ico name="trash" size={12}/> Delete</button>
        </div>
      </div>
    );
  };


  /* ═══════════════════════════════════════════════════════════════════════
     TABLE VIEW FACTORY
  ═══════════════════════════════════════════════════════════════════════ */
  const TableView = ({ title, type, cols, rows, onAdd, addLabel }) => (
    <div>
      <div className="page-head">
        <div><div className="page-title">{title}</div><div className="page-sub">{rows.length} record{rows.length!==1?"s":""}</div></div>
        <button className="btn btn-primary" onClick={onAdd}><Ico name="plus" size={13}/> {addLabel||`New ${title.replace(/s$/,"")}`}</button>
      </div>
      <div className="tw">
        <table>
          <thead><tr>
            {cols.map(c=><th key={c.key}>{c.label}</th>)}
            <th style={{textAlign:"right"}}>Actions</th>
          </tr></thead>
          <tbody>
            {rows.length===0
              ?<tr><td colSpan={cols.length+1}><EmptyState msg="No records found."/></td></tr>
              :rows.map(row=>(
              <tr key={row.id} onClick={()=>setDetail({type,id:row.id})}>
                {cols.map(c=><td key={c.key} className={c.mono?"mo":c.muted?"mu":""}>{c.render?c.render(row):row[c.key]}</td>)}
                <td style={{textAlign:"right",whiteSpace:"nowrap"}} onClick={e=>e.stopPropagation()}>
                  <div className="act-row" style={{justifyContent:"flex-end"}}>
                    <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type,data:{...row}})}><Ico name="edit" size={11}/> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>removeRec(type,row.id)}><Ico name="trash" size={11}/> Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════
     DASHBOARD
  ═══════════════════════════════════════════════════════════════════════ */
  const Dashboard = () => {
    const pipeline  = opportunities.reduce((s,o)=>s+(o.value||0),0);
    const paidRev   = invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+invTotal(i),0);
    const openSRs = serviceRequests.filter(c=>c.status==="Open"||c.status==="In Progress"||c.status==="Escalated").length;
    const activeCamps = campaigns.filter(c=>c.status==="Active").length;

    const stats = [
      { label:"Companies",    val:companies.length,                icon:"companies",  color:"#2563eb", bg:"#eff6ff" },
      { label:"Contacts",     val:contacts.length,                 icon:"contacts",   color:"#7c3aed", bg:"#f5f3ff" },
      { label:"Employees",    val:employees.length,                icon:"employees",  color:"#0891b2", bg:"#ecfeff" },
      { label:"Open Leads",   val:leads.filter(l=>!l.converted).length, icon:"leads", color:"#d97706", bg:"#fffbeb" },
      { label:"Opportunities",val:opportunities.length,            icon:"opps",       color:"#059669", bg:"#f0fdf4" },
      { label:"Open Service Requests",   val:openSRs,                       icon:"cases",      color:"#dc2626", bg:"#fef2f2" },
      { label:"Pipeline",     val:fmtN(pipeline),                  icon:"dollar",     color:"#0891b2", bg:"#ecfeff", mono:true },
      { label:"Paid Revenue", val:fmtN(paidRev),                   icon:"invoices",   color:"#059669", bg:"#f0fdf4", mono:true },
      { label:"Campaigns",    val:`${activeCamps} active`,         icon:"campaigns",  color:"#7c3aed", bg:"#f5f3ff" },
    ];

    const criticalCases = serviceRequests.filter(c=>c.priority==="Critical"||c.priority==="High").filter(c=>c.status!=="Resolved"&&c.status!=="Closed");

    return (
      <div>
        <div className="page-head"><div><div className="page-title">Dashboard</div><div className="page-sub">CRM + Case Management + Marketing Automation</div></div></div>
        <div className="stat-grid">
          {stats.map(s=>(
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{background:s.bg}}><Ico name={s.icon} size={20} color={s.color}/></div>
              <div><div className="stat-val" style={{fontFamily:s.mono?"'JetBrains Mono',monospace":undefined,fontSize:s.mono?17:21}}>{s.val}</div><div className="stat-lbl">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="two-col" style={{marginBottom:18}}>
          {/* Active Leads */}
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:12}}>Active Leads</div>
            {leads.filter(l=>!l.converted).slice(0,6).map(l=>(
              <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>{setView("leads");setDetail({type:"leads",id:l.id});}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{gct(l.contactId)?.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{l.source} · {gc(gct(l.contactId)?.companyId)?.name||"Independent"}</div></div>
                <Bdg text={l.status} cls={leadColors[l.status]}/>
              </div>
            ))}
            {leads.filter(l=>!l.converted).length===0&&<EmptyState msg="No open leads."/>}
          </div>

          {/* Open/Escalated Cases */}
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:12}}>High-Priority Cases</div>
            {criticalCases.slice(0,5).map(c=>(
              <div key={c.id} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>{setView("cases");setDetail({type:"serviceRequests",id:c.id});}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:500,flex:1,marginRight:8,lineHeight:1.3}}>{c.subject.length>50?c.subject.slice(0,50)+"…":c.subject}</span>
                  <Bdg text={c.priority} cls={srPriorityColors[c.priority]}/>
                </div>
                <div style={{fontSize:11,color:"#94a3b8"}}>{c.requestNum} · {gc(c.companyId)?.name||"—"}</div>
              </div>
            ))}
            {criticalCases.length===0&&<EmptyState msg="No critical/high-priority open cases."/>}
          </div>
        </div>

        <div className="two-col">
          {/* Campaign progress */}
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:12}}>Campaign Progress</div>
            {campaigns.slice(0,4).map(c=>{
              const cg=goals.filter(g=>g.campaignId===c.id);
              const ap=cg.length>0?Math.round(cg.reduce((s,g)=>s+pct(g.currentValue,g.targetValue),0)/cg.length):null;
              return(
                <div key={c.id} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>{setView("campaigns");}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:500}}>{c.name}</span><Bdg text={c.status} cls={campStatus[c.status]}/></div>
                  {ap!==null&&<><PBar value={ap} max={100}/><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{ap}% avg goal completion</div></>}
                </div>
              );
            })}
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:12}}>Upcoming Events</div>
            {events.filter(e=>e.status==="Upcoming").slice(0,5).map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>{setView("events");setDetail({type:"events",id:e.id});}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{e.date} · {e.location}</div></div>
                <Tag text={e.type} cls="t-teal"/>
              </div>
            ))}
            {events.filter(e=>e.status==="Upcoming").length===0&&<EmptyState msg="No upcoming events."/>}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     CASES VIEW
  ═══════════════════════════════════════════════════════════════════════ */
  const ServiceRequestsView = () => {
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");
    const statuses = ["All","Open","In Progress","Pending","Escalated","Resolved","Closed"];
    const priorities = ["All","Critical","High","Medium","Low"];

    const filtered = F.serviceRequests
      .filter(c => filterStatus==="All" || c.status===filterStatus)
      .filter(c => filterPriority==="All" || c.priority===filterPriority);

    const counts = { open:serviceRequests.filter(c=>c.status==="Open").length, inProgress:serviceRequests.filter(c=>c.status==="In Progress").length, escalated:serviceRequests.filter(c=>c.status==="Escalated").length, resolved:serviceRequests.filter(c=>c.status==="Resolved"||c.status==="Closed").length };

    return (
      <div>
        <div className="page-head">
          <div><div className="page-title">Case Management</div><div className="page-sub">ServiceNow-style service request tracking for contacts & companies</div></div>
          <button className="btn btn-primary" onClick={()=>setModal({type:"serviceRequests",data:{}})}><Ico name="plus" size={13}/> New Service Request</button>
        </div>
        <div className="stat-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
          {[{l:"Open",v:counts.open,color:"#2563eb",bg:"#eff6ff"},{l:"In Progress",v:counts.inProgress,color:"#d97706",bg:"#fffbeb"},{l:"Escalated",v:counts.escalated,color:"#dc2626",bg:"#fef2f2"},{l:"Resolved/Closed",v:counts.resolved,color:"#059669",bg:"#f0fdf4"}].map(s=>(
            <div key={s.l} className="stat-card"><div className="stat-icon" style={{background:s.bg}}><Ico name="cases" size={19} color={s.color}/></div><div><div className="stat-val" style={{fontSize:20}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div></div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {statuses.map(s=><button key={s} className={`rpt-tab${filterStatus===s?" on":""}`} onClick={()=>setFilterStatus(s)} style={{padding:"5px 12px",fontSize:12}}>{s}</button>)}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginLeft:8}}>
            {priorities.map(p=><button key={p} className={`rpt-tab${filterPriority===p?" on":""}`} onClick={()=>setFilterPriority(p)} style={{padding:"5px 12px",fontSize:12,background:filterPriority===p&&p==="Critical"?"#7c3aed":filterPriority===p&&p==="High"?"#dc2626":filterPriority===p&&p==="Medium"?"#d97706":undefined,borderColor:filterPriority===p&&p!=="All"?"transparent":undefined}}>{p}</button>)}
          </div>
        </div>
        <div className="tw">
          <table>
            <thead><tr>
              <th>Case #</th><th>Subject</th><th>Type</th><th>Priority</th><th>Status</th><th>Contact</th><th>Company</th><th>Products</th><th>Updated</th><th style={{textAlign:"right"}}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length===0?<tr><td colSpan={10}><EmptyState/></td></tr>:filtered.map(c=>(
                <tr key={c.id} onClick={()=>setDetail({type:"serviceRequests",id:c.id})}>
                  <td className="mo" style={{color:"#64748b"}}>{c.requestNum}</td>
                  <td style={{maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{c.subject}</td>
                  <td><Bdg text={c.type} cls={srTypeColors[c.type]}/></td>
                  <td><Bdg text={c.priority} cls={srPriorityColors[c.priority]}/></td>
                  <td><Bdg text={c.status} cls={srStatusColors[c.status]}/></td>
                  <td style={{fontSize:13}}>{gct(c.contactId)?.name}</td>
                  <td>{c.companyId?<Tag text={gc(c.companyId)?.name} cls="t-blue"/>:<span style={{color:"#94a3b8"}}>—</span>}</td>
                  <td className="mo" style={{color:"#64748b"}}>{(c.productIds||[]).length}</td>
                  <td className="mu">{c.updatedAt||c.createdAt}</td>
                  <td style={{textAlign:"right",whiteSpace:"nowrap"}} onClick={e=>e.stopPropagation()}>
                    <div className="act-row" style={{justifyContent:"flex-end"}}>
                      <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"serviceRequests",data:{...c}})}><Ico name="edit" size={11}/> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>removeRec("serviceRequests",c.id)}><Ico name="trash" size={11}/> Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     REPORTS VIEW
  ═══════════════════════════════════════════════════════════════════════ */
  const ReportsView = () => {
    /* Revenue helpers */
    const paid = invoices.filter(i=>i.status==="Paid");
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const revByMonth = (() => {
      const map={};
      paid.forEach(inv=>{
        const d=inv.createdAt||"";
        if(!d)return;
        const [yr,mo]=d.split("-");
        const key=`${yr}-${mo}`;
        map[key]=(map[key]||0)+invTotal(inv);
      });
      return Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>{
        const [yr,mo]=k.split("-");
        return {label:`${monthNames[+mo-1]} ${yr}`,value:v};
      });
    })();

    const revByQuarter = (() => {
      const map={};
      paid.forEach(inv=>{
        const d=inv.createdAt||"";
        if(!d)return;
        const [yr,mo]=d.split("-");
        const q=Math.ceil(+mo/3);
        const key=`${yr} Q${q}`;
        map[key]=(map[key]||0)+invTotal(inv);
      });
      return Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>({label:k,value:v}));
    })();

    const revByYear = (() => {
      const map={};
      paid.forEach(inv=>{
        const yr=(inv.createdAt||"").split("-")[0];
        if(!yr)return;
        map[yr]=(map[yr]||0)+invTotal(inv);
      });
      return Object.entries(map).sort().map(([k,v])=>({label:k,value:v}));
    })();

    const srByCompany = (() => {
      return companies.map(c=>({label:c.name,value:serviceRequests.filter(x=>x.companyId===c.id).length})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
    })();

    const srByContact = (() => {
      return contacts.map(c=>({label:c.name,value:serviceRequests.filter(x=>x.contactId===c.id).length})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
    })();

    const leadsByCampaign = (() => {
      return campaigns.map(c=>{
        const campEvents=events.filter(ev=>ev.campaignId===c.id);
        const campLeads=new Set();
        campEvents.forEach(ev=>(ev.leadIds||[]).forEach(lid=>campLeads.add(lid)));
        return {label:c.name,value:campLeads.size};
      }).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
    })();

    const leadsByEvent = (() => {
      return events.map(ev=>({label:ev.name,value:(ev.leadIds||[]).length})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
    })();

    const BarChart = ({data, fmt=(v)=>v, color="#2563eb"}) => {
      const max=Math.max(...data.map(d=>d.value),1);
      return(
        <div>
          {data.length===0&&<EmptyState msg="No data available."/>}
          {data.map((d,i)=>(
            <div key={i} className="rpt-bar-row">
              <div className="rpt-bar-lbl" title={d.label}>{d.label}</div>
              <div className="rpt-bar-bg"><div className="rpt-bar-fill" style={{width:`${d.value/max*100}%`,background:color}}/></div>
              <div className="rpt-bar-val">{fmt(d.value)}</div>
            </div>
          ))}
        </div>
      );
    };

    const tabs = [
      {id:"rev-month",   label:"Revenue by Month"},
      {id:"rev-quarter", label:"Revenue by Quarter"},
      {id:"rev-year",    label:"Revenue by Year"},
      {id:"sr-co",    label:"Service Requests by Company"},
      {id:"sr-ct",    label:"Service Requests by Contact"},
      {id:"leads-camp",  label:"Leads by Campaign"},
      {id:"leads-event", label:"Leads by Event"},
    ];

    const revTotal = (data) => data.reduce((s,d)=>s+d.value,0);

    return (
      <div>
        <div className="page-head"><div><div className="page-title">Reports</div><div className="page-sub">Operational analytics across revenue, cases, and lead generation</div></div></div>

        {/* Summary cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
          {[
            {label:"Total Paid Revenue",     val:fmt$(paid.reduce((s,i)=>s+invTotal(i),0)),color:"#059669",bg:"#f0fdf4"},
            {label:"Total Service Requests",            val:serviceRequests.length,                               color:"#dc2626",bg:"#fef2f2"},
            {label:"Leads via Campaigns",    val:leadsByCampaign.reduce((s,d)=>s+d.value,0),color:"#7c3aed",bg:"#f5f3ff"},
            {label:"Leads via Events",       val:leadsByEvent.reduce((s,d)=>s+d.value,0),   color:"#0891b2",bg:"#ecfeff"},
          ].map(s=>(
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{background:s.bg}}><Ico name="reports" size={19} color={s.color}/></div>
              <div><div className="stat-val" style={{fontSize:17,fontFamily:"'JetBrains Mono',monospace",color:s.color}}>{s.val}</div><div className="stat-lbl">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="rpt-tabs">
          {tabs.map(t=><button key={t.id} className={`rpt-tab${rptTab===t.id?" on":""}`} onClick={()=>setRptTab(t.id)}>{t.label}</button>)}
        </div>

        <div className="rpt-card">
          {rptTab==="rev-month"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Revenue by Month</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Paid invoices only · Total: {fmt$(revTotal(revByMonth))}</div></div>
            </div>
            <BarChart data={revByMonth} fmt={v=>fmt$(v)} color="#2563eb"/>
          </>}
          {rptTab==="rev-quarter"&&<>
            <div style={{marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Revenue by Quarter</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Paid invoices only · Total: {fmt$(revTotal(revByQuarter))}</div></div>
            <BarChart data={revByQuarter} fmt={v=>fmt$(v)} color="#7c3aed"/>
          </>}
          {rptTab==="rev-year"&&<>
            <div style={{marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Revenue by Year</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Paid invoices only · Total: {fmt$(revTotal(revByYear))}</div></div>
            <BarChart data={revByYear} fmt={v=>fmt$(v)} color="#059669"/>
          </>}
          {rptTab==="sr-co"&&<>
            <div style={{marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Service Requests by Company</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Total service requests per company</div></div>
            <BarChart data={srByCompany} fmt={v=>`${v} case${v!==1?"s":""}`} color="#dc2626"/>
            {srByCompany.length===0&&<><br/><div style={{color:"#94a3b8",fontSize:13}}>No cases linked to companies yet.</div></>}
          </>}
          {rptTab==="sr-ct"&&<>
            <div style={{marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Service Requests by Contact</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Total service requests per contact</div></div>
            <BarChart data={srByContact} fmt={v=>`${v} case${v!==1?"s":""}`} color="#ea580c"/>
          </>}
          {rptTab==="leads-camp"&&<>
            <div style={{marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Leads Generated by Campaign</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Unique leads associated to events in each campaign</div></div>
            <BarChart data={leadsByCampaign} fmt={v=>`${v} lead${v!==1?"s":""}`} color="#7c3aed"/>
            {leadsByCampaign.length===0&&<><br/><div style={{color:"#94a3b8",fontSize:13}}>No leads linked to campaign events yet.</div></>}
          </>}
          {rptTab==="leads-event"&&<>
            <div style={{marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700}}>Leads Generated by Event</div><div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>Leads associated per event</div></div>
            <BarChart data={leadsByEvent} fmt={v=>`${v} lead${v!==1?"s":""}`} color="#0891b2"/>
          </>}
        </div>
      </div>
    );
  };


  /* ═══════════════════════════════════════════════════════════════════════
     MARKETING CAMPAIGN HUB
  ═══════════════════════════════════════════════════════════════════════ */
  const CampaignHub = () => {
    const camp = campView ? campaigns.find(c=>c.id===campView) : null;
    if (!camp) {
      return (
        <div>
          <div className="page-head">
            <div>
              <div className="page-title">Marketing Automation</div>
              <div className="page-sub">Campaigns · Events · Goals</div>
            </div>
            <button className="btn btn-primary" onClick={()=>setModal({type:"campaigns",data:{employeeIds:[]}})}><Ico name="plus" size={13}/> New Campaign</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[{l:"Total Campaigns",val:campaigns.length,c:"#7c3aed",bg:"#f5f3ff"},{l:"Active",val:campaigns.filter(c=>c.status==="Active").length,c:"#059669",bg:"#f0fdf4"},{l:"Total Budget",val:fmt$(campaigns.reduce((s,c)=>s+(c.budget||0),0)),c:"#0891b2",bg:"#ecfeff",mono:true},{l:"Goals Tracked",val:goals.length,c:"#d97706",bg:"#fffbeb"}].map(s=>(
              <div key={s.l} className="stat-card"><div className="stat-icon" style={{background:s.bg}}><Ico name="campaigns" size={19} color={s.c}/></div><div><div className="stat-val" style={{fontSize:s.mono?16:20,fontFamily:s.mono?"'JetBrains Mono',monospace":undefined,color:s.c}}>{s.val}</div><div className="stat-lbl">{s.l}</div></div></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {F.campaigns.map(c=>{
              const cg=goals.filter(g=>g.campaignId===c.id);
              const ce=events.filter(ev=>ev.campaignId===c.id);
              const ap=cg.length>0?Math.round(cg.reduce((s,g)=>s+pct(g.currentValue,g.targetValue),0)/cg.length):null;
              return(
                <div key={c.id} className="camp-card" onClick={()=>setCampView(c.id)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><Tag text={c.type} cls="t-purple" style={{marginBottom:5}}/><br/><div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,marginTop:5}}>{c.name}</div></div>
                    <Bdg text={c.status} cls={campStatus[c.status]}/>
                  </div>
                  <div style={{fontSize:12,color:"#94a3b8",marginBottom:10,height:36,overflow:"hidden",lineHeight:1.5}}>{c.description?.slice(0,100)}…</div>
                  {ap!==null&&<><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}><span style={{color:"#64748b"}}>Avg Goal Progress</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:ap>=80?"#059669":ap>=50?"#2563eb":"#d97706"}}>{ap}%</span></div><PBar value={ap} max={100}/></>}
                  <div style={{display:"flex",gap:14,fontSize:12,color:"#94a3b8",borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:10}}>
                    <span>{ce.length} events</span><span>{cg.length} goals</span>
                    <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",color:"#7c3aed",fontWeight:600}}>{fmt$(c.budget)}</span>
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:8}} onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"campaigns",data:{...c}})}><Ico name="edit" size={11}/> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>removeRec("campaigns",c.id)}><Ico name="trash" size={11}/> Del</button>
                  </div>
                </div>
              );
            })}
            {F.campaigns.length===0&&<div style={{gridColumn:"1/-1"}}><EmptyState msg="No campaigns found."/></div>}
          </div>
        </div>
      );
    }
    const campGoals  = goals.filter(g=>g.campaignId===camp.id);
    const campEvents = events.filter(e=>e.campaignId===camp.id);
    return (
      <div>
        <button className="btn btn-secondary btn-sm" style={{marginBottom:16}} onClick={()=>setCampView(null)}><Ico name="back" size={12}/> Back to Campaigns</button>
        <div style={{background:"linear-gradient(135deg,#f5f3ff,#eff6ff)",border:"1px solid #ddd6fe",borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><Tag text={camp.type} cls="t-purple"/><Bdg text={camp.status} cls={campStatus[camp.status]}/></div>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,marginBottom:4}}>{camp.name}</div>
            <div style={{fontSize:13,color:"#64748b"}}>{camp.startDate} → {camp.endDate} · Budget: <b style={{color:"#7c3aed"}}>{fmt$(camp.budget)}</b></div>
            {(camp.employeeIds||[]).length>0&&<div style={{fontSize:12,color:"#64748b",marginTop:6}}>Employees: {(camp.employeeIds||[]).map(eid=>gem(eid)?.name).filter(Boolean).join(", ")}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"campaigns",data:{...camp}})}><Ico name="edit" size={11}/> Edit Campaign</button>
            <button className="btn btn-primary btn-sm" onClick={()=>setModal({type:"events",data:{campaignId:camp.id,leadIds:[],employeeIds:[]}})}><Ico name="plus" size={11}/> Add Event</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"goals",data:{campaignId:camp.id}})}><Ico name="plus" size={11}/> Add Goal</button>
          </div>
        </div>
        {camp.description&&<p style={{color:"#64748b",fontSize:14,lineHeight:1.7,marginBottom:20}}>{camp.description}</p>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:12}}>Events ({campEvents.length})</div>
            {campEvents.length===0&&<EmptyState msg="No events in this campaign yet."/>}
            {campEvents.map(ev=>(
              <div key={ev.id} className="ev-card" onClick={()=>setDetail({type:"events",id:ev.id})} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:14,fontWeight:600,flex:1,marginRight:8}}>{ev.name}</div><Bdg text={ev.status} cls={eventStatus[ev.status]}/></div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:7}}>{ev.date} · {ev.location}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <Tag text={ev.type} cls="t-teal"/>
                  <span style={{fontSize:12,color:"#94a3b8"}}>{(ev.leadIds||[]).length} leads · {(ev.employeeIds||[]).length} staff</span>
                </div>
                <div style={{display:"flex",gap:6,marginTop:8}} onClick={e=>e.stopPropagation()}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"events",data:{...ev}})}><Ico name="edit" size={11}/> Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>removeRec("events",ev.id)}><Ico name="trash" size={11}/> Del</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:12}}>Goals ({campGoals.length})</div>
            {campGoals.length===0&&<EmptyState msg="No goals in this campaign yet."/>}
            {campGoals.map(g=>{const p=pct(g.currentValue,g.targetValue);return(
              <div key={g.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px",marginBottom:10,cursor:"pointer"}} onClick={()=>setDetail({type:"goals",id:g.id})}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:14,fontWeight:600}}>{g.name}</div><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:16,color:p>=100?"#059669":p>=60?"#2563eb":"#d97706"}}>{p}%</span></div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>{g.metric} · due {g.dueDate}</div>
                <PBar value={g.currentValue} max={g.targetValue}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:5,color:"#64748b"}}><span>{g.currentValue} {g.unit} current</span><span>target {g.targetValue} {g.unit}</span></div>
                <div style={{display:"flex",gap:6,marginTop:8}} onClick={e=>e.stopPropagation()}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"goals",data:{...g}})}><Ico name="edit" size={11}/> Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>removeRec("goals",g.id)}><Ico name="trash" size={11}/> Del</button>
                </div>
              </div>
            );})}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     VIEW ROUTING
  ═══════════════════════════════════════════════════════════════════════ */
  const views = {
    dashboard: <Dashboard/>,
    campaigns: <CampaignHub/>,
    serviceRequests: <ServiceRequestsView/>,
    reports:   <ReportsView/>,

    companies: <TableView title="Companies" type="companies" rows={F.companies} onAdd={()=>setModal({type:"companies",data:{}})} addLabel="New Company" cols={[
      {key:"name",     label:"Company",   render:r=><b>{r.name}</b>},
      {key:"industry", label:"Industry",  render:r=><Tag text={r.industry} cls="t-blue"/>},
      {key:"phone",    label:"Phone",     mono:true},
      {key:"email",    label:"Email",     muted:true},
      {key:"contacts", label:"Contacts",  render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#2563eb",fontWeight:600}}>{contacts.filter(c=>c.companyId===r.id).length}</span>},
      {key:"cases",    label:"Service Requests",     render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#dc2626",fontWeight:600}}>{serviceRequests.filter(c=>c.companyId===r.id).length}</span>},
      {key:"createdAt",label:"Since",     muted:true},
    ]}/>,

    contacts: <TableView title="Contacts" type="contacts" rows={F.contacts} onAdd={()=>setModal({type:"contacts",data:{}})} addLabel="New Contact" cols={[
      {key:"name",    label:"Name",    render:r=><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{r.name[0]}</div><div><div style={{fontWeight:500}}>{r.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{r.title}</div></div></div>},
      {key:"email",   label:"Email",   muted:true},
      {key:"phone",   label:"Phone",   mono:true},
      {key:"company", label:"Company", render:r=>r.companyId?<Tag text={gc(r.companyId)?.name} cls="t-blue"/>:<span style={{color:"#94a3b8"}}>Independent</span>},
      {key:"cases",   label:"Service Requests",   render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#dc2626",fontWeight:600}}>{serviceRequests.filter(c=>c.contactId===r.id).length}</span>},
      {key:"createdAt",label:"Since",  muted:true},
    ]}/>,

    employees: <TableView title="Employees" type="employees" rows={F.employees} onAdd={()=>setModal({type:"employees",data:{}})} addLabel="New Employee" cols={[
      {key:"name",       label:"Employee",   render:r=><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#059669,#0891b2)",color:"#fff",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{r.name[0]}</div><div><div style={{fontWeight:500}}>{r.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{r.title}</div></div></div>},
      {key:"department", label:"Dept",       render:r=><Tag text={r.department} cls="t-teal"/>},
      {key:"company",    label:"Company",    render:r=><Tag text={gc(r.companyId)?.name||"—"} cls="t-blue"/>},
      {key:"email",      label:"Email",      muted:true},
      {key:"phone",      label:"Phone",      mono:true},
      {key:"hiredAt",    label:"Hired",      muted:true},
    ]}/>,

    leads: <TableView title="Leads" type="leads" rows={F.leads} onAdd={()=>setModal({type:"leads",data:{}})} addLabel="New Lead" cols={[
      {key:"contact",   label:"Contact",   render:r=><b>{gct(r.contactId)?.name}</b>},
      {key:"company",   label:"Company",   render:r=>{const co=gc(gct(r.contactId)?.companyId);return co?<Tag text={co.name} cls="t-blue"/>:<span style={{color:"#94a3b8"}}>—</span>;}},
      {key:"status",    label:"Status",    render:r=><Bdg text={r.status} cls={leadColors[r.status]}/>},
      {key:"source",    label:"Source",    render:r=><Tag text={r.source} cls="t-gray"/>},
      {key:"employee",  label:"Owner",     render:r=><span style={{fontSize:13,color:"#64748b"}}>{gem(r.employeeId)?.name||"—"}</span>},
      {key:"event",     label:"Event",     render:r=>r.eventId?<span style={{fontSize:12,color:"#0891b2"}}>{gev(r.eventId)?.name?.slice(0,28)}…</span>:<span style={{color:"#94a3b8"}}>—</span>},
      {key:"converted", label:"Converted", render:r=>r.converted?<Bdg text="✓ Yes" cls="b-green"/>:<span style={{color:"#94a3b8",fontSize:12}}>No</span>},
      {key:"createdAt", label:"Date",      muted:true},
    ]}/>,

    opportunities: <TableView title="Opportunities" type="opportunities" rows={F.opportunities} onAdd={()=>setModal({type:"opportunities",data:{productIds:[]}})} addLabel="New Opportunity" cols={[
      {key:"title",    label:"Title",    render:r=><b style={{fontSize:13}}>{r.title}</b>},
      {key:"value",    label:"Value",    render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#1e40af",fontWeight:600,fontSize:13}}>{fmt$(r.value)}</span>},
      {key:"stage",    label:"Stage",    render:r=><Bdg text={r.stage} cls={stageColor(r.stage)}/>},
      {key:"contact",  label:"Contact",  render:r=>gct(r.contactId)?.name||"—"},
      {key:"employee", label:"Owner",    render:r=><span style={{fontSize:13,color:"#64748b"}}>{gem(r.employeeId)?.name||"—"}</span>},
      {key:"products", label:"Products", render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#64748b",fontSize:12}}>{r.productIds?.length||0}</span>},
      {key:"closeDate",label:"Close",    muted:true},
    ]}/>,

    products: <TableView title="Products" type="products" rows={F.products} onAdd={()=>setModal({type:"products",data:{}})} addLabel="New Product" cols={[
      {key:"name",       label:"Product",     render:r=><b>{r.name}</b>},
      {key:"sku",        label:"SKU",         render:r=><code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:12}}>{r.sku}</code>},
      {key:"price",      label:"Unit Price",  render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#1e40af",fontWeight:600}}>{fmt$(r.price)}</span>},
      {key:"description",label:"Description", render:r=><span style={{color:"#64748b",fontSize:12,maxWidth:240,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.description}</span>},
      {key:"createdAt",  label:"Since",       muted:true},
    ]}/>,

    invoices: <TableView title="Invoices" type="invoices" rows={F.invoices} onAdd={()=>setModal({type:"invoices",data:{lineItems:[]}})} addLabel="New Invoice" cols={[
      {key:"id",      label:"Invoice #",  render:r=><code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:12}}>INV-{r.id.toUpperCase()}</code>},
      {key:"contact", label:"Bill To",    render:r=><b>{gct(r.contactId)?.name}</b>},
      {key:"employee",label:"Owner",      render:r=><span style={{fontSize:13,color:"#64748b"}}>{gem(r.employeeId)?.name||"—"}</span>},
      {key:"status",  label:"Status",     render:r=><Bdg text={r.status} cls={invColors[r.status]}/>},
      {key:"lines",   label:"Lines",      render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#64748b"}}>{(r.lineItems||[]).length} items</span>},
      {key:"total",   label:"Total",      render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#1e40af",fontWeight:600}}>{fmt$(invTotal(r))}</span>},
      {key:"dueDate", label:"Due",        muted:true},
    ]}/>,

    events: <TableView title="Events" type="events" rows={F.events} onAdd={()=>setModal({type:"events",data:{leadIds:[],employeeIds:[]}})} addLabel="New Event" cols={[
      {key:"name",     label:"Event",     render:r=><b>{r.name}</b>},
      {key:"type",     label:"Type",      render:r=><Tag text={r.type} cls="t-teal"/>},
      {key:"campaign", label:"Campaign",  render:r=>r.campaignId?<span style={{fontSize:12,color:"#7c3aed"}}>{gcam(r.campaignId)?.name?.slice(0,26)}</span>:<span style={{color:"#94a3b8"}}>—</span>},
      {key:"status",   label:"Status",    render:r=><Bdg text={r.status} cls={eventStatus[r.status]}/>},
      {key:"date",     label:"Date",      muted:true},
      {key:"employees",label:"Staff",     render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#0891b2"}}>{(r.employeeIds||[]).length}</span>},
      {key:"leads",    label:"Leads",     render:r=><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#7c3aed"}}>{(r.leadIds||[]).length}</span>},
      {key:"location", label:"Location",  render:r=><span style={{color:"#94a3b8",fontSize:12,maxWidth:160,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.location}</span>},
    ]}/>,

    goals: <TableView title="Goals" type="goals" rows={F.goals} onAdd={()=>setModal({type:"goals",data:{}})} addLabel="New Goal" cols={[
      {key:"name",    label:"Goal",     render:r=><b>{r.name}</b>},
      {key:"metric",  label:"Metric",   render:r=><Tag text={r.metric} cls="t-amber"/>},
      {key:"campaign",label:"Campaign", render:r=>r.campaignId?<span style={{fontSize:12,color:"#7c3aed"}}>{gcam(r.campaignId)?.name?.slice(0,26)}</span>:<span style={{color:"#94a3b8"}}>—</span>},
      {key:"progress",label:"Progress", render:r=>{const p=pct(r.currentValue,r.targetValue);const c=p>=100?"#059669":p>=60?"#2563eb":"#d97706";return <div style={{width:140}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:11}}><span style={{color:"#64748b"}}>{r.currentValue}/{r.targetValue} {r.unit}</span><span style={{color:c,fontWeight:700}}>{p}%</span></div><PBar value={r.currentValue} max={r.targetValue}/></div>;}},
      {key:"dueDate", label:"Due",      muted:true},
    ]}/>,
  };

  /* ═══════════════════════════════════════════════════════════════════════
     MODAL ROUTING
  ═══════════════════════════════════════════════════════════════════════ */
  const modalMap = {
    companies:     {title:modal?.data?.id?"Edit Company":"New Company",           form:<FormCompany     init={modal?.data||{}}/>},
    contacts:      {title:modal?.data?.id?"Edit Contact":"New Contact",           form:<FormContact     init={modal?.data||{}}/>},
    employees:     {title:modal?.data?.id?"Edit Employee":"New Employee",         form:<FormEmployee    init={modal?.data||{}}/>},
    leads:         {title:modal?.data?.id?"Edit Lead":"New Lead",                 form:<FormLead        init={modal?.data||{}}/>},
    opportunities: {title:modal?.data?.id?"Edit Opportunity":"New Opportunity",   form:<FormOpportunity init={modal?.data||{}}/>},
    products:      {title:modal?.data?.id?"Edit Product":"New Product",           form:<FormProduct     init={modal?.data||{}}/>},
    invoices:      {title:modal?.data?.id?"Edit Invoice":"New Invoice",           form:<FormInvoice     init={modal?.data||{}}/>, wide:true},
    serviceRequests: {title:modal?.data?.id?"Edit Service Request":"New Service Request",                 form:<FormServiceRequest        init={modal?.data||{}}/>, wide:true},
    campaigns:     {title:modal?.data?.id?"Edit Campaign":"New Campaign",         form:<FormCampaign    init={modal?.data||{}}/>},
    events:        {title:modal?.data?.id?"Edit Event":"New Event",               form:<FormEvent       init={modal?.data||{}}/>, subtitle:"Events can belong to a Campaign and have zero-to-many Leads and one-to-many Employees."},
    goals:         {title:modal?.data?.id?"Edit Goal":"New Goal",                 form:<FormGoal        init={modal?.data||{}}/>},
  };

  /* ═══════════════════════════════════════════════════════════════════════
     SIDEBAR NAV
  ═══════════════════════════════════════════════════════════════════════ */
  const crmNav = [
    {id:"dashboard",     label:"Dashboard",     icon:"dashboard",   count:undefined},
    {id:"companies",     label:"Companies",     icon:"companies",   count:companies.length},
    {id:"contacts",      label:"Contacts",      icon:"contacts",    count:contacts.length},
    {id:"employees",     label:"Employees",     icon:"employees",   count:employees.length},
    {id:"leads",         label:"Leads",         icon:"leads",       count:leads.filter(l=>!l.converted).length},
    {id:"opportunities", label:"Opportunities", icon:"opps",        count:opportunities.length},
    {id:"products",      label:"Products",      icon:"products",    count:products.length},
    {id:"invoices",      label:"Invoices",      icon:"invoices",    count:invoices.length},
  ];
  const svcNav = [
    {id:"serviceRequests",   label:"Service Requests",    icon:"cases",    count:serviceRequests.filter(c=>c.status!=="Closed"&&c.status!=="Resolved").length},
  ];
  const mktNav = [
    {id:"campaigns", label:"Campaigns", icon:"campaigns", count:campaigns.length},
    {id:"events",    label:"Events",    icon:"events",    count:events.length},
    {id:"goals",     label:"Goals",     icon:"goals",     count:goals.length},
  ];
  const rptNav = [
    {id:"reports", label:"Reports", icon:"reports", count:undefined},
  ];

  const NavItem = ({item}) => {
    const on = view===item.id;
    return(
      <div className={`ni${on?" on":""}`} onClick={()=>{ setView(item.id); if(item.id!=="campaigns")setCampView(null); }}>
        <Ico name={item.icon} size={15} color={on?"#1e40af":"#94a3b8"}/>
        <span style={{flex:1}}>{item.label}</span>
        {item.count!==undefined&&<span className="nct">{item.count}</span>}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{CSS}</style>
      <div className="crm-wrap">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="logo-wrap">
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="logo-icon"><Ico name="list" size={18} color="#fff"/></div>
              <div><div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:"#0f172a",letterSpacing:"-.3px",lineHeight:1}}>CRM</div><div style={{fontSize:9,color:"#94a3b8",letterSpacing:"1.8px",textTransform:"uppercase",fontWeight:600,marginTop:1}}>Enterprise Suite</div></div>
            </div>
          </div>

          <div className="srch-wrap">
            <div className="srch-inner">
              <svg className="srch-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="srch-inp" placeholder="Search records…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>

          <nav style={{flex:1,padding:"4px 0",overflowY:"auto"}}>
            <div className="nav-sec">Sales CRM</div>
            {crmNav.map(item=><NavItem key={item.id} item={item}/>)}
            <div className="nav-sec">Service</div>
            {svcNav.map(item=><NavItem key={item.id} item={item}/>)}
            <div className="nav-sec">Marketing</div>
            {mktNav.map(item=><NavItem key={item.id} item={item}/>)}
            <div className="nav-sec">Analytics</div>
            {rptNav.map(item=><NavItem key={item.id} item={item}/>)}
          </nav>

          <div className="sidebar-footer">
            <div className="av">A</div>
            <div><div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>Admin User</div><div style={{fontSize:11,color:"#94a3b8"}}>admin@company.com</div></div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className={`main${detail?" dp-open":""}`}>
          {views[view]}
        </main>

        {/* ── DETAIL PANEL ── */}
        <DetailPanel/>

        {/* ── MODAL ── */}
        {modal && modalMap[modal.type] && (
          <div className="mo-overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="mo-box" style={{maxWidth:modalMap[modal.type].wide?820:700}}>
              <div className="mo-head">
                <div>
                  <div className="mo-title">{modalMap[modal.type].title}</div>
                  {modalMap[modal.type].subtitle&&<div className="mo-sub">{modalMap[modal.type].subtitle}</div>}
                </div>
                <button className="btn btn-secondary btn-sm" style={{padding:"5px 8px"}} onClick={closeModal}><Ico name="x"/></button>
              </div>
              {modalMap[modal.type].form}
            </div>
          </div>
        )}

        {/* ── TOAST ── */}
        {toast && (
          <div className="toast">
            <div className={`toast-inner ${toast.type}`}>
              <Ico name={toast.type==="err"?"trash":"check"} size={13} color="#fff"/>
              {toast.msg}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
