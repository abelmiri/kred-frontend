const versionMigrations = (version) =>
{
    if (localStorage.hasOwnProperty("version"))
    {
        const userVersion = localStorage.getItem("version")
        if (userVersion === "1")
        {
            const req = indexedDB.deleteDatabase("videoDb")
            req.onsuccess = () => console.log("Deleted database successfully")
            req.onerror = () => console.log("Couldn't delete database")
            req.onblocked = () => console.log("Couldn't delete database due to the operation being blocked")
        }
        localStorage.setItem("version", version)
    }
    else localStorage.setItem("version", version)
}

export default versionMigrations