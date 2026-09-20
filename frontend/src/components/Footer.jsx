import { Link } from 'react-router'

export default function Footer() {
    return (
        <footer>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/boards">Boards</Link>
                    </li>
                    <li>
                        <Link to="/auth">Auth</Link>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}