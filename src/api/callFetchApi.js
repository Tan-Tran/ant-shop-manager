const callFetchApi = async (url, method='GET', body) =>{
    console.log(url, method, body);
    const response = await fetch(url,{
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    return response.json()
}

export default callFetchApi