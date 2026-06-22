const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const scrollTopButton = document.querySelector("#scrollTop");
const contactForm = document.querySelector("[data-contact-form]");
const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCategory = document.querySelector("[data-modal-category]");
const modalBody = document.querySelector("[data-modal-body]");
const modalClose = document.querySelector("[data-modal-close]");
const modalImage = document.querySelector("[data-modal-image]");
const modalDate = document.querySelector("[data-modal-date]");
const modalHighlights = document.querySelector("[data-modal-highlights]");
const darkToggle = document.querySelector("[data-dark-toggle]");
const certificateModal = document.querySelector("[data-certificate-modal]");
const certificateImage = document.querySelector("[data-certificate-image]");
const certificateTitle = document.querySelector("[data-certificate-title]");
const certificateTrack = document.querySelector("[data-certificate-track]");
const certificatePrev = document.querySelector("[data-certificate-prev]");
const certificateNext = document.querySelector("[data-certificate-next]");
let certificateSlideshowTimer;

const certificates = [
  { title: "Certificate 01", image: "assets/certificates/certificate-01.PNG" },
  { title: "Certificate 02", image: "assets/certificates/certificate-02.PNG" },
  { title: "Certificate 03", image: "assets/certificates/certificate-03.jpg" },
  { title: "Certificate 04", image: "assets/certificates/certificate-04.jpg" },
  { title: "Certificate 05", image: "assets/certificates/certificate-05.PNG" },
  { title: "Certificate 06", image: "assets/certificates/certificate-06.jpg" },
  { title: "Certificate 07", image: "assets/certificates/certificate-07.PNG" },
  { title: "Certificate 08", image: "assets/certificates/certificate-08.jpg" },
  { title: "Certificate 09", image: "assets/certificates/certificate-09.jpg" },
  { title: "Certificate 10", image: "assets/certificates/certificate-10.PNG" },
  { title: "Certificate 11", image: "assets/certificates/certificate-11.jpg" },
  { title: "Certificate 12", image: "assets/certificates/certificate-12.PNG" },
  { title: "Certificate 13", image: "assets/certificates/certificate-13.jpg" },
  { title: "Certificate 14", image: "assets/certificates/certificate-14.PNG" },
  { title: "Certificate 15", image: "assets/certificates/certificate-15.jpg" },
  { title: "Certificate 16", image: "assets/certificates/certificate-16.jpg" },
  { title: "Certificate 17", image: "assets/certificates/certificate-17.jpg" },
  { title: "Certificate 18", image: "assets/certificates/certificate-18.jpg" },
  { title: "Certificate 19", image: "assets/certificates/certificate-19.jpg" },
];

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");
  highlightActiveLink();
  restoreTheme();
  renderCertificateShowcase();
});

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function highlightActiveLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

window.addEventListener("scroll", () => {
  if (!scrollTopButton) return;
  scrollTopButton.classList.toggle("visible", window.scrollY > 420);
});

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.querySelectorAll("a[href$='.html']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || link.target) return;
    event.preventDefault();
    document.body.classList.remove("page-ready");
    setTimeout(() => {
      window.location.href = link.href;
    }, 160);
  });
});

document.querySelectorAll("[data-engagement]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!modal) return;
    modalTitle.textContent = button.dataset.title || "Engagement Details";
    modalCategory.textContent = button.dataset.category || "";
    modalBody.textContent = button.dataset.description || "";
    if (modalImage) {
      modalImage.src = button.dataset.image || "assets/images/educational-leadership.jpg";
      modalImage.alt = button.dataset.title || "Engagement image";
    }
    if (modalDate) {
      modalDate.textContent = button.dataset.date || "Professional Engagement";
    }
    if (modalHighlights) {
      const highlights = (button.dataset.highlights || "Purpose-led leadership|Learner-centered service|Community-responsive practice").split("|");
      modalHighlights.innerHTML = highlights.map((item) => `<li><span class="material-symbols-outlined" style="color: var(--secondary); font-size: 20px;">check_circle</span><span>${item}</span></li>`).join("");
    }
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("modal-open");
  });
});

