export async function GET() {
  return Response.json({
    nextauth: process.env.NEXTAUTH_URL,
  });
}