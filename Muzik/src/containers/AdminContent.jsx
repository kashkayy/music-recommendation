import { useState } from "react";
import { SECTIONS } from "../AdminSections";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import UserTable from "../pages/UserTable";
import SongTable from "../pages/SongTable";
import { fetchData } from "../AdminData";
import { tableColumns } from "../TableColumns";
export default function AdminContent() {
  const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD);
  const [sectionData, setSectionData] = useState([]);
  async function handleSectionChange(section) {
    setActiveSection(section);
    const data = await fetchData(section);
    setSectionData(data);
  }
  function renderContent() {
    if (activeSection === SECTIONS.DASHBOARD) {
      return <Dashboard />;
    } else if (activeSection === SECTIONS.USERS) {
      return (
        <UserTable
          data={sectionData}
          columns={tableColumns[activeSection]}
          //pass down handleSectionChange function as a prop
          onChange={handleSectionChange}
        />
      );
    } else if (activeSection === SECTIONS.SONGS) {
      return (
        <SongTable data={sectionData} columns={tableColumns[activeSection]} />
      );
    }
  }
  return (
    <>
      <div className="admin">
        <Sidebar onSelect={handleSectionChange} />
        {renderContent()}
      </div>
    </>
  );
}
