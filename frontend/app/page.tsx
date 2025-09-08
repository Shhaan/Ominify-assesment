"use client";
import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock, X } from "lucide-react";
import baseapi from "./src";
import "./event.css"; // Import the CSS file
import { useRouter } from "next/router";
import Event_rout from "../app/component/Event_rout";

const Event = () => {
  // Create Event Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    start_time: "",
    end_time: "",
    max_capacity: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const openCreate = () => {
    setIsCreateOpen(true);
    setForm({
      name: "",
      location: "",
      start_time: "",
      end_time: "",
      max_capacity: "",
    });
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
    if (!form.location.trim()) return "Location is required.";
    if (!form.start_time.trim()) return "Start time is required.";
    if (!form.end_time.trim()) return "End time is required.";
    if (
      !form.max_capacity.trim() ||
      isNaN(Number(form.max_capacity)) ||
      Number(form.max_capacity) < 1
    )
      return "Max capacity must be a positive number.";
    if (new Date(form.start_time) >= new Date(form.end_time))
      return "End time must be after start time.";
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
        name: form.name,
        location: form.location,
        start_time: form.start_time,
        end_time: form.end_time,
        max_capacity: Number(form.max_capacity),
      };
      const response = await baseapi.post("events", payload);
      // Add new event to list
      setrefresh((e) => !e);
      setIsCreateOpen(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.data || "Failed to create event.");
    } finally {
      setFormLoading(false);
    }
  };
  type EventType = {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    location: string;
    max_capacity: number;
    created_at: string;
    updated_at: string;
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setrefresh] = useState(true);

  useEffect(() => {
    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(localTimeZone);

    const fetchEvents = async () => {
      try {
        const response = await baseapi.get(
          `events?user_location=${localTimeZone}`
        );
        console.log("API Response:", response);
        setEvents(response?.data?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refresh]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedEvent(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, eventData: EventType) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleEventClick(eventData);
    }
  };

  if (loading) {
    return (
      <div className="event-loading-container">
        <div className="event-loading-spinner"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="event-main-container">
        <h1 className="event-title"> Events</h1>
        <button
          className="create-event-btn"
          onClick={openCreate}
          style={{ marginBottom: "1.5rem" }}
        >
          Create Event
        </button>
        <div className="no-events">
          <h2 className="no-events-title">No Events Found</h2>
          <p className="no-events-text">
            There are currently no upcoming events available.
          </p>
        </div>

        {isCreateOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "28rem" }}>
              <div className="modal-header">
                <div className="modal-header-content">
                  <h2 className="modal-title">Create Event</h2>
                  <button
                    onClick={closeCreate}
                    className="modal-close-btn"
                    aria-label="Close modal"
                  >
                    <X className="modal-close-icon" />
                  </button>
                </div>
              </div>
              <form className="modal-body" onSubmit={handleCreateSubmit}>
                <div className="modal-details">
                  <div className="modal-detail-item">
                    <input
                      type="text"
                      name="name"
                      placeholder="Event Name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="modal-detail-item">
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={form.location}
                      onChange={handleFormChange}
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="modal-detail-item">
                    <input
                      type="datetime-local"
                      name="start_time"
                      placeholder="Start Time"
                      value={form.start_time}
                      onChange={handleFormChange}
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="modal-detail-item">
                    <input
                      type="datetime-local"
                      name="end_time"
                      placeholder="End Time"
                      value={form.end_time}
                      onChange={handleFormChange}
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="modal-detail-item">
                    <input
                      type="number"
                      name="max_capacity"
                      placeholder="Max Capacity"
                      value={form.max_capacity}
                      onChange={handleFormChange}
                      className="modal-input"
                      min={1}
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
                    {formLoading ? "Creating..." : "Create"}
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
      </div>
    );
  }

  return (
    <div className="event-main-container">
      <h1 className="event-title">Events</h1>
      <button
        className="create-event-btn"
        onClick={openCreate}
        style={{ marginBottom: "1.5rem" }}
      >
        Create Event
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          overflowX: "auto",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="event-card"
            style={{ minWidth: "350px", flex: "0 0 auto" }}
            onClick={() => handleEventClick(event)}
            onKeyDown={(e) => handleKeyDown(e, event)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${event.name}`}
          >
            <div className="event-card-header"></div>

            <div className="event-card-content">
              <h3 className="event-card-title">{event.name}</h3>
              <div className="event-details">
                <div className="event-detail-item">
                  <Calendar className="event-detail-icon calendar" />
                  <span className="event-detail-text">
                    {formatDate(event.start_time)}
                  </span>
                </div>

                <div className="event-detail-item">
                  <Clock className="event-detail-icon clock" />
                  <span className="event-detail-text">
                    {formatTime(event.start_time)} -{" "}
                    {formatTime(event.end_time)}
                  </span>
                </div>

                <div className="event-detail-item">
                  <MapPin className="event-detail-icon location" />
                  <span className="event-detail-text">{event.location}</span>
                </div>

                <div className="event-detail-item">
                  <Users className="event-detail-icon users" />
                  <span className="event-detail-text">
                    Max {event.max_capacity} attendees
                  </span>
                </div>
              </div>
              <Event_rout id={event.id} event={event} />
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "28rem" }}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2 className="modal-title">Create Event</h2>
                <button
                  onClick={closeCreate}
                  className="modal-close-btn"
                  aria-label="Close modal"
                >
                  <X className="modal-close-icon" />
                </button>
              </div>
            </div>
            <form className="modal-body" onSubmit={handleCreateSubmit}>
              <div className="modal-details">
                <div className="modal-detail-item">
                  <input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-detail-item">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleFormChange}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-detail-item">
                  <input
                    type="datetime-local"
                    name="start_time"
                    placeholder="Start Time"
                    value={form.start_time}
                    onChange={handleFormChange}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-detail-item">
                  <input
                    type="datetime-local"
                    name="end_time"
                    placeholder="End Time"
                    value={form.end_time}
                    onChange={handleFormChange}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-detail-item">
                  <input
                    type="number"
                    name="max_capacity"
                    placeholder="Max Capacity"
                    value={form.max_capacity}
                    onChange={handleFormChange}
                    className="modal-input"
                    min={1}
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
                  {formLoading ? "Creating..." : "Create"}
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
    </div>
  );
};

export default Event;
