'use client'

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Type, Zap, Share2, Star, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('auth') === 'required') {
      setAuthModalOpen(true)
    }
  }, [searchParams])

  const handleSignIn = () => setAuthModalOpen(true);
  const handleTryFree = () => setAuthModalOpen(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-inter">
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Top Nav */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold">∞ Everything Calculator</div>
        <div className="flex space-x-6">
          <a href="#" className="text-[#a1a1aa] hover:text-[#fafafa]">Marketplace</a>
          <a href="#" className="text-[#a1a1aa] hover:text-[#fafafa]">How it Works</a>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#18181b] border-[#27272a] text-[#fafafa]">
                <DropdownMenuItem>My Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn}>Sign in</Button>
              <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white" onClick={handleTryFree}>Try Free →</Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6">
        <h1 className="text-7xl font-bold mb-4">
          Calculate Anything. <span className="text-[#a855f7]">Instantly.</span>
        </h1>
        <p className="text-xl text-[#a1a1aa] mb-8 max-w-2xl mx-auto">
          Describe your calculation in plain English. Get a working, interactive tool in seconds.
        </p>
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex">
            <Input
              placeholder="e.g. Calculate my FIRE runway with savings rate and expected returns..."
              className="flex-1 bg-[#18181b] border-[#27272a] rounded-l-lg text-[#fafafa] placeholder-[#a1a1aa]"
            />
            <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-r-lg px-6">Build It →</Button>
          </div>
        </div>
        <div className="flex justify-center space-x-2">
          <Badge variant="outline" className="cursor-pointer bg-[#18181b] border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">FIRE Calculator</Badge>
          <Badge variant="outline" className="cursor-pointer bg-[#18181b] border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">Mortgage Affordability</Badge>
          <Badge variant="outline" className="cursor-pointer bg-[#18181b] border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">Macro Split Tracker</Badge>
          <Badge variant="outline" className="cursor-pointer bg-[#18181b] border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">SaaS Churn Rate</Badge>
          <Badge variant="outline" className="cursor-pointer bg-[#18181b] border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">Freelance Rate</Badge>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="text-center py-4 bg-[#18181b] border-y border-[#27272a]">
        <p className="text-sm text-[#a1a1aa]">Join 12,000+ users · 50,000+ calculators built · 4.9★ avg rating</p>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Type className="w-12 h-12 mx-auto mb-4 text-[#a855f7]" />
            <h3 className="text-xl font-bold mb-2">Describe it</h3>
            <p className="text-[#a1a1aa]">Type your calculation in plain English.</p>
          </div>
          <div className="text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-[#a855f7]" />
            <h3 className="text-xl font-bold mb-2">AI builds it</h3>
            <p className="text-[#a1a1aa]">Our AI generates a fully functional calculator.</p>
          </div>
          <div className="text-center">
            <Share2 className="w-12 h-12 mx-auto mb-4 text-[#fafafa]" />
            <h3 className="text-xl font-bold mb-2">Use & share it</h3>
            <p className="text-[#a1a1aa]">Interact with it and share with others.</p>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">From the Marketplace</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {[
            { title: "FIRE Runway Calculator", category: "Finance", rating: 4.7, uses: "2.3k" },
            { title: "SaaS Revenue Projector", category: "Business", rating: 4.8, uses: "1.8k" },
            { title: "Macro & Calorie Tracker", category: "Health", rating: 4.6, uses: "3.1k" },
            { title: "Mortgage Affordability", category: "Finance", rating: 4.9, uses: "2.7k" },
            { title: "Startup Runway", category: "Business", rating: 4.5, uses: "1.5k" },
            { title: "BMI + TDEE", category: "Health", rating: 4.7, uses: "4.2k" },
          ].map((tool, index) => (
            <Card key={index} className="w-72 bg-white/5 backdrop-blur border-[#27272a] rounded-2xl">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-[#a855f7] text-white">{tool.category}</Badge>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm">{tool.rating}</span>
                  </div>
                  <span className="text-sm text-[#a1a1aa]">{tool.uses} uses</span>
                </div>
                <Button variant="outline" className="w-full border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">Fork</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center bg-[#18181b] border-t border-[#27272a]">
        <div className="text-2xl font-bold mb-2">∞ Everything Calculator</div>
        <p className="text-[#a1a1aa] mb-4">Describe any calculation, build it instantly, and share it with the world.</p>
        <p className="text-sm text-[#a1a1aa]">Built with Lovable</p>
      </footer>
    </div>
  );
}