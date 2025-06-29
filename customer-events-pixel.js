/* ------------------------------------------------------------------------
  Shopify Customer Events Pixel
  ------------------------------------------------------------------------
  Description  :  Sends enhanced-ecommerce events from Shopify’s Customer Events
                  API to Google Tag Manager (GTM) + Google Ads.
  Author       :  Analyzify
  Version      :  1.0.0
  ------------------------------------------------------------------------
  REQUIRED SET-UP
    • GTM_ID                 – Replace "GTM-XXXXXXXX" with your own container ID.
    • google_feed_region     – Two-letter feed region code used in your
                               Google Merchant Center feed (e.g. "US", "UK").
    • (Optional) debugMode   – Set to false in production.
  ---------------------------------------------------------------------- */

/* ============
   GLOBAL CONFIG
   ============ */
const GTM_ID = "GTM-XXXXXXXX"; // ← GTM container ID (UA-, GA4, or server-side)
const google_feed_region = "YY"; // ← Merchant-Center region code
const google_business_vertical = "retail"; // Keep as-is unless you sell services
const debugMode = true; // Toggle verbose console logs

/* ============
   ADDITONAL CONFIG
   ============ */
const version = "1.0.0";
const debugStyle = "background: #747bd5; color: #c9d1d9; padding: 3px;";
const debugMsg = "Analyzify GTM Kit ->";

window.dataLayer = window.dataLayer || [];

/* ====================
   GOOGLE TAG MANAGER
   ==================== */
function GTM_init() {
  // GTM INITIALIZATION
  window.dataLayer = window.dataLayer || [];

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", GTM_ID);

  if (debugMode) console.log("%c%s Initiated", debugStyle, debugMsg);
}

/* =========
   HELPERS
   ========= */

/**
 * Transforms a Shopify product/variant object to a Google Ads-ready
 * item schema.  Update here if you need extra attributes.
 */
const getItemObj = function (item) {
  return {
    item_id: item.product.id,
    item_name: item.product.title,
    item_type: item.product.type,
    item_vendor: item.product.vendor,
    item_sku: item.sku,
    item_variant: item.title,
    item_variant_id: item.id,
    price: item.price.amount,
    quantity: item.quantity || 1,
    currency: item.price.currencyCode,
    id: "shopify_" + google_feed_region + "_" + item.product.id + "_" + item.id,
    business_vertical: google_business_vertical || "retail",
  };
};

/**
 * Normalises customer information – looks first at shipping, then billing.
 * Add or remove fields as required by your ad platform.
 */
const getUserData = function (userObj) {
  const checkUserData =
    userObj.shippingAddress && userObj.shippingAddress.lastName ? userObj.shippingAddress : userObj.billingAddress && userObj.billingAddress.lastName ? userObj.billingAddress : {};
  return {
    user: {
      email: userObj.email || checkUserData.email || null,
      phone: userObj.phone || checkUserData.phone || null,
      first_name: checkUserData.firstName || null,
      last_name: checkUserData.lastName || null,
      address1: checkUserData.address1 || null,
      address2: checkUserData.address2 || null,
      city: checkUserData.city || null,
      country: checkUserData.country || null,
      countryCode: checkUserData.countryCode || null,
      province: checkUserData.province || null,
      provinceCode: checkUserData.provinceCode || null,
      zip: checkUserData.zip || null,
    },
  };
};

/* Sum helper for line-item arrays */
const getTotalPrice = function (price) {
  return price.reduce((a, b) => a + b.price, 0);
};

/* Universal push wrapper to keep logs consistent */
const pushDataLayer = function (event, data) {
  window.dataLayer.push({
    event,
    analyzify_source: "gtm-kit",
    ...data,
    debug_mode: debugMode || false,
    eventCallback: () => {
      if (debugMode) console.log(`%c%s Event "${event}" pushed successfully.`, debugStyle, debugMsg);
      if (debugMode) console.log(`%c%s dataLayer`, debugStyle, debugMsg);
    },
  });
  if (debugMode){
    console.group('GTM Kit Debugger');
    console.log(`%c%s ${event}`, debugStyle, debugMsg, data);
    console.log(window.dataLayer);
    console.groupEnd();
  }
};

if (debugMode) console.log("%c%s" + GTM_ID + " initiated. Version: " + version, debugStyle, debugMsg);

/* ======================
   BUILT-IN ANALYTICS EVENTS
   ====================== */

/* --------
   PAGE VIEW
   -------- */
