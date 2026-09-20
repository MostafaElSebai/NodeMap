import { RouterProvider } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import { router } from "./routes/routes";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
}