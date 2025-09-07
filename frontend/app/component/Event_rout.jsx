"use client";
import { useRouter } from "next/navigation";
import React from "react";

const EventRout = ({ id, event }) => {
  const router = useRouter();

  const handleClick = () => {
    // Storing the event in localStorage is a valid method for client-side
    // data transfer.
    localStorage.setItem("selectedEvent", JSON.stringify(event));

    // The router push path should be spelled correctly
    router.push(`/attendees/${id}`);
  };

  return (
    <div>
      <button onClick={handleClick} className="event-view-details-btn">
        View Attendees
      </button>
    </div>
  );
};

export default EventRout;
