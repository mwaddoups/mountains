import React from "react";
import { Disc } from "react-bootstrap-icons";

interface LoadingProps {
  loading: boolean,
  children: React.ReactNode
}

export default function Loading({loading, children}: LoadingProps) {
  return (
    <div className="relative">
      <div className={loading ? "blur" : ""}>
        {children}
      </div>
      {loading && (
        <div className="absolute inset-x-2/4 top-10 w-full h-full">
          <Disc className="origin-center animate-spin w-5 h-5 text-slate-500" />
        </div>
      )}
    </div>
  )
}