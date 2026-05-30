"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 bg-background/95 backdrop-blur border-b border-border items-center px-6 gap-6">
      <Link href="/" className="flex items-center mr-4">
        <span className="font-display font-black text-2xl tracking-tighter">
          <span className="text-accent">RAP</span>HUNT
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <Link href="/" className="px-3 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-surface transition-all">
          Home
        </Link>
        <Link href="/launches" className="px-3 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-surface transition-all">
          Launches
        </Link>
        <Link href="/charts" className="px-3 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-surface transition-all">
          Charts
        </Link>
        <Link href="/events" className="px-3 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-surface transition-all">
          Events
        </Link>
        <Link href="/news" className="px-3 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-surface transition-all">
          News
        </Link>
        <Link href="/reviews" className="px-3 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-surface transition-all">
          Reviews
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {user && profile ? (
          <>
            {(profile.role === "artist" || profile.role === "admin") && (
              <Link href="/submit">
                <Button size="sm">+ Drop a Track</Button>
              </Link>
            )}
            {profile.role === "admin" && (
              <Link href="/admin">
                <Badge variant="accent">Admin</Badge>
              </Link>
            )}
            <Link href={`/artists/${profile.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar src={profile.avatar_url} name={profile.display_name ?? profile.username} size="sm" />
              <span className="text-sm font-medium">{profile.display_name ?? profile.username}</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
          </>
        ) : (
          <>
            <Link href="/login"><Button variant="secondary" size="sm">Log in</Button></Link>
            <Link href="/signup"><Button size="sm">Sign up</Button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
