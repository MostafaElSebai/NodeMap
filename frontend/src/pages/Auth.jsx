import { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { useLocation, Link } from "react-router";

export default function AuthPage() {
    const { handleLogin, handleRegister, handleRegisterGuest, handleGuestLogin, loading, user } = useContext(AuthContext);
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const isLogin = location.pathname === '/login';
    const [validationError, setValidationError] = useState('');

    const validateForm = () => {
        setValidationError('');

        if (!isLogin && !name.trim()) {
            setValidationError('Name is required for registration.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError('Please enter a valid email address.');
            return false;
        }

        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
            return false;
        }

        return true;
    };

    const onSubmit = (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        if (isLogin) {
            handleLogin(email, password);
        } else {
            if (user?.role === 'guest') {
                handleRegisterGuest(name, email, password);
            } else {
                handleRegister(name, email, password);
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <form onSubmit={onSubmit} className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-md p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold font-sans text-text-primary tracking-tight">
                        {isLogin ? 'Access Workspace' : (user?.role === 'guest' ? 'Claim Account' : 'Initialize Account')}
                    </h1>
                    <p className="text-sm font-mono text-text-secondary mt-2">
                        {isLogin ? 'Enter your credentials to continue.' : (user?.role === 'guest' ? 'Upgrade your guest account.' : 'Create a new NodeMap identity.')}
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-bg-app border border-border-subtle rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">Email</label>
                        <input
                            type="email"
                            placeholder="agent@nodemap.app"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-bg-app border border-border-subtle rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-bg-app border border-border-subtle rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />
                    </div>
                </div>

                {/* Validation Error Display */}
                {validationError && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm font-mono text-center">
                        {validationError}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col space-y-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent-teal text-bg-app font-mono font-bold tracking-widest py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                    >
                        {loading ? "Processing..." : isLogin ? 'Authenticate' : 'Register'}
                    </button>

                    {user?.role !== 'guest' && (
                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            disabled={loading}
                            className="w-full border border-border-subtle bg-bg-app text-text-primary font-mono tracking-widest py-3 rounded hover:bg-bg-surface transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 uppercase"
                        >
                            <span>Guest Access</span>
                            <span className="text-accent-teal">→</span>
                        </button>
                    )}

                    <div className="pt-4 text-center">
                        <Link
                            to={isLogin ? "/register" : "/login"}
                            onClick={() => setValidationError('')}
                            className="text-sm font-mono text-text-secondary hover:text-text-primary underline decoration-border-subtle hover:decoration-text-primary underline-offset-4 transition-all"
                        >
                            {isLogin ? 'No account? Create one here.' : 'Already initialized? Back to Login.'}
                        </Link>
                    </div>
                </div>

            </form>
        </div>
    );
}