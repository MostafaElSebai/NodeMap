import { useRouteError, useNavigate } from "react-router"

export default function ErrorPage() {
    const error = useRouteError()
    const navigate = useNavigate()
    console.log(error);
    return (
        <>
            <h1>Something went wrong</h1>
            <p>{error.data || "Please try again later"}</p>
            <button onClick={() => navigate('/')}>Go back to home page</button>
        </>
    )
}