const callFetchApi = async (url, method='GET', body) =>{
    const response = await fetch(url,{
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    console.log(response)
    return response.json()
}

export default callFetchApi