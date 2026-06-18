import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import mongodb from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {

      const adminemail="shaikhhuzefa3794@gmail.com";


      //storing in DB


      try {

        await mongodb();

        const existingUser = await User.findOne({
          email: user.email
        })

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image
          })
        }
        return true;
      } catch(err){
        console.error("Database error during sign in:", err);
        return false;
      }
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };