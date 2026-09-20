import { Outlet } from "react-router";
import Header from "./Header";
// import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

export default function RootLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}
            <Toaster
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
