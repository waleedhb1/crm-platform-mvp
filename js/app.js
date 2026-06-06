const ICONS = {
  home: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  leads: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  deals: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
  contacts: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  tasks: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  chart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20h18"/><rect x="6" y="10" width="3" height="8" rx="1"/><rect x="11" y="6" width="3" height="12" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  money: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10h4a2 2 0 1 1 0 4H9"/></svg>',
  target: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
};

const PAGES = {
  dashboard: { title: "لوحة المتابعة", sub: "مؤشرات المبيعات وخط الأنابيب للربع الحالي", crumbs: ["الرئيسية", "لوحة المتابعة"] },
  leads: { title: "العملاء المحتملون", sub: "إدارة وتأهيل العملاء المحتملين من جميع القنوات", crumbs: ["المبيعات", "العملاء المحتملون"] },
  deals: { title: "الصفقات", sub: "خط أنابيب المبيعات — من الفرصة إلى الإغلاق", crumbs: ["المبيعات", "الصفقات"] },
  contacts: { title: "جهات الاتصال", sub: "دليل جهات الاتصال والشركات B2B", crumbs: ["المبيعات", "جهات الاتصال"] },
  tasks: { title: "المهام", sub: "متابعة المتابعات والاجتماعات والمهام اليومية", crumbs: ["الإنتاجية", "المهام"] },
  reports: { title: "التقارير", sub: "تقارير المبيعات والأداء قابلة للتصدير", crumbs: ["التحليلات", "التقارير"] },
  settings: { title: "الإعدادات", sub: "مراحل خط الأنابيب والفريق والتكاملات", crumbs: ["الإعدادات"] },
};

const LEAD_STATUS = {
  new: ["tag-info", "جديد"],
  qualified: ["tag-success", "مؤهّل"],
  contacted: ["tag-warn", "تم التواصل"],
  lost: ["tag-danger", "مفقود"],
};

const STAGE_COLORS = {
  prospect: "#94a3b8",
  proposal: "#3b82f6",
  negotiation: "#f59e0b",
  won: "#059669",
  lost: "#dc2626",
};

let route = "dashboard";
let leadFilter = "all";
let dealFilter = "all";
let dealsView = "kanban";
let taskFilter = "all";

const $ = (s) => document.querySelector(s);
const view = $("#view");

function stageLabel(id) {
  return CrmAPI.STAGES.find((s) => s.id === id)?.label || id;
}

function tagLead(status) {
  const [c, l] = LEAD_STATUS[status] || ["tag-neutral", status];
  return `<span class="tag ${c}">${l}</span>`;
}

function tagStage(stage) {
  const m = {
    prospect: "tag-neutral",
    proposal: "tag-info",
    negotiation: "tag-accent",
    won: "tag-success",
    lost: "tag-danger",
  };
  return `<span class="tag ${m[stage] || "tag-neutral"}">${stageLabel(stage)}</span>`;
}

function scoreBar(score) {
  const cls = score >= 75 ? "high" : score >= 50 ? "mid" : "low";
  return `<div class="score-bar"><div class="score-track"><div class="score-fill ${cls}" style="width:${score}%"></div></div><span class="num">${fmt(score)}</span></div>`;
}

function pipe(stage) {
  const order = CrmAPI.STAGE_ORDER.filter((s) => s !== "lost");
  const idx = order.indexOf(stage);
  return `<div class="pipeline">${order.map((s, i) => {
    const n = i + 1;
    let cls = "";
    if (stage === "lost") cls = i <= idx ? "lost" : "";
    else if (i < idx) cls = "done";
    else if (i === idx) cls = "active";
    return `<div class="pipe-step ${cls}"><span class="pipe-num">${n}</span>${stageLabel(s)}</div>`;
  }).join("")}${stage === "lost" ? `<div class="pipe-step lost"><span class="pipe-num">✕</span>${stageLabel("lost")}</div>` : ""}</div>`;
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 3000);
}

