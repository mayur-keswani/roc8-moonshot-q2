import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    // if (typeof window !== "undefined") {
        const auth: any = req.cookies.get('auth')?.value
        let parsedAuth;
        try {
                parsedAuth = auth ? JSON.parse(auth) : null;
        } catch (error) {
            // If parsing fails, assume the user is not logged in
            parsedAuth = null;
        }
        // Redirect to login if the user is not logged in or if the auth data is invalid
        if (!parsedAuth || !parsedAuth.isLoggedIn) {
            
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Continue to the requested page if the user is authenticated
        return NextResponse.next();
    // }
}

export const config = {
    matcher: ['/'],
}