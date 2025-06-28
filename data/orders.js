import { formatCurrency } from "../scripts/utils/money.js";
import  {loadProductsFetch, products,loadProducts} from "../data/products.js";
export let orders = JSON.parse(localStorage.getItem('orders')) || [];
export function addOrder(order){
    orders.unshift(order);
    saveToStorage();
}

let productsList;


async function loadPage() {
  await loadProductsFetch();

  productsList = products;

  renderOrderPage(orders);

  document.querySelectorAll('.js-track-package-button').forEach((button) => {
    button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-product-id');
        const orderId = event.target.getAttribute('data-order-id');
        window.location.href = `tracking.html?productId=${productId}&orderId=${orderId}`;
    });
});


}

if (window.location.pathname.includes('orders.html')) {
    loadPage();
}


function saveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders));
}

let html = '';

function renderOrderPage(orders){
    orders.forEach((order)=>{
        const orderTime = new Date(order.orderTime);
        order.orderTime = orderTime.toLocaleDateString('en-US', {
            month: 'long'
            , day: 'numeric'});
        // console.log('Order time:', order.orderTime);
        html += `
    <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${order.orderTime}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
`
          ;
        order.products.forEach((product) => {
           const productDeliveryTime = new Date(product.estimatedDeliveryTime);
           product.estimatedDeliveryTime = productDeliveryTime.toLocaleDateString('en-US', {
            month: 'long'
            , day: 'numeric'});
            let productDetails;
            productsList.forEach((p) => {
                if(product.productId === p.id){
                     productDetails = p;
                    //  console.log('Product details:', productDetails);
                }
            })

            html += `<div class="product-image-container">
              <img src="${productDetails.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${productDetails.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${product.estimatedDeliveryTime}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              
                <button data-product-id="${productDetails.id}" data-order-id= "${order.id}" class="js-track-package-button track-package-button button-secondary ">
                  Track package
                </button>
              
            </div>`;
        });
        html += `</div>
        </div>
        `

    })
    
    document.querySelector('.js-order-container').innerHTML = html;
}