function modal(title, body, actions = "") {
  const root = $("#modal-root");
  root.innerHTML = `<div class="modal-overlay" id="modal-close">
    <div class="modal" role="dialog"><div class="modal-header"><h3>${title}</h3></div>
    <div class="modal-body">${body}</div>
    <div class="modal-footer">${actions || '<button class="btn btn-secondary btn-sm" id="modal-ok">إغلاق</button>'}</div>
    </div></div>`;
  const close = () => { root.innerHTML = ""; };
  root.querySelector("#modal-close").addEventListener("click", (e) => { if (e.target.id === "modal-close") close(); });
  const ok = root.querySelector("#modal-ok");
  if (ok) ok.onclick = close;
  return { close, root };
}

function showDealModal(deal) {
  const m = modal(
    deal.title,
    `<p><strong>${deal.company}</strong> — ${deal.contact}</p>
    <div class="modal-kpi">
      <div class="modal-kpi-item"><span>قيمة الصفقة</span><strong>${fmtMoney(deal.value)}</strong></div>
      <div class="modal-kpi-item"><span>احتمالية الإغلاق</span><strong class="num">${fmtPct(deal.probability)}</strong></div>
      <div class="modal-kpi-item"><span>المسؤول</span><strong>${deal.owner}</strong></div>
      <div class="modal-kpi-item"><span>تاريخ الإغلاق المتوقع</span><strong class="num">${deal.closeDate}</strong></div>
    </div>
    <p><strong>المنتجات:</strong> ${deal.products}</p>
    <p style="margin-top:8px"><strong>ملاحظات:</strong> ${deal.notes}</p>
    ${pipe(deal.stage)}`,
    `<div class="btn-group">
      ${deal.stage !== "won" && deal.stage !== "lost" ? `<button class="btn btn-primary btn-sm" id="modal-advance">تقديم المرحلة</button>` : ""}
      <button class="btn btn-secondary btn-sm" id="modal-ok">إغلاق</button>
    </div>`
  );
  const adv = m.root.querySelector("#modal-advance");
  if (adv) {
    adv.onclick = async () => {
      await CrmAPI.advanceDeal(deal.id);
      m.close();
      toast("تم تقديم الصفقة للمرحلة التالية");
      render();
    };
  }
}

function renderNav() {
  const sections = [
    { label: "عام", items: [["dashboard", "لوحة المتابعة", ICONS.home]] },
    { label: "المبيعات", items: [
      ["leads", "العملاء المحتملون", ICONS.leads],
      ["deals", "الصفقات", ICONS.deals],
      ["contacts", "جهات الاتصال", ICONS.contacts],
    ]},
    { label: "الإنتاجية", items: [
      ["tasks", "المهام", ICONS.tasks],
    ]},
    { label: "إدارة", items: [
      ["reports", "التقارير", ICONS.chart],
      ["settings", "الإعدادات", ICONS.settings],
    ]},
  ];
  $("#nav").innerHTML = sections.map((sec) =>
    `<div class="nav-section">${sec.label}</div>` +
    sec.items.map(([id, label, icon]) =>
      `<button class="nav-item${route === id ? " active" : ""}" data-r="${id}">${icon}${label}</button>`
    ).join("")
  ).join("");
  $("#nav").querySelectorAll("[data-r]").forEach((b) => { b.onclick = () => { route = b.dataset.r; render(); }; });
}

function setHeader() {
  const p = PAGES[route];
  $("#page-title").textContent = p.title;
  $("#page-sub").textContent = p.sub;
  $("#breadcrumb").innerHTML = p.crumbs.map((c, i) =>
    i < p.crumbs.length - 1 ? `<a href="#">${c}</a> / ` : c
  ).join("");
}

function chartMax(chart) {
  return Math.max(...chart.map((c) => c.value), 1);
}

