import { getDatabase } from '@netlify/database';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  const authHeader = req.headers.get('authorization');
  const env = process.env;
  const adminPassword = env['ADMIN_PASSWORD'] || 'AsaguAdmin2026!';

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Invalid password.' }), { status: 401, headers });
  }

  try {
    const db = getDatabase();
    
    const leads = await db.sql`
      SELECT 
        id, 
        created_at, 
        entity, 
        contact_name as name, 
        phone, 
        email, 
        message, 
        ip_address as ip
      FROM leads
      ORDER BY created_at DESC
    `;

    return new Response(JSON.stringify(leads), { status: 200, headers });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers });
  }
};
