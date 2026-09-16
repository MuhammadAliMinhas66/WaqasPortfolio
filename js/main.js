/* =========================================================
   WAQAS BIN SHARAFAT — PORTFOLIO INTERACTIONS
   Vanilla JS + GSAP/ScrollTrigger. No build step required.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     TRANSMISSION — no backend inbox exists yet, so this copies
     the visitor's message to their clipboard and opens LinkedIn,
     rather than pretending to send an email that goes nowhere.
     --------------------------------------------------------- */
  var transmissionBtn = document.querySelector("[data-transmission-send]");
  var transmissionInput = document.querySelector("[data-transmission-input]");
  if (transmissionBtn && transmissionInput) {
    transmissionBtn.addEventListener("click", function () {
      var text = transmissionInput.value.trim();
      var originalLabel = transmissionBtn.textContent;
      var finish = function (label) {
        transmissionBtn.textContent = label;
        window.setTimeout(function () { transmissionBtn.textContent = originalLabel; }, 2200);
        window.open("https://www.linkedin.com/in/waqassharafat2674/", "_blank", "noopener");
      };
      if (!text) { finish("Opening LinkedIn →"); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          finish("Copied ✓ opening LinkedIn →");
        }).catch(function () {
          finish("Opening LinkedIn →");
        });
      } else {
        finish("Opening LinkedIn →");
      }
    });
  }

  /* ---------------------------------------------------------
     ASK MY ASSISTANT — a small, honest keyword-matching Q&A.
     No external API: every answer below is a real fact about
     Waqas (projects, tools, experience, availability), matched
     against whatever the visitor types by scanning for the
     keywords tied to each answer. First match wins, most
     specific intents are listed first so they don't get
     shadowed by broader ones (e.g. "best project" before the
     general "project" catch-all).
     --------------------------------------------------------- */
  var aiForm = document.querySelector("[data-ai-form]");
  var aiLog = document.querySelector("[data-ai-log]");
  var aiInput = document.querySelector("[data-ai-input]");
  var aiSuggestions = document.querySelector("[data-ai-suggestions]");

  if (aiForm && aiLog && aiInput) {
    var aiIntents = [
      {
        keywords: ["best project", "favorite project", "favourite project", "top project", "proudest"],
        answer: "The one I'd point to is the 3PL logistics dashboard — SLA compliance and late-delivery tracking by courier and district. It's closest to the operational reporting work I actually do day to day at Daewoo FastEx."
      },
      {
        keywords: ["technology", "technologies", "tech stack", "tools", "stack", "skills", "use"],
        answer: "Power BI (DAX, Power Query, data modeling, row-level security), SQL (ETL, performance tuning), Python (pandas, NumPy, scikit-learn), and Excel (Power Query, PivotTables). KPI design and operational/logistics reporting sit on top of all of it."
      },
      {
        keywords: ["experience", "work history", "career", "background", "job"],
        answer: "Currently a Data Analyst at Daewoo FastEx (Oct 2025–present), doing logistics and operational reporting. Before that, a year of freelance data analytics work (Jan–Dec 2025) across Excel, Power BI, Google Sheets, SQL and Python."
      },
      {
        keywords: ["available", "freelance", "hire", "hiring", "contract", "open to work"],
        answer: "Yes — open to freelance work alongside the full-time role. Best way to reach him is LinkedIn (linked in the Contact section below)."
      },
      {
        keywords: ["education", "degree", "university", "comsats", "study", "studied"],
        answer: "BSCS (Computer Science) from COMSATS University Islamabad, 2020–2024."
      },
      {
        keywords: ["certification", "certificate", "certified", "udemy", "cisco"],
        answer: "Two named on his LinkedIn: \"Analyzing and Visualizing Data with Microsoft Power BI\" (Udemy) and \"Data Analytics Essentials\" (Cisco)."
      },
      {
        keywords: ["contact", "email", "reach", "linkedin", "connect"],
        answer: "The Contact section at the bottom of this page links straight to his LinkedIn — that's the fastest way to reach him."
      },
      {
        keywords: ["where", "location", "based", "live", "from"],
        answer: "Originally from Attock, Pakistan — currently based in Lahore."
      },
      {
        keywords: ["project", "projects", "work", "portfolio", "dashboard"],
        answer: "Six featured builds in Selected Work (logistics, retail, hospital operations, product, public data, content) plus eight smaller practice dashboards in the Lab section — 14 in total, scroll up to browse them."
      }
    ];

    var aiFallback = "I don't have a specific answer for that from this page's content — try asking about his projects, tools, experience, education, or availability, or check the Contact section to ask him directly.";

    var aiAnswer = function (question) {
      var q = question.toLowerCase();
      for (var i = 0; i < aiIntents.length; i++) {
        var kws = aiIntents[i].keywords;
        for (var j = 0; j < kws.length; j++) {
          if (q.indexOf(kws[j]) !== -1) return aiIntents[i].answer;
        }
      }
      return aiFallback;
    };

    var aiAppend = function (role, text) {
      var msg = document.createElement("div");
      msg.className = "ai-msg " + (role === "user" ? "ai-msg--user" : "ai-msg--bot");
      var roleLabel = document.createElement("span");
      roleLabel.className = "ai-msg-role";
      roleLabel.textContent = role === "user" ? "You" : "Assistant";
      var p = document.createElement("p");
      p.textContent = text;
      msg.appendChild(roleLabel);
      msg.appendChild(p);
      aiLog.appendChild(msg);
      aiLog.scrollTop = aiLog.scrollHeight;
    };

    var aiAsk = function (question) {
      question = question.trim();
      if (!question) return;
      aiAppend("user", question);
      // tiny delay so the reply doesn't feel instant/robotic
      window.setTimeout(function () { aiAppend("bot", aiAnswer(question)); }, 260);
    };

    aiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      aiAsk(aiInput.value);
      aiInput.value = "";
      aiInput.focus();
    });

    if (aiSuggestions) {
      aiSuggestions.addEventListener("click", function (e) {
        var chip = e.target.closest(".ai-chip");
        if (!chip) return;
        aiAsk(chip.textContent);
      });
    }
  }

  /* ---------------------------------------------------------
     DIGITAL ME AVATAR — subtle cursor-reactive tilt
     --------------------------------------------------------- */
  var tiltEl = document.querySelector("[data-tilt]");
  if (tiltEl && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var tiltInner = tiltEl.querySelector(".profile-avatar-inner");
    tiltEl.addEventListener("mousemove", function (e) {
      var r = tiltEl.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tiltInner.style.transform = "rotateY(" + (px * 24) + "deg) rotateX(" + (py * -24) + "deg)";
    });
    tiltEl.addEventListener("mouseleave", function () {
      tiltInner.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }
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
     PRELOADER + HERO REVEAL TIMING
     Locks scroll, plays a short letter-reveal + progress bar,
     then wipes away and only THEN fires the hero's word-split
     reveal — so the big headline lands the instant the curtain
     clears instead of animating underneath it.
     --------------------------------------------------------- */
  var preloader = document.querySelector("[data-preloader]");
  var preloaderFill = document.querySelector("[data-preloader-fill]");
  var preloaderLetters = document.querySelectorAll(".preloader-letter");
  var heroSplitWords = [];

  function playHeroSplit() {
    if (window.gsap && heroSplitWords.length && !reduceMotion) {
      gsap.to(heroSplitWords, {
        yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.035
      });
    } else if (heroSplitWords.length) {
      gsap.set ? gsap.set(heroSplitWords, { yPercent: 0, opacity: 1 }) : null;
    }
  }

  function finishPreload() {
    document.documentElement.classList.remove("is-preloading");
    if (preloader) preloader.classList.add("is-done");
    playHeroSplit();
  }

  if (preloader && window.gsap && !reduceMotion) {
    document.documentElement.classList.add("is-preloading");
    gsap.set(preloaderLetters, { yPercent: 110 });
    gsap.timeline({ onComplete: finishPreload })
      .to(preloaderLetters, { yPercent: 0, duration: 0.55, ease: "power4.out", stagger: 0.06 })
      .to(preloaderFill, { width: "100%", duration: 0.8, ease: "power2.inOut" }, "-=0.15")
      .to(preloader, { yPercent: -100, duration: 0.65, ease: "power4.inOut" }, "+=0.1");
  } else if (preloader) {
    preloader.style.display = "none";
  }

  /* ---------------------------------------------------------
     SPLIT TEXT — wraps each word of a [data-split] element in
     its own span so it can animate independently. Nested inline
     elements (like the accent-colored word) are kept intact as
     a single animated unit rather than split further, so their
     styling survives. Only runs with GSAP available; without it,
     headings are left as plain text and handled by the ordinary
     fade-reveal fallback below.
     --------------------------------------------------------- */
  function splitIntoWords(el) {
    var words = [];
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (part.trim() === "") {
            frag.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement("span");
            span.className = "split-word";
            span.textContent = part;
            frag.appendChild(span);
            words.push(span);
          }
        });
      } else if (node.nodeType === 1) {
        var wrap = document.createElement("span");
        wrap.className = "split-word";
        wrap.appendChild(node.cloneNode(true));
        frag.appendChild(wrap);
        words.push(wrap);
      }
    });
    el.innerHTML = "";
    el.appendChild(frag);
    return words;
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL — GSAP-powered when available (staggered
     fade + rise, batched so elements entering together animate
     as one cascade rather than each firing independently), with
     a plain IntersectionObserver fallback if the GSAP CDN fails.
     [data-split] elements are excluded from this plain batch
     when GSAP is available — they get the word-split treatment
     instead, set up right below.
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var splitEls = document.querySelectorAll("[data-split]");
  var hasGsapReveal = window.gsap && window.ScrollTrigger;

  if (hasGsapReveal && revealEls.length) {
    gsap.registerPlugin(ScrollTrigger);
    var batchEls = Array.prototype.slice.call(revealEls).filter(function (el) {
      return !el.hasAttribute("data-split");
    });

    if (reduceMotion) {
      gsap.set(revealEls, { opacity: 1, y: 0 });
    } else {
      if (batchEls.length) {
        gsap.set(batchEls, { opacity: 0, y: 30 });
        ScrollTrigger.batch(batchEls, {
          start: "top 90%",
          once: true,
          onEnter: function (batch) {
            gsap.to(batch, {
              opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, overwrite: true
            });
          }
        });
      }

      splitEls.forEach(function (el) {
        var words = splitIntoWords(el);
        gsap.set(words, { yPercent: 110, opacity: 0 });
        if (el.dataset.split === "hero") {
          heroSplitWords = heroSplitWords.concat(words);
        } else {
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: function () {
              gsap.to(words, { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.035 });
            }
          });
        }
      });

      // no preloader running (or reduced motion) — reveal the hero words now
      if (!preloader || reduceMotion) playHeroSplit();
    }
  } else if (revealEls.length) {
    if ("IntersectionObserver" in window) {
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
  }

  /* ---------------------------------------------------------
     STEP PANELS — "Raw data isn't the product" section.
     Above 900px: pins the section and scrubs the track
     horizontally as the page scrolls vertically, with each
     panel individually scaling/fading in as it crosses the
     viewport (the standard GSAP "horizontal panels inside a
     pinned scrub" pattern, using containerAnimation so each
     panel's own ScrollTrigger reads progress from the master
     horizontal tween instead of the page's vertical scroll).
     Below 900px: a plain swipeable row (see matching CSS),
     since pin-scrub tends to feel broken on small touch screens.
     --------------------------------------------------------- */
  var stepsPin = document.querySelector("[data-steps-pin]");
  var stepsTrack = document.querySelector("[data-steps-track]");
  if (stepsPin && stepsTrack) {
    var stepPanels = Array.prototype.slice.call(stepsTrack.querySelectorAll("[data-step-panel]"));

    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
      gsap.registerPlugin(ScrollTrigger);
      var stepsMM = gsap.matchMedia();

      stepsMM.add("(min-width: 900px)", function () {
        var getScrollDistance = function () {
          return Math.max(0, stepsTrack.scrollWidth - stepsPin.clientWidth);
        };
        var master = gsap.to(stepsTrack, {
          x: function () { return -getScrollDistance(); },
          ease: "none",
          scrollTrigger: {
            trigger: stepsPin,
            start: "top top",
            end: function () { return "+=" + getScrollDistance(); },
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        var panelTriggers = stepPanels.map(function (panel) {
          gsap.set(panel, { scale: 0.9, opacity: 0.4 });
          gsap.set(panel.querySelector(".step-bar"), { scaleX: 0 });
          gsap.to(panel, {
            scale: 1, opacity: 1, ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: master,
              start: "left 78%",
              end: "left 38%",
              scrub: true
            }
          });
          return gsap.to(panel.querySelector(".step-bar"), {
            scaleX: 1, ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: master,
              start: "left 70%",
              end: "left 42%",
              scrub: true
            }
          });
        });

        return function () {
          master.scrollTrigger && master.scrollTrigger.kill();
          master.kill();
          panelTriggers.forEach(function (t) { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
        };
      });

      // idea-loop decoration plays only while the section is on screen
      var ideaSection = document.getElementById("idea");
      if (ideaSection && "IntersectionObserver" in window) {
        var ideaIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            ideaSection.classList.toggle("is-in-view", entry.isIntersecting);
          });
        }, { threshold: 0.25 });
        ideaIO.observe(ideaSection);
      }
    } else {
      // no GSAP / reduced motion: everything just shown, plain swipeable row
      gsap && gsap.set ? gsap.set(stepPanels, { opacity: 1, scale: 1 }) : null;
      document.getElementById("idea") && document.getElementById("idea").classList.add("is-in-view");
    }

    attachWheelToHorizontal(stepsTrack);
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
     MAGNETIC BUTTONS — primary/secondary CTAs pull gently
     toward the cursor within their bounds, snapping back on
     leave, with a snappy press-down on click. GSAP quickTo
     gives the pull a springy, damped feel.
     --------------------------------------------------------- */
  if (window.gsap && !isCoarsePointer && !reduceMotion) {
    document.querySelectorAll(".btn-primary, .btn-secondary, .slider-btn").forEach(function (btn) {
      var moveX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      var moveY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      var moveS = gsap.quickTo(btn, "scale", { duration: 0.25, ease: "power3" });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        moveX((e.clientX - r.left - r.width / 2) * 0.3);
        moveY((e.clientY - r.top - r.height / 2) * 0.3);
      });
      btn.addEventListener("mouseleave", function () { moveX(0); moveY(0); moveS(1); });
      btn.addEventListener("mousedown", function () { moveS(0.92); });
      btn.addEventListener("mouseup", function () { moveS(1); });
    });
  }

  /* ---------------------------------------------------------
     HERO MOTION GRAPHICS — two soft blurred blobs drift in a
     slow infinite loop, and a spotlight glow follows the cursor
     around the hero for depth. Desktop only (see CSS media
     query hiding .hero-motion on small screens).
     --------------------------------------------------------- */
  var heroMotion = document.querySelector("[data-hero-motion]");
  if (heroMotion && window.gsap && !reduceMotion && !isCoarsePointer) {
    gsap.to(".hero-blob--a", {
      x: 40, y: 30, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1
    });
    gsap.to(".hero-blob--b", {
      x: -50, y: 24, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.6
    });

    var spotlight = document.querySelector("[data-hero-spotlight]");
    if (spotlight) {
      var heroSection = document.getElementById("hero");
      var moveSpotX = gsap.quickTo(spotlight, "x", { duration: 0.6, ease: "power2" });
      var moveSpotY = gsap.quickTo(spotlight, "y", { duration: 0.6, ease: "power2" });
      heroSection.addEventListener("mousemove", function (e) {
        var r = heroSection.getBoundingClientRect();
        moveSpotX(e.clientX - r.left);
        moveSpotY(e.clientY - r.top);
        spotlight.style.opacity = 1;
      });
      heroSection.addEventListener("mouseleave", function () { spotlight.style.opacity = 0; });
    }
  }

  /* ---------------------------------------------------------
     CARD TILT — a light 3D tilt following the cursor, applied
     to work/lab thumbnails and the step panels. Same technique
     as the Digital Me avatar, generalized to a reusable helper.
     --------------------------------------------------------- */
  function enableTilt(el, strength) {
    strength = strength || 10;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(700px) rotateY(" + (px * strength) + "deg) rotateX(" + (py * -strength) + "deg)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg)";
    });
  }
  if (!isCoarsePointer && !reduceMotion) {
    document.querySelectorAll(".work-frame").forEach(function (el) { enableTilt(el, 6); });
    document.querySelectorAll(".step-panel").forEach(function (el) { enableTilt(el, 4); });
  }

  /* ---------------------------------------------------------
     STEP WATERMARK PARALLAX — the big outlined number inside
     each pinned step panel drifts slightly opposite the panel's
     own motion as it crosses the screen, for a bit of depth.
     --------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    var watermarkMM = gsap.matchMedia();
    watermarkMM.add("(min-width: 900px)", function () {
      var watermarkTweens = [];
      document.querySelectorAll(".step-panel").forEach(function (panel) {
        var mark = panel.querySelector(".step-watermark");
        if (!mark) return;
        // reuse the same containerAnimation as the panel itself by
        // finding the pin ScrollTrigger already driving stepsTrack
        var pinTrigger = ScrollTrigger.getAll().find(function (st) {
          return st.vars && st.trigger === document.querySelector("[data-steps-pin]");
        });
        if (!pinTrigger) return;
        var tween = gsap.fromTo(mark, { xPercent: 6 }, {
          xPercent: -6, ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: pinTrigger.animation,
            start: "left right",
            end: "right left",
            scrub: true
          }
        });
        watermarkTweens.push(tween);
      });
      return function () { watermarkTweens.forEach(function (t) { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); }); };
    });
  }

  /* ---------------------------------------------------------
     PROOF COUNTERS — count up from 0 once scrolled into view.
     --------------------------------------------------------- */
  var proofNums = document.querySelectorAll(".proof-num");
  if (proofNums.length) {
    proofNums.forEach(function (el) {
      var raw = el.textContent.trim();
      var suffix = raw.replace(/^[0-9.]+/, "");
      var target = parseFloat(raw);
      if (isNaN(target)) return;

      var run = function () {
        if (window.gsap && !reduceMotion) {
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: function () {
              var decimals = (String(target).split(".")[1] || "").length;
              el.textContent = obj.val.toFixed(decimals) + suffix;
            }
          });
        } else {
          el.textContent = raw;
        }
      };

      if ("IntersectionObserver" in window) {
        var counterIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { run(); counterIO.unobserve(el); }
          });
        }, { threshold: 0.6 });
        counterIO.observe(el);
      } else {
        run();
      }
    });
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