async function pageDashboard() {
  const d = await CrmAPI.getDashboard();
  const maxVal = chartMax(d.chart);

  view.innerHTML = `
    <div class="grid-stats">
      <div class="card stat-card">
        <div class="stat-icon">${ICONS.money}</div>
        <div class="stat-label">قيمة خط الأنابيب</div>
        <div class="stat-value">${fmtMoney(d.stats.pipelineValue)}</div>
        <div class="stat-meta">مرجّحة: ${fmtMoney(d.stats.weightedValue)}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon accent">${ICONS.target}</div>
        <div class="stat-label">معدل التحويل</div>
        <div class="stat-value num">${fmtPct(d.stats.conversionRate)}</div>
        <div class="stat-meta up">+<span class="num">3%</span> عن الربع السابق</div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon">${ICONS.deals}</div>
        <div class="stat-label">صفقات نشطة</div>
        <div class="stat-value num">${fmt(d.stats.activeDeals)}</div>
        <div class="stat-meta"><span class="num">${fmt(d.stats.newLeads)}</span> عميل محتمل جديد</div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon">${ICONS.tasks}</div>
        <div class="stat-label">مهام مفتوحة</div>
        <div class="stat-value num">${fmt(d.stats.openTasks)}</div>
        <div class="stat-meta">تحتاج متابعة هذا الأسبوع</div>
      </div>
    </div>

    <div class="stage-summary">
      ${d.stageSummary.map((s) => `
        <div class="stage-summary-item">
          <div class="label">${s.label}</div>
          <div class="value">${fmtMoney(s.value)}</div>
          <div class="count"><span class="num">${fmt(s.count)}</span> صفقة</div>
        </div>`).join("")}
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-head"><h2>قيمة الصفقات الشهرية</h2><button class="btn btn-ghost btn-sm" data-go="deals">عرض الصفقات</button></div>
        <div class="card-body">
          <div class="bar-chart">${d.chart.map((c) => {
            const h = Math.round((c.value / maxVal) * 100);
            return `<div class="bar-col">
              <span class="bar-value num">${fmt(Math.round(c.value / 1000))}K</span>
              <div class="bar-fill" style="height:${h}%"></div>
              <span class="bar-label">${c.label}</span>
            </div>`;
          }).join("")}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>آخر الأنشطة</h2></div>
        <div class="card-body">
          <ul class="activity-list">${d.activities.map((a) => {
            const dotCls = a.type === "won" ? "won" : a.type === "lead" ? "lead" : a.type === "task" ? "task" : "";
            return `<li class="activity-item">
              <span class="activity-dot ${dotCls}"></span>
              <div style="flex:1">${a.text}<div class="activity-time">${a.time}</div></div>
            </li>`;
          }).join("")}</ul>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px">
      <div class="card-head"><h2>أحدث الصفقات</h2><button class="btn btn-secondary btn-sm" data-go="deals">عرض الكل</button></div>
      <div class="table-wrap"><table>
        <thead><tr><th>الصفقة</th><th>الشركة</th><th>القيمة</th><th>المرحلة</th><th>الاحتمالية</th><th>المسؤول</th></tr></thead>
        <tbody>${d.recentDeals.map((deal) => `<tr data-deal="${deal.id}" style="cursor:pointer">
          <td class="td-primary">${deal.title}<span class="td-sub num">${deal.id}</span></td>
          <td>${deal.company}</td>
          <td>${fmtMoney(deal.value)}</td>
          <td>${tagStage(deal.stage)}</td>
          <td class="num">${fmtPct(deal.probability)}</td>
          <td>${deal.owner}</td>
        </tr>`).join("")}</tbody>
      </table></div>
    </div>`;

  view.querySelectorAll("[data-go]").forEach((b) => { b.onclick = () => { route = b.dataset.go; render(); }; });
  view.querySelectorAll("[data-deal]").forEach((row) => {
    row.onclick = async () => {
      const deals = await CrmAPI.getDeals();
      const deal = deals.find((x) => x.id === row.dataset.deal);
      if (deal) showDealModal(deal);
    };
  });
}

