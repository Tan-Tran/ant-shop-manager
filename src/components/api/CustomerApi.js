
export const getAllCustomers = async() =>{
    const response = await fetch('https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json')
    const data = await response.json()
    return data
}

export const getCustomerById = async(key) =>{
    const response = await fetch(`https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`)
    const data = await response.json()
    return data
}

export const addCustomer = async(bodyData) =>{
    const response = await fetch('https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
    const data = await response.json()
    const id = data.name
    return id
}

export const updateCustomer = async(key, bodyData) =>{
    const response = await fetch(`https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
    const data = await response.json()
    const id = data.name
    return id
}

export const deleteCustomer = async(key) =>{
    const response = await fetch(`https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`,{
        method: 'DELETE',
    })
}
