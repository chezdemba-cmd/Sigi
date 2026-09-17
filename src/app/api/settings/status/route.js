import { NextResponse } from 'next/server';
import { api } from '@/lib/api';

function validSecret(value, minimum = 20) {
  return typeof value === 'string'
    && value.length >= minimum
    && !/changez-moi|example|placeholder|your[_-]/i.test(value);
}

export const GET = api(async () => NextResponse.json({
  anthropic: validSecret(process.env.ANTHROPIC_API_KEY),
  webhook: validSecret(process.env.WHATSAPP_VERIFY_TOKEN, 16),
}));
