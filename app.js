const catalog = document.querySelector("#catalog");
const detail = document.querySelector("#product-detail");
const detailInner = document.querySelector("#detail-inner");
const detailClose = document.querySelector("#detail-close");
const hero = document.querySelector(".hero");

function cardTemplate(product, index) {
  return `
    <article class="product-card reveal" data-product-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}" style="--delay:${index * 110}ms">
      <figure>
        <img src="${product.image}" alt="${product.name}" style="object-position:${product.imagePosition}">
        <span class="card-number">${product.number}</span>
        <span class="card-action">View object <b aria-hidden="true">↗</b></span>
      </figure>
      <div class="card-copy">
        <div><p>${product.type}</p><h3>${product.name}</h3></div>
        <p>${product.short}</p>
      </div>
    </article>`;
}

catalog.innerHTML = window.PRODUCTS.map(cardTemplate).join("");
catalog.classList.toggle("has-odd", window.PRODUCTS.length % 2 === 1);

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
    ? `<a class="model-link" href="${product.modelUrl}" target="_blank" rel="noopener noreferrer">Open 3D model <span>↗</span></a>`
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
