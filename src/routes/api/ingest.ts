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

function isValidReading(temperature: number, humidity: number) {
  return (
    Number.isFinite(temperature) &&
    Number.isFinite(humidity) &&
    temperature >= -50 &&
    temperature <= 100 &&
    humidity >= 0 &&
    humidity <= 100
  );
}

export const Route = createFileRoute("/api/ingest")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),

      POST: async ({ request }) => {
        try {
          const token = request.headers.get("x-device-token");
          let deviceId: string | null = null;

          if (token) {
            const { data: device, error: deviceError } = await supabaseAdmin
              .from("devices")
              .select("id")
              .eq("device_token", token)
              .maybeSingle();

            if (deviceError) {
              console.error("Device lookup failed", deviceError);
              return json({ error: "Database error" }, 500);
            }

            deviceId = device?.id ?? null;
          }

          let payload: { temperature?: unknown; humidity?: unknown };
          try {
            payload = await request.json();
          } catch {
            return json({ error: "Invalid JSON" }, 400);
          }

          const temperature = Number(payload.temperature);
          const humidity = Number(payload.humidity);

          if (!isValidReading(temperature, humidity)) {
            return json({ error: "Invalid temperature or humidity" }, 400);
          }

          const { error } = await supabaseAdmin.from("sensor_readings").insert({
            device_id: deviceId,
            temperature,
            humidity,
          });

          if (error) {
            console.error("Insert failed", error);
            return json({ error: "Database error" }, 500);
          }

          return json({ ok: true, linkedDevice: Boolean(deviceId) });
        } catch (error) {
          console.error("Ingest API failed", error);
          return json({ error: "Server configuration error" }, 500);
        }
      },
    },
  },
});
