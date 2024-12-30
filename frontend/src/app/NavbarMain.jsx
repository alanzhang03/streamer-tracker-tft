"use client";

import React, { useState } from "react";
import "./NavbarMain.scss";
import Link from "next/link";

const NavbarMain = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul>
          <Link className="nav-label-left" href="/">
            LOGO Streamer Tracker TFT
          </Link>
        </ul>
        <ul className="navbar-menu">
          <li>
            <Link href="/">Home</Link>
          </li>

          <li
            className="dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="#streamers">Streamers</Link>
            {isDropdownOpen && (
              <ul className="dropdown-content">
                <li>
                  <Link href="/streamers/K3soju">K3soju</Link>
                </li>
                <li>
                  <Link href="/streamers/Setsuko">Setsuko</Link>
                </li>
                <li>
                  <Link href="/streamers/Dishsoap">Dishsoap</Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarMain;
