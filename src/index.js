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
  const productsVariantId = productsVariantIdOfCart(cart);
  const cartItems = await fetchCartItems(SALEOR_HOST, productsVariantId); // 🅰️ Action
  const items = await constructItems(cart, cartItems); // 🅰️ Action
  const cartModel = createCartModel(cartId, items, SHIPPING_PRICE_DEFAULT);
  const countries = buildCountries(countries_);
  setTimeout(() => {
    app.ports.pages_shipping_fetchReceived.send({
      cart: cartModel,
      countries,
    }); // 🅰️ Action
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

// 💚 Calculation
function constructItems(cartItems) {
  const { edges } = cartItems.data.productVariants;
  return edges;
}

// 💚 Calculation
function productsVariantIdOfCart(cart) {
  const products = cart.products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
  }));
  const productsVariantId = products.map((p) => p.id);
  return productsVariantId;
}

// 💚 Calculation
function cartTotalPrice(items) {
  const totalPriceOfCart = items
    .map((p) => p.price.total)
    .reduce((a, b) => a + b, 0);
  return totalPriceOfCart;
}

// 💚 Calculation
function createCartModel(cartId, items, defaultShippingPrice) {
  // Calculation can use another calculation!
  const totalPrice = cartTotalPrice(items);
  const cartModel = {
    id: cartId,
    products: items,
    subtotal: Number(totalPrice).toLocaleString(),
    shippingPrice: Number(defaultShippingPrice).toLocaleString(),
    total: Number(totalPrice + defaultShippingPrice).toLocaleString(),
  };
  return cartModel;
}

// 💚 Calculation
function buildCountries(data) {
  const countries = data
    .map((c) => ({ name: c.name, code: c.code }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return countries;
}

// Faked network functions
// 🅰️ Action
async function fetchCart(host, cartId) {}
// 🅰️ Action
async function fetchCartItems(saleorHost, productsVariantId) {}
