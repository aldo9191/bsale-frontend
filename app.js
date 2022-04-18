const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
// Fragment es una memoria volatil
const fragment = document.createDocumentFragment()
let shoppingCart ={}



document.addEventListener('DOMContentLoaded', ()=>{
  fetchData();
});

items.addEventListener('click', (e)=> {
  addToCart(e)
})

const fetchData = async() => {
  try{
    const res = await fetch('https://bsale-api-aldo-canales.herokuapp.com/api/productos');
    const data = await res.json();
    // console.log(data)
    loadCards(data)
  } catch(error){
    console.log(error)
  }
}


const loadCards = (data) =>{
  data.forEach(product => {
    templateCard.querySelector('h5').textContent = product.name
    templateCard.querySelector('p').textContent = product.price
    templateCard.querySelector('img').setAttribute("src", product.url_image? product.url_image : "https://via.placeholder.com/150")
    templateCard.querySelector('.btn-dark').dataset.id=product.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)


  })

  items.appendChild(fragment)
}

const addToCart = e => {
  // console.log(e.target)
  // console.log(e.target.classList.contains('btn-dark'))
  if(e.target.classList.contains('btn-dark')){
    // console.log(e.target.parentElement)
    addToShoppingCart(e.target.parentElement)
  }
  e.stopPropagation()
}

const addToShoppingCart = (object)=>{
  const product = {
    id: object.querySelector('.btn-dark').dataset.id,
    name: object.querySelector('h5').textContent,
    price: object.querySelector('p').textContent,
    quantity: 1,
  }

  if(shoppingCart.hasOwnProperty(product.id)){
    product.quantity = shoppingCart[product.id].quantity + 1
  }

  shoppingCart[product.id] = {...product}

  console.log(shoppingCart)
}