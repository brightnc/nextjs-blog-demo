import React from "react";

export default async function ReviewDetail({
  params,
}: {
  params: { reviewId: string; id: string };
}) {
  const { id, reviewId } = await params;
  return (
    <h1>
      ReviewDetail {reviewId} for blog {id}
    </h1>
  );
}
