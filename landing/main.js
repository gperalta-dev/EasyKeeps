/* Easykeeps landing page interactions. Plain JS, no libraries. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Accessibility choices are applied before anything starts moving */
  var A11Y_KEY = "ek-a11y";
  var a11ySaved = {};
  try { a11ySaved = JSON.parse(localStorage.getItem(A11Y_KEY) || "{}") || {}; } catch (e) { a11ySaved = {}; }
  ["big", "contrast", "calm", "links"].forEach(function (k) { doc.classList.toggle("a11y-" + k, !!a11ySaved[k]); });
  function calm() { return reduced || doc.classList.contains("a11y-calm"); }
  var hasIO = "IntersectionObserver" in window;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function onVisible(el, cb, opts) {
    if (!hasIO) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting); });
    }, opts || { threshold: 0.25 }).observe(el);
  }

  /* ---------- Navigation solid once past the hero; pinned hero fades as the page rises over it ---------- */
  var nav = $("[data-nav]");
  var hero = $("[data-hero]");
  var heroInner = hero ? $(".hero__inner", hero) : null;
  function fitHero() {
    if (!hero) return;
    // Pin only when the hero fits the screen, so nothing in it can be covered before it's seen
    hero.classList.remove("hero--pin");
    hero.classList.toggle("hero--pin", hero.offsetHeight <= window.innerHeight + 2 && heroInner.offsetHeight <= window.innerHeight);
  }
  function onScrollHero() {
    if (!hero) return;
    var h = hero.offsetHeight;
    if (nav) nav.classList.toggle("is-solid", window.scrollY > h - nav.offsetHeight - 4);
    if (!calm() && hero.classList.contains("hero--pin")) {
      hero.style.setProperty("--hp", Math.min(1, Math.max(0, window.scrollY / h)).toFixed(3));
    } else {
      hero.style.removeProperty("--hp");
    }
  }
  fitHero();
  onScrollHero();
  window.addEventListener("resize", function () { fitHero(); onScrollHero(); });

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

  /* ---------- Hero: receipt card steps tick through, then reset ---------- */
  var heroSteps = $$("[data-hero-steps] li");
  var heroProgress = $("[data-hero-progress]");
  var chip = $("[data-cycle]");
  var chipText = $("[data-cycle-text]");
  var chipLines = ["Receipt sorted: Supplies", "Matched to your bank", "$4.11 GST set aside", "Checked by a person"];
  var heroTimer = null, heroStep = 0;

  function paintHero() {
    heroSteps.forEach(function (li, i) { li.classList.toggle("is-done", i <= heroStep); });
    if (heroProgress) heroProgress.style.width = ((heroStep + 1) / heroSteps.length) * 100 + "%";
    if (chip && chipText) {
      chip.classList.add("is-swapping");
      setTimeout(function () { chipText.textContent = chipLines[heroStep]; chip.classList.remove("is-swapping"); }, 250);
    }
  }
  function tickHero() {
    var last = heroStep === heroSteps.length - 1;
    heroStep = last ? 0 : heroStep + 1;
    paintHero();
    if (!calm()) heroTimer = setTimeout(tickHero, heroStep === heroSteps.length - 1 ? 2000 : 900);
  }
  if (hero && heroSteps.length && !reduced) {
    onVisible(hero, function (visible) {
      clearTimeout(heroTimer);
      if (visible && !document.hidden && !calm()) heroTimer = setTimeout(tickHero, 900);
    }, { threshold: 0.1 });
  } else if (heroSteps.length) {
    heroStep = heroSteps.length - 1;
    paintHero();
  }

  /* ---------- How it works: animated showcase ---------- */
  var show = $("[data-showcase]");
  if (show) {
    var stage = $("[data-stage]", show);
    var stepBtns = $$(".how__step", show);
    var tabBtns = $$(".how__tabs button", show);
    var scenes = $$(".scene", show);
    var pauseBtn = $("[data-pause]", show);
    var pauseLabel = $("[data-pause-label]", show);
    var DUR = [3800, 3800, 4200];
    var idx = 0, timer = null, startedAt = 0, remaining = DUR[0], inView = false, paused = calm();

    stepBtns.forEach(function (b, i) { b.style.setProperty("--dur", DUR[i] + "ms"); });

    function countUp(scene) {
      $$("[data-count]", scene).forEach(function (el) {
        var target = +el.getAttribute("data-count");
        if (reduced) { el.textContent = "$" + target.toLocaleString("en-CA"); return; }
        var t0 = performance.now();
        (function frame(now) {
          var p = Math.min(1, (now - t0) / 900);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = "$" + Math.round(target * eased).toLocaleString("en-CA");
          if (p < 1) requestAnimationFrame(frame);
        })(t0);
      });
    }

    function restartTimerBar(btn) {
      btn.classList.remove("is-running");
      void btn.offsetWidth;
      if (!paused && inView) btn.classList.add("is-running");
    }

    function go(i, fromUser) {
      idx = (i + scenes.length) % scenes.length;
      stepBtns.forEach(function (b, n) {
        var on = n === idx;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        if (on) restartTimerBar(b); else b.classList.remove("is-running");
      });
      tabBtns.forEach(function (b, n) { b.classList.toggle("is-active", n === idx); });
      scenes.forEach(function (s, n) {
        var on = n === idx;
        s.hidden = !on;
        s.classList.remove("is-active");
        if (on) { void s.offsetWidth; s.classList.add("is-active"); }
      });
      if (idx === 2) countUp(scenes[2]);
      if (fromUser) stepBtns[idx].focus({ preventScroll: true });
      remaining = DUR[idx];
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (paused || !inView) return;
      startedAt = Date.now();
      timer = setTimeout(function () { go(idx + 1); }, remaining);
    }

    function setPaused(p) {
      if (p === paused) return;
      paused = p;
      show.classList.toggle("is-paused", p);
      stage.classList.toggle("is-paused", p);
      pauseBtn.setAttribute("aria-pressed", p ? "true" : "false");
      pauseLabel.textContent = p ? "Play" : "Pause";
      if (p) {
        clearTimeout(timer);
        remaining = Math.max(400, remaining - (Date.now() - startedAt));
      } else {
        var active = stepBtns[idx];
        if (!active.classList.contains("is-running")) restartTimerBar(active);
        schedule();
      }
    }

    stepBtns.forEach(function (b) {
      b.addEventListener("click", function () { go(+b.getAttribute("data-goto")); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(idx + 1, true); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1, true); }
      });
    });
    tabBtns.forEach(function (b) { b.addEventListener("click", function () { go(+b.getAttribute("data-goto")); }); });
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });

    document.addEventListener("ek-calm", function (e) { setPaused(e.detail); });
    if (paused) {
      show.classList.add("is-paused");
      stage.classList.add("is-paused");
    }
    onVisible(stage, function (v) {
      inView = v;
      if (v) { restartTimerBar(stepBtns[idx]); schedule(); } else { clearTimeout(timer); }
    }, { threshold: 0.4 });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearTimeout(timer); else schedule();
    });
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
          }, reduced ? 0 : 180);
        });
        $$("[data-annual-note]", pricing).forEach(function (n) { n.hidden = !annual; });
      });
    });

    /* Mobile plan picker */
    var planTabs = $$("[data-plan-tab]", pricing);
    var plans = $$("[data-plan]", pricing);
    function showPlan(name, focus) {
      planTabs.forEach(function (t) {
        var on = t.getAttribute("data-plan-tab") === name;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      plans.forEach(function (p) { p.classList.toggle("is-shown", p.getAttribute("data-plan") === name); });
    }
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

  /* ---------- Scroll reveal ---------- */
  var reveals = $$(".reveal");
  if (calm() || !hasIO) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px 12% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Pinned photo story: background holds, words change with scroll ---------- */
  var story = $("[data-story]");
  var storyPanels = story ? $$("[data-story-panel]", story) : [];
  var storyDots = story ? $$(".story__dots li", story) : [];
  var storyIdx = -1;
  function setStoryPinned() {
    if (!story) return;
    story.classList.toggle("is-pinned", !calm());
    storyIdx = -1;
    paintStory();
  }
  function paintStory() {
    if (!story || !story.classList.contains("is-pinned")) return;
    var r = story.getBoundingClientRect();
    var run = story.offsetHeight - window.innerHeight;
    var p = run > 0 ? Math.min(.999, Math.max(0, -r.top / run)) : 0;
    var i = Math.floor(p * storyPanels.length);
    if (i === storyIdx) return;
    storyIdx = i;
    storyPanels.forEach(function (el, n) { el.classList.toggle("is-active", n === i); });
    storyDots.forEach(function (el, n) { el.classList.toggle("is-on", n === i); });
  }
  if (story) {
    storyPanels[0].querySelector("img").loading = "eager";
    // Fetch the other scene photos once the page has loaded, so no scene is blank when it appears
    window.addEventListener("load", function () {
      storyPanels.forEach(function (pnl) { pnl.querySelector("img").loading = "eager"; });
    });
    setStoryPinned();
    document.addEventListener("ek-calm", setStoryPinned);
  }

  /* ---------- Interactive example chart ---------- */
  var glance = $("[data-glance]");
  if (glance) {
    var MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    var FULL = ["October", "November", "December", "January", "February", "March", "April", "May", "June", "July", "August", "September"];
    var IN = [9800, 10450, 11900, 8600, 8900, 10200, 11350, 12100, 12900, 11800, 12150, 12480];
    var OUT = [7100, 7350, 8400, 6900, 6700, 7250, 7600, 8050, 8300, 7700, 7840, 7915];
    var CATS = [
      { name: "Supplies", color: "#087A56", share: .377 },
      { name: "Vehicle and fuel", color: "#D08A00", share: .178 },
      { name: "Rent", color: "#2457F5", share: .24 },
      { name: "Phone and internet", color: "#EF5A3C", share: .063 },
      { name: "Other", color: "#8A9AA6", share: 0 }
    ];
    var money = function (n) { return "$" + Math.round(n).toLocaleString("en-CA"); };
    var split = function (m) {
      var total = OUT[m], used = 0;
      var parts = CATS.map(function (c, k) {
        if (k === CATS.length - 1) return 0;
        var wobble = 1 + Math.sin((m + 1) * (k + 2)) * .08;
        var v = Math.round(total * c.share * wobble / 5) * 5;
        used += v;
        return v;
      });
      parts[CATS.length - 1] = total - used;
      return parts;
    };
    var svgA = $("[data-area-svg]", glance);
    var tip = $("[data-area-tip]", glance);
    var monthsBox = $("[data-months]", glance);
    var sel = 11, drawn = false, W = 640, H = 280;
    var PAD = { l: 44, r: 12, t: 14, b: 30 };
    var MAX = 15000;
    var NS = "http://www.w3.org/2000/svg";
    var x = function (i) { return PAD.l + i * (W - PAD.l - PAD.r) / (MONTHS.length - 1); };
    var y = function (v) { return PAD.t + (1 - v / MAX) * (H - PAD.t - PAD.b); };
    var path = function (arr) { return arr.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" "); };
    var el = function (name, attrs, parent) {
      var n = document.createElementNS(NS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    };

    var drawArea = function (animate) {
      W = Math.max(300, svgA.clientWidth || 640);
      H = svgA.clientHeight || 280;
      svgA.setAttribute("viewBox", "0 0 " + W + " " + H);
      svgA.innerHTML = "";
      var defs = el("defs", {}, svgA);
      [["gin", "#087A56"], ["gout", "#2457F5"]].forEach(function (g) {
        var lg = el("linearGradient", { id: g[0], x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        el("stop", { offset: "0", "stop-color": g[1], "stop-opacity": ".22" }, lg);
        el("stop", { offset: "1", "stop-color": g[1], "stop-opacity": "0" }, lg);
      });
      var step = (W - PAD.l - PAD.r) / (MONTHS.length - 1);
      el("rect", { class: "sel", x: x(sel) - step / 2, y: PAD.t, width: step, height: H - PAD.t - PAD.b, rx: 8 }, svgA);
      [0, 5000, 10000, 15000].forEach(function (v) {
        el("line", { class: "grid", x1: PAD.l, x2: W - PAD.r, y1: y(v), y2: y(v) }, svgA);
        var t = el("text", { class: "axis", x: PAD.l - 8, y: y(v) + 4, "text-anchor": "end" }, svgA);
        t.textContent = v ? "$" + v / 1000 + "k" : "$0";
      });
      var every = W < 480 ? 2 : 1;
      MONTHS.forEach(function (m, i) {
        if ((sel - i) % every) return;
        var t = el("text", { class: "axis", x: x(i), y: H - 8, "text-anchor": "middle" }, svgA);
        t.textContent = m;
      });
      var base = " L" + x(MONTHS.length - 1) + " " + y(0) + " L" + x(0) + " " + y(0) + " Z";
      el("path", { class: "fill", d: path(IN) + base, fill: "url(#gin)" }, svgA);
      el("path", { class: "fill", d: path(OUT) + base, fill: "url(#gout)" }, svgA);
      [["in", IN], ["out", OUT]].forEach(function (s2) {
        var ln = el("path", { class: "line line--" + s2[0], d: path(s2[1]) }, svgA);
        if (animate && !calm()) { ln.style.setProperty("--len", ln.getTotalLength()); ln.classList.add("draw-in"); }
      });
      el("line", { class: "cursor", x1: x(sel), x2: x(sel), y1: PAD.t, y2: H - PAD.b, "data-cursor": "" }, svgA);
      el("circle", { class: "pt pt--in", cx: x(sel), cy: y(IN[sel]), r: 6, "data-pt-in": "" }, svgA);
      el("circle", { class: "pt pt--out", cx: x(sel), cy: y(OUT[sel]), r: 6, "data-pt-out": "" }, svgA);
      if (!animate) svgA.querySelectorAll(".fill").forEach(function (f) { f.style.animation = "none"; f.style.opacity = 1; });
    };

    var moveCursor = function (i) {
      var c = $("[data-cursor]", svgA);
      if (!c) return;
      c.setAttribute("x1", x(i)); c.setAttribute("x2", x(i));
      var a = $("[data-pt-in]", svgA), b = $("[data-pt-out]", svgA);
      a.setAttribute("cx", x(i)); a.setAttribute("cy", y(IN[i]));
      b.setAttribute("cx", x(i)); b.setAttribute("cy", y(OUT[i]));
    };
    var showTip = function (i) {
      tip.hidden = false;
      tip.innerHTML = "<b>" + FULL[i] + "</b>" +
        "<span class=\"row\"><i style=\"background:#2FD08F\"></i><span>Money in</span><strong>" + money(IN[i]) + "</strong></span>" +
        "<span class=\"row\"><i style=\"background:#8FAEFF\"></i><span>Money out</span><strong>" + money(OUT[i]) + "</strong></span>" +
        "<span class=\"row\"><i></i><span>Profit</span><strong>" + money(IN[i] - OUT[i]) + "</strong></span>";
      var box = svgA.getBoundingClientRect();
      var px = x(i) / W * box.width;
      var half = tip.offsetWidth / 2;
      tip.style.left = Math.min(box.width - half, Math.max(half, px)) + "px";
      tip.style.top = Math.max(0, y(IN[i]) / H * box.height - tip.offsetHeight - 14) + "px";
    };
    var nearest = function (clientX) {
      var box = svgA.getBoundingClientRect();
      var vx = (clientX - box.left) / box.width * W;
      return Math.max(0, Math.min(MONTHS.length - 1, Math.round((vx - PAD.l) / ((W - PAD.l - PAD.r) / (MONTHS.length - 1)))));
    };
    svgA.addEventListener("pointermove", function (e) { var i = nearest(e.clientX); moveCursor(i); showTip(i); });
    svgA.addEventListener("pointerleave", function () { tip.hidden = true; moveCursor(sel); });
    svgA.addEventListener("click", function (e) { pick(nearest(e.clientX)); });

    // Donut
    var svgD = $("[data-donut-svg]", glance);
    var legend = $("[data-donut-legend]", glance);
    var cLabel = $("[data-donut-label]", glance), cValue = $("[data-donut-value]", glance);
    var arc = function (a0, a1, r0, r1) {
      var p = function (a, r) { return [110 + r * Math.sin(a), 110 - r * Math.cos(a)]; };
      var large = a1 - a0 > Math.PI ? 1 : 0;
      var A = p(a0, r1), B = p(a1, r1), C = p(a1, r0), D = p(a0, r0);
      return "M" + A + " A" + r1 + " " + r1 + " 0 " + large + " 1 " + B + " L" + C + " A" + r0 + " " + r0 + " 0 " + large + " 0 " + D + " Z";
    };
    var hot = function (k) {
      svgD.classList.toggle("has-hot", k !== null);
      $$("path", svgD).forEach(function (pp, n) { pp.classList.toggle("is-hot", n === k); });
      $$("li", legend).forEach(function (li, n) { li.classList.toggle("is-hot", n === k); });
      var parts = split(sel);
      cLabel.textContent = k === null ? "Total out" : CATS[k].name;
      cValue.textContent = money(k === null ? OUT[sel] : parts[k]);
    };
    var drawDonut = function (animate) {
      var parts = split(sel), total = OUT[sel], a = 0;
      svgD.innerHTML = "";
      legend.innerHTML = "";
      parts.forEach(function (v, k) {
        var a1 = a + v / total * Math.PI * 2;
        var pp = el("path", { d: arc(a, a1, 64, 104), fill: CATS[k].color }, svgD);
        if (animate && !calm()) { pp.classList.add("arc-in"); pp.style.animationDelay = k * 70 + "ms"; }
        pp.addEventListener("pointerenter", function () { hot(k); });
        pp.addEventListener("pointerleave", function () { hot(null); });
        a = a1;
        var li = document.createElement("li");
        li.innerHTML = "<i style=\"background:" + CATS[k].color + "\"></i><span>" + CATS[k].name + "</span><b>" + money(v) + "</b><small>" + Math.round(v / total * 100) + "%</small>";
        li.addEventListener("pointerenter", function () { hot(k); });
        li.addEventListener("pointerleave", function () { hot(null); });
        legend.appendChild(li);
      });
      $("[data-donut-month]", glance).textContent = FULL[sel];
      $("[data-profit]", glance).textContent = money(IN[sel] - OUT[sel]);
      hot(null);
    };

    var pick = function (i) {
      sel = i;
      $$("button", monthsBox).forEach(function (b, n) { b.setAttribute("aria-pressed", n === i ? "true" : "false"); });
      drawArea(false);
      drawDonut(true);
    };
    MONTHS.forEach(function (m, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = m;
      b.setAttribute("aria-label", FULL[i]);
      b.setAttribute("aria-pressed", i === sel ? "true" : "false");
      b.addEventListener("click", function () { pick(i); });
      monthsBox.appendChild(b);
    });
    // Table view of the same numbers
    var table = $("[data-glance-table]", glance);
    var rows = "<thead><tr><th scope=\"col\">Month</th><th scope=\"col\">Money in</th><th scope=\"col\">Money out</th><th scope=\"col\">Profit</th></tr></thead><tbody>";
    MONTHS.forEach(function (m, i) { rows += "<tr><th scope=\"row\">" + FULL[i] + "</th><td>" + money(IN[i]) + "</td><td>" + money(OUT[i]) + "</td><td>" + money(IN[i] - OUT[i]) + "</td></tr>"; });
    table.insertAdjacentHTML("beforeend", rows + "</tbody>");

    drawArea(false);
    drawDonut(false);
    onVisible(glance, function (v) {
      if (v && !drawn) { drawn = true; drawArea(true); drawDonut(true); }
    }, { threshold: 0.3 });
    var rT;
    window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { drawArea(false); }, 150); });
  }

  /* ---------- Scroll progress line under the nav ---------- */
  var prog = $("[data-progress]");
  if (prog) {
    var ticking = false;
    var paintProgress = function () {
      onScrollHero();
      paintStory();
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paintProgress); }
    }, { passive: true });
    paintProgress();
  }

  /* ---------- Accessibility options ---------- */
  var a11y = $("[data-a11y]");
  if (a11y) {
    var a11yBtn = $("[data-a11y-open]", a11y);
    var a11yPanel = $("#a11y-panel", a11y);
    var opts = $$("[data-a11y-opt]", a11y);
    var save = function () {
      try { localStorage.setItem(A11Y_KEY, JSON.stringify(a11ySaved)); } catch (e) { /* storage blocked: choices last for this visit */ }
    };
    var apply = function (key, on) {
      a11ySaved[key] = on;
      doc.classList.toggle("a11y-" + key, on);
      opts.forEach(function (b) { if (b.getAttribute("data-a11y-opt") === key) b.setAttribute("aria-pressed", on ? "true" : "false"); });
      if (key === "big") { fitHero(); onScrollHero(); }
      if (key === "calm") {
        document.dispatchEvent(new CustomEvent("ek-calm", { detail: on || reduced }));
        if (on) { clearTimeout(heroTimer); heroStep = heroSteps.length - 1; paintHero(); }
        else if (!reduced) heroTimer = setTimeout(tickHero, 900);
        if (on) reveals.forEach(function (el) { el.classList.add("is-in"); });
      }
    };
    opts.forEach(function (b) {
      var key = b.getAttribute("data-a11y-opt");
      b.setAttribute("aria-pressed", a11ySaved[key] ? "true" : "false");
      b.addEventListener("click", function () { apply(key, !a11ySaved[key]); save(); });
    });
    $("[data-a11y-reset]", a11y).addEventListener("click", function () {
      ["big", "contrast", "calm", "links"].forEach(function (k) { if (a11ySaved[k]) apply(k, false); });
      save();
    });
    var closePanel = function (focusBtn) {
      if (a11yPanel.hidden) return;
      a11yPanel.hidden = true;
      a11yBtn.setAttribute("aria-expanded", "false");
      if (focusBtn) a11yBtn.focus();
    };
    a11yBtn.addEventListener("click", function () {
      var open = a11yPanel.hidden;
      a11yPanel.hidden = !open;
      a11yBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) opts[0].focus();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(true); });
    document.addEventListener("click", function (e) { if (!a11y.contains(e.target)) closePanel(false); });
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
    function check(rule) {
      var ok = rule.el.value.trim() !== "";
      rule.el.closest(".field").classList.toggle("is-invalid", !ok);
      rule.el.setAttribute("aria-invalid", ok ? "false" : "true");
      document.getElementById(rule.err).hidden = ok;
      return ok;
    }
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
      }, reduced ? 0 : 600);
    });
  }
})();
