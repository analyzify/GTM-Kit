# Shopify GTM Kit by Analyzify (v1.0)

A simple and flexible open-source kit to integrate Google Tag Manager (GTM) into your Shopify store with minimal setup.
It captures **enhanced-ecommerce** events via Shopify’s Customer Events API and forwards them to **Google Tag Manager**.
Ideal for GA4, Google Ads, and any GTM-compatible destination.

This kit is designed to simplify the process of adding GTM to your Shopify store.  
It includes:
- A ready-to-use GTM container with essential tags, triggers, and variables
- A custom data layer setup tailored for Shopify Customer Events structure

---

## Contents

| File | Purpose |
|------|---------|
| `customer-events-pixel.js` | Core script (place in *Online Store → Customer Events*). |
| `README.md` | Setup guide & developer notes. |

---

## Preparation

Before you import the GTM container and set up the pixel script, make sure you have the following accounts and information ready:

### Step 1: Create a Google Tag Manager (GTM) Account
- If you don’t have a GTM account, create one 👉 [GTM](https://tagmanager.google.com)
- After creating the account, note your **GTM Container ID** (e.g., `GTM-XXXXXXX`)

### Step 2: Create a GA4 Property
- Go to 👉 [Google Analytics](https://analytics.google.com/)
- Create a new **GA4 property** (or use an existing one)
- Navigate to: **Admin → Data Streams → Web**
- Note down your **Measurement ID** (e.g., `G-XXXXXXXXXX`)

### Step 3: Create a Google Ads Account *(Optional, but recommended)*
- Visit 👉 [Google Ads](https://ads.google.com/)
- After account setup, if you don't have conversions, create them ([how to create conversions](https://docs.analyzify.com/how-to-create-a-new-google-ads-conversion))
- Note down:
   - Your **Conversion ID**
   - Your **Conversion Labels** for key events ( for this container you need: `add_to_cart`, `view_item`, and `purchase` as a starter )

### Step 4: Collect Required Variables

| Variable Name         | Where to Find It                                                                                                                                                             |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GTM ID`              | GTM Dashboard → Top-right corner (e.g., `GTM-XXXXXXX`)                                                                                                                            |
| `Measurement ID`      | GA4 → Admin → Data Collection and Modification → Data Streams → Choose your web stream or create one if you do not have any → Measurement ID                                 |
| `Conversion ID`       | Google Ads → Goals → Conversions → Choose conversion action → Tag Setup → Select GTM ([how to find](https://docs.analyzify.com/find-your-google-ads-conversion-id-and-label)) |
| `Conversion Label(s)` | Google Ads → Goals → Conversions → Choose conversion action → Tag Setup → Select GTM ([how to find](https://docs.analyzify.com/find-your-google-ads-conversion-id-and-label)) |

---

## Quick Start

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

### Configuration

| Constant               | Required | Description                                                                                                                                                                             |
|------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GTM_ID`               | Yes      | Format `GTM-XXXXXXX`. Adds the GTM container to every page when the first `page_viewed` event fires.                                                                                   |
| `google_feed_region`  | Yes      | Region used in your Google Merchant feed ID (e.g. `US`, `GB`).                                                                                                                          |
| `google_business_vertical` | No  | Keep `retail` unless you run a service business.                                                                                                                                        |
| `debugMode`            | No       | Prints verbose console logs & prevents silent failures while testing. <br>⚠️ Note: Shopify Customer Events run in a sandbox, so GTM Preview Mode won’t function. Use console logs instead or test via Shopify Pixel Test Mode. |

> [!IMPORTANT]  
> The script injects GTM automatically. Remove any other GTM snippet to avoid duplicate container loads.

## GTM-kit container
> [!Warning]  
> The container does **not** include your measurement IDs (like GA4 or Google Ads) — you’ll need to update those after import.

### How to Import

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

#### After Import: Update Required Variables

Once the container is imported:

- Go to the **Variables** section in the left sidebar.
- Update the following variables:
   - **Conversion ID** – used for Google Ads conversions.
   - **Measurement ID** – used for GA4 data streams.
   - Optional: Add **conversion labels** for events like `add_to_cart`, `view_item`, and `purchase`.

#### Product ID Format (Optional)

- The default product ID format is `Product ID`.
- If you prefer, you can update this to use:
   - `SKU`
   - `Variant ID`
- This can help align your GTM data with your Merchant Center or feed setup.

> [!NOTE]  
> Make sure to **publish** your container after making changes, since GTM Preview Mode won’t function in Shopify Customer Events sandbox

---

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

---

## Gotchas & Troubleshooting

| Symptom                             | Fix                                                                                                                                                     |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Two GTM containers in source        | Remove any hard-coded `gtm.js` snippets – this script injects GTM dynamically.                                                                           |
| Duplicate `ee_*` hits               | The script uses internal flags to prevent double-firing during checkout reloads. Still seeing duplicates? Clear `localStorage` & test again.             |
| GTM Preview shows hits but GA4 doesn’t | Verify GA4 tag fires on corresponding `ee_*` events. Also check currency/ID mismatches.                                                                  |
| Google Ads feed errors              | Ensure `google_feed_region` matches your Google Merchant Center region and your IDs follow the pattern `shopify_<region>_<product.id>_<variant.id>`.    |

---

## Contributing

PRs welcome! Please follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) standards (`feat:`, `fix:`, etc.).
> The formatting is intentional to ensure compatibility, readability, and maintainability within the Shopify Customer Events environment.

---

## License

MIT – do whatever you want, but keep the copyright notice.
