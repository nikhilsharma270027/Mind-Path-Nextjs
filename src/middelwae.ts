import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export  { default } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request})
    //to check on what current url r we on
    const url = request.nextUrl

    // checking if user has a token and where user can access
    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === ('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new  URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
// this is the file where we want the middleware to run
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}