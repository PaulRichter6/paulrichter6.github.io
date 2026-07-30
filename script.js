const root = document.documentElement;
const body = document.body;
const hero = document.querySelector(".hero");
const shortsSection = document.querySelector(".shorts-section");
const shortsTrack = document.querySelector(".shorts-track");
const shortCards = [...document.querySelectorAll(".short-card")];
const longformSection = document.querySelector(".longform");
const filmTapeSvg = document.querySelector(".film-tape-svg");
const filmTapePaths = [...document.querySelectorAll("[data-film-tape-path]")];
const filmReel = document.querySelector(".film-reel");
const themeToggle = document.querySelector(".theme-toggle");
const themeWash = document.querySelector(".theme-wash");
const siteHeader = document.querySelector(".site-header");
const modal = document.querySelector(".media-modal");
const modalTitle = modal.querySelector("h2");
const contactModal = document.querySelector(".contact-modal");
const contactForm = document.querySelector(".contact-form");
const mobileInquirySelect = contactForm.querySelector(".inquiry-select-mobile select");
const contactOpeners = [...document.querySelectorAll("[data-contact-open]")];
const statusStack = document.querySelector(".status-stack");
const remoteStatusCard = document.querySelector(".status-card-remote");
const primaryStatusCard = document.querySelector(".status-card-primary");
const activeShortLabel = document.querySelector("#active-short");
const mobileView = window.matchMedia("(max-width: 900px)");
const quoteCards = [...document.querySelectorAll(".quote-card")];

let ticking = false;
let previousScrollY = window.scrollY;
let themeTransitioning = false;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function buildFilmTape() {
  const width = filmTapeSvg.clientWidth || window.innerWidth;
  const height = longformSection.offsetHeight;
  const sectionRect = longformSection.getBoundingClientRect();
  const reelRect = filmReel.getBoundingClientRect();
  const startX = reelRect.left + reelRect.width * .75;
  const startY = reelRect.top - sectionRect.top + reelRect.height * .62;
  const pathData = mobileView.matches
    ? [
        `M ${startX.toFixed(2)} ${startY.toFixed(2)}`,
        `C ${(startX - 26).toFixed(2)} ${(startY + 40).toFixed(2)}, ${(width * .59).toFixed(2)} ${(height * .12).toFixed(2)}, ${(width * .43).toFixed(2)} ${(height * .2).toFixed(2)}`,
        `C ${(width * .24).toFixed(2)} ${(height * .29).toFixed(2)}, ${(width * .72).toFixed(2)} ${(height * .31).toFixed(2)}, ${(width * .62).toFixed(2)} ${(height * .41).toFixed(2)}`,
        `C ${(width * .52).toFixed(2)} ${(height * .5).toFixed(2)}, ${(width * .18).toFixed(2)} ${(height * .5).toFixed(2)}, ${(width * .31).toFixed(2)} ${(height * .61).toFixed(2)}`,
        `C ${(width * .43).toFixed(2)} ${(height * .72).toFixed(2)}, ${(width * .76).toFixed(2)} ${(height * .7).toFixed(2)}, ${(width * .61).toFixed(2)} ${(height * .82).toFixed(2)}`,
        `C ${(width * .49).toFixed(2)} ${(height * .91).toFixed(2)}, ${(width * .26).toFixed(2)} ${(height * .91).toFixed(2)}, ${(width * .38).toFixed(2)} ${(height * .97).toFixed(2)}`
      ].join(" ")
    : [
        `M ${startX.toFixed(2)} ${startY.toFixed(2)}`,
        `C ${(startX + 72).toFixed(2)} ${(startY + 34).toFixed(2)}, ${(width * .78).toFixed(2)} ${(height * .13).toFixed(2)}, ${(width * .69).toFixed(2)} ${(height * .2).toFixed(2)}`,
        `C ${(width * .58).toFixed(2)} ${(height * .29).toFixed(2)}, ${(width * .31).toFixed(2)} ${(height * .27).toFixed(2)}, ${(width * .35).toFixed(2)} ${(height * .39).toFixed(2)}`,
        `C ${(width * .39).toFixed(2)} ${(height * .49).toFixed(2)}, ${(width * .76).toFixed(2)} ${(height * .48).toFixed(2)}, ${(width * .69).toFixed(2)} ${(height * .61).toFixed(2)}`,
        `C ${(width * .63).toFixed(2)} ${(height * .71).toFixed(2)}, ${(width * .28).toFixed(2)} ${(height * .7).toFixed(2)}, ${(width * .34).toFixed(2)} ${(height * .82).toFixed(2)}`,
        `C ${(width * .4).toFixed(2)} ${(height * .91).toFixed(2)}, ${(width * .62).toFixed(2)} ${(height * .9).toFixed(2)}, ${(width * .56).toFixed(2)} ${(height * .965).toFixed(2)}`
      ].join(" ");

  filmTapeSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  filmTapePaths.forEach((path) => path.setAttribute("d", pathData));
}

