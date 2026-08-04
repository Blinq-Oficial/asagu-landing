import { getDatabase } from '@netlify/database';

async function migrate() {
  try {
    const db = getDatabase();
    console.log('Conectado a la base de datos de Netlify.');
    console.log('Ejecutando migración...');
    
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
    
    console.log('Migración completada exitosamente. La tabla "leads" ya existe en producción.');
  } catch (error) {
    console.error('Error durante la migración:', error);
  }
}

migrate();
