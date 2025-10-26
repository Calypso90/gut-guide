import React from "react";

const Auth: React.FC = () => {
  return (
    <section className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Sign in / Sign up</h1>
      <form className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
        />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Sign in
          </button>
          <button className="border px-4 py-2 rounded">Sign up</button>
        </div>
      </form>
    </section>
  );
};

export default Auth;
