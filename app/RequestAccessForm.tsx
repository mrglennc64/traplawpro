"use client";

import { useState } from 'react';

// Early-access form. No backend yet — validates email and confirms inline.
export default function RequestAccessForm() {
  const [msg, setMsg] = useState('');

  return (
    <form
      className="reqform"
      onSubmit={(e) => {
        e.preventDefault();
        const email = (e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement | null)?.value || '';
        if (email.includes('@')) {
          setMsg('Request received. A member of our attorney team will reach out within 24 hours.');
          e.currentTarget.reset();
        } else {
          setMsg('Please enter a valid law firm email address.');
        }
      }}
    >
      <input type="text" placeholder="Full name" required />
      <input type="email" placeholder="Law firm email" required />
      <input type="text" placeholder="Firm name" />
      <select defaultValue="">
        <option value="" disabled>Number of attorneys</option>
        <option>1–2</option>
        <option>3–5</option>
        <option>6+</option>
      </select>
      <button type="submit">Request early access →</button>
      <p className="reqnote">We will never share your information. No obligation.</p>
      {msg ? <div className="reqmsg">{msg}</div> : null}
    </form>
  );
}
