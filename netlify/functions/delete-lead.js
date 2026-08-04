import { getDatabase } from '@netlify/database';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  const authHeader = req.headers.get('authorization');
  const env = process.env;
  const adminPassword = env['ADMIN_PASSWORD'] || 'AsaguAdmin2026!';

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Invalid password.' }), { status: 401, headers });
  }

  let data;
  try {
    const text = await req.text();
    data = JSON.parse(text);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload', details: error.message }), { status: 400, headers });
  }

  const { id } = data;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Lead ID is required' }), { status: 400, headers });
  }

  try {
    const db = getDatabase();
    
    await db.sql`
      DELETE FROM leads WHERE id = ${id}
    `;

    return new Response(JSON.stringify({ message: 'Lead deleted successfully' }), { status: 200, headers });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers });
  }
};
