import { NextResponse } from 'next/server';
import { api, jsonBody } from '@/lib/api';
import { z } from 'zod';
import { getDemoGlobal, setSetting } from '@/lib/settings';
import { logAudit } from '@/lib/audit';

export const GET = api(async () => NextResponse.json({ demoGlobal: await getDemoGlobal() }));

export const PATCH = api(async (request) => {
  const { demoGlobal } = await jsonBody(request, z.object({ demoGlobal: z.boolean() }));
  await setSetting('demo_mode_global', demoGlobal);
  await logAudit('admin', demoGlobal ? 'demo_mode_enabled' : 'demo_mode_disabled');
  return NextResponse.json({ demoGlobal });
});
