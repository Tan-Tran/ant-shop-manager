const inputType = {
    product: 'select',
    quantity: 'number',
    price: 'number',
    age: 'number',
    birth: 'date'
}

const InputType = (input) =>{
    return inputType[input]? inputType[input]: 'text'
}

export default InputType
