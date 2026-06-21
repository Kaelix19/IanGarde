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

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");
  highlightActiveLink();
  restoreTheme();
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

document.querySelectorAll("[data-certificate-filter]").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedCategory = filterButton.dataset.certificateFilter || "All";

    document.querySelectorAll("[data-certificate-filter]").forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle("active", isActive);
      button.classList.toggle("border-[var(--primary)]", isActive);
      button.classList.toggle("bg-[var(--primary)]", isActive);
      button.classList.toggle("text-[var(--on-primary)]", isActive);
      button.classList.toggle("border-[var(--accent)]", !isActive);
      button.classList.toggle("text-[var(--on-surface)]", !isActive);
    });

    document.querySelectorAll(".certificate-card").forEach((card) => {
      const cardCategory = card.dataset.certificateCategory;
      const shouldShow = selectedCategory === "All" || cardCategory === selectedCategory;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

document.querySelectorAll("[data-certificate-open]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!certificateModal) return;

    const title = button.dataset.title || "Certificate";
    const image = button.dataset.image || "assets/certificates/certificate-01.jpg";

    if (certificateImage) {
      certificateImage.src = image;
      certificateImage.alt = title;
    }
    if (certificateTitle) certificateTitle.textContent = title;

    certificateModal.classList.remove("hidden");
    certificateModal.classList.add("flex");
    document.body.classList.add("modal-open");
  });
});

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

    contactForm.reset();
    if (message) message.textContent = "Thank you. Your message has been prepared for review.";
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
