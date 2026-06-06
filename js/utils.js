/** تنسيق موحّد — أرقام إنجليزية دائماً */
const fmt = (n) => Number(n).toLocaleString("en-US");
const fmtPct = (n) => `${Number(n).toLocaleString("en-US")}%`;
const fmtMoney = (n) => `${fmt(n)} <span class="num-suffix">ر.س</span>`;
