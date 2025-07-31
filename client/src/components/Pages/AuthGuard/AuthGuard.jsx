import { Outlet, Navigate, useLocation } from "react-router";
import useAuthStore from "../../../customHooks/store/useAuthStore";
import CircularProgress from '@mui/material/CircularProgress';

function AuthGuard() {

    const accessToken = useAuthStore(state => state.accessToken);
    const userId = useAuthStore(state => state.userId);
    const hasTriedRefresh = useAuthStore(state => state.hasTriedRefresh);

    const location = useLocation();

    if (!hasTriedRefresh) {
        return <CircularProgress className={"spinner"}/>
    }

    return (
        <>
            {
                accessToken && userId ? 
                    <Outlet/> : <Navigate to="/login" state={{from: location}} replace/> 
            }
        </>
    );
}


export default AuthGuard; 