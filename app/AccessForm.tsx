"use client";

// Early-access capture form. On submit it confirms inline (no backend yet).
export default function AccessForm() {
  return (
    <form
      className="cta-form"
      onSubmit={(e) => {
        e.preventDefault();
        const btn = e.currentTarget.querySelector('button');
        if (btn) btn.textContent = 'Request Sent ✓';
      }}
    >
      <input type="email" placeholder="Your law firm email address" required />
      <button type="submit">Request Access</button>
    </form>
  );
}
