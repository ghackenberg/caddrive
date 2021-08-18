import  * as React from 'react'
import { useRef, useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Version as VersionData} from 'fhooe-audit-platform-common'
import { VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Version = (props: RouteComponentProps<{ id: string }>) => {

    const id = props.match.params.id
    var newDate = new Date().getUTCFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()

    const [version, setVersion] = useState<VersionData>(null)

    if (id != 'new') {
        useEffect(() => { VersionAPI.getVersion(id).then(setVersion) }, [])
    }

    const versionNameInput = useRef<HTMLInputElement>(null)
        
    const history = useHistory()

    async function addVersion(){
        if(id == 'new') {
            if (versionNameInput.current.value != '') {
                await VersionAPI.addVersion({ name: versionNameInput.current.value, date: newDate})

                history.goBack()
            }
        }          
    }

    async function cancelInput() {
        history.goBack()
    }
        
    return (
        <div className="view version">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/versions">Versions</Link> &rsaquo; {id} Version</h1>
                {id == 'new' ? (<h2>Add new Version</h2>) : (<h2>View existing Version</h2>)}
                {id == 'new' || version != null ? (    
                    <Fragment>
                        <label>
                            Version name: <br></br>
                            <input ref={versionNameInput} placeholder={ id=='new' ? 'Type in new version name' : version.name} size={25}></input><br></br>
                            <br></br>
                            Version date: <br></br>
                            <input placeholder={id=='new' ? newDate : version.date} size={25}></input><br></br>
                        </label>
                        { id=='new' ? <button onClick={cancelInput}>Cancel</button> : <button onClick={cancelInput}>Return</button> }
                        { id=='new' ? <button onClick={addVersion}>Save</button> : <p></p> }
                    </Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )
}