async function pageLeads() {
  const list = await CrmAPI.getLeads(leadFilter);
  view.innerHTML = `
    <div class="toolbar">
      <div class="toolbar-start">
        <select id="lead-filter" class="select">
          <option value="all">كل العملاء</option>
          <option value="new">جديد</option>
          <option value="contacted">تم التواصل</option>
          <option value="qualified">مؤهّل</option>
          <option value="lost">مفقود</option>
        </select>
      </div>
      <div class="toolbar-end">
        <button class="btn btn-primary btn-sm">+ عميل محتمل</button>
      </div>
    </div>
    <div class="card">
      <div class="table-wrap"><table>
        <thead><tr><th>الاسم</th><th>الشركة</th><th>المصدر</th><th>الدرجة</th><th>الحالة</th><th>المسؤول</th><th>التاريخ</th><th>إجراء</th></tr></thead>
        <tbody>${list.length ? list.map((l) => `<tr>
          <td class="td-primary">${l.name}<span class="td-sub num">${l.id}</span></td>
          <td>${l.company}<span class="td-sub">${l.title}</span></td>
          <td>${l.source}</td>
          <td style="min-width:120px">${scoreBar(l.score)}</td>
          <td>${tagLead(l.status)}</td>
          <td>${l.owner}</td>
          <td class="num">${l.created}</td>
          <td><div class="btn-group">
            ${l.status !== "qualified" && l.status !== "lost" ? `<button class="btn btn-primary btn-sm" data-qualify="${l.id}">تأهيل</button>` : ""}
            <button class="btn btn-ghost btn-sm" data-lead-view="${l.id}">تفاصيل</button>
          </div></td>
        </tr>`).join("") : `<tr><td colspan="8" class="empty-state">لا توجد نتائج مطابقة</td></tr>`}</tbody>
      </table></div>
    </div>`;

  const filter = view.querySelector("#lead-filter");
  filter.value = leadFilter;
  filter.onchange = () => { leadFilter = filter.value; pageLeads(); };

  view.querySelectorAll("[data-qualify]").forEach((b) => {
    b.onclick = async () => {
      await CrmAPI.qualifyLead(b.dataset.qualify);
      toast("تم تأهيل العميل المحتمل بنجاح");
      pageLeads();
    };
  });

  view.querySelectorAll("[data-lead-view]").forEach((b) => {
    b.onclick = () => {
      const l = list.find((x) => x.id === b.dataset.leadView);
      modal(`تفاصيل ${l.name}`, `
        <p><strong>${l.company}</strong> — ${l.title}</p>
        <div class="modal-kpi">
          <div class="modal-kpi-item"><span>البريد</span><strong style="font-size:12px">${l.email}</strong></div>
          <div class="modal-kpi-item"><span>الهاتف</span><strong class="num">${l.phone}</strong></div>
          <div class="modal-kpi-item"><span>المصدر</span><strong>${l.source}</strong></div>
          <div class="modal-kpi-item"><span>الدرجة</span><strong class="num">${fmt(l.score)}/100</strong></div>
        </div>
        <p>الحالة: ${tagLead(l.status)} — المسؤول: ${l.owner}</p>`);
    };
  });
}

function renderDealCard(deal) {
  return `<div class="deal-card" data-deal-card="${deal.id}">
    <h4>${deal.title}</h4>
    <div class="company">${deal.company}</div>
    <div class="deal-card-footer">
      <span class="deal-value">${fmtMoney(deal.value)}</span>
      <span class="deal-prob num">${fmtPct(deal.probability)}</span>
    </div>
    ${deal.stage !== "won" && deal.stage !== "lost" ? `<button class="btn btn-ghost btn-sm" style="margin-top:8px;width:100%" data-advance="${deal.id}">تقديم ←</button>` : ""}
  </div>`;
}

