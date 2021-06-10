import * as React from 'react'
import { Link } from 'react-router-dom'

export const Navigation = () => (
    <nav>
        <ul>
            <li><Link to="/"><img src="/images/index.png"/>Index</Link></li>
        </ul>
        <ul>
            <li><Link to="/users"><img src="/images/user.png"/>Users</Link></li>
            <li><Link to="/products"><img src="/images/product.png"/>Products</Link></li>
            <li><Link to="/audits"><img src="/images/audit.png"/>Audits</Link></li>
        </ul>
        <ul>
            <li><Link to="/demo"><img src="/images/demo.png"/>Demo</Link></li>
        </ul>
    </nav>
)