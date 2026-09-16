# Adding products

All products live in `dist/products.js`.

1. Copy one complete product block from `{` to `},`.
2. Paste it below the previous product.
3. Change the `id`, `number`, `name`, `type`, text, image path and model link.
4. Add the new image to `dist/assets`.
5. Publish the site again.

When a real model link is available, paste it into `modelUrl`. Until then, the detail view displays “Model link coming soon”.

The layout adjusts automatically. With an odd number of products, the final card spans both columns. After another product is added, the cards return to an even two-column grid without any CSS changes.

Before a public launch, replace the provisional email and the bracketed operator details in `dist/index.html` and `dist/terms.html` with accurate information. Update the privacy notice again if analytics, a contact form, embedded media or non-essential cookies are added.
