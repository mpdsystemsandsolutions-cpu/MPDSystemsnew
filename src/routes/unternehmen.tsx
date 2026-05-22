import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/unternehmen")({
  component: () => <Outlet />,
});
