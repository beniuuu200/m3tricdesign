const catalog = document.querySelector("#catalog");
const detail = document.querySelector("#product-detail");
const detailInner = document.querySelector("#detail-inner");
const detailClose = document.querySelector("#detail-close");
const hero = document.querySelector(".hero");
const externalIcon = `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;

function cardTemplate(product, index) {
  return `
    <article class="product-card reveal" data-product-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}" style="--delay:${index * 110}ms">
      <figure>
        <img src="${product.image}" alt="${product.name}" style="object-position:${product.imagePosition}">
        <span class="card-number">${product.number}</span>
        <span class="card-action">View object ${externalIcon}</span>
      </figure>
      <div class="card-copy">
        <div><p>${product.type}</p><h3>${product.name}</h3></div>
        <p>${product.short}</p>
      </div>
    </article>`;
}

const catalogMode = catalog.dataset.mode || "featured";
const visibleProducts = catalogMode === "all"
  ? window.PRODUCTS
  : window.PRODUCTS.filter(product => product.featured !== false);

catalog.innerHTML = visibleProducts.map(cardTemplate).join("");
catalog.classList.toggle("has-odd", catalogMode === "featured" && visibleProducts.length % 2 === 1);

const galleryCount = document.querySelector("#gallery-count");
if (galleryCount) galleryCount.textContent = `${window.PRODUCTS.length} objects`;

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -5%" });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

function openProduct(product) {
  const link = product.modelUrl
    ? `<a class="model-link" href="${product.modelUrl}" target="_blank" rel="noopener noreferrer">Open 3D model ${externalIcon}</a>`
    : `<span class="model-link is-disabled" aria-disabled="true">Model link coming soon <span>Not available</span></span>`;

  detailInner.innerHTML = `
    <div class="detail-copy">
      <div>
        <p class="section-index">${product.number} / ${product.type}</p>
        <h2>${product.name}<span>.</span></h2>
      </div>
      <p>${product.description}</p>
    </div>
    <div class="detail-image"><img src="${product.image}" alt="${product.name}" style="object-position:${product.imagePosition}"></div>
    <div class="detail-meta">
      ${product.details.map((item, index) => `<div><span>0${index + 1}</span><p>${item}</p></div>`).join("")}
      ${link}
    </div>`;

  detail.hidden = false;
  document.body.classList.add("detail-open");
  requestAnimationFrame(() => detail.classList.add("is-open"));
  detailClose.focus();
}

function closeProduct() {
  detail.classList.remove("is-open");
  document.body.classList.remove("detail-open");
  window.setTimeout(() => { detail.hidden = true; }, 460);
}

catalog.addEventListener("click", event => {
  const card = event.target.closest(".product-card");
  if (!card) return;
  const product = window.PRODUCTS.find(item => item.id === card.dataset.productId);
  if (product) openProduct(product);
});

catalog.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".product-card");
  if (!card) return;
  event.preventDefault();
  card.click();
});

detailClose.addEventListener("click", closeProduct);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !detail.hidden) closeProduct();
});

if (hero) {
  let ticking = false;
  function updateHero() {
    const progress = Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight * 0.72));
    hero.style.setProperty("--scroll", progress.toFixed(3));
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHero);
      ticking = true;
    }
  }, { passive: true });
  updateHero();

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", event => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--grid-x", `${event.clientX - bounds.left}px`);
      hero.style.setProperty("--grid-y", `${event.clientY - bounds.top}px`);
      hero.classList.add("grid-active");
    });
    hero.addEventListener("pointerleave", () => hero.classList.remove("grid-active"));
  }
}
