"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { ApiError } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFields({});
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fields) setFields(err.fields);
      } else {
        setError("Something went wrong. Is the backend running?");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  if (user) {
    return (
      <div>
        <h1 className="page-title">Your Profile</h1>
        <div className="card auth-card" style={{ marginTop: 0 }}>
          <p style={{ marginTop: 0 }}>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Saved trails:</strong> {user.saved_trails.length} ·{" "}
            <strong>Saved lodges:</strong> {user.saved_housing.length}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Link href="/saved" className="btn btn-primary">
              View saved
            </Link>
            <button className="btn btn-outline" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{mode === "login" ? "Sign in" : "Create an account"}</h1>
      <p className="page-subtitle">
        Sign in to bookmark your favorite trails and lodges.
      </p>

      <form className="card auth-card" style={{ marginTop: 0 }} onSubmit={onSubmit}>
        {mode === "register" ? (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            {fields.username ? <div className="error-text">{fields.username}</div> : null}
          </div>
        ) : null}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {fields.email ? <div className="error-text">{fields.email}</div> : null}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {fields.password ? <div className="error-text">{fields.password}</div> : null}
        </div>

        {error ? <div className="error-text" style={{ marginBottom: 10 }}>{error}</div> : null}

        <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <p style={{ marginTop: 14, fontSize: 14, textAlign: "center" }}>
          {mode === "login" ? "New to HokieTrails?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
              setFields({});
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}