analytics.subscribe("page_viewed", (event) => {
  GTM_init(); // Inject GTM script on the first page view
  const { document } = event.context;
  const page_location = encodeURI(document.location.href);
  const page_path = document.location.pathname;
  const query = document.location.search;
  const hostname = document.location.hostname;
  const page_referrer = document.referrer;
  const page_title = document.title;
  pushDataLayer("ee_page_view", {
    page_title: page_title,
    query: query,
    hostname: hostname,
    page_path: page_path,
    page_referrer: page_referrer,
    page_location: page_location,
  });
});

/* --------
   SEARCH
   -------- */
analytics.subscribe("search_submitted", (event) => {
  const productData = event.data.searchResult.productVariants.map(
    (item, index) => {
      const itemData = getItemObj(item);
      return {
        ...itemData,
        index: index + 1,
      };
    }
  );

  pushDataLayer("ee_search", {
    search_term: event.data.searchResult.query,
    ecommerce: {
      items: productData,
      value: getTotalPrice(productData),
      currency: productData[0]?.currency,
    },
  });
});

// ECOMMERCE EVENTS
/* ---------------
   COLLECTION VIEW
   --------------- */
// Scope: data.collection.productVariants
analytics.subscribe("collection_viewed", (event) => {
  const productData = event.data.collection.productVariants.map(
    (item, index) => {
      const itemData = getItemObj(item);
      return {
        ...itemData,
        index: index + 1,
      };
    }
  );

  pushDataLayer("ee_view_item_list", {
    ecommerce: {
      item_list_id: event.data.collection.id,
      item_list_name: event.data.collection.title,
      items: productData,
      value: getTotalPrice(productData),
      currency: productData[0].currency,
    },
  });
});

/* --------------
   PRODUCT DETAIL
   -------------- */
// Scope: data.productVariant
analytics.subscribe("product_viewed", (event) => {
  const productData = getItemObj(event.data.productVariant);
  pushDataLayer("ee_view_item", {
    ecommerce: {
      items: [productData],
      value: productData.price,
      currency: productData.currency,
    },
  });
});

/* ------------
   CART ACTIONS
   ------------ */
// Scope: data.cartLine.merchandise
analytics.subscribe("product_added_to_cart", (event) => {
  const cartData = event.data.cartLine;
  const productData = getItemObj(cartData.merchandise);
  pushDataLayer("ee_add_to_cart", {
    ecommerce: {
      items: [productData],
      value: cartData.cost.totalAmount.amount,
      currency: cartData.cost.totalAmount.currencyCode,
    },
  });
});

analytics.subscribe("product_removed_from_cart", (event) => {
  const cartData = event.data.cartLine;
  const productData = getItemObj(cartData.merchandise);
  pushDataLayer("ee_remove_from_cart", {
    ecommerce: {
      items: [productData],
      value: cartData.cost.totalAmount.amount,
      currency: cartData.cost.totalAmount.currencyCode,
    },
  });
});

analytics.subscribe("cart_viewed", (event) => {
  const cartData = event.data.cart;
  const productData = cartData.lines.map((item) => {
    const itemData = getItemObj(item.merchandise);
    return {
      ...itemData,
      quantity: item.quantity,
    };
  });
  pushDataLayer("ee_view_cart", {
    ecommerce: {
      items: productData,
      value: cartData.cost.totalAmount.amount,
      currency: cartData.cost.totalAmount.currencyCode,
    },
  });
});

/* -----------
   CHECKOUT FUNNEL
   ----------- */
// Scope: data.checkout.merchandise
analytics.subscribe("checkout_started", (event) => {
  const checkoutData = event.data.checkout;
  const productData = checkoutData.lineItems.map((item) => {
    const itemData = getItemObj(item.variant);
    return {
      ...itemData,
      quantity: item.quantity,
    };
  });
  const userData = getUserData(checkoutData);
  pushDataLayer("ee_begin_checkout", {
    ...userData,
    checkout_step: "started",
    ecommerce: {
      items: productData,
      coupon: checkoutData.discountApplications.title || null,
      discount: checkoutData.discountApplications.value || 0,
      value: checkoutData.totalPrice.amount,
      currency: checkoutData.currencyCode,
      subtotal: checkoutData.subtotalPrice.amount,
      shipping: checkoutData.shippingLine.price.amount || 0,
      tax: checkoutData.totalTax.amount || 0,
    },
  });
});

/* Flags prevent duplicate firing on the same page reload */
let contactInfoSubmittedProcessed = false;
let addressInfoSubmittedProcessed = false;
let shippingInfoSubmittedProcessed = false;

