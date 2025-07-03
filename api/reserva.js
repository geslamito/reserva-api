export default async function handler(req, res) {
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
${correo ? `📧 Correo: ${correo}\n` : ''}
📆 Fecha: ${fecha} a las ${hora}
🔌 Cliente Repsol: ${clienteRepsol}
📝 Motivo: ${motivo}${motivo === "Otro" && detalle ? `\n🧾 Detalle: ${detalle}` : ''}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: mensaje })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
