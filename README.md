# Shopify Customer Events Pixel (GTM Kit)

Collects **enhanced-ecommerce** events from Shopify’s Customer Events API and forwards them to **Google Tag Manager**.  
Ideal for GA4, Google Ads, and any GTM-compatible destination.

---

## Contents

| File | Purpose |
|------|---------|
| `customer-events-pixel.js` | Core script (place in *Online Store → Customer Events*). |
| `README.md` | Setup guide & developer notes. |

---

## Quick Start

1. **Copy** `customer-events-pixel.js` into **Settings → Customer Events** in your Shopify Admin.  
2. **Edit the constants** at the top of the file:  

```js
const GTM_ID             = "GTM-XXXXXXX"; // ← your GTM container
const google_feed_region = "US";          // ← two-letter region code
const debugMode          = false;         // ← disable in production
```

3.	Publish the Customer Event.
4.	Reload your store; open DevTools → Console to verify logs (debug mode only).
5.	Confirm events appear in your GTM Preview and GA4/Ads debugger.

### Configuration

| Constant               | Required | Description                                                                                                                                                                             |
|------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GTM_ID`               | Yes      | Format `GTM-XXXXXXX`. Adds the GTM container to every page when the first `page_viewed` event fires.                                                                                   |
| `google_feed_region`  | Yes      | Region used in your Google Merchant feed ID (e.g. `US`, `GB`).                                                                                                                          |
| `google_business_vertical` | No  | Keep `retail` unless you run a service business.                                                                                                                                        |
| `debugMode`            | No       | Prints verbose console logs & prevents silent failures while testing. <br>⚠️ Note: Shopify Customer Events run in a sandbox, so GTM Preview Mode won’t function. Use console logs instead or test via Shopify Pixel Test Mode. |

> **Heads-up:** The script injects GTM automatically. Remove any other GTM snippet to avoid duplicate container loads.

## Event Mapping

| Shopify Event                    | GTM Event           | GA4/Ads Action                                |
|----------------------------------|---------------------|-----------------------------------------------|
| `page_viewed`                    | `ee_page_view`      | Page View                                     |
| `search_submitted`              | `ee_search`         | View Search Results                           |
| `collection_viewed`             | `ee_view_item_list` | View Item List                                |
| `product_viewed`                | `ee_view_item`      | View Item                                     |
| `product_added_to_cart`         | `ee_add_to_cart`    | Add To Cart                                   |
| `product_removed_from_cart`     | `ee_remove_from_cart` | Remove From Cart                             |
| `cart_viewed`                   | `ee_view_cart`      | View Cart                                     |
| `checkout_started`              | `ee_begin_checkout` | Begin Checkout                                |
| `checkout_*_info_submitted`     | `ee_add_*_info`     | Add Contact / Address / Shipping / Payment Info |
| `checkout_completed`            | `ee_purchase`       | Purchase                                      |

All ecommerce events follow Google’s Enhanced Ecommerce `items[]` spec and include:

- `value`, `currency`
- `coupon`, `discount`, `subtotal`, `shipping`, `tax`
- Unique `transaction_id` on purchase
- Anon-safe `user` object with email/phone/address when available

## Gotchas & Troubleshooting

| Symptom                             | Fix                                                                                                                                                     |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Two GTM containers in source        | Remove any hard-coded `gtm.js` snippets – this script injects GTM dynamically.                                                                           |
| Duplicate `ee_*` hits               | The script uses internal flags to prevent double-firing during checkout reloads. Still seeing duplicates? Clear `localStorage` & test again.             |
| GTM Preview shows hits but GA4 doesn’t | Verify GA4 tag fires on corresponding `ee_*` events. Also check currency/ID mismatches.                                                                  |
| Google Ads feed errors              | Ensure `google_feed_region` matches your Google Merchant Center region and your IDs follow the pattern `shopify_<region>_<product.id>_<variant.id>`.    |
| GTM tags not firing as expected     | GTM Preview Mode does not work inside Shopify’s Customer Events sandbox. This means unpublished changes in your GTM container will not be recognized. **You must publish your GTM container after every change** to test it live. Suggestion: group changes together, publish once, then verify using browser console logs or Shopify’s Pixel Test Mode. |
---

## Contributing

PRs welcome! Follow conventional commits (`feat:`, `fix:`…) & run Prettier before pushing.

---

## License

MIT – do whatever you want, but keep the copyright notice.
