import * as React from 'react'
import { Link } from 'react-router-dom'

export const Navigation = () => (
    <nav>
        <ul>
            <li><Link to="/users"><img src="/images/user.png"/>Users</Link></li>
            <li><Link to="/products"><img src="/images/product.png"/>Products</Link></li>
            <li><Link to="/audits"><img src="/images/audit.png"/>Audits</Link></li>
        </ul>
        <ul>
            <li><Link to="/demo/2CylinderEngine"><img src="/images/demo.png"/>2CylinderEngine</Link></li>
            <li><Link to="/demo/Avocado"><img src="/images/demo.png"/>Avocado</Link></li>
            <li><Link to="/demo/BrainStem"><img src="/images/demo.png"/>BrainStem</Link></li>
            <li><Link to="/demo/Buggy"><img src="/images/demo.png"/>Buggy</Link></li>
            <li><Link to="/demo/GearboxAssy"><img src="/images/demo.png"/>GearboxAssy</Link></li>
            <li><Link to="/demo/ReciprocatingSaw"><img src="/images/demo.png"/>ReciprocatingSaw</Link></li>
            <li><Link to="/demo/ToyCar"><img src="/images/demo.png"/>ToyCar</Link></li>
        </ul>
    </nav>
)