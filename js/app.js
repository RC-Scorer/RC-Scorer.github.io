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
  ["spec-count", "spec-mins"].forEach(function (id) {
    var el2 = document.getElementById(id);
    if (!el2) return;
    if (!hasClips) { var row = el2.closest("div"); if (row) row.hidden = true; return; }
    el2.textContent = id === "spec-count"
      ? String(recs.length)
      : Math.round(total / 60) + " min";
  });

  /* --- scenario table --------------------------------------------------- */
  var scenarioSection = document.getElementById("scenario-block")
    || document.getElementById("scenarios");
  if (!scenarios.length && scenarioSection) scenarioSection.hidden = true;

  var list = document.getElementById("scenario-list");
  var lastGroup = null;
  scenarios.forEach(function (s) {
    if (s.group && s.group !== lastGroup) {
      lastGroup = s.group;
      var g = el("li", "sc-group", s.group);
      g.setAttribute("role", "presentation");
      list.appendChild(g);
    }

    var li = el("li", "sc" + (s.image ? "" : " sc--noimg"));

    var head = el("div", "sc-head");
    head.appendChild(el("span", "code", s.code));
    var txt = el("div", "sc-text");
    txt.appendChild(el("h3", "sc-title", s.title));
    txt.appendChild(el("p", "sc-detail", s.detail));

    var meta = el("p", "sc-meta");
    var sp = el("span", "num");
    sp.appendChild(document.createTextNode(s.speeds + " "));
    sp.appendChild(el("span", "unit", "km/h"));
    meta.appendChild(sp);
    var n = countFor(s.code);
    meta.appendChild(el("span", "num n-clips" + (n ? "" : " n-zero"),
      n ? n + (n === 1 ? " clip" : " clips") : "no clips yet"));
    txt.appendChild(meta);

    head.appendChild(txt);

    if (s.image) {
      var fig = el("figure", "sc-fig");
      var img = document.createElement("img");
      img.src = s.image;
      img.loading = "lazy";
      img.alt = "Overhead diagram of scenario " + s.code + ": " + s.title;
      fig.appendChild(img);
      li.appendChild(fig);
    }

    li.appendChild(head);
    list.appendChild(li);
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
    // Nothing to show: drop the whole section and its nav entry rather than
    // leaving an empty heading behind.
    var vid = document.getElementById("videos");
    if (vid) vid.hidden = true;
    var navLink = document.querySelector('.secnav a[href="#videos"]');
    if (navLink) navLink.hidden = true;
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
