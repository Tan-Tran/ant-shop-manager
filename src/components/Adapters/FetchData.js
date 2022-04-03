
export const getData = async (url, covertDataFunction) =>{
    const response = await fetch(url)
    const data = await response.json()
    return covertDataFunction(data)
}

export const addData = async (url, dataBody) =>{
    const response = await fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataBody)
    })
    const data = await response.json()
    const id =  data.name
    return id
}

export const deleteData = async (url) =>{
    const response = await fetch(url,{
        method: 'DELETE'
    })
}

export const updateData = async (url, dataBody) =>{
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(dataBody),
    })
    const data = await response.json()
    const id =  data.name
    return id
}

