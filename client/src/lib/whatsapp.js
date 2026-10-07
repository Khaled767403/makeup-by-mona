import { formatEGP } from "./format.js";

/**
 * Builds the structured WhatsApp message from the order object returned by
 * the checkout API (which already carries server-verified prices/totals).
 */
export function buildWhatsAppMessage(order) {
  const lines = [];
  lines.push("🛒 *Order Summary for Make up by mona*");
  lines.push("");
  lines.push(`*Order ID:* ${order.id}`);
  lines.push("");
  lines.push("*Items:*");
  order.items.forEach((item) => {
    const lineTotal = Number(item.priceSnapshot) * item.quantity;
    lines.push(`• ${item.titleSnapshot} x${item.quantity} = ${formatEGP(lineTotal)}`);
  });
  lines.push("");
  lines.push(`Subtotal: ${formatEGP(order.itemsTotal)}`);
  lines.push(`Delivery Fee: ${formatEGP(order.shippingFee)}`);
  lines.push(`*Total: ${formatEGP(order.grandTotal)}*`);
  lines.push("");
  lines.push("*Customer Info:*");
  lines.push(`Name: ${order.customerName}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push(`Governorate: ${order.governorate}`);
  lines.push(`Address: ${order.address}`);
  if (order.notes) lines.push(`Notes: ${order.notes}`);
  lines.push("");
  lines.push("Please confirm payment method (InstaPay, Vodafone Cash, or Bank Card) 💗");

  return lines.join("\n");
}

// whatsappNumber comes from the backend (Admin → Settings), fetched via
// publicApi.getStoreConfig() — never hardcoded, so Mona can change it anytime
// without a redeploy.
export function openWhatsAppCheckout(order, whatsappNumber) {
  if (!whatsappNumber) {
    console.warn("No WhatsApp number configured — set one from Admin → Settings.");
    return;
  }
  const message = buildWhatsAppMessage(order);
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