async function pageDeals() {
  const list = await CrmAPI.getDeals(dealFilter);
  const kanbanStages = CrmAPI.STAGES.filter((s) => dealFilter === "all" || s.id === dealFilter);

  view.innerHTML = `
    <div class="toolbar">
      <div class="toolbar-start">
        <select id="deal-filter" class="select">
          <option value="all">كل المراحل</option>
          ${CrmAPI.STAGES.map((s) => `<option value="${s.id}">${s.label}</option>`).join("")}
        </select>
        <div class="view-toggle">
          <button class="${dealsView === "kanban" ? "active" : ""}" data-view="kanban">Kanban</button>
          <button class="${dealsView === "table" ? "active" : ""}" data-view="table">جدول</button>
        </div>
      </div>
      <div class="toolbar-end">
        <button class="btn btn-primary btn-sm">+ صفقة جديدة</button>
      </div>
    </div>
    ${dealsView === "kanban" ? `
    <div class="kanban-board">
      ${kanbanStages.map((stage) => {
        const stageDeals = list.filter((d) => d.stage === stage.id);
        const total = stageDeals.reduce((s, d) => s + d.value, 0);
        return `<div class="kanban-col">
          <div class="kanban-col-head">
            <h3><span class="stage-dot" style="background:${STAGE_COLORS[stage.id]};display:inline-block;width:8px;height:8px;border-radius:50%;margin-left:6px"></span>${stage.label}</h3>
            <span class="kanban-col-meta"><span class="num">${fmt(stageDeals.length)}</span> · ${fmtMoney(total)}</span>
          </div>
          <div class="kanban-cards">${stageDeals.length ? stageDeals.map(renderDealCard).join("") : `<div class="empty-state" style="padding:24px">لا صفقات</div>`}</div>
        </div>`;
      }).join("")}
    </div>` : `
    <div class="card">
      <div class="table-wrap"><table>
        <thead><tr><th>الصفقة</th><th>الشركة</th><th>القيمة</th><th>المرحلة</th><th>الاحتمالية</th><th>تاريخ الإغلاق</th><th>المسؤول</th><th>إجراء</th></tr></thead>
        <tbody>${list.map((d) => `<tr>
          <td class="td-primary">${d.title}<span class="td-sub num">${d.id}</span></td>
          <td>${d.company}</td>
          <td>${fmtMoney(d.value)}</td>
          <td>${tagStage(d.stage)}</td>
          <td class="num">${fmtPct(d.probability)}</td>
          <td class="num">${d.closeDate}</td>
          <td>${d.owner}</td>
          <td><div class="btn-group">
            ${d.stage !== "won" && d.stage !== "lost" ? `<button class="btn btn-primary btn-sm" data-advance="${d.id}">تقديم</button>` : ""}
            <button class="btn btn-ghost btn-sm" data-deal-view="${d.id}">تفاصيل</button>
          </div></td>
        </tr>`).join("")}</tbody>
      </table></div>
    </div>`}`;

  const filter = view.querySelector("#deal-filter");
  filter.value = dealFilter;
  filter.onchange = () => { dealFilter = filter.value; pageDeals(); };

  view.querySelectorAll("[data-view]").forEach((b) => {
    b.onclick = () => { dealsView = b.dataset.view; pageDeals(); };
  });

  view.querySelectorAll("[data-advance]").forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      await CrmAPI.advanceDeal(b.dataset.advance);
      toast("تم تقديم الصفقة للمرحلة التالية");
      pageDeals();
    };
  });

  view.querySelectorAll("[data-deal-card]").forEach((card) => {
    card.onclick = (e) => {
      if (e.target.closest("[data-advance]")) return;
      const deal = list.find((x) => x.id === card.dataset.dealCard);
      if (deal) showDealModal(deal);
    };
  });

  view.querySelectorAll("[data-deal-view]").forEach((b) => {
    b.onclick = () => {
      const deal = list.find((x) => x.id === b.dataset.dealView);
      if (deal) showDealModal(deal);
    };
  });
}

