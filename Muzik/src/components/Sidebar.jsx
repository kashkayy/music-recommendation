import { useState } from "react";
import Hamburger from "hamburger-react";
import { SECTIONS } from "../admin/AdminSections";
export default function Sidebar({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="aside">
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <Hamburger toggled={isOpen} toggle={setIsOpen} />
        {isOpen && (
          <nav>
            {Object.keys(SECTIONS).map((section) => (
              <button key={section} onClick={() => onSelect(SECTIONS[section])}>
                {SECTIONS[section]}
              </button>
            ))}
          </nav>
        )}
      </aside>
    </div>
  );
}
