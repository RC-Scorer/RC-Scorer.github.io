/* RadarAD project page — builds the scenario table and the recording grid
   from data/recordings.js. Edit that file, not this one. */
(function () {
  "use strict";

  var recs = (typeof RECORDINGS !== "undefined" ? RECORDINGS : [])
    .filter(function (r) { return !r.hidden; });
  var scenarios = typeof SCENARIOS !== "undefined" ? SCENARIOS : [];
  var byCode = {};
  scenarios.forEach(function (s) { byCode[s.code] = s; });

  var RUN_LABEL = { baseline: "baseline", comfort: "comfort" };

  function mmss(sec) {
    var s = Math.round(sec || 0);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function countFor(code) {
    return recs.filter(function (r) { return r.scenario === code; }).length;
  }

  var hasClips = recs.length > 0;

  /* --- hero spec -------------------------------------------------------- */
  var total = recs.reduce(function (a, r) { return a + (r.seconds || 0); }, 0);
  document.getElementById("spec-count").textContent = hasClips ? recs.length : "—";
  document.getElementById("spec-mins").textContent =
    hasClips ? Math.round(total / 60) + " min" : "—";

  /* --- scenario table --------------------------------------------------- */
  var scenarioSection = document.getElementById("scenarios");
  if (!scenarios.length && scenarioSection) scenarioSection.hidden = true;

  var tbody = document.querySelector("#scenario-table tbody");
  var lastGroup = null;
  scenarios.forEach(function (s) {
    if (s.group !== lastGroup) {
      lastGroup = s.group;
      var gr = el("tr", "group-row");
      var gc = el("td", null, s.group);
      gc.colSpan = 4;
      gr.appendChild(gc);
      tbody.appendChild(gr);
    }
    var tr = el("tr");

    var td0 = el("td");
    td0.appendChild(el("span", "code", s.code));
    tr.appendChild(td0);

    var td1 = el("td");
    td1.appendChild(el("span", "sc-title", s.title));
    td1.appendChild(el("span", "sc-detail", s.detail));
    tr.appendChild(td1);

    var td2 = el("td", "num");
    td2.appendChild(document.createTextNode(s.speeds + " "));
    td2.appendChild(el("span", "unit", "km/h"));
    tr.appendChild(td2);

    var n = countFor(s.code);
    var td3 = el("td", "num" + (n ? "" : " n-zero"), n ? String(n) : "—");
    tr.appendChild(td3);

    tbody.appendChild(tr);
  });

  /* --- filters ---------------------------------------------------------- */
  var state = { scenario: "all", run: "all" };

  function buildChips(host, items, key) {
    items.forEach(function (it) {
      var b = el("button", "chip");
      b.type = "button";
      b.setAttribute("aria-pressed", String(state[key] === it.value));
      b.dataset.value = it.value;
      b.appendChild(document.createTextNode(it.label));
      if (it.n != null) b.appendChild(el("span", "n", String(it.n)));
      b.addEventListener("click", function () {
        state[key] = it.value;
        host.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c.dataset.value === it.value));
        });
        render();
      });
      host.appendChild(b);
    });
  }

  if (!hasClips) {
    document.querySelector(".filters").hidden = true;
    document.getElementById("result-line").hidden = true;
    document.getElementById("empty").textContent =
      "No clips published yet — add them to data/recordings.js.";
    document.getElementById("empty").hidden = false;
    return;
  }

  var unassigned = recs.filter(function (r) { return !r.scenario; }).length;
  var scItems = [{ value: "all", label: "All", n: recs.length }];
  scenarios.forEach(function (s) {
    var n = countFor(s.code);
    if (n) scItems.push({ value: s.code, label: s.code, n: n });
  });
  if (unassigned && scenarios.length) {
    scItems.push({ value: "__none", label: "Unassigned", n: unassigned });
  }
  buildChips(document.getElementById("filter-scenario"), scItems, "scenario");

  var nBase = recs.filter(function (r) { return r.run === "baseline"; }).length;
  var nComf = recs.filter(function (r) { return r.run === "comfort"; }).length;
  var runItems = [{ value: "all", label: "Both runs", n: recs.length }];
  if (nBase) runItems.push({ value: "baseline", label: "Baseline", n: nBase });
  if (nComf) runItems.push({ value: "comfort", label: "Comfort", n: nComf });
  if (runItems.length > 1) {
    buildChips(document.getElementById("filter-run"), runItems, "run");
  }

  /* --- grid ------------------------------------------------------------- */
  var grid = document.getElementById("grid");
  var emptyMsg = document.getElementById("empty");
  var resultLine = document.getElementById("result-line");

  function card(r) {
    var li = el("li", "card");

    var v = document.createElement("video");
    v.controls = true;
    v.preload = "none";
    v.playsInline = true;
    v.poster = "posters/" + r.id + ".jpg";
    v.setAttribute("aria-label", "Recording " + r.clock);
    var src = document.createElement("source");
    src.src = "videos/" + r.id + ".mp4";
    src.type = "video/mp4";
    v.appendChild(src);
    li.appendChild(v);

    var meta = el("div", "card-meta");

    var top = el("div", "card-top");
    top.appendChild(el("span", "card-id", r.clock));
    top.appendChild(el("span", "card-dur", mmss(r.seconds)));
    meta.appendChild(top);

    var badges = el("div", "badges");
    if (r.scenario && byCode[r.scenario]) {
      var b = el("span", "badge badge--sc", r.scenario + " · " + byCode[r.scenario].title);
      badges.appendChild(b);
    } else {
      badges.appendChild(el("span", "badge badge--todo", "unassigned"));
    }
    if (r.run) {
      badges.appendChild(el("span", "badge badge--" + r.run, RUN_LABEL[r.run] || r.run));
    }
    if (r.speed !== "" && r.speed != null) {
      badges.appendChild(el("span", "badge", r.speed + " km/h"));
    }
    if (r.side) badges.appendChild(el("span", "badge", r.side));
    meta.appendChild(badges);

    if (r.note) meta.appendChild(el("p", "card-note", r.note));

    li.appendChild(meta);
    return li;
  }

  function matches(r) {
    var okS = state.scenario === "all" ||
      (state.scenario === "__none" ? !r.scenario : r.scenario === state.scenario);
    var okR = state.run === "all" || r.run === state.run;
    return okS && okR;
  }

  function render() {
    var shown = recs.filter(matches);
    grid.textContent = "";
    shown.forEach(function (r) { grid.appendChild(card(r)); });
    emptyMsg.hidden = shown.length > 0;

    var mins = Math.round(
      shown.reduce(function (a, r) { return a + (r.seconds || 0); }, 0) / 60);
    resultLine.textContent =
      shown.length + " of " + recs.length + " recordings · " + mins + " min";
  }

  render();
})();
