import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export const Route = createFileRoute("/api/public/latest")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),

      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const deviceId = url.searchParams.get("device_id");

          let query = supabaseAdmin
            .from("sensor_readings")
            .select("id, device_id, temperature, humidity, recorded_at")
            .order("recorded_at", { ascending: false })
            .limit(288);

          if (deviceId) {
            query = query.eq("device_id", deviceId);
          }

          const { data, error } = await query;

          if (error) {
            console.error("Latest readings lookup failed", error);
            return json({ error: "Database error" }, 500);
          }

          return json({
            readings: (data ?? []).map((reading) => ({
              ...reading,
              temperature: Number(reading.temperature),
              humidity: Number(reading.humidity),
            })),
          });
        } catch (error) {
          console.error("Latest readings API failed", error);
          return json({ error: "Server configuration error" }, 500);
        }
      },
    },
  },
});
