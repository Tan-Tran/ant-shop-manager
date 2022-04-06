
export const getAllProducts = async() =>{
    const response = await fetch('https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json')
    const data = await response.json()
    return data
}

export const getProduct = async(key) =>{
    const response = await fetch(`https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`)
    const data = await response.json()
    return data
}

export const addProduct = async(dataBody) =>{
    const response = await fetch('https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataBody)
    })
    const data = await response.json()
    const {id} = data.name
    return id
}

export const updateProduct = async(key, dataBody) =>{
    const response = await fetch(`https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataBody)
    })
    const data = await response.json()
    const {id} = data.name
    return id
}
