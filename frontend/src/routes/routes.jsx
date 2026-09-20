import { createBrowserRouter } from "react-router";
import { Home, AuthPage, Boards, BoardCanvas, ErrorPage } from "../pages";
import RootLayout from "../components/RootLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import GuestRoute from "../components/GuestRoute.jsx";
import { ReactFlowProvider } from "@xyflow/react"
import { BoardProvider } from "../contexts/boardContext.jsx";
import { AuthProvider } from "../contexts/authContext.jsx";


export const router = createBrowserRouter([
    {
        path: "/", element: <AuthProvider><RootLayout /></AuthProvider>,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            {
                element: <GuestRoute />,
                children: [
                    { path: "/login", element: <AuthPage />, errorElement: <ErrorPage /> },
                    { path: "/register", element: <AuthPage />, errorElement: <ErrorPage /> }
                ]
            },
            {
                element: <ProtectedRoute />, children: [{
                    path: "/boards", element: <>
                        <BoardProvider>
                            <Boards />
                        </BoardProvider>
                    </>, errorElement: <ErrorPage />
                },
                {
                    path: "/boards/:boardId", element:
                        <BoardProvider>
                            <ReactFlowProvider>
                                <BoardCanvas />
                            </ReactFlowProvider>
                        </BoardProvider>,
                    errorElement: <ErrorPage />
                }]
            }

        ]
    }
]);