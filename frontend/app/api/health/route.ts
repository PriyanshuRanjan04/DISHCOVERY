import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('Health check endpoint called');
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/health`);
        const data = await res.json();

        return NextResponse.json({
            status: 'ok',
            backendUrl,
            backendResponse: data
        });
    } catch (e: any) {
        console.error('Health check failed:', e);
        return NextResponse.json({
            status: 'error',
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
