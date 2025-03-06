import React from 'react';
import { Link } from 'react-router-dom'; 
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; 
import { BsJournalBookmarkFill } from "react-icons/bs";
import { PiStudentDuotone, PiChalkboardTeacher } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { GiBee } from "react-icons/gi";

const Layout = ({ children }) => {
  return (
    <div className="sidebar container-fluid">
      <div className="row">
        <div className="col-sm-auto sidebar" style={{ backgroundColor: "#2d3034" }}>
          <div className="d-flex flex-column flex-nowrap align-items-center" style={{ backgroundColor: "#2d3034" }}>
            <Link to="#" className="d-block p-3 link-light text-decoration-none">
              <GiBee className="fs-1 text-white" />
            </Link>
            <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center">
              <li className="nav-item">
                <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-students">Студенти</Tooltip>}>
                  <Link to="/students" className="nav-link py-3 px-2 text-white">
                    <PiStudentDuotone className="fs-1 text-white" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-facultatives">Факультативи</Tooltip>}>
                  <Link to="/faculty" className="nav-link py-3 px-2 text-white">
                    <BsJournalBookmarkFill className="fs-1 text-white" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-teachers">Викладачі</Tooltip>}>
                  <Link to="/teachers" className="nav-link py-3 px-2 text-white">
                    <PiChalkboardTeacher className="fs-1 text-white" />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
            <div className="dropdown">
              <Link to="#" className="d-flex align-items-center justify-content-center p-3 link-light text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                <CiLogout className="fs-1 text-white" />
              </Link>
              <ul className="dropdown-menu text-small shadow text-white" aria-labelledby="dropdownUser3">
                <li>
                  <Link className="dropdown-item text-white" to="#">Log Out</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          { children }
        </div>
      </div>
    </div>
  );
};

export default Layout;