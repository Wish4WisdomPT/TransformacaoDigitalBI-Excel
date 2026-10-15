const serviceContent = {
  diagnostic: {
    label: "DIAGNÓSTICO DE DADOS",
    title: "Saiba onde o reporting pode melhorar.",
    description: "Mapeamos fontes, ficheiros e necessidades da equipa para definir prioridades e um plano de trabalho claro.",
    items: ["Levantamento de processos", "Qualidade e organização dos dados", "Plano de próximos passos"],
  },
  powerbi: {
    label: "DASHBOARD POWER BI",
    title: "Indicadores claros, numa única vista.",
    description: "Desenhamos relatórios Power BI ajustados às perguntas do negócio e às fontes de dados disponíveis.",
    items: ["Modelo de dados", "Relatórios e indicadores", "Validação com a equipa"],
  },
  excel: {
    label: "AUTOMAÇÃO EXCEL",
    title: "Menos tarefas repetidas na preparação dos dados.",
    description: "Organizamos e automatizamos fluxos em Excel e Power Query para tornar o reporting mais consistente.",
    items: ["Power Query", "Consolidação de ficheiros", "Automatização de tarefas"],
  },
  training: {
    label: "FORMAÇÃO E SUPORTE",
    title: "Mais autonomia para a sua equipa.",
    description: "Apoiamos a utilização e evolução dos relatórios com formação prática e acompanhamento definido em conjunto.",
    items: ["Formação Power BI e Excel", "Documentação", "Apoio à evolução"],
  },
};

const tabs = [...document.querySelectorAll(".service-tab")];
const panel = document.querySelector("#service-panel");

function selectService(tab, moveFocus = false) {
  const content = serviceContent[tab.dataset.service];
  if (!content) return;
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", tab.id);
  panel.innerHTML = `<div class="service-icon" aria-hidden="true">${tab.textContent.trim().slice(0, 2)}</div>
    <p class="eyebrow">${content.label}</p>
    <h3>${content.title}</h3>
    <p class="service-description">${content.description}</p>
    <ul class="service-list">${content.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    <a class="text-link" href="#contacto">Falar sobre o meu caso <span>↗</span></a>`;
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
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const endpoint = contactForm.dataset.endpoint.trim();
  const submitButton = contactForm.querySelector('[type="submit"]');
  const fields = [
    ["Nome", formData.get("name")],
    ["Email", formData.get("email")],
    ["Empresa", formData.get("company") || "Não indicado"],
    ["Ferramentas", formData.get("tools")],
    ["Desafio", formData.get("problem")],
    ["Contexto", formData.get("message") || "Não indicado"],
  ];

  if (!endpoint) {
    const summary = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      formStatus.classList.remove("is-error");
      formStatus.textContent = "Resumo copiado. O formulário ainda não envia dados: configure o endpoint de contacto para receber pedidos.";
    } catch {
      formStatus.classList.add("is-error");
      formStatus.textContent = `O formulário ainda não envia dados. Copie este resumo:\n${summary}`;
    }
    return;
  }

  submitButton.disabled = true;
  formStatus.classList.remove("is-error");
  formStatus.textContent = "A enviar o pedido…";
  try {
    const response = await fetch(endpoint, { method: "POST", body: formData, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Submission failed");
    contactForm.reset();
    formStatus.textContent = "Pedido enviado. Obrigado pelo contacto.";
  } catch {
    formStatus.classList.add("is-error");
    formStatus.textContent = "Não foi possível enviar o pedido agora. Tente novamente mais tarde.";
  } finally {
    submitButton.disabled = false;
  }
});
