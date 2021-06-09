import * as React from 'react'
import { Link } from 'react-router-dom'

export const Navigation = () => (
    <nav>
        <ul>
            <li style={{backgroundImage: 'url(/images/index.png)'}}><Link to="/">Index</Link></li>
        </ul>
        <ul>
            <li style={{backgroundImage: 'url(/images/user.png)'}}><Link to="/users">Users</Link></li>
            <li style={{backgroundImage: 'url(/images/product.png)'}}><Link to="/products">Products</Link></li>
            <li style={{backgroundImage: 'url(/images/audit.png)'}}><Link to="/audits">Audits</Link></li>
        </ul>
        <ul>
            <li style={{backgroundImage: 'url(/images/demo.png)'}}><Link to="/demo">Demo</Link></li>
        </ul>
    </nav>
)