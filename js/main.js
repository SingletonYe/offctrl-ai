(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var nav = document.getElementById("site-nav");
  var navToggle = document.getElementById("nav-toggle");

  /* ---------- Sticky header ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */
  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  function toggleNav() {
    var open = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        toggleNav();
      }
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- Render news list from js/news.js ---------- */
  var newsList = document.getElementById("news-list");
  var newsData = window.OFFCTRL_NEWS || [];

  function formatDate(iso) {
    var parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return parts[2] + " " + month + " " + parts[0];
  }

  if (newsList) {
    newsData.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    }).forEach(function (item, index) {
      var article = document.createElement("article");
      article.className = "news-item";

      var meta = document.createElement("div");
      meta.className = "news-item__meta";

      var date = document.createElement("time");
      date.className = "news-item__date";
      date.setAttribute("datetime", item.date || "");
      date.textContent = formatDate(item.date);
      meta.appendChild(date);

      if (item.tag) {
        var tag = document.createElement("span");
        tag.className = "news-item__tag";
        tag.textContent = item.tag;
        meta.appendChild(tag);
      }
      article.appendChild(meta);

      var content = document.createElement("div");
      content.className = "news-item__content";

      var title = document.createElement("h3");
      title.className = "news-item__title";
      if (item.link && item.link !== "#") {
        var anchor = document.createElement("a");
        anchor.href = item.link;
        anchor.target = "_blank";
        anchor.rel = "noopener";
        anchor.textContent = item.title;
        title.appendChild(anchor);
      } else {
        title.textContent = item.title;
      }
      content.appendChild(title);

      if (item.summary) {
        var summary = document.createElement("p");
        summary.className = "news-item__summary";
        summary.textContent = item.summary;
        content.appendChild(summary);
      }

      var hasBody = !!(item.body && String(item.body).trim());
      if (hasBody) {
        var bodyId = "news-body-" + index;
        var body = document.createElement("div");
        body.className = "news-item__full";
        body.id = bodyId;

        var fullText = document.createElement("p");
        fullText.textContent = item.body;
        body.appendChild(fullText);
        content.appendChild(body);

        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "news-item__toggle";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", bodyId);
        toggle.textContent = "Read more";
        toggle.addEventListener("click", function () {
          var open = article.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          toggle.textContent = open ? "Show less" : "Read more";
        });
        content.appendChild(toggle);
      }

      article.appendChild(content);
      newsList.appendChild(article);
    });
  }

  /* ---------- Active section highlighting ---------- */
  var navLinks = document.querySelectorAll(".site-nav__link");
  var sections = [document.getElementById("news"), document.getElementById("join")];

  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (section) {
      if (section) observer.observe(section);
    });
  }

  /* ---------- Join application form ---------- */
  var form = document.getElementById("join-form");
  var note = document.getElementById("join-note");
  var JOIN_EMAIL = "98@offctrl.ai";

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameInput = document.getElementById("join-name");
      var emailInput = document.getElementById("join-email");
      var roleInput = document.getElementById("join-role");
      var githubInput = document.getElementById("join-github");
      var messageInput = document.getElementById("join-message");

      var name = (nameInput && nameInput.value.trim()) || "";
      var email = (emailInput && emailInput.value.trim()) || "";

      function showNote(text, isError) {
        if (!note) return;
        note.textContent = text;
        note.classList.toggle("is-error", !!isError);
        note.hidden = false;
      }

      if (!name) {
        showNote("Please enter your name.", true);
        nameInput.focus();
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNote("Please enter a valid email address.", true);
        emailInput.focus();
        return;
      }

      var role = (roleInput && roleInput.value) || "Other";
      var github = (githubInput && githubInput.value.trim()) || "—";
      var message = (messageInput && messageInput.value.trim()) || "—";

      var subject = "Application to join OFFCTRL AI — " + name;
      var body = [
        "Name: " + name,
        "Email: " + email,
        "Track: " + role,
        "GitHub / Portfolio: " + github,
        "",
        "About me:",
        message
      ].join("\n");

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Opening your email…";
      }
      showNote("Application ready — check your email app to send it.");
      window.location.href = "mailto:" + JOIN_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
