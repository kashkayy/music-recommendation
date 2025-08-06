import { useState } from "react";
import { SECTIONS, ROLE } from "../admin/AdminSections";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import Dashboard from "../pages/Dashboard";
import UserTable from "../pages/UserTable";
import SongTable from "../pages/SongTable";
import { fetchData } from "../admin/AdminData";
import { tableColumns } from "../admin/TableColumns";
export default function AdminContent() {
  const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD);
  const [sectionData, setSectionData] = useState([]);
  const { user } = useAuth();
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
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {activeSection === SECTIONS.DASHBOARD && user?.role === ROLE.globalAdmin && (
            <h1 style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              marginTop: "1rem",
              textAlign: "center",
              width: "100%"
            }}>
              Chart for Entire Map
            </h1>
          )}
          {renderContent()}
        </div>
      </div>
    </>
  );
}
