import { Link } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";

export default function Header() {
    const { user, handleLogout } = useContext(AuthContext) || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 flex items-start justify-between pointer-events-none">

                {/* Left Corner HUD: Logo & Navigation */}
                <div className="pointer-events-auto flex items-center space-x-6 bg-bg-surface/80 backdrop-blur-md border border-border-subtle rounded-full px-6 py-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)]">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="font-mono text-accent-teal font-bold text-lg tracking-widest leading-none">
                        NODE<span className="text-text-primary">MAP</span>
                    </Link>

                    {/* Separator (Desktop) */}
                    <div className="hidden md:block w-px h-4 bg-border-subtle"></div>

                    {/* Main Navigation (Desktop) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
                            Home
                        </Link>
                        {user && (
                            <Link to="/boards" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
                                Boards
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Right Corner HUD: Auth State & Mobile Toggle */}
                <div className="pointer-events-auto flex items-center bg-bg-surface/80 backdrop-blur-md border border-border-subtle rounded-full px-4 py-2 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)]">
                    
                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm font-mono text-text-secondary px-2">
                                    {user.name || user.email || "Guest"}
                                </span>
                                {user.role === 'guest' && (
                                    <Link to="/register" className="text-sm font-mono font-bold text-bg-app bg-text-primary px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
                                        CLAIM ACCOUNT
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="text-sm font-mono font-bold text-bg-app bg-accent-teal px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
                                    LOG OUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-mono text-text-secondary hover:text-text-primary transition-colors px-2">
                                    LOGIN
                                </Link>
                                <Link to="/register" className="px-4 py-1.5 bg-text-primary text-bg-app text-sm font-mono font-bold rounded-full hover:opacity-90 transition-opacity">
                                    SIGN UP
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button 
                        onClick={toggleMenu} 
                        className="md:hidden p-2 text-text-primary focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-bg-app/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                    <nav className="flex flex-col items-center space-y-6">
                        <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-text-primary tracking-wide">
                            Home
                        </Link>
                        {user && (
                            <Link to="/boards" onClick={closeMenu} className="text-2xl font-bold text-text-primary tracking-wide">
                                Boards
                            </Link>
                        )}
                    </nav>

                    <div className="w-24 h-px bg-border-subtle"></div>

                    <div className="flex flex-col items-center space-y-4">
                        {user ? (
                            <>
                                <span className="text-lg font-mono text-text-secondary">
                                    {user.name || user.email || "Guest"}
                                </span>
                                {user.role === 'guest' && (
                                    <Link to="/register" onClick={closeMenu} className="text-lg font-mono font-bold text-bg-app bg-text-primary px-8 py-3 rounded-full">
                                        CLAIM ACCOUNT
                                    </Link>
                                )}
                                <button onClick={() => { handleLogout(); closeMenu(); }} className="text-lg font-mono font-bold text-bg-app bg-accent-teal px-8 py-3 rounded-full">
                                    LOG OUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="text-lg font-mono text-text-secondary hover:text-text-primary">
                                    LOGIN
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="px-8 py-3 bg-text-primary text-bg-app text-lg font-mono font-bold rounded-full">
                                    SIGN UP
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}