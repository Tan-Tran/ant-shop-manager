import React from "react"
import './Header.css'

import shop_icon from  '../../images/shopping-cart.png'

const AppHeader = props =>{
    return (
        <div className="container">
            <div className="shop-icon">
                <img src={shop_icon} alt="shop icon"/>
            </div>
            <h1>Shop Management</h1>
        </div>
    )
}

export default AppHeader