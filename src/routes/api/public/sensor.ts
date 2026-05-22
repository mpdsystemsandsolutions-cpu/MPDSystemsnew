import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Device-Token",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export const Route = createFileRoute("/api/public/sensor")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),

      POST: async ({ request }) => {
        const expected = process.env.DEVICE_TOKEN;
        if (!expected) return json({ error: "Server not configured" }, 500);

        const token = request.headers.get("x-device-token");
        if (!token || token !== expected) {
          return json({ error: "Unauthorized" }, 401);
        }

        let payload: { temperature?: unknown; humidity?: unknown };
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const temperature = Number(payload.temperature);
        const humidity = Number(payload.humidity);

        if (
          !Number.isFinite(temperature) ||
          !Number.isFinite(humidity) ||
          temperature < -50 ||
          temperature > 100 ||
          humidity < 0 ||
          humidity > 100
        ) {
          return json({ error: "Invalid temperature or humidity" }, 400);
        }

        const { error } = await supabaseAdmin
          .from("sensor_readings")
          .insert({ temperature, humidity });

        if (error) {
          console.error("Insert failed", error);
          return json({ error: "Database error" }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
