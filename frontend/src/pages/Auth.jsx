import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
   const response = await fetch(`https://quicknotes-37g4.onrender.com${endpoint}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});


      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // On successful login, store token and navigate to notes
          localStorage.setItem("token", data.token);
          navigate("/notes");
        } else {
          // On successful registration, switch to login form
          alert("Registration successful! Please login.");
          setIsLogin(true);
          setUsername("");
          setPassword("");
        }
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f0f0",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}