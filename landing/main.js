/* Easykeeps landing page interactions. Plain JS, no libraries. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hasIO = "IntersectionObserver" in window;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  /* "Still" means the visitor's device asks for less motion, or they chose "Stop moving parts" */
  function still() { return reducedMQ.matches || doc.classList.contains("a11y-still"); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-CA"); }

  function onVisible(el, cb, opts) {
    if (!hasIO) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting, e); });
    }, opts || { threshold: 0.25 }).observe(el);
  }

  function countTo(el, target, dur) {
    if (still()) { el.textContent = money(target); return; }
    var t0 = performance.now();
    (function frame(now) {
      var p = Math.max(0, Math.min(1, (now - t0) / (dur || 900)));
      el.textContent = money(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }

  /* ---------- Navigation: solid as soon as the page starts to scroll ---------- */
  var nav = $("[data-nav]");
  var hero = $("[data-hero]");
  if (nav && hero && hasIO) {
    var sentinel = document.createElement("div");
    sentinel.className = "nav-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    hero.appendChild(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("is-solid", !entries[0].isIntersecting);
    }).observe(sentinel);
  } else if (nav) {
    nav.classList.add("is-solid");
  }

  /* ---------- Mobile menu sheet ---------- */
  var sheet = $("[data-sheet]");
  var openBtn = $("[data-menu-open]");
  function closeSheet(returnFocus) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (returnFocus) openBtn.focus();
  }
  if (sheet && openBtn) {
    openBtn.addEventListener("click", function () {
      sheet.hidden = false;
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      $("[data-menu-close]", sheet).focus();
    });
    $("[data-menu-close]", sheet).addEventListener("click", function () { closeSheet(true); });
    $$("[data-menu-link]", sheet).forEach(function (a) { a.addEventListener("click", function () { closeSheet(false); }); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(true); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(true); });
  }

  /* ---------- Hero: receipt card ticks through, money chips count up ---------- */
  var heroSteps = $$("[data-hero-steps] li");
  var heroProgress = $("[data-hero-progress]");
  var chip = $("[data-cycle]");
  var chipText = $("[data-cycle-text]");
  var chipLines = ["Receipt sorted: Supplies", "Matched to your bank", "$4.11 GST set aside", "Checked by a person"];
  var heroTimer = null, heroStep = 0, heroVisible = true;

  function paintHero() {
    heroSteps.forEach(function (li, i) { li.classList.toggle("is-done", i <= heroStep); });
    if (heroProgress) heroProgress.style.width = ((heroStep + 1) / heroSteps.length) * 100 + "%";
    if (chip && chipText) {
      chip.classList.add("is-swapping");
      setTimeout(function () { chipText.textContent = chipLines[heroStep]; chip.classList.remove("is-swapping"); }, 220);
    }
  }
  function tickHero() {
    clearTimeout(heroTimer);
    if (still()) { heroStep = heroSteps.length - 1; paintHero(); return; }
    heroStep = heroStep === heroSteps.length - 1 ? 0 : heroStep + 1;
    paintHero();
    if (heroVisible && !document.hidden) heroTimer = setTimeout(tickHero, heroStep === heroSteps.length - 1 ? 2400 : 1100);
  }
  if (hero && heroSteps.length) {
    if (still()) { heroStep = heroSteps.length - 1; paintHero(); }
    onVisible(hero, function (visible) {
      heroVisible = visible;
      clearTimeout(heroTimer);
      if (visible && !still()) heroTimer = setTimeout(tickHero, 1100);
    }, { threshold: 0.1 });
    document.addEventListener("visibilitychange", function () {
      clearTimeout(heroTimer);
      if (!document.hidden && heroVisible && !still()) heroTimer = setTimeout(tickHero, 1100);
    });
  }
  $$("[data-ticker]").forEach(function (el, i) {
    setTimeout(function () { countTo(el, +el.getAttribute("data-ticker"), 1400); }, 500 + i * 150);
  });

  /* ---------- Works-with strip: a second copy makes the loop seamless ---------- */
  $$("[data-marquee]").forEach(function (m) {
    var track = $(".marquee__track", m);
    var copy = track.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.removeAttribute("aria-label");
    m.appendChild(copy);
  });

  /* ---------- How it works: pinned while scrolling, steps follow the scroll ---------- */
  var scrolly = $("[data-scrolly]");
  if (scrolly) {
    var track = $("[data-track]", scrolly);
    var stepBtns = $$(".how__step", scrolly);
    var tabBtns = $$(".how__tabs button", scrolly);
    var scenes = $$(".scene", scrolly);
    var markers = $$("[data-marker]", scrolly);
    var rail = $("[data-rail]", scrolly);
    var current = -1;

    var setStep = function (i) {
      if (i === current) return;
      current = i;
      stepBtns.forEach(function (b, n) {
        b.classList.toggle("is-active", n === i);
        if (n === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      tabBtns.forEach(function (b, n) { b.classList.toggle("is-active", n === i); });
      scenes.forEach(function (s, n) {
        s.classList.remove("is-active");
        if (n === i) { void s.offsetWidth; s.classList.add("is-active"); }
      });
      if (rail) rail.style.setProperty("--p", ((i + 1) / scenes.length).toFixed(3));
      if (i === 2) $$("[data-count]", scenes[2]).forEach(function (el) { countTo(el, +el.getAttribute("data-count")); });
    };
    setStep(0);

    if (hasIO) {
      var mo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setStep(+e.target.getAttribute("data-marker")); });
      }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
      markers.forEach(function (m) { mo.observe(m); });
    }

    var goTo = function (i) {
      var top = track.getBoundingClientRect().top + window.scrollY;
      var target = i === 0 ? top : top + markers[i].offsetTop - window.innerHeight / 2 + 12;
      window.scrollTo({ top: target, behavior: still() ? "auto" : "smooth" });
      setStep(i);
    };
    stepBtns.concat(tabBtns).forEach(function (b) {
      b.addEventListener("click", function () { goTo(+b.getAttribute("data-goto")); });
    });
  }

  /* ---------- Story: the photo behind stays put and changes with the words ---------- */
  var story = $("[data-story]");
  if (story && hasIO) {
    var bgs = $$("[data-bg]", story);
    var dots = $$(".story__dots i", story);
    var panels = $$("[data-panel]", story);
    var po = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var k = +e.target.getAttribute("data-panel");
        bgs.forEach(function (b, n) { b.classList.toggle("is-on", n === k); });
        dots.forEach(function (d, n) { d.classList.toggle("is-on", n === k); });
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    var pin = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("is-in", e.isIntersecting); });
    }, { threshold: 0.45 });
    panels.forEach(function (p) { po.observe(p); pin.observe(p); });
    /* load the next photos once the section is near */
    onVisible(story, function (v) { if (v) bgs.forEach(function (b) { b.loading = "eager"; }); }, { rootMargin: "600px 0px" });
  } else if (story) {
    $$("[data-panel]", story).forEach(function (p) { p.classList.add("is-in"); });
  }

  /* ---------- Your report: interactive sample charts ---------- */
  var insight = $("[data-insight]");
  if (insight) {
    var SVGNS = "http://www.w3.org/2000/svg";
    var mk = function (tag, attrs, parent) {
      var el = document.createElementNS(SVGNS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(el);
      return el;
    };
    /* Sample numbers only. September matches the example report above.
       Category colours checked for colour-blind separation (dataviz palette validator). */
    var months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    var full = ["October 2025", "November 2025", "December 2025", "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026", "July 2026", "August 2026", "September 2026"];
    var IN = [8420, 7980, 9150, 8760, 9890, 10420, 11260, 12030, 11640, 12210, 13120, 12480];
    var OUT = [6120, 5890, 6440, 6310, 6980, 7210, 7460, 7820, 7690, 7740, 8010, 7915];
    var CATS = [
      { name: "Supplies", value: 2840, color: "#087A56" },
      { name: "Wages", value: 2210, color: "#D08A00" },
      { name: "Rent", value: 1450, color: "#2457F5" },
      { name: "Vehicle and fuel", value: 810, color: "#EF5A3C" },
      { name: "Phone, software and other", value: 605, color: "#8A63D2" }
    ];

    /* Area chart */
    var area = $("[data-area]", insight);
    var svg = $("[data-area-svg]", insight);
    var tip = $("[data-area-tip]", insight);
    var range = 12, show = { "in": true, out: true }, hoverIdx = -1, drawn = false, geo = null;

    var monotone = function (pts) {
      /* Smooth line that never overshoots between points (Fritsch-Carlson) */
      var n = pts.length, i, dx = [], m = [], t = [];
      if (n < 2) return "";
      for (i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]; }
      t[0] = m[0]; t[n - 1] = m[n - 2];
      for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
      for (i = 0; i < n - 1; i++) {
        if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
        var a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
        if (s > 9) { var tau = 3 / Math.sqrt(s); t[i] = tau * a * m[i]; t[i + 1] = tau * b * m[i]; }
      }
      var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
      for (i = 0; i < n - 1; i++) {
        var h = dx[i] / 3;
        d += " C" + (pts[i][0] + h).toFixed(1) + " " + (pts[i][1] + h * t[i]).toFixed(1) + " " + (pts[i + 1][0] - h).toFixed(1) + " " + (pts[i + 1][1] - h * t[i + 1]).toFixed(1) + " " + pts[i + 1][0].toFixed(1) + " " + pts[i + 1][1].toFixed(1);
      }
      return d;
    };

    var drawArea = function (animate) {
      var W = area.clientWidth, H = area.clientHeight;
      if (!W || !H) return;
      var small = W < 520;
      var pad = { l: 46, r: 14, t: 14, b: 30 };
      var from = 12 - range;
      var inS = IN.slice(from), outS = OUT.slice(from), labels = months.slice(from);
      var maxV = Math.max.apply(null, (show["in"] ? inS : []).concat(show.out ? outS : [], [1000]));
      var step = maxV > 8000 ? 4000 : 2000;
      var top = Math.ceil(maxV / step) * step;
      var x = function (i) { return pad.l + (W - pad.l - pad.r) * (inS.length === 1 ? 0 : i / (inS.length - 1)); };
      var y = function (v) { return pad.t + (H - pad.t - pad.b) * (1 - v / top); };
      geo = { x: x, y: y, from: from, inS: inS, outS: outS, W: W, H: H, pad: pad };

      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.textContent = "";
      var defs = mk("defs", {}, svg);
      [["g-in", "#087A56"], ["g-out", "#2457F5"]].forEach(function (g) {
        var lg = mk("linearGradient", { id: g[0], x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        mk("stop", { offset: "0%", "stop-color": g[1], "stop-opacity": g[0] === "g-in" ? .32 : .22 }, lg);
        mk("stop", { offset: "100%", "stop-color": g[1], "stop-opacity": 0 }, lg);
      });
      var clip = mk("clipPath", { id: "area-clip" }, defs);
      var clipRect = mk("rect", { x: 0, y: 0, width: W, height: H }, clip);

      var grid = mk("g", { "class": "area__grid" }, svg);
      var axis = mk("g", { "class": "area__axis" }, svg);
      for (var v = 0; v <= top; v += step) {
        mk("line", { x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }, grid);
        var t = mk("text", { x: pad.l - 10, y: y(v) + 4, "text-anchor": "end" }, axis);
        t.textContent = v === 0 ? "$0" : "$" + (v / 1000) + "k";
      }
      labels.forEach(function (lab, i) {
        if (small && range === 12 && (labels.length - 1 - i) % 2 === 1) return;
        var t = mk("text", { x: x(i), y: H - 8, "text-anchor": i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle" }, axis);
        t.textContent = lab;
      });

      var plot = mk("g", { "clip-path": "url(#area-clip)" }, svg);
      var lines = [];
      [["out", outS, "url(#g-out)"], ["in", inS, "url(#g-in)"]].forEach(function (s) {
        var pts = s[1].map(function (val, i) { return [x(i), y(val)]; });
        var line = monotone(pts);
        var g = mk("g", { "class": "area__series" + (show[s[0]] ? "" : " is-off") }, plot);
        mk("path", { "class": "area__fill", d: line + " L" + x(pts.length - 1) + " " + y(0) + " L" + x(0) + " " + y(0) + "Z", fill: s[2] }, g);
        lines.push(mk("path", { "class": "area__line area__line--" + s[0], d: line }, g));
      });

      if (show["in"]) {
        var li = inS.length - 1;
        mk("circle", { "class": "area__live", cx: x(li), cy: y(inS[li]), r: 5 }, svg);
        mk("circle", { cx: x(li), cy: y(inS[li]), r: 5, fill: "#087A56", stroke: "#fff", "stroke-width": 2 }, svg);
      }

      geo.cross = mk("line", { "class": "area__cross", y1: pad.t, y2: H - pad.b }, svg);
      geo.ptIn = mk("circle", { "class": "area__pt", r: 6, fill: "#087A56" }, svg);
      geo.ptOut = mk("circle", { "class": "area__pt", r: 6, fill: "#2457F5" }, svg);

      if (animate && !still()) {
        clipRect.setAttribute("width", 0);
        var t0 = performance.now();
        (function grow(now) {
          var p = Math.max(0, Math.min(1, (now - t0) / 1300));
          clipRect.setAttribute("width", (W * (1 - Math.pow(1 - p, 3))).toFixed(1));
          if (p < 1) requestAnimationFrame(grow);
        })(t0);
      }
      if (hoverIdx >= 0) showPoint(Math.min(hoverIdx, inS.length - 1));
    };

    var totalEl = $("[data-profit-total]", insight);
    var totalLabel = $("[data-profit-label]", insight);
    var updateTotal = function () {
      var from = 12 - range, sum = 0;
      for (var i = from; i < 12; i++) sum += IN[i] - OUT[i];
      countTo(totalEl, sum, 800);
      totalLabel.textContent = "profit over " + range + " months";
    };

    var showPoint = function (i) {
      if (!geo) return;
      hoverIdx = i;
      var gx = geo.x(i), vin = geo.inS[i], vout = geo.outS[i];
      area.classList.add("is-hover");
      geo.cross.setAttribute("x1", gx); geo.cross.setAttribute("x2", gx);
      geo.ptIn.setAttribute("cx", gx); geo.ptIn.setAttribute("cy", geo.y(vin));
      geo.ptOut.setAttribute("cx", gx); geo.ptOut.setAttribute("cy", geo.y(vout));
      geo.ptIn.style.display = show["in"] ? "" : "none";
      geo.ptOut.style.display = show.out ? "" : "none";
      tip.innerHTML = "<b>" + full[geo.from + i] + "</b>" +
        (show["in"] ? "<div><span><i style=\"background:#087A56\"></i>Money in</span><span>" + money(vin) + "</span></div>" : "") +
        (show.out ? "<div><span><i style=\"background:#2457F5\"></i>Money out</span><span>" + money(vout) + "</span></div>" : "") +
        "<div class=\"tip-profit\"><span>Profit</span><span>" + money(vin - vout) + "</span></div>";
      tip.hidden = false;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = gx + 16 + tw > geo.W ? gx - 16 - tw : gx + 16;
      var topY = Math.max(0, Math.min(geo.y(Math.max(vin, vout)) - th / 2, geo.H - geo.pad.b - th));
      tip.style.transform = "translate(" + Math.max(0, left) + "px," + topY + "px)";
    };
    var hidePoint = function () { hoverIdx = -1; area.classList.remove("is-hover"); tip.hidden = true; };
    var idxFromEvent = function (e) {
      var r = area.getBoundingClientRect();
      var px = e.clientX - r.left;
      var n = geo.inS.length;
      var f = (px - geo.pad.l) / (geo.W - geo.pad.l - geo.pad.r);
      return Math.max(0, Math.min(n - 1, Math.round(f * (n - 1))));
    };
    area.addEventListener("pointermove", function (e) { if (geo) showPoint(idxFromEvent(e)); });
    area.addEventListener("pointerdown", function (e) { if (geo) showPoint(idxFromEvent(e)); });
    area.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hidePoint(); });
    area.addEventListener("focus", function () { showPoint(hoverIdx >= 0 ? hoverIdx : geo.inS.length - 1); });
    area.addEventListener("blur", hidePoint);
    area.addEventListener("keydown", function (e) {
      var n = geo.inS.length;
      if (e.key === "ArrowRight") { e.preventDefault(); showPoint(Math.min(n - 1, hoverIdx + 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); showPoint(Math.max(0, hoverIdx - 1)); }
      if (e.key === "Escape") hidePoint();
    });

    $$("[data-range]", insight).forEach(function (b) {
      b.addEventListener("click", function () {
        range = +b.getAttribute("data-range");
        $$("[data-range]", insight).forEach(function (o) {
          var on = o === b;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-pressed", on ? "true" : "false");
        });
        hidePoint();
        drawArea(true);
        updateTotal();
      });
    });
    $$("[data-series]", insight).forEach(function (b) {
      b.addEventListener("click", function () {
        var s = b.getAttribute("data-series");
        var other = s === "in" ? "out" : "in";
        if (show[s] && !show[other]) return; /* keep at least one series showing */
        show[s] = !show[s];
        b.classList.toggle("is-on", show[s]);
        b.setAttribute("aria-pressed", show[s] ? "true" : "false");
        drawArea(false);
      });
    });

    /* Donut chart */
    var donut = $("[data-donut]", insight);
    var dsvg = $("[data-donut-svg]", insight);
    var keys = $("[data-donut-keys]", insight);
    var dLabel = $("[data-donut-label]", insight);
    var dValue = $("[data-donut-value]", insight);
    var total = CATS.reduce(function (s, c) { return s + c.value; }, 0);
    var R = 80, C = 2 * Math.PI * R, GAP = 3;
    var segs = [], keyBtns = [], acc = 0;
    CATS.forEach(function (c, i) {
      var len = C * c.value / total;
      var seg = mk("circle", { "class": "donut__seg", cx: 100, cy: 100, r: R, stroke: c.color, "stroke-dasharray": "0 " + C, "stroke-dashoffset": -acc }, dsvg);
      seg.dataset.full = Math.max(0, len - GAP) + " " + C;
      acc += len;
      segs.push(seg);
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = "<i style=\"background:" + c.color + "\"></i><span>" + c.name + "</span><span>" + money(c.value) + "</span>";
      li.appendChild(btn);
      keys.appendChild(li);
      keyBtns.push(btn);
      var on = function () { focusCat(i); };
      seg.addEventListener("pointerenter", on);
      seg.addEventListener("click", on);
      btn.addEventListener("pointerenter", on);
      btn.addEventListener("focus", on);
      btn.addEventListener("click", on);
    });
    var focusCat = function (i) {
      donut.classList.add("has-focus");
      segs.forEach(function (s, n) { s.classList.toggle("is-focus", n === i); });
      keyBtns.forEach(function (b, n) { b.classList.toggle("is-focus", n === i); });
      dLabel.textContent = CATS[i].name + ", " + Math.round(CATS[i].value / total * 100) + "%";
      dValue.textContent = money(CATS[i].value);
    };
    var clearCat = function () {
      donut.classList.remove("has-focus");
      segs.forEach(function (s) { s.classList.remove("is-focus"); });
      keyBtns.forEach(function (b) { b.classList.remove("is-focus"); });
      dLabel.textContent = "Money out";
      dValue.textContent = money(total);
    };
    donut.addEventListener("pointerleave", clearCat);
    keys.addEventListener("pointerleave", clearCat);
    keys.addEventListener("focusout", function (e) { if (!keys.contains(e.relatedTarget)) clearCat(); });
    var growDonut = function () {
      segs.forEach(function (s, i) {
        if (still()) { s.setAttribute("stroke-dasharray", s.dataset.full); return; }
        s.style.transition = "stroke-dasharray .9s cubic-bezier(.16,1,.3,1) " + (i * 0.12) + "s, stroke-width .3s, opacity .3s";
        requestAnimationFrame(function () { s.setAttribute("stroke-dasharray", s.dataset.full); });
      });
    };

    /* Table view of the same numbers */
    var tableHost = $("[data-table]", insight);
    var rows = months.map(function (m, i) { return "<tr><td>" + full[i] + "</td><td>" + money(IN[i]) + "</td><td>" + money(OUT[i]) + "</td><td>" + money(IN[i] - OUT[i]) + "</td></tr>"; }).join("");
    var catRows = CATS.map(function (c) { return "<tr><td>" + c.name + "</td><td>" + money(c.value) + "</td><td>" + Math.round(c.value / total * 100) + "%</td></tr>"; }).join("");
    tableHost.innerHTML = "<table><caption class=\"sr-only\">Sample money in and out by month</caption><thead><tr><th scope=\"col\">Month</th><th scope=\"col\">Money in</th><th scope=\"col\">Money out</th><th scope=\"col\">Profit</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      "<table style=\"margin-top:16px\"><caption class=\"sr-only\">Sample September spending by category</caption><thead><tr><th scope=\"col\">September spending</th><th scope=\"col\">Amount</th><th scope=\"col\">Share</th></tr></thead><tbody>" + catRows + "</tbody></table>";

    drawArea(false);
    var started = false;
    onVisible(insight, function (v) {
      if (v && !started) { started = true; drawArea(true); updateTotal(); growDonut(); }
    }, { threshold: 0.2 });
    if ("ResizeObserver" in window) {
      var lastW = area.clientWidth;
      new ResizeObserver(function () {
        if (area.clientWidth !== lastW) { lastW = area.clientWidth; drawArea(false); }
      }).observe(area);
    }
  }

  /* ---------- Pricing: monthly / annual toggle ---------- */
  var pricing = $("[data-pricing]");
  if (pricing) {
    var toggle = $(".toggle", pricing);
    $$("[data-period]", pricing).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var period = btn.getAttribute("data-period");
        if (toggle.getAttribute("data-period") === period) return;
        toggle.setAttribute("data-period", period);
        $$("[data-period]", toggle).forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        var annual = period === "annual";
        $$(".plan__price", pricing).forEach(function (box) {
          box.classList.add("is-swapping");
          setTimeout(function () {
            $("[data-price]", box).textContent = box.getAttribute(annual ? "data-price-annual" : "data-price-monthly");
            $("[data-per]", box).textContent = annual ? "/ year" : "/ month";
            var from = $("[data-from]", box);
            if (from) from.hidden = annual;
            box.classList.toggle("is-annual", annual);
            box.classList.remove("is-swapping");
          }, still() ? 0 : 180);
        });
        $$("[data-annual-note]", pricing).forEach(function (n) { n.hidden = !annual; });
      });
    });

    /* Mobile plan picker */
    var planTabs = $$("[data-plan-tab]", pricing);
    var plans = $$("[data-plan]", pricing);
    var showPlan = function (name, focus) {
      planTabs.forEach(function (t) {
        var on = t.getAttribute("data-plan-tab") === name;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      plans.forEach(function (p) { p.classList.toggle("is-shown", p.getAttribute("data-plan") === name); });
    };
    planTabs.forEach(function (t, i) {
      t.addEventListener("click", function () { showPlan(t.getAttribute("data-plan-tab")); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        showPlan(planTabs[(i + d + planTabs.length) % planTabs.length].getAttribute("data-plan-tab"), true);
      });
    });
    showPlan("standard");
  }

  /* ---------- Split headings: each word rises in turn ---------- */
  $$(".split").forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map(function (w, i) { return "<span class=\"w\" aria-hidden=\"true\" style=\"--i:" + i + "\">" + w + "</span>"; }).join(" ");
    h.classList.add("is-ready");
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = $$(".reveal, .split");
  if (!hasIO) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Get started form: opens a pre-filled email ---------- */
  var form = $("[data-form]");
  if (form) {
    var submit = $("[data-submit]", form);
    var status = $("[data-form-status]", form);
    var rules = [
      { el: form.elements.name, err: "e-name" },
      { el: form.elements.business, err: "e-biz" },
      { el: form.elements.contact, err: "e-contact" }
    ];
    var check = function (rule) {
      var ok = rule.el.value.trim() !== "";
      rule.el.closest(".field").classList.toggle("is-invalid", !ok);
      rule.el.setAttribute("aria-invalid", ok ? "false" : "true");
      document.getElementById(rule.err).hidden = ok;
      return ok;
    };
    rules.forEach(function (r) {
      r.el.addEventListener("blur", function () { if (r.el.getAttribute("aria-invalid") === "true") check(r); });
      r.el.addEventListener("input", function () { if (r.el.getAttribute("aria-invalid") === "true") check(r); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      var bad = rules.filter(function (r) { return !check(r); });
      if (bad.length) { bad[0].el.focus(); return; }
      submit.classList.add("is-loading");
      submit.disabled = true;
      var data = new FormData(form);
      var body = [
        "Hi Easykeeps,",
        "",
        "I'd like to get started.",
        "",
        "Name: " + data.get("name"),
        "Business: " + data.get("business"),
        "Best way to reach me: " + data.get("contact"),
        "Transactions a month: " + (data.get("volume") || "Not sure")
      ].join("\n");
      var href = "mailto:hello@easykeeps.ca?subject=" + encodeURIComponent("Getting started with Easykeeps") + "&body=" + encodeURIComponent(body);
      setTimeout(function () {
        window.location.href = href;
        submit.classList.remove("is-loading");
        submit.disabled = false;
        status.textContent = "Your email app should open with your details filled in. If it didn't, email us at hello@easykeeps.ca.";
      }, still() ? 0 : 600);
    });
  }

  /* ---------- Accessibility options ---------- */
  var a11y = $("[data-a11y]");
  if (a11y) {
    var aBtn = $("[data-a11y-open]", a11y);
    var aPanel = $("[data-a11y-panel]", a11y);
    var opts = $$("[data-a11y-opt]", a11y);
    var save = function () {
      var on = opts.filter(function (o) { return o.getAttribute("aria-pressed") === "true"; }).map(function (o) { return o.getAttribute("data-a11y-opt"); });
      try { localStorage.setItem("ek-a11y", JSON.stringify(on)); } catch (e) { /* private mode: choices last for this visit */ }
    };
    var setOpen = function (open) {
      aPanel.hidden = !open;
      aBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) opts[0].focus();
    };
    opts.forEach(function (o) {
      var name = o.getAttribute("data-a11y-opt");
      o.setAttribute("aria-pressed", doc.classList.contains("a11y-" + name) ? "true" : "false");
      o.addEventListener("click", function () {
        var on = !doc.classList.contains("a11y-" + name);
        doc.classList.toggle("a11y-" + name, on);
        o.setAttribute("aria-pressed", on ? "true" : "false");
        save();
        if (name === "still" && !on && heroVisible) { clearTimeout(heroTimer); heroTimer = setTimeout(tickHero, 1100); }
      });
    });
    aBtn.addEventListener("click", function () { setOpen(aPanel.hidden); });
    $("[data-a11y-close]", a11y).addEventListener("click", function () { setOpen(false); aBtn.focus(); });
    $("[data-a11y-reset]", a11y).addEventListener("click", function () {
      opts.forEach(function (o) { doc.classList.remove("a11y-" + o.getAttribute("data-a11y-opt")); o.setAttribute("aria-pressed", "false"); });
      save();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !aPanel.hidden) { setOpen(false); aBtn.focus(); } });
    document.addEventListener("click", function (e) { if (!aPanel.hidden && !a11y.contains(e.target)) setOpen(false); });
  }
})();
