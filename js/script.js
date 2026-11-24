// Renderização do conteúdo a partir de js/data.js. Sem framework e sem banco de dados.
const $ = (selector) => document.querySelector(selector);
const data = portfolioData;

function renderSocialLinks(target) {
  const container = $(target);
  container.innerHTML = data.profile.social.map(item =>
    `<a href="${escapeAttribute(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.label)} ↗</a>`
  ).join("");
}

function renderHighlights() {
  $("#highlights").innerHTML = data.highlights.map(item =>
    `<div class="fact"><span>${escapeHTML(item.label)}</span><strong>${escapeHTML(item.value)}</strong></div>`
  ).join("");
}

function renderFocusAreas() {
  $("#focusGrid").innerHTML = data.focusAreas.map((item, index) =>
    `<article class="focus-card">
      <div class="focus-card-top"><span>0${index + 1}</span><span class="focus-symbol">${escapeHTML(item.symbol)}</span></div>
      <h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p>
    </article>`
  ).join("");
}

function renderTeaching() {
  $("#teachingList").innerHTML = data.teaching.map((item, index) =>
    `<article class="teaching-row">
      <span class="row-number">0${index + 1}</span>
      <h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><span class="row-arrow">↗</span>
    </article>`
  ).join("");
}

function renderProjects() {
  $("#projectGrid").innerHTML = data.projects.map((project, index) =>
    `<article class="project-card">
      <div class="project-art project-art-${(index % 3) + 1}">
        <span class="project-index">PROJETO 0${index + 1}</span>
        <div class="project-art-icon">${["&lt;/&gt;", "▤", "✳"][index % 3]}</div>
      </div>
      <div class="project-info">
        <span class="project-category">${escapeHTML(project.category)}</span>
        <h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p>
        <div class="tech-tags">${project.technologies.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        ${project.link ? `<a class="project-link" href="${escapeAttribute(project.link)}" target="_blank" rel="noopener noreferrer">Ver projeto ↗</a>` : ""}
      </div>
    </article>`
  ).join("");
}

// Evita inserir conteúdo de texto diretamente como HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function escapeAttribute(value) {
  return escapeHTML(value);
}

function renderProfile() {
  $("#profileRole").textContent = data.profile.role;
  $("#profileHeadline").textContent = data.profile.headline;
  $("#profileIntro").textContent = data.profile.intro;
  $("#profileAbout").textContent = data.profile.about;
  $("#profileLocation").textContent = data.profile.location;
  $("#profileAvailability").textContent = data.profile.availability;
  renderSocialLinks("#heroSocial");
  renderSocialLinks("#contactSocial");
}

function setupMenu() {
  const toggle = $("#menuToggle");
  const nav = $("#navigation");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("navigation-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    toggle.textContent = isOpen ? "×" : "☰";
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("navigation-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.textContent = "☰";
  }));
}

function setupContactForm() {
  $("#contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const subject = String(form.get("subject") || "").trim() || `Contato pelo portfólio — ${name}`;
    const message = String(form.get("message") || "").trim();
    const feedback = $("#formFeedback");

    if (!name || !email || !message) {
      feedback.textContent = "Preencha nome, e-mail e mensagem.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = "Informe um endereço de e-mail válido.";
      return;
    }
    if (!data.profile.email || data.profile.email.startsWith("[") || !data.profile.email.includes("@")) {
      feedback.textContent = "Formulário validado. Configure seu e-mail em js/data.js para habilitar o envio.";
      return;
    }

    const body = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;
    window.location.href = `mailto:${encodeURIComponent(data.profile.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.textContent = "Seu aplicativo de e-mail será aberto para concluir o envio.";
  });
}

function init() {
  document.title = `${data.profile.name} | Portfólio`;
  renderProfile();
  renderHighlights();
  renderFocusAreas();
  renderTeaching();
  renderProjects();
  setupMenu();
  setupContactForm();
}

init();
