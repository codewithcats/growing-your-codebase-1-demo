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

async function main() {
  const cartId = getUrlQuery("cart_id");
  const cart = await fetchCart(HOST, cartId);
  const items = await constructItems(cart, SALEOR_HOST);
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
    app.ports.pages_shipping_fetchReceived.send(toElm);
  }, 1500);
}

function getUrlQuery(name) {
  const name_ = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name_ + "=([^&#]*)");
  const results = regex.exec(location.search);

  if (results === null) {
    throw new Error("invalid-url");
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

async function constructItems(cart, saleorHost) {
  const products = cart.products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
  }));
  const productsVariantId = products.map((p) => p.id);
  const cartItems = await fetchCartItems(saleorHost, productsVariantId);
  const { edges } = cartItems.data.productVariants;

  return edges;
}

// Faked network functions
async function fetchCart(host, cartId) {}
async function fetchCartItems(saleorHost, productsVariantId) {}
