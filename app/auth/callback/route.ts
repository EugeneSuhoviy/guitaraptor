import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const requestURL = new URL(request.url);
    const code = requestURL.searchParams.get('code');

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(requestURL.origin);
}
