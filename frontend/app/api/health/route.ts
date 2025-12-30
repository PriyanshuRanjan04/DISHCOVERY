import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('Health check endpoint called');

    const hasClerkSecret = !!process.env.CLERK_SECRET_KEY;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    const diagnostics = {
        hasClerkSecret,
        backendUrl: backendUrl || 'MISSING',
        env: process.env.NODE_ENV,
    };

    try {
        const target = backendUrl || 'http://localhost:8000';
        const res = await fetch(`${target}/health`);
        const data = await res.json();

        return NextResponse.json({
            status: 'ok',
            diagnostics,
            backendResponse: data
        });
    } catch (e: any) {
        console.error('Health check failed:', e);
        return NextResponse.json({
            status: 'error',
            diagnostics,
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