/* Contact Info */
analytics.subscribe("checkout_contact_info_submitted", (event) => {
  if (!contactInfoSubmittedProcessed) {
    const checkoutData = event.data.checkout;
    const productData = checkoutData.lineItems.map((item) => {
      const itemData = getItemObj(item.variant);
      return {
        ...itemData,
        quantity: item.quantity,
      };
    });
    const userData = getUserData(checkoutData);
    pushDataLayer("ee_add_contact_info", {
      ...userData,
      checkout_step: "contact",
      ecommerce: {
        items: productData,
        coupon: checkoutData.discountApplications.title || null,
        discount: checkoutData.discountApplications.value || 0,
        value: checkoutData.totalPrice.amount,
        currency: checkoutData.currencyCode,
        subtotal: checkoutData.subtotalPrice.amount,
        shipping: checkoutData.shippingLine.price.amount || 0,
        tax: checkoutData.totalTax.amount || 0,
      },
    });
    contactInfoSubmittedProcessed = true;
  }
});
/* Address Info */
analytics.subscribe("checkout_address_info_submitted", (event) => {
  if (!addressInfoSubmittedProcessed) {
    const checkoutData = event.data.checkout;
    const productData = checkoutData.lineItems.map((item) => {
      const itemData = getItemObj(item.variant);
      return {
        ...itemData,
        quantity: item.quantity,
      };
    });
    const userData = getUserData(checkoutData);
    pushDataLayer("ee_add_address_info", {
      ...userData,
      checkout_step: "address",
      ecommerce: {
        items: productData,
        coupon: checkoutData.discountApplications.title || null,
        discount: checkoutData.discountApplications.value || 0,
        value: checkoutData.totalPrice.amount,
        currency: checkoutData.currencyCode,
        subtotal: checkoutData.subtotalPrice.amount,
        shipping: checkoutData.shippingLine.price.amount || 0,
        tax: checkoutData.totalTax.amount || 0,
      },
    });
    addressInfoSubmittedProcessed = true;
  }
});
/* Shipping Info */
analytics.subscribe("checkout_shipping_info_submitted", (event) => {
  if (!addressInfoSubmittedProcessed) {
    const checkoutData = event.data.checkout;
    const productData = checkoutData.lineItems.map((item) => {
      const itemData = getItemObj(item.variant);
      return {
        ...itemData,
        quantity: item.quantity,
      };
    });
    const userData = getUserData(checkoutData);
    if (eventFlags.checkout_shipping_info_submitted) {
      pushDataLayer("ee_add_shipping_info", {
        ...userData,
        checkout_step: "shipping",
        ecommerce: {
          items: productData,
          coupon: checkoutData.discountApplications.title || null,
          discount: checkoutData.discountApplications.value || 0,
          value: checkoutData.totalPrice.amount,
          currency: checkoutData.currencyCode,
          subtotal: checkoutData.subtotalPrice.amount,
          shipping: checkoutData.shippingLine.price.amount || 0,
          tax: checkoutData.totalTax.amount || 0,
        },
      });
    }
    shippingInfoSubmittedProcessed = true;
  }
});
/* Payment Info */
analytics.subscribe("payment_info_submitted", (event) => {
  const checkoutData = event.data.checkout;
  const productData = checkoutData.lineItems.map((item) => {
    const itemData = getItemObj(item.variant);
    return {
      ...itemData,
      quantity: item.quantity,
    };
  });
  const userData = getUserData(checkoutData);
  pushDataLayer("ee_add_payment_info", {
    ...userData,
    checkout_step: "payment",
    ecommerce: {
      items: productData,
      coupon: checkoutData.discountApplications.title || null,
      discount: checkoutData.discountApplications.value || 0,
      value: checkoutData.totalPrice.amount,
      currency: checkoutData.currencyCode,
      subtotal: checkoutData.subtotalPrice.amount,
      shipping: checkoutData.shippingLine.price.amount || 0,
      tax: checkoutData.totalTax.amount || 0,
    },
  });
});
/* Purchase / Thank You */
analytics.subscribe("checkout_completed", (event) => {
  GTM_init(); // Ensure GTM loads on the thank-you page
  const checkoutData = event.data.checkout;
  const productData = checkoutData.lineItems.map((item) => {
    const itemData = getItemObj(item.variant);
    return {
      ...itemData,
      quantity: item.quantity,
    };
  });
  const userData = getUserData(checkoutData);

  pushDataLayer("ee_purchase", {
    ...userData,
    checkout_step: "thank_you",
    ecommerce: {
      items: productData,
      coupon: checkoutData.discountApplications.title || null,
      discount: checkoutData.discountApplications.value || 0,
      value: checkoutData.totalPrice.amount,
      currency: checkoutData.currencyCode,
      subtotal: checkoutData.subtotalPrice.amount,
      shipping: checkoutData.shippingLine.price.amount || 0,
      tax: checkoutData.totalTax.amount || 0,
      transaction_id: checkoutData.order.id || null,
      payment_type: checkoutData.transactions.length > 0 ? checkoutData.transactions[0].gateway : null,
    },
  });
});
