"use client";

import React, { useState } from "react";
import "./NavbarMain.scss";
import Link from "next/link";
import Image from "next/image";

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
            {/* <Image src="/favicon.ico" width={30} height={30} alt="Logo"></Image> */}
            Streamer Tracker TFT
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
                <li>
                  <Link href="/streamers/Mortdog">Mortdog</Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarMain;
