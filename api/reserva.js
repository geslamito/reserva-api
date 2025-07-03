import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.grupogeslama.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  try {
    const {
      nombre,
      telefono,
      correo,
      fecha,
      hora,
      clienteRepsol,
      motivo,
      detalle
    } = req.body;

    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const mensaje = `📅 Nueva cita reservada:
👤 Nombre: ${nombre}
📞 Teléfono: ${telefono}
${correo ? `📧 Correo: ${correo}\n` : ''}📆 Fecha: ${fecha} a las ${hora}
🔌 Cliente Repsol: ${clienteRepsol}
📝 Motivo: ${motivo}${motivo === "Otro" && detalle ? `\n🧾 Detalle: ${detalle}` : ''}`;

    const chatIds = process.env.TELEGRAM_CHAT_ID.split(',');

for (const chatId of chatIds) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId.trim(),
      text: mensaje
    })
  });
}

    // INSERTA EN SUPABASE
    const { error } = await supabase.from('reservas').insert([{
      nombre,
      telefono,
      correo,
      fecha,
      hora,
      clienteRepsol,
      motivo,
      detalle
    }]);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
