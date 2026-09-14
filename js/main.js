/* =========================================================
   WAQAS BIN SHARAFAT — PORTFOLIO INTERACTIONS
   Vanilla JS + GSAP/ScrollTrigger. No build step required.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  document.documentElement.classList.add("reveal-ready");

  /* ---------------------------------------------------------
     HEADER SCROLL STATE
     --------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuToggle && mobileMenu) {
    var closeMenu = function () {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("data-open", "false");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        if (mobileMenu.getAttribute("data-open") === "false") {
          mobileMenu.hidden = true;
        }
      }, 500);
    };
    var openMenu = function () {
      mobileMenu.hidden = false;
      requestAnimationFrame(function () {
        menuToggle.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("data-open", "true");
        document.body.style.overflow = "hidden";
      });
    };
    menuToggle.addEventListener("click", function () {
      var expanded = menuToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
     --------------------------------------------------------- */
  if (!isCoarsePointer) {
    document.body.classList.add("has-custom-cursor");
    var dot = document.querySelector(".cursor-dot");
    var label = document.querySelector(".cursor-label");
    var labelSpan = label ? label.querySelector("span") : null;
    var mx = -100, my = -100, lx = -100, ly = -100;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = "1";
      label.style.opacity = label.classList.contains("is-active") ? "1" : "0";
    });

    (function raf() {
      lx += (mx - lx) * 0.18;
      ly += (my - ly) * 0.18;
      if (dot) dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      if (label) label.style.transform = "translate(" + lx + "px," + ly + "px)";
      requestAnimationFrame(raf);
    })();

    document.querySelectorAll("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        dot.classList.add("is-hovering");
        if (labelSpan) labelSpan.textContent = el.getAttribute("data-cursor");
        label.classList.add("is-active");
      });
      el.addEventListener("mouseleave", function () {
        dot.classList.remove("is-hovering");
        label.classList.remove("is-active");
      });
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            window.setTimeout(function () {
              el.classList.add("is-visible");
            }, (i % 6) * 70);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     IDEA LIFECYCLE — active stage on horizontal scroll
     --------------------------------------------------------- */
  var ideaTrack = document.querySelector("[data-idea-track]");
  if (ideaTrack) {
    var stages = ideaTrack.querySelectorAll("[data-idea-stage]");
    var updateActiveStage = function () {
      var trackRect = ideaTrack.getBoundingClientRect();
      var center = trackRect.left + trackRect.width * 0.32;
      var closest = null, closestDist = Infinity;
      stages.forEach(function (stage) {
        var r = stage.getBoundingClientRect();
        var stageCenter = r.left + r.width / 2;
        var dist = Math.abs(stageCenter - center);
        if (dist < closestDist) { closestDist = dist; closest = stage; }
      });
      stages.forEach(function (stage) {
        stage.classList.toggle("is-active", stage === closest);
      });
    };
    updateActiveStage();
    var ideaTicking = false;
    ideaTrack.addEventListener("scroll", function () {
      if (!ideaTicking) {
        requestAnimationFrame(function () { updateActiveStage(); ideaTicking = false; });
        ideaTicking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateActiveStage);

    // let vertical wheel input drive horizontal scroll, but fall through
    // to normal page scroll once the track has reached either end
    attachWheelToHorizontal(ideaTrack);
  }

  function attachWheelToHorizontal(el) {
    el.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var atStart = el.scrollLeft <= 0;
      var atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }

  /* ---------------------------------------------------------
     CAPABILITIES — tap to open on touch devices
     --------------------------------------------------------- */
  var stackRows = document.querySelectorAll("[data-stack-row]");
  if (isCoarsePointer && stackRows.length) {
    stackRows.forEach(function (row) {
      row.addEventListener("click", function () {
        var wasOpen = row.classList.contains("is-open");
        stackRows.forEach(function (r) { r.classList.remove("is-open"); });
        if (!wasOpen) row.classList.add("is-open");
      });
    });
  }

  /* ---------------------------------------------------------
     WORK SLIDER — single-line, arrow + swipe navigation
     --------------------------------------------------------- */
  var slider = document.querySelector("[data-slider]");
  var sliderTrack = document.querySelector("[data-slider-track]");
  if (slider && sliderTrack) {
    var slides = Array.prototype.slice.call(sliderTrack.querySelectorAll(".work-item"));
    var prevBtn = document.querySelector("[data-slider-prev]");
    var nextBtn = document.querySelector("[data-slider-next]");
    var currentEl = document.querySelector("[data-slider-current]");
    var totalEl = document.querySelector("[data-slider-total]");
    var progressEl = document.querySelector("[data-slider-progress]");

    if (totalEl) totalEl.textContent = String(slides.length).padStart(2, "0");

    var slideStep = function () {
      var first = slides[0];
      var gap = parseFloat(getComputedStyle(sliderTrack).columnGap || getComputedStyle(sliderTrack).gap || "24");
      return first.getBoundingClientRect().width + gap;
    };

    var currentIndex = function () {
      var step = slideStep();
      return Math.round(sliderTrack.scrollLeft / step);
    };

    var updateSliderUI = function () {
      var idx = Math.max(0, Math.min(slides.length - 1, currentIndex()));
      if (currentEl) currentEl.textContent = String(idx + 1).padStart(2, "0");
      if (progressEl) {
        progressEl.style.width = (100 / slides.length) + "%";
        progressEl.style.transform = "translateX(" + idx * 100 + "%)";
      }
      var atStart = sliderTrack.scrollLeft <= 4;
      var atEnd = sliderTrack.scrollLeft + sliderTrack.clientWidth >= sliderTrack.scrollWidth - 4;
      if (prevBtn) prevBtn.disabled = atStart;
      if (nextBtn) nextBtn.disabled = atEnd;
    };

    var goTo = function (idx) {
      idx = Math.max(0, Math.min(slides.length - 1, idx));
      sliderTrack.scrollTo({ left: idx * slideStep(), behavior: reduceMotion ? "auto" : "smooth" });
    };

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(currentIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(currentIndex() + 1); });

    var sliderTicking = false;
    sliderTrack.addEventListener("scroll", function () {
      if (!sliderTicking) {
        requestAnimationFrame(function () { updateSliderUI(); sliderTicking = false; });
        sliderTicking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", updateSliderUI);
    updateSliderUI();
    attachWheelToHorizontal(sliderTrack);
  }

  /* ---------------------------------------------------------
     LIGHTBOX — click a project to open it full size
     --------------------------------------------------------- */
  var lightbox = document.querySelector("[data-lightbox]");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-slide-trigger]"));
  if (lightbox && triggers.length) {
    var lbImg = lightbox.querySelector("[data-lightbox-img]");
    var lbTag = lightbox.querySelector("[data-lightbox-tag]");
    var lbTitle = lightbox.querySelector("[data-lightbox-title]");
    var lbDesc = lightbox.querySelector("[data-lightbox-desc]");
    var lbCurrent = lightbox.querySelector("[data-lightbox-current]");
    var lbTotal = lightbox.querySelector("[data-lightbox-total]");
    var lbClose = lightbox.querySelector("[data-lightbox-close]");
    var lbPrev = lightbox.querySelector("[data-lightbox-prev]");
    var lbNext = lightbox.querySelector("[data-lightbox-next]");
    var lbBackdrop = lightbox.querySelector("[data-lightbox-backdrop]");

    var activeIndex = 0;
    var lastFocused = null;
    if (lbTotal) lbTotal.textContent = String(triggers.length).padStart(2, "0");

    var renderSlide = function (i) {
      var t = triggers[i];
      if (lbImg) {
        lbImg.src = t.getAttribute("data-full");
        lbImg.alt = t.getAttribute("data-title") || "";
      }
      if (lbTag) lbTag.textContent = t.getAttribute("data-tag") || "";
      if (lbTitle) lbTitle.textContent = t.getAttribute("data-title") || "";
      if (lbDesc) lbDesc.textContent = t.getAttribute("data-desc") || "";
      if (lbCurrent) lbCurrent.textContent = String(i + 1).padStart(2, "0");
    };

    var openLightbox = function (i) {
      activeIndex = i;
      lastFocused = document.activeElement;
      renderSlide(activeIndex);
      lightbox.setAttribute("data-open", "true");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lbClose) lbClose.focus();
    };

    var closeLightbox = function () {
      lightbox.setAttribute("data-open", "false");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };

    var showNext = function () { renderSlide((activeIndex = (activeIndex + 1) % triggers.length)); };
    var showPrev = function () { renderSlide((activeIndex = (activeIndex - 1 + triggers.length) % triggers.length)); };

    triggers.forEach(function (t, i) {
      t.addEventListener("click", function () { openLightbox(i); });
    });
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener("click", closeLightbox);
    if (lbNext) lbNext.addEventListener("click", showNext);
    if (lbPrev) lbPrev.addEventListener("click", showPrev);

    document.addEventListener("keydown", function (e) {
      if (lightbox.getAttribute("data-open") !== "true") return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }

  /* ---------------------------------------------------------
     GSAP SCROLLTRIGGER — section entrances + analytical loop
     --------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero headline lines rise in on load
    gsap.set(".hero-headline .line", { clearProps: "none" });

    // Stack rows: gentle stagger in
    gsap.utils.toArray(".stack-row").forEach(function (row, i) {
      gsap.from(row, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 90%" }
      });
    });

    // Timeline items
    gsap.utils.toArray("[data-timeline-item]").forEach(function (item) {
      gsap.from(item, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 88%" }
      });
    });

    // Work strip items
    gsap.utils.toArray(".work-item").forEach(function (item, i) {
      gsap.from(item, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: (i % 3) * 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 92%" }
      });
    });

    /* ---------- THE ANALYTICAL LOOP (signature pinned scroll) ---------- */
    var loopSection = document.querySelector(".loop");
    var loopPin = document.querySelector("[data-loop-pin]");
    var loopItems = gsap.utils.toArray("[data-loop-item]");
    var loopNoise = document.querySelector("[data-loop-noise]");

    if (loopSection && loopPin && loopItems.length) {
      // scatter faux "raw data" tokens representing noise/mess
      var tokens = ["NULL", "0.837", "#REF!", "12,004", "TRUE", "undefined",
        "row_442", "??", "0", "NaN", "duplicate", "2025-13-01", "N/A", "999999"];
      var tSeed = 7;
      function trand() { tSeed = (tSeed * 9301 + 49297) % 233280; return tSeed / 233280; }
      tokens.forEach(function (t) {
        var span = document.createElement("span");
        span.textContent = t;
        span.style.position = "absolute";
        span.style.left = (trand() * 92).toFixed(1) + "%";
        span.style.top = (trand() * 92).toFixed(1) + "%";
        span.style.transform = "rotate(" + (trand() * 16 - 8).toFixed(1) + "deg)";
        loopNoise.appendChild(span);
      });

      ScrollTrigger.create({
        trigger: loopSection,
        start: "top top",
        end: "+=180%",
        pin: loopPin,
        scrub: 0.6,
        onUpdate: function (self) {
          var p = self.progress;
          var activeCount = Math.min(
            loopItems.length,
            Math.floor(p * (loopItems.length + 0.001)) + (p > 0 ? 1 : 0)
          );
          loopItems.forEach(function (li, i) {
            li.classList.toggle("is-active", i < activeCount);
          });
          gsap.set(loopNoise, { opacity: Math.max(0, 1 - p * 2.2) });
        }
      });
    }
  } else {
    // reduced motion / no GSAP fallback: mark everything visible & active
    document.querySelectorAll("[data-loop-item]").forEach(function (li) {
      li.classList.add("is-active");
    });
  }

  /* ---------------------------------------------------------
     REFRESH SCROLLTRIGGER AFTER FONTS/IMAGES SETTLE
     --------------------------------------------------------- */
  window.addEventListener("load", function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
})();
