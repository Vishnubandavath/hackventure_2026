/**
 * ============================================================================
 * HACKVENTURE 2026 — CLIENT SCRIPTS
 * Modern, Minimal, Professional Interactions & Accessibility
 * Mizoram Police × National Institute of Technology Mizoram
 * ============================================================================
 */

(function () {
  'use strict';

  // Configurable settings
  const REGISTRATION_URL = "https://forms.gle/o8KeSzMFzz78hfyt7"; // Official Google Form registration link
  const EVENT_START_DATE = new Date("2026-10-28T09:00:00+05:30").getTime();

  function initApp() {
    /* --------------------------------------------------------------------------
       1. MOBILE MENU TOGGLE
       -------------------------------------------------------------------------- */
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
      function toggleMenu() {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      function closeMenu() {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }

      navToggle.addEventListener("click", toggleMenu);

      navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      // Close menu on resize > 1024px
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024 && navMenu.classList.contains("open")) {
          closeMenu();
        }
      });

      // Close on outside click
      document.addEventListener("click", (e) => {
        const navbar = document.getElementById("navbar");
        if (navMenu.classList.contains("open") && navbar && !navbar.contains(e.target)) {
          closeMenu();
        }
      });

      // Close on Escape key press
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMenu.classList.contains("open")) {
          closeMenu();
        }
      });
    }

    /* --------------------------------------------------------------------------
       2. ACTIVE NAVIGATION HIGHLIGHT & NAVBAR SHADOW ON SCROLL
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll("main section[id]");
    const navbarEl = document.getElementById("navbar");

    function updateActiveLink() {
      if (navbarEl) {
        if (window.scrollY > 20) {
          navbarEl.classList.add("scrolled");
        } else {
          navbarEl.classList.remove("scrolled");
        }
      }

      if (!navLinks || !navLinks.length) return;
      const scrollPos = window.scrollY + 140;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });

    /* --------------------------------------------------------------------------
       3. ENHANCED COUNTDOWN TIMER & STAGGERED ENTRANCE
       -------------------------------------------------------------------------- */
    const cdDays = document.getElementById("cd-days");
    const cdHours = document.getElementById("cd-hours");
    const cdMinutes = document.getElementById("cd-minutes");
    const cdSeconds = document.getElementById("cd-seconds");
    const cdTimer = document.getElementById("countdown-timer");
    const cdLive = document.getElementById("countdown-live");
    const cdSection = document.getElementById("countdown");

    function padZero(num) {
      return num < 10 ? `0${num}` : `${num}`;
    }

    function updateNum(el, valStr) {
      if (!el) return;
      if (el.textContent !== valStr) {
        el.textContent = valStr;
        el.classList.remove("cd-num-tick");
        void el.offsetWidth; // Force reflow for animation restart
        el.classList.add("cd-num-tick");
      }
    }

    function updateCountdown() {
      const now = Date.now();
      const diff = EVENT_START_DATE - now;

      if (diff <= 0) {
        if (cdTimer) cdTimer.style.display = "none";
        if (cdLive) cdLive.style.display = "block";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      updateNum(cdDays, padZero(days));
      updateNum(cdHours, padZero(hours));
      updateNum(cdMinutes, padZero(minutes));
      updateNum(cdSeconds, padZero(seconds));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Staggered entrance observer for countdown section
    if (cdSection) {
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              cdSection.classList.add("countdown-in-view");
              observer.unobserve(cdSection);
            }
          });
        }, { threshold: 0.15 });
        observer.observe(cdSection);
      } else {
        cdSection.classList.add("countdown-in-view");
      }
    }

    /* --------------------------------------------------------------------------
       4. FAQ ACCORDION
       -------------------------------------------------------------------------- */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const btn = item.querySelector(".faq-btn");
      if (!btn) return;

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close other items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            const otherBtn = other.querySelector(".faq-btn");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove("active");
          btn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    /* --------------------------------------------------------------------------
       5. REGISTRATION MODAL
       -------------------------------------------------------------------------- */
    const modal = document.getElementById("registration-modal");
    const modalClose = document.getElementById("modal-close");
    const modalAckBtn = document.getElementById("modal-ack-btn");
    const registerTriggers = document.querySelectorAll(".register-trigger");

    function openModal() {
      if (!modal) return;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    registerTriggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Close mobile nav menu if open
        const navMenu = document.getElementById("nav-menu");
        const navToggle = document.getElementById("nav-toggle");
        if (navMenu && navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          if (navToggle) {
            navToggle.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
          }
        }

        if (REGISTRATION_URL && REGISTRATION_URL !== "#") {
          window.open(REGISTRATION_URL, "_blank", "noopener,noreferrer");
          e.preventDefault();
        } else {
          e.preventDefault();
          openModal();
        }
      });
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalAckBtn) modalAckBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.classList.contains("open")) {
        closeModal();
      }
    });

    /* --------------------------------------------------------------------------
       5A. PROBLEM STATEMENTS ACCORDION
       -------------------------------------------------------------------------- */
    const problemAccordionCards = document.querySelectorAll(".problem-accordion-card");

    problemAccordionCards.forEach((card) => {
      const header = card.querySelector(".problem-accordion-header");
      if (!header) return;

      header.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = card.classList.contains("open");
        if (isOpen) {
          card.classList.remove("open");
          header.setAttribute("aria-expanded", "false");
        } else {
          card.classList.add("open");
          header.setAttribute("aria-expanded", "true");
        }
      });

      // If card is collapsed, clicking anywhere on the card expands it
      card.addEventListener("click", () => {
        if (!card.classList.contains("open")) {
          card.classList.add("open");
          header.setAttribute("aria-expanded", "true");
        }
      });
    });

    /* --------------------------------------------------------------------------
       5B. PROBLEM STATEMENTS MODAL & INTERACTIONS
       -------------------------------------------------------------------------- */
    const PROBLEM_STATEMENTS_DATA = {
      "01": {
        num: "01",
        badge: "PROBLEM 01 • SMART POLICING",
        title: "Automated Check Gate Monitoring System",
        goal: "Develop a data-capturing and analytics system for monitoring vehicles entering and leaving police check gates.",
        requirements: [
          "Digitally record vehicles entering and exiting using ANPR or another suitable method.",
          "Acquire and verify vehicle registration details against the VAHAN database.",
          "Acquire and verify driver details against the SARTHI database.",
          "Generate real-time alerts for suspicious vehicles, including stolen vehicles, vehicles linked to drug trafficking, hit-and-run cases, and other flagged vehicles.",
          "Record and update the action taken when a suspicious vehicle is intercepted.",
          "Generate analytics showing vehicle movement patterns at check gates.",
          "Capture information as quickly as possible to reduce traffic congestion at check gates."
        ],
        techTags: ["ANPR", "VAHAN", "SARTHI", "Real-Time Alerts", "Analytics"]
      },
      "02": {
        num: "02",
        badge: "PROBLEM 02 • SMART POLICING",
        title: "Chatbot for Mizoram Police",
        goal: "Develop an intelligent chatbot to improve police operational efficiency, communication, public engagement, and secure information sharing.",
        requirements: [
          "Provide public interaction and timely assistance.",
          "Allow citizens to securely share information anonymously while protecting their identity and safety.",
          "Support bilingual communication: Mizo — Default, English — Optional.",
          "Provide role-based access for authorized police users.",
          "Generate a pop-up alert for a predefined authorized person when sensitive information is submitted.",
          "Design the application so additional features can be added in the future."
        ],
        hierarchy: {
          title: "Access Hierarchy",
          steps: ["District Level", "Range Level", "State Level"]
        },
        techTags: ["Chatbot", "NLP", "Mizo", "English", "Role-Based Access"]
      },
      "03": {
        num: "03",
        badge: "PROBLEM 03 • SMART POLICING",
        title: "Social Media Monitoring Tool",
        goal: "Develop a Social Media Monitoring tool for law-enforcement agencies to monitor and analyze social-media activity related to cybercrime and other threats.",
        requirements: [
          "Keyword-based search supporting: AND, OR, NOT (Boolean Search).",
          "Support phrase searching.",
          "Allow collected mentions to be filtered, grouped, marked, and deleted.",
          "Support filtering and grouping based on factors such as geography and language.",
          "Analyze: Volume, Engagement, Reach, Sentiment, Influence.",
          "Use sentiment analysis and daily mention monitoring to help detect potential crisis situations.",
          "Measure the volume of specific types of content.",
          "Analyze opinions and beliefs expressed in social-media content.",
          "Support: English, Mizo."
        ],
        techTags: ["NLP", "Sentiment Analysis", "Boolean Search", "Social Analytics", "Multilingual"]
      },
      "04": {
        num: "04",
        badge: "PROBLEM 04 • SMART POLICING",
        title: "App for Police Crime Report",
        goal: "Build a mobile and web application to make police crime reporting completely paperless.",
        reportsToDigitize: [
          "PS Daily Report",
          "Arrested Persons Report"
        ],
        requirements: [
          "Allow reports to be entered digitally or uploaded at the Police Station level.",
          "Monitor reporting deadlines and flag non-compliance when reports are not submitted within the specified time.",
          "Generate: Daily Reports, Weekly Reports, Monthly Reports.",
          "Allow reports to be exported as PDF.",
          "Provide search, filtering, and reporting based on selected fields for Police Station data analysis."
        ],
        hierarchy: {
          title: "Five User Levels & Hierarchical Access",
          steps: ["PS", "SDPO", "SP", "DIG", "DGP-IGP"],
          rules: [
            "SDPO: View reports from Police Stations under their jurisdiction.",
            "SP: View reports from SDPOs/Police Stations under their jurisdiction.",
            "DIG: View reports under SPs within their control.",
            "DGP-IGP: View reports from all Police Stations."
          ]
        },
        techTags: ["Web App", "Mobile App", "RBAC", "Analytics", "PDF Reports"]
      }
    };

    const problemModal = document.getElementById("problem-modal");
    const problemModalClose = document.getElementById("problem-modal-close");
    const problemModalBackBtn = document.getElementById("problem-modal-back-btn");
    const problemModalBadge = document.getElementById("problem-modal-badge");
    const problemModalTitle = document.getElementById("problem-modal-title");
    const problemModalBody = document.getElementById("problem-modal-body");
    const viewProblemButtons = document.querySelectorAll(".btn-view-problem");
    let lastActiveProblemTrigger = null;

    function renderProblemModalContent(problem) {
      if (!problemModalBody) return;
      if (problemModalBadge) problemModalBadge.textContent = problem.badge;
      if (problemModalTitle) problemModalTitle.textContent = problem.title;

      let html = "";

      // Goal Section
      html += `
        <div class="problem-modal-section">
          <h4 class="problem-modal-section-title">Problem Goal</h4>
          <div class="problem-goal-box">
            ${problem.goal}
          </div>
        </div>
      `;

      // Digitized Reports (for Problem 04)
      if (problem.reportsToDigitize && problem.reportsToDigitize.length) {
        html += `
          <div class="problem-modal-section">
            <h4 class="problem-modal-section-title">Current Reports to be Digitized</h4>
            <ul class="problem-req-list">
              ${problem.reportsToDigitize.map(r => `
                <li class="problem-req-item">
                  <span class="problem-req-bullet" aria-hidden="true"></span>
                  <span><strong>${r}</strong></span>
                </li>
              `).join("")}
            </ul>
          </div>
        `;
      }

      // Key Requirements Section
      html += `
        <div class="problem-modal-section">
          <h4 class="problem-modal-section-title">Key Requirements</h4>
          <ul class="problem-req-list">
            ${problem.requirements.map(req => `
              <li class="problem-req-item">
                <span class="problem-req-bullet" aria-hidden="true"></span>
                <span>${req}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `;

      // Hierarchy Section (if any)
      if (problem.hierarchy) {
        html += `
          <div class="problem-modal-section">
            <h4 class="problem-modal-section-title">${problem.hierarchy.title}</h4>
            <div class="problem-hierarchy-box">
              <div class="problem-hierarchy-flow">
                ${problem.hierarchy.steps.map((step, idx) => `
                  <span class="problem-hierarchy-step">${step}</span>
                  ${idx < problem.hierarchy.steps.length - 1 ? '<span class="problem-hierarchy-arrow">&rarr;</span>' : ''}
                `).join("")}
              </div>
              ${problem.hierarchy.rules ? `
                <ul class="problem-req-list" style="margin-top: 8px;">
                  ${problem.hierarchy.rules.map(rule => `
                    <li class="problem-req-item">
                      <span class="problem-req-bullet" aria-hidden="true"></span>
                      <span>${rule}</span>
                    </li>
                  `).join("")}
                </ul>
              ` : ''}
            </div>
          </div>
        `;
      }

      // Technology Tags Section
      html += `
        <div class="problem-modal-section">
          <h4 class="problem-modal-section-title">Technology Areas</h4>
          <div class="problem-modal-tags">
            ${problem.techTags.map(tag => `<span class="problem-tag">${tag}</span>`).join("")}
          </div>
        </div>
      `;

      problemModalBody.innerHTML = html;
    }

    function openProblemModal(problemId, triggerEl) {
      if (!problemModal) return;
      const data = PROBLEM_STATEMENTS_DATA[problemId];
      if (!data) return;

      lastActiveProblemTrigger = triggerEl || null;
      renderProblemModalContent(data);
      problemModal.classList.add("open");
      document.body.style.overflow = "hidden";
      if (problemModalClose) problemModalClose.focus();
    }

    function closeProblemModal() {
      if (!problemModal) return;
      problemModal.classList.remove("open");
      document.body.style.overflow = "";
      if (lastActiveProblemTrigger) {
        lastActiveProblemTrigger.focus();
        lastActiveProblemTrigger = null;
      }
    }

    viewProblemButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const problemId = btn.getAttribute("data-problem");
        openProblemModal(problemId, btn);
      });
    });

    if (problemModalClose) problemModalClose.addEventListener("click", closeProblemModal);
    if (problemModalBackBtn) problemModalBackBtn.addEventListener("click", closeProblemModal);

    if (problemModal) {
      problemModal.addEventListener("click", (e) => {
        if (e.target === problemModal) closeProblemModal();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && problemModal && problemModal.classList.contains("open")) {
        closeProblemModal();
      }
    });

    /* --------------------------------------------------------------------------
       5C. FOOTER LEGAL & CONTACT MODALS (PRIVACY, TERMS, CONTACT)
       -------------------------------------------------------------------------- */
    const legalTriggers = document.querySelectorAll(".legal-modal-trigger");
    const legalModals = document.querySelectorAll(".legal-modal-overlay");

    function openLegalModal(modalId) {
      const target = document.getElementById(modalId);
      if (!target) return;
      target.classList.add("open");
      document.body.style.overflow = "hidden";
      const closeBtn = target.querySelector(".modal-close-btn");
      if (closeBtn) closeBtn.focus();
    }

    function closeLegalModals() {
      legalModals.forEach((m) => m.classList.remove("open"));
      document.body.style.overflow = "";
    }

    legalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute("data-modal");
        if (targetId) openLegalModal(targetId);
      });
    });

    legalModals.forEach((m) => {
      const closeBtn = m.querySelector(".modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", closeLegalModals);
      }
      m.addEventListener("click", (e) => {
        if (e.target === m) closeLegalModals();
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLegalModals();
      }
    });

    /* --------------------------------------------------------------------------
       5D. EVENT CARDS MODALS (CHECK OUT MORE & VIEW PROBLEM STATEMENTS)
       -------------------------------------------------------------------------- */
    const eventModalTriggers = document.querySelectorAll("[data-event-modal]");
    const eventModals = document.querySelectorAll(".event-modal-overlay");

    function openEventModal(modalId) {
      const target = document.getElementById(modalId);
      if (!target) return;
      target.classList.add("open");
      document.body.style.overflow = "hidden";
      const closeBtn = target.querySelector(".modal-close-btn");
      if (closeBtn) closeBtn.focus();
    }

    function closeEventModals() {
      eventModals.forEach((m) => m.classList.remove("open"));
      document.body.style.overflow = "";
    }

    eventModalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute("data-event-modal");
        if (targetId) openEventModal(targetId);
      });
    });

    eventModals.forEach((m) => {
      const closeBtn = m.querySelector(".modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", closeEventModals);
      }
      m.addEventListener("click", (e) => {
        if (e.target === m) closeEventModals();
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeEventModals();
      }
    });

    /* --------------------------------------------------------------------------
       6. REFINED CUSTOM CURSOR (DESKTOP ONLY — rAF & GPU ACCELERATED)
       -------------------------------------------------------------------------- */
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasFinePointer && !prefersReduced) {
      let cursorEl = document.querySelector(".custom-cursor");
      if (!cursorEl) {
        cursorEl = document.createElement("div");
        cursorEl.className = "custom-cursor";
        cursorEl.setAttribute("aria-hidden", "true");
        document.body.appendChild(cursorEl);
      }

      let mouseX = -100;
      let mouseY = -100;
      let currentX = -100;
      let currentY = -100;
      let isMoving = false;
      let isHovering = false;
      let isVisible = false;
      let rafId = null;

      function renderCursor() {
        // Smooth linear interpolation with slight delay
        const factor = 0.22;
        currentX += (mouseX - currentX) * factor;
        currentY += (mouseY - currentY) * factor;

        const size = isHovering ? 26 : 10;
        const x = currentX - size / 2;
        const y = currentY - size / 2;

        cursorEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

        if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
          rafId = requestAnimationFrame(renderCursor);
        } else {
          isMoving = false;
        }
      }

      function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
          isVisible = true;
          cursorEl.classList.add("cursor-visible");
          currentX = mouseX;
          currentY = mouseY;
        }

        if (!isMoving) {
          isMoving = true;
          rafId = requestAnimationFrame(renderCursor);
        }
      }

      window.addEventListener("mousemove", onMouseMove, { passive: true });

      document.addEventListener("mouseleave", () => {
        isVisible = false;
        cursorEl.classList.remove("cursor-visible");
      });

      // Delegated interactive element detection for circle expansion
      const interactiveSelector = "a, button, .btn, .faq-btn, .about-feat-card, .history-card, .challenge-card, .problem-card, .btn-view-problem, .timeline-content-card, .prize-card, .org-card, .venue-card, .countdown-box, [role='button'], input, select";

      document.addEventListener("mouseover", (e) => {
        if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
          isHovering = true;
          cursorEl.classList.add("cursor-hover");
        }
      }, { passive: true });

      document.addEventListener("mouseout", (e) => {
        if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
          if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(interactiveSelector)) {
            isHovering = false;
            cursorEl.classList.remove("cursor-hover");
          }
        }
      }, { passive: true });
    }

    /* --------------------------------------------------------------------------
       7. SUBTLE SCROLL REVEAL (INTERSECTION OBSERVER — ONCE ONLY)
       -------------------------------------------------------------------------- */
    if ("IntersectionObserver" in window && !prefersReduced) {
      const sectionsToReveal = document.querySelectorAll("main > section");

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-revealed");
            sectionObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      });

      sectionsToReveal.forEach((sec) => {
        sec.classList.add("section-reveal");
        // Ensure hero is displayed smoothly on arrival
        if (sec.id === "hero") {
          sec.classList.add("section-revealed");
        } else {
          sectionObserver.observe(sec);
        }
      });

      /* --------------------------------------------------------------------------
         8. TIMELINE ENTRANCE ANIMATIONS (HISTORY & SCHEDULE)
         -------------------------------------------------------------------------- */
      const historyTrack = document.querySelector(".history-timeline-track");
      const eventTimeline = document.querySelector(".timeline-vertical");

      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === historyTrack) {
              entry.target.classList.add("history-in-view");
            }
            if (entry.target === eventTimeline) {
              entry.target.classList.add("timeline-in-view");
            }
            timelineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      if (historyTrack) timelineObserver.observe(historyTrack);
      if (eventTimeline) timelineObserver.observe(eventTimeline);
    } else {
      const historyTrack = document.querySelector(".history-timeline-track");
      const eventTimeline = document.querySelector(".timeline-vertical");
      if (historyTrack) historyTrack.classList.add("history-in-view");
      if (eventTimeline) eventTimeline.classList.add("timeline-in-view");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
