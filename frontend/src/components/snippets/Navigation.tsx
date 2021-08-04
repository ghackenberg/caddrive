import * as React from 'react'
import { Link } from 'react-router-dom'
import * as UserIcon from '/assets/images/user.png'
import * as ProductIcon from '/assets/images/product.png'
import * as AuditIcon from '/assets/images/audit.png'
import * as DemoIcon from '/assets/images/demo.png'
import * as TwoCylinderEngine from '/assets/models/2CylinderEngine.glb'
import * as Avocado from '/assets/models/Avocado.glb'
import * as BrainStem from '/assets/models/BrainStem.glb'
import * as Buggy from '/assets/models/Buggy.glb'
import * as GearboxAssy from '/assets/models/GearboxAssy.glb'
import * as ReciprocatingSaw from '/assets/models/ReciprocatingSaw.glb'
import * as ToyCar from '/assets/models/ToyCar.glb'
import * as Demonstrator from '/assets/models/Demonstrator.glb'

export const Navigation = () => {
    function toUrl(name: string) {
        name = name.substr(name.lastIndexOf('/') + 1)
        name = name.substr(0, name.lastIndexOf('.'))
        return `/models/${name}`
    }
    return (
        <nav>
            <ul>
                <li><Link to="/users"><img src={UserIcon}/>Users</Link></li>
                <li><Link to="/products"><img src={ProductIcon}/>Products</Link></li>
                <li><Link to="/audits"><img src={AuditIcon}/>Audits</Link></li>
            </ul>
            <ul>
                <li><Link to={toUrl(TwoCylinderEngine)}><img src={DemoIcon}/>2CylinderEngine</Link></li>
                <li><Link to={toUrl(Avocado)}><img src={DemoIcon}/>Avocado</Link></li>
                <li><Link to={toUrl(BrainStem)}><img src={DemoIcon}/>BrainStem</Link></li>
                <li><Link to={toUrl(Buggy)}><img src={DemoIcon}/>Buggy</Link></li>
                <li><Link to={toUrl(GearboxAssy)}><img src={DemoIcon}/>GearboxAssy</Link></li>
                <li><Link to={toUrl(ReciprocatingSaw)}><img src={DemoIcon}/>ReciprocatingSaw</Link></li>
                <li><Link to={toUrl(ToyCar)}><img src={DemoIcon}/>ToyCar</Link></li>
                <li><Link to={toUrl(Demonstrator)}><img src={DemoIcon}/>Demonstrator</Link></li>
            </ul>
        </nav>
    )
}