function updateScrollEffects() {
  const currentScrollY = window.scrollY;
  statusStack.classList.toggle("scroll-remote", currentScrollY > 10);
  const scrollingDown = currentScrollY > previousScrollY + 2;
  const scrollingUp = currentScrollY < previousScrollY - 2;
  const beyondHero = currentScrollY > hero.offsetHeight * .72;
  if (!beyondHero || scrollingUp) {
    siteHeader.classList.remove("header-hidden");
  } else if (scrollingDown) {
    siteHeader.classList.add("header-hidden");
  }
  previousScrollY = currentScrollY;

  const heroRect = hero.getBoundingClientRect();
  const heroProgress = clamp(-heroRect.top / Math.max(heroRect.height * 0.75, 1));
  root.style.setProperty("--hero-progress", heroProgress.toFixed(3));
  const lightWindow = clamp((heroProgress - .035) / .38);
  const heroLight = Math.sin(lightWindow * Math.PI) * (heroProgress > .035 && heroProgress < .415 ? 1 : 0);
  root.style.setProperty("--hero-light", Math.max(0, heroLight * .9).toFixed(3));

  const shortsRect = shortsSection.getBoundingClientRect();
  let shortProgress = 0;
  if (mobileView.matches) {
    const trackOverflow = Math.max(shortsTrack.scrollWidth - shortsTrack.clientWidth, 1);
    shortProgress = clamp(shortsTrack.scrollLeft / trackOverflow);
    root.style.setProperty("--shorts-x", "0px");
  } else {
    const scrollable = shortsSection.offsetHeight - window.innerHeight;
    shortProgress = clamp(-shortsRect.top / Math.max(scrollable, 1));
    const trackOverflow = Math.max(shortsTrack.scrollWidth - window.innerWidth + 48, 0);
    root.style.setProperty("--shorts-x", `${-trackOverflow * shortProgress}px`);
  }
  root.style.setProperty("--short-progress", shortProgress.toFixed(3));

  const trackRect = shortsTrack.getBoundingClientRect();
  const viewportCenter = mobileView.matches
    ? trackRect.left + trackRect.width / 2
    : window.innerWidth / 2;
  let activeCard = shortCards[0];
  let closestDistance = Infinity;
  shortCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const signedDistance = cardCenter - viewportCenter;
    const distance = Math.abs(signedDistance);
    const focus = clamp(1 - distance / Math.max(viewportCenter + rect.width * .6, 1));
    const direction = signedDistance < 0 ? -1 : 1;
    const flight = Math.pow(1 - focus, 1.35);
    card.style.setProperty("--short-fly-x", mobileView.matches ? "0px" : `${direction * flight * 190}px`);
    card.style.setProperty("--short-fly-y", mobileView.matches ? "0px" : `${flight * 46}px`);
    card.style.setProperty("--short-flight-rotate", mobileView.matches ? "0deg" : `${direction * flight * 6}deg`);
    if (distance < closestDistance) {
      activeCard = card;
      closestDistance = distance;
    }
  });
  shortCards.forEach((card) => {
    const isActive = card === activeCard;
    const video = card.querySelector("video");
    const rect = card.getBoundingClientRect();
    const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
    const visibleRatio = visibleWidth / Math.max(rect.width, 1);
    const shouldPlay = visibleRatio > .16 || card.matches(":hover");
    card.classList.toggle("is-active", isActive);
    if (!video) return;
    if (shouldPlay && video.paused) {
      video.play().catch(() => {});
    } else if (!shouldPlay && !video.paused) {
      video.pause();
    }
  });
  activeShortLabel.textContent = String(shortCards.indexOf(activeCard) + 1).padStart(2, "0");

  const longformRect = longformSection.getBoundingClientRect();
  const longformProgress = clamp(
    (window.innerHeight * .45 - longformRect.top) /
      Math.max(longformRect.height - window.innerHeight * .55, 1)
  );
  root.style.setProperty("--tape-progress", longformProgress.toFixed(3));
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  buildFilmTape();
  updateScrollEffects();
});

