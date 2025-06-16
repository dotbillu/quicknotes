import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    fetchNotes();
  }, [token, navigate]);

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill both title and content");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to add note");
        return;
      }
      setNotes((prev) => [...prev, data.note]);
      setTitle("");
      setContent("");
    } catch (error) {
      alert("Failed to add note");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete note");
        return;
      }
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      alert("Failed to delete note");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Title */}
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Quick Notes</h1>

        {/* Add Note Form */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            backgroundColor: "#f9f9f9",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical",
              textAlign: "left",
            }}
          />
          <button
            onClick={handleAddNote}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              width: "100%",
            }}
          >
            Add Note
          </button>
        </div>

        {/* Horizontal line */}
        {notes.length > 0 && <hr style={{ margin: "30px 0" }} />}

        {/* Notes list */}
        <div>
          {notes.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>
              No notes yet. Add one above!
            </p>
          ) : (
            notes.map(({ _id, title, content }) => (
              <div
                key={_id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  position: "relative",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <h3 style={{ margin: "0 0 10px", textAlign: "left" }}>{title}</h3>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", textAlign: "left" }}>
                  {content}
                </p>
                <button
                  onClick={() => handleDelete(_id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  title="Delete Note"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}