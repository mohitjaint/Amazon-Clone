import { loadProductsFetch,products } from "./products.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('productId');
const orderId = urlParams.get('orderId');
const orders = JSON.parse(localStorage.getItem('orders'));


async function loadTrackingPage(productId,orderId) {
    let matchingProduct = null;
    let matchingOrder = null;
    let matchingProductInOrders = null;
  await loadProductsFetch();

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  orders.forEach((order) => {
    if (order.id === orderId) {
        matchingOrder = order;
    }
  });
  matchingOrder.products.forEach((product) => {
    if (product.productId === productId) {
        matchingProductInOrders = product;
    }
})
  let arrivingDate = new Date(matchingProductInOrders.estimatedDeliveryTime);
  arrivingDate = arrivingDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });

  document.querySelector('.js-order-tracking').innerHTML = `

        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on Monday, ${arrivingDate}
        </div>

        <div class="product-info">
          ${matchingProduct.name}        </div>

        <div class="product-info">
          Quantity: ${matchingProductInOrders.quantity}
        </div>

        <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      `
}
loadTrackingPage(productId,orderId);

