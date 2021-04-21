const HOST = "http://localhost";
const SALEOR_HOST = "https://saleor-host";
const SHIPPING_PRICE_DEFAULT = "100.00";
const countries_ = [{ name: "Thailand", code: "th" }];
// Mocked Elm app object
const app = {
  ports: {
    pages_shipping_fetchReceived: { send() {} },
  },
};

// 🅰️ Action
async function main() {
  const cartId = getUrlQuery("cart_id", location.search);
  const cart = await fetchCart(HOST, cartId); // 🅰️ Action
  const items = await constructItems(cart, SALEOR_HOST); // 🅰️ Action
  const totalPriceOfCart = items
    .map((p) => p.price.total)
    .reduce((a, b) => a + b, 0);
  const cartModel = {
    id: cartId,
    products: items,
    subtotal: Number(totalPriceOfCart).toLocaleString(),
    shippingPrice: Number(SHIPPING_PRICE_DEFAULT).toLocaleString(),
    total: Number(totalPriceOfCart + SHIPPING_PRICE_DEFAULT).toLocaleString(),
  };

  const countries = countries_
    .map((c) => ({ name: c.name, code: c.code }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const toElm = {
    cart: cartModel,
    countries,
  };

  setTimeout(() => {
    app.ports.pages_shipping_fetchReceived.send(toElm); // 🅰️ Action
  }, 1500);
}

// 💚 Calculation
// Make locationSearch a function argument
export function getUrlQuery(name, locationSearch) {
  const name_ = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name_ + "=([^&#]*)");
  const results = regex.exec(locationSearch);

  if (results === null) {
    throw new Error("invalid-url");
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

// 🅰️ Action
async function constructItems(cart, saleorHost) {
  const products = cart.products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
  }));
  const productsVariantId = products.map((p) => p.id);
  // 🅰️ input: network request
  const cartItems = await fetchCartItems(saleorHost, productsVariantId);
  const { edges } = cartItems.data.productVariants;

  return edges;
}

// Faked network functions
// 🅰️ Action
async function fetchCart(host, cartId) {}
// 🅰️ Action
async function fetchCartItems(saleorHost, productsVariantId) {}
