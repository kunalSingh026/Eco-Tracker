// backend/src/controllers/insightsController.ts
import { Elysia, t } from 'elysia';
import { supabase } from '../db/supabase';

export const insightsRoutes = new Elysia({ prefix: '/api/v1/insights' })
  .get('/:userId', async ({ params, status }) => {
    const { userId } = params;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return status(500, { message: "AI Engine configuration missing on server." });
    }

    // 1. Fetch the last 5 logs from Supabase to give context to the AI
    const { data: logs, error: dbError } = await supabase
      .from('footprint_logs')
      .select('logged_at, commute_mode, commute_distance_km, meal_type, energy_kwh, total_co2_kg')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(5);

    if (dbError) return status(400, { message: dbError.message });
    if (!logs || logs.length === 0) {
      return { success: true, insights: "Log at least one daily activity to unlock personalized AI recommendations!" };
    }

    // 2. Format the logs into a highly readable text string for the AI prompt
    const dataContext = logs.map(log => 
      `Date: ${log.logged_at} | Transport: ${log.commute_mode} (${log.commute_distance_km}km) | Diet: ${log.meal_type} | Energy: ${log.energy_kwh}kWh | CO2: ${log.total_co2_kg}kg`
    ).join('\n');

    // 3. Craft a strict prompt to make the output punchy, short, and actionable
    const prompt = {
      contents: [{
        parts: [{
          text: `You are an expert carbon footprint reduction AI. Analyze this user's recent data logs:\n\n${dataContext}\n\nProvide exactly 3 bullet points of highly specific, actionable advice based on their numbers. Focus on where they waste the most CO2. Keep it under 100 words total. Do not use generic introductions.`
        }]
      }]
    };

    try {
      // 4. Send the request using an ultra-lightweight native fetch call
      const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prompt),
        }
      );

      const json: any = await aiResponse.json();
      const insightsText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate insights right now.";

      return { success: true, insights: insightsText };
    } catch (aiError: any) {
      return status(500, { message: "AI service failed to respond.", details: aiError.message });
    }
  }, {
    params: t.Object({
      userId: t.String({ format: 'uuid' })
    })
  });