async function pageContacts(q = "") {
  const list = await CrmAPI.getContacts(q);
  view.innerHTML = `
    <div class="toolbar">
      <span style="font-size:13px;color:var(--text-muted)"><span class="num">${fmt(list.length)}</span> جهة اتصال</span>
      <button class="btn btn-primary btn-sm">+ جهة اتصال</button>
    </div>
    <div class="person-grid">${list.length ? list.map((c) => `
      <div class="card person-card">
        <h3>${c.name}</h3>
        <p class="dept">${c.title} — ${c.company}</p>
        <div class="contact-meta">
          <span>${c.email}</span>
          <span class="num">${c.phone}</span>
          <span>${c.city} · ${c.sector}</span>
        </div>
        <div class="person-stat">
          <span>صفقات<strong class="num">${fmt(c.deals)}</strong></span>
          <span>آخر تواصل<strong class="num" style="font-size:13px">${c.lastContact}</strong></span>
        </div>
      </div>`).join("") : `<div class="card empty-state" style="grid-column:1/-1">لا توجد نتائج مطابقة</div>`}</div>`;
}

function priorityLabel(p) {
  const m = { high: ["priority-high", "عالية"], medium: ["priority-medium", "متوسطة"], low: ["priority-low", "منخفضة"] };
  const [cls, label] = m[p] || ["", p];
  return `<span class="${cls}">${label}</span>`;
}

