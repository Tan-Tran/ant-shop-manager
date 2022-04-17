const Span = (props) =>{
    return (
        <span
            style={{
            display: 'inline-block',
            marginLeft: 10,
            width: 150,
            }}
        >{props.children}</span>
    )
}

export default Span