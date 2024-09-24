"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import React from "react";
import axios from "axios";

export default function Home() {
  
  // React.useEffect(() => {
  //   axios.get("http://localhost:1234/").then((res) => console.log(res.data));
  // }, []);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
