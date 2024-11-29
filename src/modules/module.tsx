

import { auth } from '@/lib/services';
import { getRoleRoutePath } from '../lib/helper';
import { Navigate } from "react-router-dom"
import DashboardLayout from '@/layouts/DashboardLayout';
import Guest from '@/layouts/Guest';
import PrintLayout from '@/layouts/PrintLayout';

export const PublicLayout = () => {
    
    if(auth.isAuthenticated()){
        return  <Navigate to={getRoleRoutePath()} />;
    }
    return (
        <Guest />
    )
}

export const PrivateLayout = () => {
    if (!auth.isAuthenticated()) {
        return <Navigate to={"/login"} />;
    }
    else if (auth.getExpiration() * 1000 <= Date.now()) {
        auth.clear()
        alert("Session Expired")
        return <Navigate to={"/login"} />;
        
    }else{
        return <DashboardLayout />
    }   
}

export const PrivatePrintLayout = () => {
    if (!auth.isAuthenticated()) {
        return <Navigate to={"/login"} />;
    }
    else if (auth.getExpiration() * 1000 <= Date.now()) {
        auth.clear()
        alert("Session Expired")
        return <Navigate to={"/login"} />;
        
    }else{
        return <PrintLayout />
    }   
}