shortsTrack.addEventListener(
  "scroll",
  () => {
    if (!mobileView.matches) return;
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true }
);
buildFilmTape();
updateScrollEffects();

hero.addEventListener("pointermove", (event) => {
  const rect = hero.getBoundingClientRect();
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
  const y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1;
  root.style.setProperty("--portrait-x", x.toFixed(3));
  root.style.setProperty("--portrait-y", y.toFixed(3));
});

hero.addEventListener("pointerleave", () => {
  root.style.setProperty("--portrait-x", "0");
  root.style.setProperty("--portrait-y", "0");
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width) - .5;
    const y = clamp((event.clientY - rect.top) / rect.height) - .5;
    card.style.setProperty("--pointer-rotate-x", `${(-y * 4).toFixed(2)}deg`);
    card.style.setProperty("--pointer-rotate-y", `${(x * 5).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--pointer-rotate-x", "0deg");
    card.style.setProperty("--pointer-rotate-y", "0deg");
  });

  card.addEventListener("click", () => {
    if (!mobileView.matches) return;
    const shouldActivate = !card.classList.contains("is-touch-active");
    document.querySelectorAll(".service-card.is-touch-active").forEach((activeCard) => {
      activeCard.classList.remove("is-touch-active");
    });
    card.classList.toggle("is-touch-active", shouldActivate);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function updateThemeState() {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  themeToggle.setAttribute("aria-label", isDark ? "White Mode aktivieren" : "Dark Mode aktivieren");
}

themeToggle.addEventListener("click", () => {
  if (themeTransitioning) return;
  themeTransitioning = true;
  const rect = themeToggle.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  );
  root.style.setProperty("--theme-x", `${originX}px`);
  root.style.setProperty("--theme-y", `${originY}px`);
  root.style.setProperty("--theme-radius", `${Math.ceil(radius)}px`);
  root.style.setProperty("--theme-wash-scale", Math.ceil(radius / 6 + 8));

  if (document.startViewTransition) {
    const transition = document.startViewTransition(updateThemeState);
    transition.finished.finally(() => {
      themeTransitioning = false;
    });
    return;
  }

  themeWash.style.left = `${originX}px`;
  themeWash.style.top = `${originY}px`;
  themeWash.classList.remove("animate");
  void themeWash.offsetWidth;
  themeWash.classList.add("animate");

  window.setTimeout(() => {
    updateThemeState();
  }, 210);
  window.setTimeout(() => {
    themeTransitioning = false;
  }, 700);
});

function openMedia(title) {
  modalTitle.textContent = title;
  modal.showModal();
}

shortCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.dataset.url) {
      window.open(card.dataset.url, "_blank", "noopener,noreferrer");
      return;
    }
    openMedia(card.querySelector(".short-title").textContent);
  });
});

const collaborationServices = document.querySelectorAll(".collab-service");

function openCollaborationService(service) {
  window.clearTimeout(service.closeTimer);
  service.classList.add("is-collab-open");
  service.querySelector(".collab-service-summary").setAttribute("aria-expanded", "true");
}

function closeCollaborationService(service) {
  service.classList.remove("is-collab-open");
  service.querySelector(".collab-service-summary").setAttribute("aria-expanded", "false");
  service.closeTimer = window.setTimeout(() => {
    if (service.matches(":hover") || service.contains(document.activeElement)) return;
    service.classList.remove("is-collab-open");
  }, 150);
}

collaborationServices.forEach((service) => {
  const summary = service.querySelector(".collab-service-summary");

  service.addEventListener("mouseenter", () => {
    if (!mobileView.matches) openCollaborationService(service);
  });
  service.addEventListener("mouseleave", () => {
    if (!mobileView.matches) closeCollaborationService(service);
  });

  service.addEventListener("focusin", () => {
    if (!mobileView.matches) openCollaborationService(service);
  });
  service.addEventListener("focusout", () => {
    if (!mobileView.matches) closeCollaborationService(service);
  });
  summary.addEventListener("click", (event) => {
    event.preventDefault();
    if (mobileView.matches) {
      const shouldOpen = !service.classList.contains("is-collab-open");
      collaborationServices.forEach((otherService) => {
        if (otherService === service) return;
        otherService.classList.remove("is-collab-open");
        otherService.querySelector(".collab-service-summary").setAttribute("aria-expanded", "false");
      });
      window.clearTimeout(service.closeTimer);
      if (shouldOpen) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => openCollaborationService(service));
        });
      } else {
        service.classList.remove("is-collab-open");
        summary.setAttribute("aria-expanded", "false");
        service.closeTimer = window.setTimeout(() => {
          service.classList.remove("is-collab-open");
        }, 260);
      }
      summary.blur();
      return;
    }
    if (service.classList.contains("is-collab-open")) {
      closeCollaborationService(service);
    } else {
      openCollaborationService(service);
    }
  });

  service.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!mobileView.matches || target?.closest(".collab-service-summary")) return;
    summary.click();
  });
});

document.querySelectorAll(".film-flip").forEach((card) => {
  card.addEventListener("click", (event) => {
    const openTarget = event.target instanceof Element ? event.target.closest(".film-open") : null;
    if (mobileView.matches && !openTarget) {
      document.querySelectorAll(".film-flip.is-flipped").forEach((openCard) => {
        if (openCard !== card) openCard.classList.remove("is-flipped");
      });
      card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
      card.blur();
      return;
    }
    if (card.dataset.url) {
      window.open(card.dataset.url, "_blank", "noopener,noreferrer");
      return;
    }
    openMedia(card.dataset.title);
  });
});

function setActiveQuote(activeIndex = 0) {
  if (!mobileView.matches) {
    quoteCards.forEach((card) => {
      card.style.removeProperty("--mobile-stack-order");
      card.style.removeProperty("--mobile-stack-z");
      card.classList.remove("is-mobile-active");
    });
    return;
  }

  const orderedCards = [
    ...quoteCards.slice(activeIndex),
    ...quoteCards.slice(0, activeIndex)
  ];

  orderedCards.forEach((card, order) => {
    card.style.setProperty("--mobile-stack-order", order);
    card.style.setProperty("--mobile-stack-z", quoteCards.length - order);
    card.classList.toggle("is-mobile-active", order === 0);
  });
}

quoteCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (!mobileView.matches) return;
    setActiveQuote(index);
    card.blur();
  });
});

setActiveQuote();
mobileView.addEventListener("change", () => setActiveQuote());

modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

function selectInquiryType(type) {
  if (!mobileInquirySelect) return;
  const hasOption = [...mobileInquirySelect.options].some((option) => option.value === type);
  mobileInquirySelect.value = hasOption ? type : "General inquiry";
}

mobileInquirySelect?.addEventListener("change", () => {
  selectInquiryType(mobileInquirySelect.value);
});

contactOpeners.forEach((opener) => {
  opener.addEventListener("click", () => {
    selectInquiryType(opener.dataset.contactType || "General inquiry");
    contactModal.showModal();
    window.setTimeout(() => contactForm.elements.name.focus(), 80);
  });
});

contactModal.querySelector(".contact-modal-close").addEventListener("click", () => contactModal.close());
contactModal.addEventListener("click", (event) => {
  if (event.target === contactModal) contactModal.close();
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const type = mobileInquirySelect.value;
  const name = String(formData.get("name")).trim();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector(".contact-form-status");
  const defaultButtonContent = submitButton.innerHTML;

  formData.set("inquiry_type", type);
  formData.set("subject", `${type} inquiry from ${name}`);
  formData.delete("inquiry-type");

  contactForm.classList.add("is-sending");
  status.classList.remove("is-success", "is-error");
  status.textContent = "Sending your inquiry...";
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "The inquiry could not be sent.");
    }

    status.classList.add("is-success");
    status.textContent = "Thank you - your inquiry has been sent.";
    submitButton.textContent = "Sent";
    contactForm.reset();
    selectInquiryType("General inquiry");

    window.setTimeout(() => {
      contactModal.close();
      status.classList.remove("is-success");
      status.textContent = "Sent directly to Paul · No email app needed";
      submitButton.innerHTML = defaultButtonContent;
    }, 1800);
  } catch (error) {
    status.classList.add("is-error");
    status.textContent = "Something went wrong. Please try again.";
    submitButton.innerHTML = defaultButtonContent;
  } finally {
    contactForm.classList.remove("is-sending");
    submitButton.disabled = false;
  }
});

remoteStatusCard.addEventListener("click", () => {
  statusStack.classList.add("show-remote");
});

remoteStatusCard.addEventListener("pointerenter", () => {
  statusStack.classList.add("show-remote");
});

primaryStatusCard.addEventListener("click", () => {
  statusStack.classList.remove("show-remote");
});

primaryStatusCard.addEventListener("pointerenter", () => {
  statusStack.classList.remove("show-remote");
});

document.querySelector("#year").textContent = new Date().getFullYear();
