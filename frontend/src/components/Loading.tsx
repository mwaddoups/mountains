import React from "react";

interface LoadingProps {
  loading: boolean,
  children: React.ReactNode
}

export default function Loading({loading, children}: LoadingProps) {
  return (
      loading 
      ? <h2>Loading...</h2>
      : <div>{children}</div>
  )
}