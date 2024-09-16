import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom"
import { Home } from "@/pages/home"
import { PrivateLayout, PublicLayout } from "./module"
import { Login } from "@/pages/login"
import AboutUs from "@/pages/about-us"
import { SignUp } from "@/pages/sign-up"
const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PublicLayout/>}>
                <Route index path="/" element={<Home />} />
                <Route index path="/login" element={<Login />} />
                <Route index path="/sign-up" element={<SignUp />} />
                <Route index path="/about" element={<AboutUs />} />
            </Route>  
            <Route element={<PrivateLayout/>} >

            </Route> 

        </>
    )
)
export default routers