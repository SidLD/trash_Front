import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import { Home } from "@/pages/home"
import { PrivateLayout, PublicLayout } from "./module"
import { Login } from "@/pages/login"
import AboutUs from "@/pages/about-us"
import { SignUp } from "@/pages/sign-up"
import { AdminDashboard } from "@/pages/admin/dashboard"
import { ContributorDashboard } from "@/pages/contributor/dashboard"
import { UserManagement } from "@/pages/admin/user-management"
const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PublicLayout/>}>
                <Route index path="/" element={<Home />} />
                <Route  path="/login" element={<Login />} />
                <Route  path="/sign-up" element={<SignUp />} />
                <Route  path="/about" element={<AboutUs />} />
                <Route  path="*" element={<Navigate to="/" replace />} />
            </Route>  
            <Route element={<PrivateLayout/>} >
               <Route path="/admin">
                    <Route  index  element={<AdminDashboard />}/>
                    <Route  path="user-management"  element={<UserManagement />}/>
               </Route>
               <Route path="/contributor">
                    <Route  index  element ={ <ContributorDashboard /> }/>
               </Route>
            </Route> 

        </>
    )
)
export default routers