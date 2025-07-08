import { Outlet } from "react-router"; 

function Root() {
    return (
        <>
            <h1>Hello world</h1>
            <Outlet/>
        </>
    );
}

export default Root; 