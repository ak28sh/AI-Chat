import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './rootLayout.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const VITE_CLERK_PUBLISHABLE_KEY = 'pk_test_YmFsYW5jZWQtYm9uZWZpc2gtODkuY2xlcmsuYWNjb3VudHMuZGV2JA'

// Import your publishable key
// console.log(import.meta, typeof(import.meta))
const PUBLISHABLE_KEY = VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <QueryClientProvider client={queryClient}>
                <div className="rootLayout">
                    <header>
                        <Link to="/" className="logo">
                            <img src="/logo.png" alt="" />
                            <span>AI CHAT</span>
                        </Link>
                        <div className="user">
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </QueryClientProvider>
        </ClerkProvider>
    )
}

export default RootLayout