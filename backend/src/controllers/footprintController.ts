// backend/src/controllers/footprintController.ts
import { Elysia, t } from 'elysia';
import { supabase } from '../db/supabase';
import { calculateDailyCarbon } from './carbonEngine';

export const footprintRoutes = new Elysia({ prefix: '/api/v1/footprint' })
  // 1. Log Daily Footprint
  .post('/log', async ({ body, status }) => {
    const { userId, commuteMode, commuteDistanceKm, mealType, energyKwh } = body;

    // Run the inputs through the calculation engine
    const totalCo2Kg = calculateDailyCarbon({
      commuteMode,
      commuteDistanceKm,
      mealType,
      energyKwh
    });

    // Upsert directly into Supabase (Insert or Update if log for today already exists)
    const { data, error: dbError } = await supabase
      .from('footprint_logs')
      .upsert({
        user_id: userId,
        logged_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        commute_mode: commuteMode,
        commute_distance_km: commuteDistanceKm,
        meal_type: mealType,
        energy_kwh: energyKwh,
        total_co2_kg: totalCo2Kg
      }, { onConflict: 'user_id,logged_at' })
      .select();

    if (dbError) return status(400, { message: dbError.message });
    
    return { success: true, message: 'Activity logged successfully!', data: data[0] };
  }, {
    body: t.Object({
      userId: t.String({ format: 'uuid' }),
      commuteMode: t.Optional(t.Union([t.Literal('car'), t.Literal('public_transport'), t.Literal('bike'), t.Literal('walk')])),
      commuteDistanceKm: t.Optional(t.Number()),
      mealType: t.Optional(t.Union([t.Literal('meat_heavy'), t.Literal('vegetarian'), t.Literal('vegan')])),
      energyKwh: t.Optional(t.Number())
    })
  })

  // 2. Fetch Historical Logs for Analytics & Dashboard charts
  .get('/history/:userId', async ({ params, status }) => {
    const { data, error: dbError } = await supabase
      .from('footprint_logs')
      .select('*')
      .eq('user_id', params.userId)
      .order('logged_at', { ascending: false })
      .limit(7); // Last 7 entries for dashboard charts

    if (dbError) return status(400, { message: dbError.message });
    return { success: true, data };
  }, {
    params: t.Object({
      userId: t.String({ format: 'uuid' })
    })
  });
