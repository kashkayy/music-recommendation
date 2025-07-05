import {useState } from "react"
import { SECTIONS } from "../AdminSections"
import Sidebar from "../components/Sidebar"
import Dashboard from "../pages/Dashboard"
import DataTable from "../pages/DataTable"
import { fetchData } from "../AdminData"
import { tableColumns } from "../TableColumns"
export default function AdminContent() {
    const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD)
    const [sectionData, setSectionData] = useState([])
    async function handleSectionChange(section){
        setActiveSection(section)
        const data = await fetchData(section)
        setSectionData(data)
    }
    function renderContent(){
        if (activeSection === SECTIONS.DASHBOARD){
            return <Dashboard/>
        }
        else if (activeSection === SECTIONS.USERS || activeSection === SECTIONS.SONGS){
            return <DataTable data={sectionData} columns={tableColumns[activeSection]}/>
        }
    }
    return(
        <>
            <div className="admin">
                <Sidebar onSelect={handleSectionChange}/>
                {renderContent()}
            </div>
        </>
    )
}
