const CALLSIGN = "KD9ADR";
const API = `https://api.pota.app/stats/user/${CALLSIGN}`;

document.getElementById("year").textContent = new Date().getFullYear();

const fmt = value => {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : "—";
};

function firstNumber(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === "" || typeof value === "object") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function countAwards(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") {
    const direct = firstNumber(value.count, value.total, value.awardCount, value.achievementCount);
    if (direct !== null) return direct;
    for (const key of ["awards", "achievements", "earned", "items", "results"]) {
      if (value[key] !== undefined && value[key] !== null) {
        const count = countAwards(value[key]);
        if (count !== null) return count;
      }
    }
  }
  return firstNumber(value);
}

function findValue(obj, keys) {
  if (!obj || typeof obj !== "object") return null;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return null;
}

function extractPotaStats(data) {
  // POTA's public API has changed shape over time. Keep this deliberately
  // defensive so a harmless field rename doesn't break the whole page.
  const root = data?.stats || data || {};
  const activator = root.activator || root.activatorStats || root;
  const awards = root.awards || root.achievements || root.achievementStats || {};

  return {
    activations: firstNumber(
      findValue(activator, ["activations", "activationCount", "totalActivations"]),
      findValue(root, ["activations", "activationCount", "totalActivations"])
    ),
    parks: firstNumber(
      findValue(activator, ["parks", "parksActivated", "uniqueParks", "parkCount"]),
      findValue(root, ["parks", "parksActivated", "uniqueParks", "parkCount"])
    ),
    qsos: firstNumber(
      findValue(activator, ["qsos", "qsoCount", "contacts", "contactCount", "totalQSOs"]),
      findValue(root, ["qsos", "qsoCount", "contacts", "contactCount", "totalQSOs"])
    ),
    awards: countAwards(awards) ?? countAwards(findValue(root, ["awards", "achievementCount", "achievements"]))
  };
}

async function loadPota() {
  const status = document.getElementById("pota-status");
  const cells = [...document.querySelectorAll("#pota-stats .stat-value")];

  try {
    const response = await fetch(API, {
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const stats = extractPotaStats(data);
    const values = [stats.activations, stats.parks, stats.qsos, stats.awards];

    cells.forEach((cell, i) => {
      cell.textContent = fmt(values[i]);
      cell.classList.remove("loading");
    });

    status.textContent = `POTA public data · updated ${new Date().toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric"
    })}`;
  } catch {
    cells.forEach(cell => {
      cell.textContent = "—";
      cell.classList.remove("loading");
    });
    status.textContent = "POTA data is temporarily unavailable. The rest of the site still works normally.";
  }
}

loadPota();
