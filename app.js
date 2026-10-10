const serviceContent = {
  strategy: {
    label: "ESTRATÉGIA DIGITAL",
    title: "Clareza para escolher o próximo passo.",
    description: "Descobrimos onde a mudança pode criar mais valor e desenhamos um caminho que a sua equipa consegue pôr em prática.",
    items: ["Diagnóstico e visão digital", "Roadmap de transformação", "Estratégia de produto"],
  },
  automation: {
    label: "AUTOMAÇÃO & IA",
    title: "Menos tarefas repetidas. Mais espaço para pensar.",
    description: "Automatizamos processos com critério e aplicamos inteligência artificial onde melhora o trabalho, sem acrescentar complexidade.",
    items: ["Automação de processos", "Assistentes com IA", "Integração de ferramentas"],
  },
  experience: {
    label: "EXPERIÊNCIA DIGITAL",
    title: "Experiências que fazem tudo parecer simples.",
    description: "Desenhamos produtos e serviços digitais intuitivos, alinhados com as necessidades das pessoas e os objetivos do negócio.",
    items: ["Pesquisa e UX", "Design de produto", "Websites e plataformas"],
  },
  data: {
    label: "DADOS & TECNOLOGIA",
    title: "Decisões melhores começam com bons sinais.",
    description: "Organizamos dados e sistemas para dar às equipas uma visão clara e uma base tecnológica pronta para evoluir.",
    items: ["Estratégia de dados", "Dashboards e analytics", "Arquitetura e integração"],
  },
};

const tabs = [...document.querySelectorAll(".service-tab")];
const panel = document.querySelector("#service-panel");

function selectService(tab, moveFocus = false) {
  const content = serviceContent[tab.dataset.service];
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", tab.id);
  panel.innerHTML = `<div class="service-icon" aria-hidden="true">↗</div>
    <p class="eyebrow">${content.label}</p>
    <h3>${content.title}</h3>
    <p class="service-description">${content.description}</p>
    <ul class="service-list">${content.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    <a class="text-link" href="#contacto">Fale connosco <span>↗</span></a>`;
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectService(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
      (index + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
    selectService(tabs[nextIndex], true);
  });
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".project-card").forEach((card) => {
      const visible = filter === "all" || card.dataset.category.split(" ").includes(filter);
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navLinks.classList.toggle("is-open", !isOpen);
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navLinks.classList.remove("is-open");
}));

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(`Contacto de ${formData.get("name")} — ${formData.get("service")}`);
  const body = encodeURIComponent([
    `Nome: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Área: ${formData.get("service")}`,
    "",
    `Mensagem: ${formData.get("message") || "Sem mensagem adicional."}`,
  ].join("\n"));
  formStatus.classList.remove("is-error");
  formStatus.textContent = "A abrir a sua aplicação de email para concluir o envio…";
  window.location.href = `mailto:ola@nortedigital.pt?subject=${subject}&body=${body}`;
});
