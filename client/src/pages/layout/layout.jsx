import React from 'react';
import { Link } from 'react-router-dom'; 
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; 
import { FaHome } from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";
import { HiOutlineTemplate } from "react-icons/hi";
import { BsPeopleFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { PiStudentDuotone } from "react-icons/pi";

const Layout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-auto bg-light sticky-top">
          <div className="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
            <Link to="/" className="d-block p-3 link-dark text-decoration-none" title="Icon-only">
              <PiStudentDuotone className="bi-bootstrap fs-1" />
            </Link>
            <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center">
              <li className="nav-item">
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="tooltip-home">Home</Tooltip>}
                >
                  <Link to="#" className="nav-link py-3 px-2">
                    <FaHome className='fs-1'/>
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="tooltip-dashboard">Dashboard</Tooltip>}
                >
                  <Link to="#" className="nav-link py-3 px-2">
                    <IoIosSpeedometer className='fs-1'/>
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="tooltip-orders">Orders</Tooltip>}
                >
                  <Link to="#" className="nav-link py-3 px-2">
                    <HiOutlineTemplate className='fs-1'/>
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="tooltip-products">Products</Tooltip>}
                >
                  <Link to="#" className="nav-link py-3 px-2">
                    <BsPeopleFill className='fs-1'/>
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-sm p-3 min-vh-100">
          {/* content */}
        </div>
      </div>
    </div>
  );
};

export default Layout;