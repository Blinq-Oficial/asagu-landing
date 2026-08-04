import { getDatabase } from '@netlify/database';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  let data;
  try {
    const text = await req.text();
    data = JSON.parse(text);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload', details: error.message }), { status: 400, headers });
  }

  try {
    const db = getDatabase();

    const entidad = data.entidad || 'N/A';
    const contacto = data.contacto;
    const telefono = data.telefono || 'N/A';
    const email = data.email;
    const objeto = data.objeto;

    if (!contacto || !email || !objeto) {
       return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400, headers });
    }

    let formattedPhone = telefono;
    if (telefono !== 'N/A') {
      try {
        const phoneNumber = parsePhoneNumberFromString(telefono, 'CO');
        if (phoneNumber && phoneNumber.isValid()) {
          formattedPhone = phoneNumber.formatInternational();
        }
      } catch (e) {
        console.warn('No se pudo formatear el teléfono:', e);
      }
    }

    const ip_address = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || null;

    // Crear la tabla si no existe (solución para despliegues manuales por CLI)
    await db.sql`
      CREATE TABLE IF NOT EXISTS leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          entity TEXT NOT NULL,
          contact_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          ip_address TEXT
      );
    `;

    await db.sql`
      INSERT INTO leads (entity, contact_name, phone, email, message, ip_address) 
      VALUES (${entidad}, ${contacto}, ${formattedPhone}, ${email}, ${objeto}, ${ip_address})
    `;

    return new Response(JSON.stringify({ message: 'Solicitud enviada exitosamente' }), { status: 200, headers });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor', details: error.message || error.toString() }), { status: 500, headers });
  }
};
