import { NextRequest, NextResponse } from 'next/server';
import { healthMythsAndFacts } from '@/utils/healthUtils';

// GET /api/health/myths
export async function GET(request: NextRequest) {
  try {
    // Return the predefined list of health myths and facts
    return NextResponse.json(healthMythsAndFacts);
  } catch (error) {
    console.error('Error fetching health myths and facts:', error);
    return NextResponse.json({ error: 'Failed to fetch health myths and facts' }, { status: 500 });
  }
}
