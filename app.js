const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateShoppingCart =
  document.getElementById("template-carrito").content;
// Fragment es una memoria volatil
const fragment = document.createDocumentFragment();

let shoppingCart = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if(localStorage.getItem('shoppingCart')){
    shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'))
    showShoppingCart();
  }
});

cards.addEventListener("click", (e) => {
  addToCart(e);
});

items.addEventListener('click',(e) => {
  btnChange(e)
})

const fetchData = async () => {
  try {
    const res = await fetch(
      "https://bsale-api-aldo-canales.herokuapp.com/api/productos"
    );
    const data = await res.json();
    console.log(data);
    loadCards(data);
  } catch (error) {
    console.log(error);
  }
};

const loadCards = (data) => {
  data.forEach((product) => {
    templateCard.querySelector("h5").textContent = product.name;
    templateCard.querySelector("p").textContent = product.price;
    templateCard
      .querySelector("img")
      .setAttribute(
        "src",
        product.url_image
          ? product.url_image
          : "https://via.placeholder.com/150"
      );
    templateCard.querySelector(".btn-dark").dataset.id = product.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addToCart = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    addToShoppingCart(e.target.parentElement);
  }
  e.stopPropagation();
};

const addToShoppingCart = (object) => {
  const product = {
    id: object.querySelector(".btn-dark").dataset.id,
    name: object.querySelector("h5").textContent,
    price: object.querySelector("p").textContent,
    quantity: 1,
  };

  if (shoppingCart.hasOwnProperty(product.id)) {
    product.quantity = shoppingCart[product.id].quantity + 1;
  }

  shoppingCart[product.id] = { ...product };
  showShoppingCart();
};

const showShoppingCart = () => {
  console.log(shoppingCart);
  items.innerHTML = "";
  Object.values(shoppingCart).forEach((product) => {
    templateShoppingCart.querySelector("th").textContent = product.id;
    templateShoppingCart.querySelectorAll("td")[0].textContent = product.name;
    templateShoppingCart.querySelectorAll("td")[1].textContent =
      product.quantity;
    templateShoppingCart.querySelector(".btn-info").dataset.id = product.id;
    templateShoppingCart.querySelector(".btn-danger").dataset.id = product.id;
    templateShoppingCart.querySelector("span").textContent =
      product.quantity * product.price;

    const clone = templateShoppingCart.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  showFooter();

  localStorage.setItem('shoppingCart',JSON.stringify(shoppingCart))
};

const showFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(shoppingCart).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `;

    return;
  }

  const totalQuantity = Object.values(shoppingCart).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  );
  console.log(totalQuantity);

  const totalPrice = Object.values(shoppingCart).reduce(
    (acc, { price, quantity }) => acc + price * quantity,
    0
  );
  console.log(totalPrice);

  templateFooter.querySelectorAll("td")[0].textContent = totalQuantity;
  templateFooter.querySelector("span").textContent = totalPrice;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);


  const cleanBtn = document.getElementById('vaciar-carrito')
  cleanBtn.addEventListener('click', () => {
    shoppingCart ={}
    showShoppingCart();
  })
};

const btnChange = (e) => {
  console.log(e.target)
  //add button
  if(e.target.classList.contains('btn-info')){
    const product = shoppingCart[e.target.dataset.id]
    product.quantity = shoppingCart[e.target.dataset.id].quantity + 1
    shoppingCart[e.target.dataset.id] = { ...product }
    showShoppingCart();
  }

  if(e.target.classList.contains('btn-danger')){
    const product = shoppingCart[e.target.dataset.id]
    product.quantity = shoppingCart[e.target.dataset.id].quantity - 1
    if(product.quantity === 0){
      delete shoppingCart[e.target.dataset.id]
    }
    // shoppingCart[e.target.dataset.id] = { ...product }
    showShoppingCart();
  }

  e.stopPropagation()
}
