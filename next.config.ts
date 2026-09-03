import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Dev-only QA: lets a real device reach the dev server through an ngrok tunnel.
  // Without this, Next.js dev rejects the tunnel origin's asset/HMR requests --
  // the page loads (initial HTML is unaffected) but React never hydrates, so
  // interactions silently no-op (e.g. Q1 not advancing to Q2). Wildcard host,
  // not a session-specific ngrok URL, so this keeps working when ngrok issues a
  // new free-tier hostname. No effect on production builds.
  allowedDevOrigins: ["*.ngrok-free.app"],
};

export default nextConfig;
