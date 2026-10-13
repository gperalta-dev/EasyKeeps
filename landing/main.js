/* Easykeeps landing page interactions. Plain JS, no libraries. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function onVisible(el, cb, opts) {
    if (!hasIO) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting); });
    }, opts || { threshold: 0.25 }).observe(el);
  }

  /* ---------- Navigation: solid once the hero is behind it ---------- */
  var nav = $("[data-nav]");
  var hero = $("[data-hero]");
  if (nav && hero && hasIO) {
    var navH = nav.offsetHeight;
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("is-solid", !entries[0].isIntersecting);
    }, { rootMargin: "-" + navH + "px 0px -" + Math.max(0, window.innerHeight - navH - 2) + "px 0px" }).observe(hero);
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
    heroTimer = setTimeout(tickHero, heroStep === heroSteps.length - 1 ? 3200 : 1500);
  }
  if (hero && heroSteps.length && !reduced) {
    onVisible(hero, function (visible) {
      clearTimeout(heroTimer);
      if (visible && !document.hidden) heroTimer = setTimeout(tickHero, 1500);
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
    var DUR = [5200, 5200, 5600];
    var idx = 0, timer = null, startedAt = 0, remaining = DUR[0], inView = false, paused = reduced;

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

    if (reduced) {
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
  if (reduced || !hasIO) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
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
