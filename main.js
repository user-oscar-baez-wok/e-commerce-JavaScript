/** --------------> */
const product_content = document.getElementById("products_content");
const urlApi = "https://fakestoreapi.com/products";

/** --------------> */
const navLinks = document.querySelectorAll(".nav-item");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    navLinks.forEach((otherLink) => {
      if (otherLink !== link) {
        otherLink.classList.remove("active");
      }
    });
    link.classList.toggle("active");
  });
});
/** --------------> */
async function getProducts(url = urlApi) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    product_content.innerHTML = "";
    drawProducts(data);
  } catch (error) {
    console.error("Error fetching characters:", error);
  }
}
/** --------------> */
document.addEventListener("DOMContentLoaded", function () {
  getProducts();
  applyLikedState();
  loadCartItems();
  updateCartCount();
  updateCartTotal();
});
/** --------------> */
function applyLikedState() {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

  likedProducts.forEach((id) => {
    const icon = document.querySelector(
      `.product-favorite-icon[data-product-id="${id}"]`
    );

    if (icon) {
      icon.classList.add("liked");
    }
  });
}
/** --------------> */
function drawProducts(products) {
  products.map((product) => {
    product_content.insertAdjacentHTML(
      "beforeend",
      `
      <div class="product">
      <figure class="product-image">
      <img src="${product.image}" alt="${product.title}" onload="applyLikedState()" />
      <button class="product-favorite-icon" data-product-id="${product.id}">
      <span class="material-symbols-outlined"> favorite </span>
      </button>
      </figure>
      <h2 class="product-title">${product.title}</h2>
      <h3 class="product-price">$${product.price} MXN</h3>
      <button class="product-shopping-cart-icon"  onclick="addProductToCart(${product.id}, '${product.title}','${product.image}', ${product.price})">
      AÑADIR
      <span class="material-symbols-outlined"> shopping_cart </span>
      </button>

      </div>
      `
    );
  });
  /** --------------> */
  const productFavoriteIcons = document.querySelectorAll(
    ".product-favorite-icon"
  );
  productFavoriteIcons.forEach((iconFavorite) => {
    iconFavorite.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      this.classList.toggle("liked");

      const likedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];

      const id = likedProducts.indexOf(productId);

      if (id === -1) {
        likedProducts.push(productId);
      } else {
        likedProducts.splice(id, 1);
      }

      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    });
  });
}
/** --------------> */
const cart_container = document.querySelector(".cart-products");

document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
  updateCartCount();
});
/** --------------> */
function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  clearCartContainer();
  cartItems.forEach((item) => {
    renderCartItem(item);
  });
  updateCartTotal(cartItems);
}
/** --------------> */
function clearCartContainer() {
  cart_container.innerHTML = "";
}
/** --------------> */
function renderCartItem(item) {
  const cartProduct = document.createElement("div");
  cartProduct.classList.add("cart-product");
  cartProduct.innerHTML = `
  <img src="${item.image}" alt="">
  <div class="cart-product-information">
  <h4 class="cart-product-title">${item.title}</h4>
  <hr>
  <div class="cart-product-count">
  <p>$<span class="cart-product-price">${item.price}</span></p>
  <input type="number" min="1" value="${item.quantity}" class="quantity-input">
  </div>
  </div>
  <span class="close-icon material-symbols-outlined borrarProductCart">
  close
  </span>
  `;
  cart_container.appendChild(cartProduct);
  const quantityInput = cartProduct.querySelector(".quantity-input");
  quantityInput.addEventListener("input", () => {
    const newQuantity = parseInt(quantityInput.value, 10);
    updateCartItemQuantity(item.id, newQuantity);
  });

  const closeIcon = cartProduct.querySelector(".borrarProductCart");
  closeIcon.addEventListener("click", () => {
    const productId = item.id;
    console.log("Clicked on product ID:", productId);
    removeProductFromCart(productId);
  });
}

function clearCart() {
  cart_container.innerHTML = "";
}

