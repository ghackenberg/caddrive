import * as React from 'react'
import { Link } from 'react-router-dom'
// Images
import * as UserIcon from '/src/images/user.png'
import * as ProductIcon from '/src/images/product.png'
import * as DemoIcon from '/src/images/demo.png'
// Models
import * as TwoCylinderEngine from '/src/models/2CylinderEngine.glb'
import * as Avocado from '/src/models/Avocado.glb'
import * as BrainStem from '/src/models/BrainStem.glb'
import * as Buggy from '/src/models/Buggy.glb'
import * as GearboxAssy from '/src/models/GearboxAssy.glb'
import * as ReciprocatingSaw from '/src/models/ReciprocatingSaw.glb'
import * as ToyCar from '/src/models/ToyCar.glb'
import * as Demonstrator from '/src/models/Demonstrator.glb'

function toUrl(name: string) {
    name = name.substr(name.lastIndexOf('/') + 1)
    name = name.substr(0, name.lastIndexOf('.'))
    return `/models/${name}`
}

export const Navigation = () => {

    return (
        <nav>
            <ul>
                <li><Link to="/users"><img src={UserIcon}/>Users</Link></li>
                <li><Link to="/products"><img src={ProductIcon}/>Products</Link></li>
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