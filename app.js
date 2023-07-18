// Selectors
const _$ = (e) => document.querySelector(e);
const _$$ = (e) => document.querySelectorAll(e);

const productDOM = _$('.product__center');
const openCart = _$('.cart__icon');
const closeCart = _$('.close__cart');
const cartTotalQauntity = _$('.item__total');
const cartTotal = _$('.cart__total');
const cartDOM = _$('.cart__centent');
const cartFooter = _$('.cart__footer');
const cartClear = _$('.clear__cart');

let cart = [];
let addToCartBtnDOM = [];
let products = [];

class UI {
    displayProducts(obj) {
        let productLoop = '';
        if (typeof obj === 'object' && Array.isArray(obj) && obj.length) {
            obj.forEach(({id, title, image, price, rating, review}) => {
                //console.log(title);
                productLoop += `<div class="product">
                <div class="image__container">
                  <img src="${image}" alt="${title}" />
                </div>
                <div class="product__footer">
                  <h3 class="title">${title}</h3> 
                  <div class="rating" data-rating="${rating}">
                    ${(() => {
                        let stars = '';
                        for(let i = 0; i < 5; i++) {
                            const statStaus = (i+1) <= parseInt(rating) ? 'icon-star-full' : 'icon-star-empty';
                            stars +=`<span><svg><use xlink:href="./images/sprite.svg#${statStaus}"></use></svg></span>`
                        }
                        return stars;
                    })()}
                    ${review ? `<span class="review">(${review})</span>` : ''}
                  </div>
                  <div class="bottom">
                    <div class="btn__group">
                      <button type="button" role="button" class="btn addToCart" data-id="${id}"><span class="addedToCartText">Add to Cart</span> - <span class="price">₹${price}</span></button>
                    </div>
                  </div>
                </div>
              </div>`;
            })
        }
        return productDOM.innerHTML = productLoop;
    }
    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        cart.map(item => this.addToCart(item));
        this.cartLogic();

        openCart.addEventListener('click', () => {
            this.showCart();
            this.showClearBtn();
        });
        closeCart.addEventListener('click', this.HideCart);
    }
    cartLogic() {

        cartClear.addEventListener('click', () => {
            this.clearCart();
            this.HideCart();
        })

        cartDOM.addEventListener('click', (e) => {
            const target = e.target.closest('span');
            if(!target) {
                return;
            }
            const id = parseInt(target.dataset.id);
            const increaseBtn = target.classList.contains('increase');
            const decreaseBtn = target.classList.contains('decrease');
            const removeBtn = target.classList.contains('remove__item');
            //console.log(increaseBtn, decreaseBtn, removeBtn);
            let cartQunt = cart.find(item => item.id === id);
            if(increaseBtn) {
                //console.log(cartQunt);
                cartQunt.amount++;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                target.nextElementSibling.innerText = cartQunt.amount;
            }
            if(decreaseBtn) {
                cartQunt.amount--;
                if(cartQunt.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    target.previousElementSibling.innerText = cartQunt.amount;
                } else {
                    this.removeItem(id);
                    cartDOM.removeChild(target.parentElement.parentElement);
                }
            }
            if(removeBtn) {
                this.removeItem(id);
                cartDOM.removeChild(target.parentElement.parentElement);
            }
        });
    }
    clearCart() {
        const cartItem = cart.map(item => item.id);
        cartItem.forEach(id => this.removeItem(id));
        while(cartDOM.children.length > 0){
            cartDOM.removeChild(cartDOM.children[0]);
        }
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        //console.log(cart);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        this.showClearBtn();

        let button = this.singleButton(id);
        this.buttonAction(button);
    }
    showClearBtn() {
        if(cart.length) {
            cartFooter.classList.add('show-clear-btn');
        } else {
            cartFooter.classList.remove('show-clear-btn');
            //this.HideCart();
        }
    }
    singleButton(id){
        return addToCartBtnDOM.find(button => parseInt(button.dataset.id) === id);
    }
    showCart() {
        document.body.classList.add('open-cart');
    }
    HideCart() {
        document.body.classList.remove('open-cart');
    }
    addToCartButton() {
        addToCartBtnDOM = [..._$$('.addToCart')];
        //console.log(addToCartBtnDOM);
        addToCartBtnDOM.forEach(btn => {
            const id = parseInt(btn.dataset.id);
            const inCart = cart.length && cart.find(item => item.id === id);
            if (inCart) {
                this.buttonAction(btn, true);
            }  
            //console.log(id);
            btn.addEventListener('click', () => {
                this.buttonAction(btn, true, 'Added to Cart');
                const cartItem = {...this.getProducts(id), amount: 1};
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                this.setCartValues(cart);
                this.addToCart(cartItem);

                //console.log(cart);
            })
        })
    }
    addToCart({id, title, image, price, amount}) {
        //console.log(cart);
        let cart = document.createElement('div');
        cart.classList.add('cart__item');
        cart.innerHTML = `<img src="${image}" alt="${title}">
            <div>
                <h3>${title}</h3>
                <h3 class="price">$${price}</h3>
                </div>
                <div>
                <span data-id="${id}" class="increase">
                    <svg>
                    <use xlink:href="./images/sprite.svg#icon-angle-up"></use>
                    </svg>
                </span>
                <p>${amount}</p>
                <span data-id="${id}" class="decrease">
                    <svg>
                    <use xlink:href="./images/sprite.svg#icon-angle-down"></use>
                    </svg>
                </span>
                </div>
                <div>
                <span class="remove__item" data-id="${id}">
                    <svg>
                    <use xlink:href="./images/sprite.svg#icon-trash"></use>
                    </svg>
                </span>
            </div>`;
        return cartDOM.appendChild(cart);
    }
    setCartValues(cart) {
        let cartQauntity = 0;
        let totalAmount = 0;
        cart.map(item => {
            cartQauntity += item.amount;
            totalAmount += item.price * item.amount;
        });
        cartTotalQauntity.innerText = cartQauntity;
        cartTotal.innerText = totalAmount;
    }
    getProducts(id) {
        return products.find(item => item.id === parseInt(id));
    }
    buttonAction(element, isTrue, text) {
        if (isTrue) {
            element.children[0].innerText = text ? text : 'Already in Cart';
            element.disabled = true;
        } else {
            element.children[0].innerText = 'Added in Cart'; 
            element.disabled = false;
        }
    }
}

class Product {
    async getProducts () {
        try {
            const response = await fetch('./products.json');
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                return data.items;
            } else {
                throw result.statusText;
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}

 class Storage {
    static saveProducts(obj) {
        if (localStorage) {
            return localStorage.setItem('Products', JSON.stringify(obj));
        }
    }
    static saveCart(cart) {
        if(localStorage) {
            return localStorage.setItem('Cart', JSON.stringify(cart));
        }
    }
    static getCart() {
        if (localStorage) {
            return localStorage.getItem('Cart') ? JSON.parse(localStorage.getItem('Cart')) : [];
        }
    }
 }

document.addEventListener('DOMContentLoaded', function (){
    const ui = new UI();
    const productList = new Product();

    ui.setupApp();

    const dataFromStorage = JSON.parse(localStorage.getItem('Products'));
    if (localStorage && dataFromStorage && Array.isArray(dataFromStorage) && dataFromStorage.length) {
        ui.displayProducts(dataFromStorage);
        ui.addToCartButton();
        products = dataFromStorage;
    } else {
        productList.getProducts().then(obj => {
            //console.log(obj);
            ui.displayProducts(obj);
            Storage.saveProducts(obj);
            ui.addToCartButton();
            products = obj;
        });
    }
    //console.log(productList.getProducts());

});