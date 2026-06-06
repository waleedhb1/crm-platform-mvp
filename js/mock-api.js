const CrmAPI = (() => {
  const STAGES = [
    { id: "prospect", label: "فرصة أولية" },
    { id: "proposal", label: "عرض سعر" },
    { id: "negotiation", label: "تفاوض" },
    { id: "won", label: "مكتسبة" },
    { id: "lost", label: "مفقودة" },
  ];

  const STAGE_ORDER = ["prospect", "proposal", "negotiation", "won", "lost"];

  const leads = [
    { id: "LD-2401", name: "فهد بن عبدالرحمن الدوسري", company: "مجموعة الخليج للتجارة", title: "مدير المشتريات", source: "معرض LEAP 2026", score: 82, status: "qualified", phone: "+966 50 123 4567", email: "f.dossary@gulftrade.sa", created: "2026-02-28", owner: "خالد المنصور" },
    { id: "LD-2402", name: "نورة بنت سعد القحطاني", company: "شركة نماء للتقنية", title: "رئيسة التحول الرقمي", source: "إحالة عميل", score: 91, status: "contacted", phone: "+966 55 987 6543", email: "n.alqahtani@nama-tech.sa", created: "2026-03-01", owner: "ريم الحربي" },
    { id: "LD-2403", name: "عبدالله بن محمد الشمري", company: "مصنع الأفق للبلاستيك", title: "المدير التنفيذي", source: "موقع إلكتروني", score: 64, status: "new", phone: "+966 54 222 8899", email: "a.alshamri@ufuq-plast.sa", created: "2026-03-03", owner: "خالد المنصور" },
    { id: "LD-2404", name: "لينا بنت حسن الزهراني", company: "مجموعة الرياض للخدمات اللوجستية", title: "مديرة العمليات", source: "LinkedIn", score: 73, status: "new", phone: "+966 56 334 1122", email: "l.alzahrani@riyadh-log.sa", created: "2026-03-04", owner: "ريم الحربي" },
    { id: "LD-2405", name: "ماجد بن فيصل العتيبي", company: "شركة البناء المتقدم", title: "مدير المشاريع", source: "مكالمة باردة", score: 45, status: "lost", phone: "+966 53 776 5544", email: "m.alotaibi@advanced-build.sa", created: "2026-01-15", owner: "خالد المنصور" },
    { id: "LD-2406", name: "هيفاء بنت علي الغامدي", company: "مركز الرعاية الصحية الخاص", title: "مديرة تكنولوجيا المعلومات", source: "معرض GITEX", score: 88, status: "qualified", phone: "+966 58 665 4433", email: "h.alghamdi@carecenter.sa", created: "2026-02-20", owner: "سارة العبدالله" },
    { id: "LD-2407", name: "بدر بن ناصر السبيعي", company: "شركة الطاقة الخضراء", title: "مدير المبيعات", source: "حملة Google Ads", score: 57, status: "contacted", phone: "+966 59 112 3344", email: "b.alsubaie@green-energy.sa", created: "2026-02-25", owner: "ريم الحربي" },
    { id: "LD-2408", name: "دانة بنت خالد المطيري", company: "مجموعة الفطيم للتجزئة", title: "مديرة التسويق", source: "إحالة شريك", score: 79, status: "new", phone: "+966 50 998 7766", email: "d.almutairi@al-futtaim.sa", created: "2026-03-05", owner: "سارة العبدالله" },
  ];

  const deals = [
    { id: "DL-8801", title: "ترخيص CRM — 50 مستخدم", company: "مجموعة الخليج للتجارة", contact: "فهد الدوسري", value: 285000, stage: "negotiation", probability: 75, owner: "خالد المنصور", closeDate: "2026-03-20", products: "Enterprise + تكامل ERP", notes: "جولة تفاوض أخيرة على شروط الدفع السنوي" },
    { id: "DL-8802", title: "اشتراك سنوي — 25 مستخدم", company: "شركة نماء للتقنية", contact: "نورة القحطاني", value: 142500, stage: "proposal", probability: 55, owner: "ريم الحربي", closeDate: "2026-04-05", products: "Professional", notes: "بانتظار موافقة الإدارة المالية" },
    { id: "DL-8803", title: "توسعة ترخيص — 10 مقاعد", company: "مصنع الأفق للبلاستيك", contact: "عبدالله الشمري", value: 48000, stage: "prospect", probability: 30, owner: "خالد المنصور", closeDate: "2026-04-15", products: "Starter + تدريب", notes: "عرض أولي قيد الإعداد" },
    { id: "DL-8804", title: "منصة CRM + أتمتة", company: "مركز الرعاية الصحية الخاص", contact: "هيفاء الغامدي", value: 198000, stage: "proposal", probability: 60, owner: "سارة العبدالله", closeDate: "2026-03-28", products: "Enterprise + Workflow", notes: "متطلبات امتثال HIPAA محلية" },
    { id: "DL-8805", title: "تكامل Salesforce", company: "مجموعة الرياض للخدمات اللوجستية", contact: "لينا الزهراني", value: 95000, stage: "prospect", probability: 25, owner: "ريم الحربي", closeDate: "2026-05-01", products: "Integration Module", notes: "اجتماع اكتشاف الأسبوع القادم" },
    { id: "DL-8806", title: "عقد صيانة 3 سنوات", company: "شركة الطاقة الخضراء", contact: "بدر السبيعي", value: 72000, stage: "negotiation", probability: 70, owner: "ريم الحربي", closeDate: "2026-03-15", products: "Support Premium", notes: "خصم 8% معتمد من الإدارة" },
    { id: "DL-8807", title: "CRM للفروع — 80 مستخدم", company: "مجموعة الفطيم للتجزئة", contact: "دانة المطيري", value: 420000, stage: "prospect", probability: 40, owner: "سارة العبدالله", closeDate: "2026-06-30", products: "Enterprise Multi-branch", notes: "منافسة مع HubSpot و Zoho" },
    { id: "DL-8808", title: "ترقية Professional → Enterprise", company: "شركة البناء المتقدم", contact: "ماجد العتيبي", value: 65000, stage: "lost", probability: 0, owner: "خالد المنصور", closeDate: "2026-02-10", products: "Upgrade", notes: "اختيار منافس بسبب السعر" },
    { id: "DL-8809", title: "حزمة مبيعات + تقارير", company: "شركة الواحة للحلول", contact: "سامي الحربي", value: 156000, stage: "won", probability: 100, owner: "خالد المنصور", closeDate: "2026-02-28", products: "Professional + Analytics", notes: "تم التوقيع — بدء التنفيذ 15 مارس" },
    { id: "DL-8810", title: "CRM + تطبيق جوال", company: "مجموعة الصناعات المتقدمة", contact: "أحمد السعيد", value: 310000, stage: "won", probability: 100, owner: "سارة العبدالله", closeDate: "2026-01-20", products: "Enterprise + Mobile App", notes: "عقد سنوي مع تجديد تلقائي" },
  ];

  const contacts = [
    { id: "CT-501", name: "فهد بن عبدالرحمن الدوسري", company: "مجموعة الخليج للتجارة", title: "مدير المشتريات", email: "f.dossary@gulftrade.sa", phone: "+966 50 123 4567", city: "الرياض", sector: "تجارة وتجزئة", deals: 2, lastContact: "2026-03-04" },
    { id: "CT-502", name: "نورة بنت سعد القحطاني", company: "شركة نماء للتقنية", title: "رئيسة التحول الرقمي", email: "n.alqahtani@nama-tech.sa", phone: "+966 55 987 6543", city: "جدة", sector: "تقنية", deals: 1, lastContact: "2026-03-03" },
    { id: "CT-503", name: "هيفاء بنت علي الغامدي", company: "مركز الرعاية الصحية الخاص", title: "مديرة تكنولوجيا المعلومات", email: "h.alghamdi@carecenter.sa", phone: "+966 58 665 4433", city: "الدمام", sector: "رعاية صحية", deals: 1, lastContact: "2026-03-02" },
    { id: "CT-504", name: "سامي بن عبدالله الحربي", company: "شركة الواحة للحلول", title: "المدير التنفيذي", email: "s.alharbi@waha-solutions.sa", phone: "+966 54 881 2233", city: "الرياض", sector: "حلول برمجية", deals: 3, lastContact: "2026-02-28" },
    { id: "CT-505", name: "أحمد بن عبدالله السعيد", company: "مجموعة الصناعات المتقدمة", title: "مدير المبيعات", email: "a.alsaeed@advanced-ind.sa", phone: "+966 50 445 6677", city: "الجبيل", sector: "صناعة", deals: 2, lastContact: "2026-02-15" },
    { id: "CT-506", name: "ريم بنت محمد الشهري", company: "شركة الآفاق للتطوير", title: "مديرة علاقات العملاء", email: "r.alshahri@ufuq-dev.sa", phone: "+966 56 778 9900", city: "مكة", sector: "تطوير تقني", deals: 1, lastContact: "2026-02-20" },
    { id: "CT-507", name: "عبدالرحمن بن سعود المالكي", company: "مجموعة المالكي القابضة", title: "نائب الرئيس للمبيعات", email: "a.almalki@almalki-group.sa", phone: "+966 55 334 5566", city: "الرياض", sector: "استثمار", deals: 4, lastContact: "2026-03-01" },
    { id: "CT-508", name: "منى بنت فهد العنزي", company: "شركة نور للاتصالات", title: "مديرة الحسابات الكبرى", email: "m.alenzi@noor-telecom.sa", phone: "+966 59 223 4455", city: "الرياض", sector: "اتصالات", deals: 2, lastContact: "2026-02-25" },
  ];

  const tasks = [
    { id: "TK-301", title: "متابعة عرض سعر — مجموعة الخليج", assignee: "خالد المنصور", due: "2026-03-06", priority: "high", done: false, related: "DL-8801", type: "متابعة" },
    { id: "TK-302", title: "إرسال عرض Demo — نماء للتقنية", assignee: "ريم الحربي", due: "2026-03-07", priority: "medium", done: false, related: "DL-8802", type: "عرض" },
    { id: "TK-303", title: "اجتماع اكتشاف — الرياض لوجستيك", assignee: "ريم الحربي", due: "2026-03-10", priority: "medium", done: false, related: "DL-8805", type: "اجتماع" },
    { id: "TK-304", title: "تجهيز عرض RFP — الفطيم", assignee: "سارة العبدالله", due: "2026-03-12", priority: "high", done: false, related: "DL-8807", type: "مستند" },
    { id: "TK-305", title: "مكالمة متابعة — الطاقة الخضراء", assignee: "ريم الحربي", due: "2026-03-05", priority: "high", done: true, related: "DL-8806", type: "مكالمة" },
    { id: "TK-306", title: "تحديث CRM — بيانات الأفق", assignee: "خالد المنصور", due: "2026-03-08", priority: "low", done: false, related: "LD-2403", type: "إداري" },
    { id: "TK-307", title: "تدريب فريق — الواحة للحلول", assignee: "سارة العبدالله", due: "2026-03-15", priority: "medium", done: false, related: "DL-8809", type: "تدريب" },
    { id: "TK-308", title: "مراجعة عقد — الرعاية الصحية", assignee: "سارة العبدالله", due: "2026-03-04", priority: "high", done: true, related: "DL-8804", type: "قانوني" },
    { id: "TK-309", title: "تأهيل عميل محتمل — GITEX", assignee: "خالد المنصور", due: "2026-03-09", priority: "medium", done: false, related: "LD-2406", type: "تأهيل" },
    { id: "TK-310", title: "تقرير أسبوعي للإدارة", assignee: "سارة العبدالله", due: "2026-03-07", priority: "low", done: false, related: "—", type: "تقرير" },
  ];

  const activities = [
    { text: "تم تقديم صفقة «ترخيص CRM — 50 مستخدم» إلى مرحلة التفاوض", time: "منذ 45 دقيقة", type: "deal" },
    { text: "تأهيل عميل محتمل: هيفاء الغامدي — مركز الرعاية الصحية", time: "منذ ساعتين", type: "lead" },
    { text: "إغلاق صفقة «حزمة مبيعات + تقارير» بقيمة 156,000 ر.س", time: "منذ 4 ساعات", type: "won" },
    { text: "مهمة مكتملة: مراجعة عقد — الرعاية الصحية", time: "منذ 5 ساعات", type: "task" },
    { text: "عميل محتمل جديد: دانة المطيري — مجموعة الفطيم", time: "أمس", type: "lead" },
    { text: "اجتماع Demo مع شركة نماء للتقنية — نتيجة إيجابية", time: "أمس", type: "meeting" },
  ];

  const teamMembers = [
    { id: "TM-01", name: "سارة العبدالله", role: "مدير المبيعات", email: "s.abdullah@rabt-crm.sa", deals: 12, quota: 1500000, achieved: 980000 },
    { id: "TM-02", name: "خالد المنصور", role: "مندوب مبيعات أول", email: "k.almansour@rabt-crm.sa", deals: 9, quota: 900000, achieved: 720000 },
    { id: "TM-03", name: "ريم الحربي", role: "مندوبة مبيعات", email: "r.alharbi@rabt-crm.sa", deals: 7, quota: 750000, achieved: 580000 },
    { id: "TM-04", name: "عمر الزهراني", role: "مسؤول النظام", email: "o.alzahrani@rabt-crm.sa", deals: 0, quota: 0, achieved: 0 },
  ];

  const integrations = [
    { name: "Microsoft 365", status: "connected", desc: "مزامنة البريد والتقويم" },
    { name: "SAP Business One", status: "connected", desc: "تكامل الفواتير والعملاء" },
    { name: "WhatsApp Business", status: "pending", desc: "رسائل العملاء المباشرة" },
    { name: "Zapier", status: "available", desc: "أتمتة سير العمل" },
    { name: "Slack", status: "available", desc: "إشعارات الفريق" },
  ];

  const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));

  const activeDeals = () => deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const pipelineValue = () => activeDeals().reduce((s, d) => s + d.value, 0);
  const weightedValue = () => activeDeals().reduce((s, d) => s + d.value * (d.probability / 100), 0);

  return {
    STAGES,
    STAGE_ORDER,

    async getDashboard() {
      await delay();
      const active = activeDeals();
      const won = deals.filter((d) => d.stage === "won");
      const totalClosed = won.length + deals.filter((d) => d.stage === "lost").length;
      const conversionRate = totalClosed ? Math.round((won.length / totalClosed) * 100) : 0;

      return {
        stats: {
          pipelineValue: pipelineValue(),
          weightedValue: Math.round(weightedValue()),
          conversionRate,
          activeDeals: active.length,
          newLeads: leads.filter((l) => l.status === "new").length,
          openTasks: tasks.filter((t) => !t.done).length,
        },
        chart: [
          { label: "أكتوبر", value: 420000, count: 3 },
          { label: "نوفمبر", value: 580000, count: 4 },
          { label: "ديسمبر", value: 710000, count: 5 },
          { label: "يناير", value: 890000, count: 6 },
          { label: "فبراير", value: 1050000, count: 7 },
          { label: "مارس", value: pipelineValue(), count: active.length },
        ],
        activities,
        recentDeals: [...deals].sort((a, b) => STAGE_ORDER.indexOf(b.stage) - STAGE_ORDER.indexOf(a.stage)).slice(0, 5),
        stageSummary: STAGES.filter((s) => s.id !== "lost").map((s) => ({
          ...s,
          count: deals.filter((d) => d.stage === s.id).length,
          value: deals.filter((d) => d.stage === s.id).reduce((sum, d) => sum + d.value, 0),
        })),
      };
    },

    async getLeads(filter = "all") {
      await delay();
      if (filter === "all") return [...leads];
      return leads.filter((l) => l.status === filter);
    },

    async qualifyLead(id) {
      await delay(350);
      const lead = leads.find((l) => l.id === id);
      if (lead && (lead.status === "new" || lead.status === "contacted")) {
        lead.status = "qualified";
        lead.score = Math.min(100, lead.score + 12);
      }
      return lead;
    },

    async getDeals(stage = "all") {
      await delay();
      if (stage === "all") return [...deals];
      return deals.filter((d) => d.stage === stage);
    },

    async advanceDeal(id) {
      await delay(350);
      const deal = deals.find((d) => d.id === id);
      if (!deal || deal.stage === "won" || deal.stage === "lost") return deal;
      const idx = STAGE_ORDER.indexOf(deal.stage);
      if (idx >= 0 && idx < STAGE_ORDER.length - 2) {
        deal.stage = STAGE_ORDER[idx + 1];
        deal.probability = Math.min(95, deal.probability + 15);
        if (deal.stage === "won") deal.probability = 100;
      }
      return deal;
    },

    async getContacts(q = "") {
      await delay();
      const term = q.trim();
      if (!term) return [...contacts];
      return contacts.filter(
        (c) =>
          c.name.includes(term) ||
          c.company.includes(term) ||
          c.email.includes(term) ||
          c.city.includes(term)
      );
    },

    async getTasks(filter = "all") {
      await delay();
      if (filter === "open") return tasks.filter((t) => !t.done);
      if (filter === "done") return tasks.filter((t) => t.done);
      return [...tasks];
    },

    async toggleTask(id) {
      await delay(300);
      const task = tasks.find((t) => t.id === id);
      if (task) task.done = !task.done;
      return task;
    },

    async getReports() {
      await delay();
      return [
        { id: "r1", title: "تقرير المبيعات الشهري", desc: "إيرادات مكتسبة ومقارنة بالهدف والربع السابق", records: deals.filter((d) => d.stage === "won").length, updated: "2026-03-04", icon: "💰" },
        { id: "r2", title: "تقرير خط الأنابيب", desc: "قيمة الصفقات حسب المرحلة والاحتمالية المرجّحة", records: activeDeals().length, updated: "2026-03-04", icon: "📊" },
        { id: "r3", title: "أداء فريق المبيعات", desc: "تحقيق الحصص والصفقات لكل مندوب", records: teamMembers.filter((m) => m.quota > 0).length, updated: "2026-03-03", icon: "👥" },
        { id: "r4", title: "تحليل مصادر العملاء", desc: "توزيع العملاء المحتملين حسب القناة والتأهيل", records: leads.length, updated: "2026-03-02", icon: "🎯" },
        { id: "r5", title: "معدل التحويل", desc: "نسبة الفوز والخسارة ومتوسط دورة البيع", records: deals.length, updated: "2026-03-01", icon: "📈" },
        { id: "r6", title: "تقرير المهام المتأخرة", desc: "مهام تجاوزت موعد الاستحقاق حسب الأولوية", records: tasks.filter((t) => !t.done && t.due < "2026-03-05").length, updated: "2026-03-04", icon: "⏰" },
      ];
    },

    async getSettings() {
      await delay();
      return {
        pipelineStages: STAGES,
        teamMembers,
        integrations,
        currency: "SAR",
        fiscalYear: "2026",
        autoAssignLeads: true,
        emailSync: true,
        dealApprovalThreshold: 250000,
      };
    },
  };
})();
