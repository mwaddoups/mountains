import React, { useEffect } from "react";

interface ModalProps {
    children: React.ReactFragment;
}

export default function AttendPopup({ children }: ModalProps) {

  // Disable scroll on the body with modal dialog
  useEffect(() => {
     document.body.style.overflow = 'hidden';
     return () => { document.body.style.overflow = 'unset' };
  }, []);


  return (
    <div className="fixed left-0 top-0 w-full h-full bg-black/60 z-40">
      <div className="fixed w-3/4 h-auto mx-auto top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg p-5 shadow bg-white overflow-scroll">
        {children}
      </div>
    </div>
  )
}