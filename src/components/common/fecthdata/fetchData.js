import React, {useState} from 'react'

export const useFetchProducts = () =>{
    const [products, setProducts] = useState(null)
    const fetchProducts = async() =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
        try{
            const response = await fetch(url)
            if(!response.ok){
                throw new Error("Some thing went wrong!")
            }
            const data = await response.json()
            const loadedProducts = []
            for(const key in data){
                loadedProducts.push({
                    key: key,
                    name: data[key].name,
                    price: data[key].price,
                    quantity: data[key].quantity,
                    desc: data[key].desc,
                    origin: data[key].origin,
                })
            }
            setProducts(loadedProducts)
        }catch(error){
            console.log("Add product failed")
        }
    }
    fetchProducts()
    return products
}

