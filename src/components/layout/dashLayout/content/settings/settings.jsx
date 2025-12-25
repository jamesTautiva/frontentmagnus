import {useState, useEffect} from 'react'
import './settings.css'

export const Settings = () => {
    // traer info del localstorage
    const user = JSON.parse(localStorage.getItem('artistData'));

    // guardar cambios
    
    return (
        <section className="settings">
            <h2>Settings</h2>
            <div className="settings-content">
                <div className="settings-item">
                    <h3>General</h3>
                    <div className='settings-profile' >
                        <img src="" alt="" />
                        <div className="settings-profile-info">
                            <p>Nombre: {user.name}  </p>
                            <p>Correo: {user.email}</p>
                            <p>descripcion: {user.description}</p>
                            <p>genere: {user.genere}</p>
                            <div className='settings-profile-links'>
                                <p>Youtube: {user.linkyoutube}</p>
                                <p>Instagram: {user.linkinstagram}</p>
                                <p>Twitter: {user.linktwitter}</p>
                                <p>Facebook: {user.linkfacebook}</p>
                            </div>
                        </div>
                        <button>Guardar</button>
                    </div>
                    {/* */}
                    <div className="settings-">

                    </div>
                </div>                
            </div>
        </section>
    )
}
