import AdminContent from "../containers/AdminContent"
import { isAdmin } from "../api"
import { useEffect, useState } from "react"
export default function Admin() {
    const [isAdminUser, setIsAdminUser] = useState(false)
    async function handlePermission(){
        const result = await isAdmin()
        setIsAdminUser(result)
    }
    useEffect(() => {
        handlePermission()
    }, [])
    return (
    <>
      {isAdminUser ? <AdminContent /> : <div id="permission">Not Authorized</div>}
    </>
    )
}
