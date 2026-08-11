(function () {
  "use strict";

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
    }).forEach(function (item) {
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

      var body = document.createElement("div");
      body.className = "news-item__body";

      var title = document.createElement("h3");
      title.className = "news-item__title";
      if (item.link) {
        var anchor = document.createElement("a");
        anchor.href = item.link;
        anchor.textContent = item.title;
        title.appendChild(anchor);
      } else {
        title.textContent = item.title;
      }
      body.appendChild(title);

      if (item.summary) {
        var summary = document.createElement("p");
        summary.className = "news-item__summary";
        summary.textContent = item.summary;
        body.appendChild(summary);
      }
      article.appendChild(body);

      newsList.appendChild(article);
    });
  }

  /* ---------- Join application form ---------- */
  var form = document.getElementById("join-form");
  var note = document.getElementById("join-note");
  var JOIN_EMAIL = "join@offctrl.ai"; // TODO: replace with the real team inbox

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

      showNote("Application ready — check your email app to send it.");
      window.location.href = "mailto:" + JOIN_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
