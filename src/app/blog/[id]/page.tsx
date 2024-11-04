import React from "react";

export default function BlogDetail({ params }: { params: { id: string } }) {
  return (
    <>
      <h1>Detail {params.id}</h1>
    </>
  );
}
