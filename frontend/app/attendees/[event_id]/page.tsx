"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import base_api from "@/app/src";
import "../attandees.css";

const AttendeesPage = () => {
  const { event_id } = useParams(); // from URL /attandees/[event_id]

  // Create Attendee Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Attendees data
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const openCreate = () => {
    setIsCreateOpen(true);
    setForm({ name: "", email: "" });
    setFormError("");
  };
  const closeCreate = () => {
    setIsCreateOpen(false);
    setFormError("");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email is invalid.";
    return "";
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }
    setFormLoading(true);
    setFormError("");
    try {
      const payload = {
        event: Number(event_id),
        name: form.name,
        email: form.email,
      };
      await base_api.post("/attendees", payload);
      setIsCreateOpen(false);
      setRefresh((prev) => !prev);
    } catch (err: any) {
      setFormError(err?.response?.data?.data || "Failed to create attendee.");
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ fetch attendees with normal pagination
  const fetchAttendees = async () => {
    if (!event_id) return;
    setLoading(true);
    try {
      const response = await base_api.get(
        `/attendees?event_id=${event_id}&is_paginated=true&page=${page}`
      );

      const results = response?.data?.data?.results || [];
      const count = response?.data?.data?.count || 0;
      const perPage = results.length > 0 ? results.length : 1;

      setAttendees(results);
      setPageCount(Math.ceil(count / perPage));
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ fetch on page change or refresh
  useEffect(() => {
    fetchAttendees();
  }, [page, refresh]);

  // ✅ get event from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedEvent");
    if (stored) {
      setEvent(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-6">
      <button
        className="create-event-btn"
        onClick={openCreate}
        style={{ marginBottom: "1.5rem" }}
      >
        Add Attendee
      </button>

      {/* Event Info */}
      {event && (
        <div className="mb-6 border rounded-lg shadow-md p-4 bg-white">
          <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
          <p className="text-gray-600">{event.location}</p>
          <p className="mt-2 text-sm text-gray-500">
            Start:{" "}
            {typeof window !== "undefined"
              ? new Date(event.converted_time.start_time).toLocaleString()
              : event.converted_time.start_time}
          </p>
          <p className="text-sm text-gray-500">
            End:{" "}
            {typeof window !== "undefined"
              ? new Date(event.converted_time.end_time).toLocaleString()
              : event.converted_time.end_time}
          </p>
          <p className="text-sm text-gray-500">
            Max Capacity: {event.max_capacity}
          </p>
        </div>
      )}

      {/* Create Attendee Modal */}
      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "28rem" }}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2 className="modal-title">Add Attendee</h2>
                <button
                  onClick={closeCreate}
                  className="modal-close-btn"
                  aria-label="Close modal"
                >
                  X
                </button>
              </div>
            </div>
            <form className="modal-body" onSubmit={handleCreateSubmit}>
              <div className="modal-details">
                <div className="modal-detail-item">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-detail-item">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleFormChange}
                    className="modal-input"
                    required
                  />
                </div>
              </div>
              {formError && (
                <p className="modal-meta-text" style={{ color: "#ef4444" }}>
                  {formError}
                </p>
              )}
              <div className="modal-actions">
                <button
                  type="submit"
                  className="modal-btn modal-btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closeCreate}
                  className="modal-btn modal-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeCreate}></div>
        </div>
      )}

      {/* Attendees List */}
      <h3 className="text-xl font-semibold mb-4">Attendees</h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : attendees.length === 0 ? (
          <p className="text-center text-gray-500">No attendees found</p>
        ) : (
          attendees.map((attendee, index) => (
            <div key={index} className="attendee-card">
              <p className="attendee-name">{attendee.name}</p>
              <p className="attendee-email">{attendee.email}</p>
              <p className="attendee-joined">
                Joined:{" "}
                {typeof window !== "undefined"
                  ? new Date(attendee.created_at).toLocaleString()
                  : attendee.created_at}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {pageCount}
        </span>

        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendeesPage;