function renderCertificateShowcase() {
  if (!certificateTrack) return;

  certificateTrack.innerHTML = certificates.map((certificate, index) => {
    const number = String(index + 1).padStart(2, "0");
    const loading = index < 3 ? "eager" : "lazy";

    return `
      <article class="certificate-showcase-card" data-certificate-index="${index}">
        <button class="block w-full text-left" type="button" data-certificate-open data-certificate-index="${index}" aria-label="View ${certificate.title}">
          <div class="certificate-frame">
            <img src="${certificate.image}" alt="${certificate.title}" loading="${loading}" decoding="async">
          </div>
        </button>
      </article>
    `;
  }).join("");

  updateActiveCertificate();
}

function updateActiveCertificate() {
  if (!certificateTrack) return;

  const trackCenter = certificateTrack.getBoundingClientRect().left + certificateTrack.clientWidth / 2;
  let closestCard = null;
  let closestDistance = Infinity;

  certificateTrack.querySelectorAll(".certificate-showcase-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(trackCenter - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });

  certificateTrack.querySelectorAll(".certificate-showcase-card").forEach((card) => {
    card.classList.toggle("is-active", card === closestCard);
  });
}

function scrollCertificate(direction) {
  if (!certificateTrack) return;
  const activeCard = certificateTrack.querySelector(".certificate-showcase-card.is-active");
  const cards = [...certificateTrack.querySelectorAll(".certificate-showcase-card")];
  const currentIndex = Math.max(0, cards.indexOf(activeCard));
  const nextIndex = (currentIndex + direction + cards.length) % cards.length;
  cards[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

function startCertificateSlideshow() {
  if (!certificateTrack || certificateSlideshowTimer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  certificateSlideshowTimer = window.setInterval(() => scrollCertificate(1), 4500);
}

function stopCertificateSlideshow() {
  window.clearInterval(certificateSlideshowTimer);
  certificateSlideshowTimer = undefined;
}

if (certificateTrack) {
  certificateTrack.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActiveCertificate);
  });

  certificateTrack.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-certificate-open]");
    if (!openButton || !certificateModal) return;

    const certificate = certificates[Number(openButton.dataset.certificateIndex)];
    if (!certificate) return;

    if (certificateImage) {
      certificateImage.src = certificate.image;
      certificateImage.alt = certificate.title;
    }
    if (certificateTitle) certificateTitle.textContent = certificate.title;

    certificateModal.classList.remove("hidden");
    certificateModal.classList.add("flex");
    document.body.classList.add("modal-open");
  });

  window.addEventListener("resize", updateActiveCertificate);
  certificateTrack.addEventListener("mouseenter", stopCertificateSlideshow);
  certificateTrack.addEventListener("mouseleave", startCertificateSlideshow);
  certificateTrack.addEventListener("focusin", stopCertificateSlideshow);
  certificateTrack.addEventListener("focusout", startCertificateSlideshow);
  startCertificateSlideshow();
}

if (certificatePrev) {
  certificatePrev.addEventListener("click", () => {
    stopCertificateSlideshow();
    scrollCertificate(-1);
    startCertificateSlideshow();
  });
}

if (certificateNext) {
  certificateNext.addEventListener("click", () => {
    stopCertificateSlideshow();
    scrollCertificate(1);
    startCertificateSlideshow();
  });
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("modal-open");
}

function closeCertificateModal() {
  if (!certificateModal) return;
  certificateModal.classList.add("hidden");
  certificateModal.classList.remove("flex");
  document.body.classList.remove("modal-open");
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

document.querySelectorAll("[data-certificate-close]").forEach((button) => {
  button.addEventListener("click", closeCertificateModal);
});

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
}

if (certificateModal) {
  certificateModal.addEventListener("click", (event) => {
    if (event.target === certificateModal) closeCertificateModal();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeCertificateModal();
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    const message = contactForm.querySelector("[data-form-message]");
    const invalid = fields.find((field) => !field.value.trim() || (field.type === "email" && !field.checkValidity()));

    fields.forEach((field) => {
      field.style.borderColor = !field.value.trim() ? "var(--error)" : "";
    });

    if (invalid) {
      invalid.focus();
      if (message) message.textContent = "Please complete all fields with a valid email address.";
      return;
    }

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const subject = formData.get("subject").trim();
    const body = [
      formData.get("message").trim(),
      "",
      `From: ${name}`,
      `Email: ${email}`,
    ].join("\n");

    window.location.href = `mailto:igardephl@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (message) message.textContent = "Opening your email app...";
  });
}

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("lumen-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  });
}

function restoreTheme() {
  if (localStorage.getItem("lumen-theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}