async function pageTasks() {
  const list = await CrmAPI.getTasks(taskFilter);
  view.innerHTML = `
    <div class="toolbar">
      <select id="task-filter" class="select">
        <option value="all">كل المهام</option>
        <option value="open">مفتوحة</option>
        <option value="done">مكتملة</option>
      </select>
      <button class="btn btn-primary btn-sm">+ مهمة جديدة</button>
    </div>
    <div class="card">
      <div class="card-head"><h2>قائمة المهام — <span class="num">${fmt(list.length)}</span></h2></div>
      <div class="card-body" style="padding:0">
        <table>
          <thead><tr><th style="width:40px"></th><th>المهمة</th><th>المسؤول</th><th>الاستحقاق</th><th>الأولوية</th><th>النوع</th><th>مرتبط بـ</th></tr></thead>
          <tbody>${list.map((t) => `<tr class="task-row${t.done ? " done" : ""}">
            <td><div class="task-check${t.done ? " done" : ""}" data-task="${t.id}" role="button" aria-label="إكمال">${t.done ? "✓" : ""}</div></td>
            <td class="task-title td-primary">${t.title}</td>
            <td>${t.assignee}</td>
            <td class="num">${t.due}</td>
            <td>${priorityLabel(t.priority)}</td>
            <td><span class="tag tag-neutral">${t.type}</span></td>
            <td class="num">${t.related}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    </div>`;

  const filter = view.querySelector("#task-filter");
  filter.value = taskFilter;
  filter.onchange = () => { taskFilter = filter.value; pageTasks(); };

  view.querySelectorAll("[data-task]").forEach((el) => {
    el.onclick = async () => {
      await CrmAPI.toggleTask(el.dataset.task);
      toast(el.classList.contains("done") ? "تم إعادة فتح المهمة" : "تم إكمال المهمة");
      pageTasks();
    };
  });
}

async function pageReports() {
  const list = await CrmAPI.getReports();
  view.innerHTML = `<div class="grid-3">${list.map((r) => `
    <div class="card report-tile card-pad" data-r="${r.id}">
      <div class="report-icon">${r.icon}</div>
      <h3>${r.title}</h3><p>${r.desc}</p>
      <div class="report-meta"><span class="num">${fmt(r.records)}</span> سجل — آخر تحديث <span class="num">${r.updated}</span></div>
    </div>`).join("")}</div>`;
  view.querySelectorAll(".report-tile").forEach((t) => {
    t.onclick = () => toast("جاري تجهيز التقرير للتصدير بصيغة PDF...");
  });
}

async function pageSettings() {
  const s = await CrmAPI.getSettings();
  view.innerHTML = `<div class="grid-2">
    <div class="card card-pad">
      <div class="settings-section">
        <h3>مراحل خط الأنابيب</h3>
        <ul class="stage-list">${s.pipelineStages.map((st, i) => `
          <li class="stage-item">
            <span><span class="stage-dot" style="background:${STAGE_COLORS[st.id]}"></span>${st.label}</span>
            <span class="num">${i + 1}</span>
          </li>`).join("")}</ul>
      </div>
      <div class="settings-section">
        <h3>إعدادات عامة</h3>
        <div class="kpi-row">
          <div class="kpi-item"><span>العملة</span><strong>${s.currency}</strong></div>
          <div class="kpi-item"><span>السنة المالية</span><strong class="num">${s.fiscalYear}</strong></div>
          <div class="kpi-item"><span>حد موافقة الصفقة</span><strong>${fmtMoney(s.dealApprovalThreshold)}</strong></div>
          <div class="kpi-item"><span>تعيين تلقائي</span><strong>${s.autoAssignLeads ? "مفعّل" : "معطّل"}</strong></div>
        </div>
      </div>
    </div>
    <div class="card card-pad">
      <div class="settings-section">
        <h3>أعضاء الفريق</h3>
        ${s.teamMembers.map((m) => {
          const pct = m.quota ? Math.round((m.achieved / m.quota) * 100) : 0;
          return `<div class="integration-row">
            <div class="integration-info">
              <strong>${m.name}</strong>
              <span>${m.role} — ${m.email}</span>
            </div>
            <div style="text-align:left;font-size:12px">
              ${m.quota ? `<span class="num">${fmtPct(pct)}</span> من الحصة<div class="progress-track" style="width:80px;margin-top:4px"><div class="progress-fill accent" style="width:${Math.min(pct, 100)}%"></div></div>` : "—"}
            </div>
          </div>`;
        }).join("")}
      </div>
      <div class="settings-section">
        <h3>التكاملات</h3>
        ${s.integrations.map((int) => {
          const tag = int.status === "connected" ? ["tag-success", "متصل"] : int.status === "pending" ? ["tag-warn", "قيد الإعداد"] : ["tag-neutral", "متاح"];
          return `<div class="integration-row">
            <div class="integration-info"><strong>${int.name}</strong><span>${int.desc}</span></div>
            <span class="tag ${tag[0]}">${tag[1]}</span>
          </div>`;
        }).join("")}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:8px">تعديل الإعدادات</button>
    </div>
  </div>`;
}

async function render() {
  setHeader();
  renderNav();
  view.innerHTML = `<div class="loading-state"><span class="spinner"></span> جاري تحميل البيانات...</div>`;
  const pages = {
    dashboard: pageDashboard,
    leads: pageLeads,
    deals: pageDeals,
    contacts: () => pageContacts($("#global-search").value),
    tasks: pageTasks,
    reports: pageReports,
    settings: pageSettings,
  };
  await pages[route]();
}

$("#global-search").addEventListener("input", () => {
  if (route === "contacts") pageContacts($("#global-search").value);
});

$("#notif-btn").addEventListener("click", () =>
  modal("الإشعارات", "<p>6 إشعارات جديدة: 2 صفقات بانتظار الموافقة، 3 عملاء محتملون جدد، مهمة متأخرة واحدة.</p>")
);

$("#role-select").addEventListener("change", (e) => {
  const labels = { manager: "مدير المبيعات", rep: "مندوب مبيعات", admin: "مسؤول النظام" };
  $("#profile-role").textContent = labels[e.target.value];
});

render();
