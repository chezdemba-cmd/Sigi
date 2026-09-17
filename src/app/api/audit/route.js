import { NextResponse } from 'next/server';
import { api, checked } from '@/lib/api';
import { db } from '@/lib/supabase';
import { paging } from '@/lib/resources';

export const GET = api(async (request) => {
  const { start, end } = paging(request, 200);
  const rows = checked(await db().from('audit_logs').select('*')
    .order('created_at', { ascending: false }).order('id').range(start, end));
  return NextResponse.json(rows);
});
