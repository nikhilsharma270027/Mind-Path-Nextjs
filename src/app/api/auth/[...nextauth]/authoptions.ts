import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';
// import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    
    user: DefaultSession["user"] & {
      id: string;
       username?: string;
    }
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
  }
}

//                        type
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({//it is a method that gives access to objects
            id: "credentials",
            name: "Credentials",
            credentials: {// here we get actuall access of credebtials
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                // await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                            // { email: credentials.email },
                            // { username: credentials.username }
                        ]
                    });

                    // if user has not come
                    if (!user) {
                        throw new Error('No user found with this email')
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (err: any) {
                    console.error('Error in authorize function:', err.message);
                    throw new Error(err.message || 'Authentication failed');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id?.toString();
                // token.isVerified = user.isVerified;
                // token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = (user as any).username;
                // console.log("JWT Callback:", token);
            }
            return token
        },
        // most of the time nextjs works on session based strategy
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                // session.user.isVerified = token.isVerified;
                // session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            // console.log(session)
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}