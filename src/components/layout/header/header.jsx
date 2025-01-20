import { Logo } from '../../ui/logo/logo'
import { HamburgerMenu } from '../../ui/hamburgerMenu/HamburgerMenu'
import './header.css'

export const Header = () => {
    return (
        <header className="header">
            <Logo />
            <div className='header-right'>
            <div className='sigin-buttons'>
                    <a href="/register">
                    <button>Register</button>
                    </a>
                    <a href="/login">
                    <button>Login</button>
                    </a>
                </div>
            <HamburgerMenu />
            </div>
        </header>
    )
}