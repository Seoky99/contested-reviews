import { Outlet, Navigate, useLocation } from "react-router";
import useAuthStore from "../../../customHooks/store/useAuthStore";

function AuthGuard() {

    const accessToken = useAuthStore(state => state.accessToken);
    const userId = useAuthStore(state => state.userId);
    const hasTriedRefresh = useAuthStore(state => state.hasTriedRefresh);

    const location = useLocation();

    if (!hasTriedRefresh) {
        return <h1>Loading...</h1>
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