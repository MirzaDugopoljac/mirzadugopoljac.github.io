
(() => {
  const html = document.documentElement;

  // -----------------------------
  // Language switcher
  // -----------------------------
  html.dataset.language =
    localStorage.getItem("portfolio-language") ||
    html.dataset.language ||
    "en";

  const updateLanguage = () => {
    document.documentElement.lang = html.dataset.language;

    document.querySelectorAll("[data-lang-btn]").forEach((button) => {
      button.textContent =
        html.dataset.language === "en" ? "TR" : "EN";
    });
  };

  updateLanguage();

  document.querySelectorAll("[data-lang-btn]").forEach((button) => {
    button.addEventListener("click", () => {
      html.dataset.language =
        html.dataset.language === "en" ? "tr" : "en";

      localStorage.setItem(
        "portfolio-language",
        html.dataset.language
      );

      updateLanguage();
    });
  });

  // -----------------------------
  // Header, scroll progress,
  // and back-to-top button
  // -----------------------------
  const header = document.querySelector(".site-header");
  const progressBar = document.querySelector(".progress");
  const backTopButton = document.querySelector(".back-top");

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    header?.classList.toggle(
      "scrolled",
      scrollPosition > 30
    );

    backTopButton?.classList.toggle(
      "show",
      scrollPosition > 700
    );

    if (progressBar) {
      const percentage =
        maxScroll > 0
          ? (scrollPosition / maxScroll) * 100
          : 0;

      progressBar.style.width = `${percentage}%`;
    }
  };

  handleScroll();

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  backTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // -----------------------------
  // Mobile navigation
  // -----------------------------
  const menuButton =
    document.querySelector(".menu-toggle");

  const navLinks =
    document.querySelector(".nav-links");

  menuButton?.addEventListener("click", () => {
    const isOpen =
      navLinks?.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  });

  navLinks
    ?.querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");

        menuButton?.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });

  // -----------------------------
  // Reveal animations
  // -----------------------------
  const revealElements = [
    ...document.querySelectorAll(".reveal"),
  ];

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    "IntersectionObserver" in window &&
    !reducedMotion
  ) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.12,
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // -----------------------------
  // Project filters
  // -----------------------------
  document
    .querySelectorAll("[data-filter]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          document
            .querySelectorAll(
              "[data-filter]"
            )
            .forEach((item) => {
              item.classList.remove(
                "active"
              );
            });

          button.classList.add("active");

          const selectedFilter =
            button.dataset.filter;

          document
            .querySelectorAll(
              "[data-category]"
            )
            .forEach((card) => {
              const shouldShow =
                selectedFilter ===
                  "all" ||
                card.dataset.category ===
                  selectedFilter;

              card.style.display =
                shouldShow ? "" : "none";
            });
        }
      );
    });

  // -----------------------------
  // Project tabs
  // -----------------------------
  document
    .querySelectorAll(
      "[data-tab-target]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const tabsGroup =
            button.closest(
              "[data-tabs]"
            );

          if (!tabsGroup) {
            return;
          }

          tabsGroup
            .querySelectorAll(
              "[data-tab-target]"
            )
            .forEach((item) => {
              item.classList.remove(
                "active"
              );
            });

          tabsGroup
            .querySelectorAll(
              ".tab-panel"
            )
            .forEach((panel) => {
              panel.classList.remove(
                "active"
              );
            });

          button.classList.add("active");

          const targetPanel =
            tabsGroup.querySelector(
              button.dataset.tabTarget
            );

          targetPanel?.classList.add(
            "active"
          );
        }
      );
    });

  // -----------------------------
  // Image lightbox
  // -----------------------------
  const zoomableImages = [
    ...document.querySelectorAll(
      ".zoomable"
    ),
  ];

  const lightbox =
    document.querySelector(".lightbox");

  const lightboxImage =
    lightbox?.querySelector("img");

  const lightboxCaption =
    lightbox?.querySelector(
      ".lightbox-caption"
    );

  let currentImageIndex = 0;

  const showImage = (index) => {
    if (
      !lightbox ||
      zoomableImages.length === 0
    ) {
      return;
    }

    currentImageIndex =
      (index +
        zoomableImages.length) %
      zoomableImages.length;

    const selectedImage =
      zoomableImages[currentImageIndex];

    if (lightboxImage) {
      lightboxImage.src =
        selectedImage.dataset.full ||
        selectedImage.src;

      lightboxImage.alt =
        selectedImage.alt || "";
    }

    if (lightboxCaption) {
      lightboxCaption.textContent =
        selectedImage.dataset.caption ||
        selectedImage.alt ||
        "";
    }

    lightbox.classList.add("open");

    document.body.style.overflow =
      "hidden";
  };

  const closeLightbox = () => {
    lightbox?.classList.remove("open");

    document.body.style.overflow =
      "";
  };

  zoomableImages.forEach(
    (image, index) => {
      image.tabIndex = 0;

      image.addEventListener(
        "click",
        () => {
          showImage(index);
        }
      );

      image.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter") {
            showImage(index);
          }
        }
      );
    }
  );

  lightbox
    ?.querySelector(
      ".lightbox-close"
    )
    ?.addEventListener(
      "click",
      closeLightbox
    );

  lightbox
    ?.querySelector(
      ".lightbox-prev"
    )
    ?.addEventListener(
      "click",
      () => {
        showImage(
          currentImageIndex - 1
        );
      }
    );

  lightbox
    ?.querySelector(
      ".lightbox-next"
    )
    ?.addEventListener(
      "click",
      () => {
        showImage(
          currentImageIndex + 1
        );
      }
    );

  lightbox?.addEventListener(
    "click",
    (event) => {
      if (
        event.target === lightbox
      ) {
        closeLightbox();
      }
    }
  );

  window.addEventListener(
    "keydown",
    (event) => {
      if (
        !lightbox?.classList.contains(
          "open"
        )
      ) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showImage(
          currentImageIndex - 1
        );
      }

      if (event.key === "ArrowRight") {
        showImage(
          currentImageIndex + 1
        );
      }
    }
  );

  // -----------------------------
  // Current year
  // -----------------------------
  document
    .querySelectorAll("[data-year]")
    .forEach((element) => {
      element.textContent =
        new Date().getFullYear();
    });
})();