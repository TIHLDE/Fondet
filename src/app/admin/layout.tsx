import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-token";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware has already verified the token for everything except the login
  // page; this only decides whether the logout button makes sense to show.
  const loggedIn = cookies().has(SESSION_COOKIE);
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {loggedIn && (
        <div className="flex items-center justify-end mb-6">
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="outline">
              Logg ut
            </Button>
          </form>
        </div>
      )}
      {children}
    </div>
  );
}
