"use client";
import { useEffect, useState } from "react";

export default function Home() {
 const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveHandler = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", moveHandler);
    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);


  return (
    <div className=" text-white relative overflow-hidden">
       <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-50">
        <div
          className="absolute w-40 h-40 bg-white rounded-full opacity-30 blur-3xl"
          style={{
            left: position.x - 80,
            top: position.y - 80,
          }}
        />
      </div>
    </div>
  );
}
