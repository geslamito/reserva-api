// pages/api/disponible.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const { fecha } = req.body;

  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('hora')
      .eq('fecha', fecha);

    if (error) {
      throw error;
    }

    const horasReservadas = data.map(r => r.hora);
    return res.status(200).json({ success: true, horasReservadas });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
