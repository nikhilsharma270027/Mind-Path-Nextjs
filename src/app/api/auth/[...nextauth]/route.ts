import NextAuth from "next-auth/next";
import { authOptions } from "../../../../lib/authoptions";

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
// in this files, write any method that will not work , cuz it is a framework,
// we need these get post verbs, then only it works