# GTM-Kit

> **Status: Archived on 2026-11-25**. Shopify GTM Kit v1.0 by Analyzify: a Customer Events custom pixel plus an importable Google Tag Manager container for GA4 and Google Ads.

## What it is

An open-source kit for Shopify merchants: `customer-events-pixel.js` (a custom pixel for Shopify Admin > Settings > Customer Events that injects GTM and pushes enhanced e-commerce `ee_*` events to the dataLayer) and `container/gtm-kit.json` (a GTM container with 12 tags for GA4 and Google Ads).

## Why it existed

A free, open-source successor to the Shopify GA4 Kit built on Shopify's Customer Events API, meant as content and a lead magnet for Analyzify. The pixel script was started in April 2024 and the kit (README, container, docs) was finished as v1.0 in June 2025 by the Analyzify tracking team.

## Status

Archived on 2026-11-25 as part of the analyzify GitHub org cleanup. No changes since 2025-06-26. The repo stays read-only for reference.

## Where it ran

| What | Value |
|---|---|
| Domains / URLs | None found. The README links help articles on https://docs.analyzify.com (they serve 200). No analyzify.com landing page for the kit was found (https://analyzify.com/shopify-gtm-kit returns 404). |
| Hosting | None. The pixel runs in the merchant's Shopify Customer Events sandbox; the container is imported into the merchant's own GTM account. |
| DNS zone | None. |
| Database | None. |
| Storage | None. |
| Deploy | None. Merchants paste the pixel and import the container by hand. |

## Tech stack

JavaScript for the Shopify Customer Events (Web Pixels) API, Google Tag Manager container export (JSON), GA4, Google Ads.

## History

- First commit: 2024-04-15 ("Create customer-events-pixel.js"); last commit: 2025-06-26; 25 commits.
- Authors: the Analyzify tracking team.
- 2024-04-15: pixel script created; 2024-07-24: two updates.
- 2025-06-19 to 2025-06-23: pixel reworked, README written, GTM container info added.
- 2025-06-26: container and documentation updated (v1.0), last change.
- No pull requests or issues.
- 2026-11-25: archived.

## Related repos

- https://github.com/analyzify/shopify-ga4-kit: the 2022 predecessor (theme data layers).
- https://github.com/analyzify/shopify-pixels: the 2022 GA4 custom pixel.

## Who to ask