const co=document.getElementById("comprar")
co.addEventListener("click",()=>{
  clearCart();
  updateCartTotal(0); 
  updateCartCount(0); 
  localStorage.removeItem("cartItems");
  alert("¡Gracias por tu compra!");
})
/** --------------> */
function updateCartItemQuantity(productId, newQuantity) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingItem = cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity = newQuantity;
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  loadCartItems();
  updateCartCount();
  updateCartTotal();
}
/** --------------> */
function updateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartTotal = calculateCartTotal(cartItems);
  document.getElementById("cartTotal").innerText = `$${cartTotal.toFixed(2)}`;
}
/** --------------> */
function calculateCartTotal(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
/** --------------> */
function addProductToCart(id_product, t_product, im_product, p_product) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingItem = cartItems.find((item) => item.id === id_product);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const newCartItem = {
      id: id_product,
      title: t_product,
      image: im_product,
      price: p_product,
      quantity: 1,
    };
    cartItems.push(newCartItem);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  loadCartItems();
  updateCartCount();
}
/** --------------> */
function removeProductFromCart(productId) {
  console.log("Removing product with ID:", productId);

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  console.log("Before removal:", cartItems);

  cartItems = cartItems.filter((item) => item.id !== productId);
  console.log("After removal:", cartItems);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  loadCartItems();
  updateCartCount();
}
/** --------------> */
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const shopping_cart_number = document.querySelectorAll(
    ".shopping-cart-number"
  );
  shopping_cart_number.forEach((shopping_number) => {
    shopping_number.innerText = cartCount.toString();
  });
}
/** --------------> */
const nav_link = document.querySelectorAll(".nav-item");
nav_link.forEach((link) => {
  link.addEventListener("click", (e) => {
    const goToLink = e.target.textContent.toLowerCase();
    console.log(goToLink);
    let url_filter = "";

    if (goToLink === "inicio") {
      getProducts();
    } else if (goToLink === "electrónica") {
      url_filter = "https://fakestoreapi.com/products/category/electronics";
      getProducts(url_filter);
    } else if (goToLink === "joyería") {
      url_filter = "https://fakestoreapi.com/products/category/jewelery";
      getProducts(url_filter);
    } else if (goToLink === "ropa") {
      url_filter = "https://fakestoreapi.com/products/category/jewelery";
      getProducts(url_filter);
    } else if (goToLink === "caballero" || goToLink === "ropa caballero") {
      url_filter = "https://fakestoreapi.com/products/category/men's clothing";
      getProducts(url_filter);
    } else if (goToLink === "dama" || goToLink === "ropa dama") {
      url_filter =
        "https://fakestoreapi.com/products/category/women's clothing";
      getProducts(url_filter);
    }
  });
});
/** --------------> */
const input_search = document.querySelector("#search_text");
input_search.addEventListener("input", () => {
  const text = input_search.value;
  handleInput(text);
});
/** --------------> */
async function getAllProducts() {
  const urlApi = "https://fakestoreapi.com/products/";
  const response = await fetch(urlApi);
  const data = await response.json();
  return data;
}

/** --------------> */
async function handleInput(txt) {
  const tituloABuscar = txt.toLowerCase();
  const allProducts = await getAllProducts();

  product_content.innerHTML = "";

  if (tituloABuscar === "") {
    getProducts();
  } else {
    const filterProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(tituloABuscar)
    );

    filterProducts.forEach((product) => {
      drawOnlyProducts(product);
    });
  }

  applyLikedState();
}

/** --------------> */
function drawOnlyProducts(product) {
  product_content.insertAdjacentHTML(
    "beforeend",
    `
    <div class="product">
    <figure class="product-image">
    <img src="${product.image}" alt="${product.title}" />
    <button class="product-favorite-icon" data-product-id="${product.id}">
    <span class="material-symbols-outlined"> favorite </span>
    </button>
    </figure>
    <h2 class="product-title">${product.title}</h2>
    <h3 class="product-price">$${product.price} MXN</h3>
    <button class="product-shopping-cart-icon" id="product_shopping_cart_icon">
    AÑADIR
    <span class="material-symbols-outlined"> shopping_cart </span>
    </button>
    </div>
    `
  );

  const productFavoriteIcons = document.querySelectorAll(
    ".product-favorite-icon"
  );
  productFavoriteIcons.forEach((iconFavorite) => {
    iconFavorite.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      this.classList.toggle("liked");

      const likedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];

      const id = likedProducts.indexOf(productId);

      if (id === -1) {
        likedProducts.push(productId);
      } else {
        likedProducts.splice(id, 1);
      }

      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    });
  });
}
/** --------------> */
getProducts();
