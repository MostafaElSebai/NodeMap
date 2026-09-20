import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
// import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

export default function RootLayout() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}
            <Toaster
                position={isMobile ? "bottom-center" : "top-center"}
                toastOptions={{
                    style: {
                        background: '#1A1D24',
                        color: '#E2E8F0',
                        border: '1px solid #2C313A',
                    },
                }}
            />
        </>
    )
}
