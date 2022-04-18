const BASE_URL = 'https://bsale-api-aldo-canales.herokuapp.com/api';

 const getAllProducts = async() => {
  try{
    const response = await fetch(`${BASE_URL}/productos`);
    console.log(response)
    const products = await response.json()
    console.log(products)
  } catch(error){
    console.log(error)
  }
}


 const getAllCategories = async() => {
  try{
    const response = await fetch(`${BASE_URL}/categorias`);
    console.log(response)
    const categories = await response.json()
    console.log(categories)
  } catch(error){
    console.log(error)
  }
}

export {BASE_URL, getAllProducts, getAllCategories}