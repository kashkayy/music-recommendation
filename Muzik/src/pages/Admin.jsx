import AdminContent from "../containers/AdminContent"
import { isAdmin } from "../api"
import { useEffect, useState } from "react"
import { Spinner } from "react-spinner-toolkit";
export default function Admin() {
    const [isAdminUser, setIsAdminUser] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    async function handlePermission(){
        await new Promise (resolve => setTimeout(resolve, 1000))
        const result = await isAdmin()
        setIsAdminUser(result)
    }
    useEffect(() => {
        handlePermission().then(() => setIsLoaded(true))
    }, [])
    return (
    <>
      {isLoaded? 
        (isAdminUser ? <AdminContent /> : <div id="permission">Not Authorized</div>) : (<div className="loading-container"><Spinner shape="threeDots" color="#888" loading speed={1} size={400} transition={true} /></div>)
      }
    </>
    )
}
