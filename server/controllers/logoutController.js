async function logoutUser(req, res) {

    //TODO: Front-end: delete the access token!
    //IN production, add secure: true 
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "Strict"
    })

    res.sendStatus(204);
}

export { logoutUser };