The Analyzify team (via https://analyzify.com).

## Answers from the team

- 2026-11-25 (tracking team): the kit was created at the owners' request as a free, open-source resource for the community and a simplified version of Analyzify's own GTM setup. Where it was published or promoted is not known; it may have had a dedicated page or been linked from an article or blog post.

## Original README

### Shopify GTM Kit by Analyzify (v1.0)

A simple and flexible open-source kit to integrate Google Tag Manager (GTM) into your Shopify store with minimal setup.
It captures **enhanced-ecommerce** events via Shopify’s Customer Events API and forwards them to **Google Tag Manager**.
Ideal for GA4, Google Ads, and any GTM-compatible destination.

This kit is designed to simplify the process of adding GTM to your Shopify store.  
It includes:
- A ready-to-use GTM container with essential tags, triggers, and variables
- A custom data layer setup tailored for Shopify Customer Events structure

---

#### Contents

| File                       | Purpose                                                                                  |
|----------------------------|------------------------------------------------------------------------------------------|
| `customer-events-pixel.js` | Core script (place in *Online Store → Customer Events*).                                 |
| `README.md`                | Setup guide & developer notes.                                                           |
| `gtm-kit.json`             | Exported GTM container file including tags, triggers, and variables (to import in GTM).  |

---

#### Quick Start

Before you import the GTM container and set up the pixel script, make sure you have the following accounts and information ready:

##### Step 1: Collect Required Variables

| Variable Name         | Where to Find It                                                                                                                                                              |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GTM ID`              | GTM Dashboard → Top-right corner (e.g., `GTM-XXXXXXX`)                                                                                                                        |
| `Measurement ID`      | GA4 → Admin → Data Collection and Modification → Data Streams → Choose your web stream or create one if you do not have any → Measurement ID                                  |
| `Conversion ID`       | Google Ads → Goals → Conversions → Choose conversion action → Tag Setup → Select GTM ([how to find](https://docs.analyzify.com/find-your-google-ads-conversion-id-and-label)) |
| `Conversion Label(s)` | Google Ads → Goals → Conversions → Choose conversion action → Tag Setup → Select GTM ([how to find](https://docs.analyzify.com/find-your-google-ads-conversion-id-and-label)) |

If you haven’t set up the necessary accounts yet, you can create them using the links below:

👉 [Google Analytics (GA4)](https://analytics.google.com/)  
👉 [Google Ads](https://ads.google.com/)  
👉 [Google Tag Manager](https://tagmanager.google.com/)

If you don’t have any conversion actions set up in Google Ads and you don't know how to create them, follow this guide:  
👉 [How to create a Google Ads conversion](https://docs.analyzify.com/how-to-create-a-new-google-ads-conversion)

---

##### Step 2: Add custom pixel to your shop

1. Go to **Shopify Admin → Settings → Customer Events**
2. Click **“Add custom pixel”**, paste the contents of `customer-events-pixel.js`, and name it **Analyzify GTM Kit v1.0**
3. **Edit the constants** at the top of the file:  

```js
const GTM_ID             = "GTM-XXXXXXX"; // ← your GTM container
const google_feed_region = "US";          // ← two-letter region code
const debugMode          = false;         // ← disable in production
```

4. Publish the Customer Event.
5. Reload your store; open DevTools → Console to verify logs (debug mode only).
6. Confirm events appear in your GTM Preview and GA4/Ads debugger.

##### Configuration

| Constant               | Required | Description                                                                                                                                                                             |
|------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GTM_ID`               | Yes      | Format `GTM-XXXXXXX`. Adds the GTM container to every page when the first `page_viewed` event fires.                                                                                   |
| `google_feed_region`  | Yes      | Region used in your Google Merchant feed ID (e.g. `US`, `GB`).                                                                                                                          |
| `google_business_vertical` | No  | Keep `retail` unless you run a service business.                                                                                                                                        |
| `debugMode`            | No       | Prints verbose console logs & prevents silent failures while testing. <br>⚠️ Note: Shopify Customer Events run in a sandbox, so GTM Preview Mode won’t function. Use console logs instead or test via Shopify Pixel Test Mode. |

> [!IMPORTANT]  
> The script injects GTM automatically. Remove any other GTM snippet to avoid duplicate container loads.

--- 
##### Step 3: GTM-kit container
> [!Warning]  
> The container does **not** include your measurement IDs (like GA4 or Google Ads) — you’ll need to update those after import.

##### How to Import

1. Go to your [Google Tag Manager](https://tagmanager.google.com) account
2. Open the container you want to use
3. Navigate to **Admin → Import Container**
4. Select and upload the provided `gtm-kit.json` file from this repo
5. Choose your target workspace:
   - Use **Default Workspace**, or
   - Create a new one for clean start
6. Select:
   - **Merge** (if you already have tags and want to add ours), or
   - **Overwrite** (to replace your current setup entirely)
7. Click **Confirm** and review all the imported tags, triggers, and variables

###### After Import: Update Required Variables

Once the container is imported:

- Go to the **Variables** section in the left sidebar.
- Update the following variables:
   - **Conversion ID** – used for Google Ads conversions.
   - **Measurement ID** – used for GA4 data streams.
   - Optional: Add **conversion labels** for events like `add_to_cart`, `view_item`, and `purchase`.

###### Product ID Format (Optional)

- The default product ID format is `Product ID`.
- If you prefer, you can update this to use:
   - `SKU`
   - `Variant ID`
- This can help align your GTM data with your Merchant Center or feed setup.

> [!NOTE]  
> Make sure to **publish** your container after making changes, since GTM Preview Mode won’t function in Shopify Customer Events sandbox

---

#### Event Mapping

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

---

#### Gotchas & Troubleshooting

| Symptom                             | Fix                                                                                                                                                     |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Two GTM containers in source        | Remove any hard-coded `gtm.js` snippets – this script injects GTM dynamically.                                                                           |
| Duplicate `ee_*` hits               | The script uses internal flags to prevent double-firing during checkout reloads. Still seeing duplicates? Clear `localStorage` & test again.             |
| GTM Preview shows hits but GA4 doesn’t | Verify GA4 tag fires on corresponding `ee_*` events. Also check currency/ID mismatches.                                                                  |
| Google Ads feed errors              | Ensure `google_feed_region` matches your Google Merchant Center region and your IDs follow the pattern `shopify_<region>_<product.id>_<variant.id>`.    |

---

#### Contributing

PRs welcome! Please follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) standards (`feat:`, `fix:`, etc.).
> The formatting is intentional to ensure compatibility, readability, and maintainability within the Shopify Customer Events environment.

---

#### License

MIT – do whatever you want, but keep the copyright notice.
