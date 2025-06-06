import { cart, removeFromCart,updateDeliveryOption } from "../../data/cart.js";
import { products,getProduct } from "../../data/products.js";

import { formatCurrency } from ".././utils/money.js";
import {deliveryOptions,getDeliveryOption} from "../../data/deliveryOptions.js";
import dayjs from "http://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){

  let cartSummaryHTML = '';

  cart.forEach((cartItem)=>{
      const productId = cartItem.productId;

      let matchingProduct = getProduct(productId);

      const deliveryOptionId = cartItem.deliveryOptionId;

      const deliveryOption = getDeliveryOption(deliveryOptionId);
      const today = dayjs();
      const dateString = today.add(deliveryOption.deliveryDays,'days').format('dddd, MMMM D');
      cartSummaryHTML += `<div class="cart-item-container
      js-cart-item-container js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    ${formatCurrency(matchingProduct.priceCents)}
                  </div>
                  <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                    <span>
                      Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                      Update
                    </span>
                    <span  class="delete-quantity-link link-primary js-delete-link
                    js-delete-link-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(matchingProduct.id,cartItem.deliveryOptionId)}
                </div>
              </div>
            </div>`;
      
  });

  function deliveryOptionsHTML(matchingProductId,deliveryOptionId) {

    let html = '';
    deliveryOptions.forEach((deliveryOption) =>{
      const today = dayjs();
      const dateString = today.add(deliveryOption.deliveryDays,'days').format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents ==0 ?
      'FREE'
      : `${formatCurrency(deliveryOption.priceCents)} - `;
      const isChecked = deliveryOption.id === deliveryOptionId;

      html += `<div class="delivery-option js-delivery-option" data-matching-product-id = "${matchingProductId}"
      data-delivery-option-id = "${deliveryOption.id}">
                    <input type="radio" ${isChecked ? 'checked':''}
                      class="delivery-option-input"
                      name="delivery-option-${matchingProductId}">
                    <div>
                      <div class="delivery-option-date">
                        ${dateString}
                      </div>
                      <div class="delivery-option-price">
                        ${priceString} Shipping
                      </div>
                    </div>
                  </div>
    `
    })
    return html;
  }
  deliveryOptionsHTML();
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
  .forEach( (link) => {
      link.addEventListener('click', () => {
          const productId = link.dataset.productId;
          removeFromCart(productId);
          const container = document.querySelector(`.js-cart-item-container-${productId}`);;
          container.remove();
          renderPaymentSummary();

      })
  })

  document.querySelectorAll('.js-delivery-option')
  .forEach((element)=>{
    element.addEventListener('click',()=>{
      const productId = element.dataset.matchingProductId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
}
