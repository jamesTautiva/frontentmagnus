import { Header } from '../../components/layout/header/header'
import { FormLogin } from '../../components/ui/formLogin/formLogin'
import './login.css'

export const Login = () => {
    return (
        <div className='login-container'>
            <Header />
            <FormLogin />

        </div>

    )
}