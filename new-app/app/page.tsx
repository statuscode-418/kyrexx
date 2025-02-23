"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import Image from "next/image";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";





export default function Page() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/scanning-page"); 
    }
  }, [isConnected, router]);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <div className="stars-bg" />
        <div className="orbital-shape" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-purple-500 font-bold text-2xl">K</span>
              <span className="font-semibold">Kyrex</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#" className="text-sm hover:text-purple-500 transition-colors">
                Home
              </Link>
              <Link href="#" className="text-sm hover:text-purple-500 transition-colors">
                Technology
              </Link>
              <Link href="#" className="text-sm hover:text-purple-500 transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-sm hover:text-purple-500 transition-colors">
                FAQ
              </Link>
            </nav>
           <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-purple-500 glow-purple">Zero Knowledge Proof</span>
            <br />
            <span className="text-white">BlockChain based</span>
            <br />
            <span className="text-purple-500 glow-purple">Voting</span>
            <span className="text-white"> Application</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Revolutionize voting with our zero-knowledge-based application—ensuring complete privacy, security, and
            transparency. Cast your vote with confidence, knowing your identity and choices remain fully anonymous!
          </p>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 rounded-lg text-lg">
            Get Started
          </Button>
        </div>

        {/* Technology Section */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">About Our Technology</h2>
          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-16">
            Powered by cutting-edge technology, our service ensures unmatched security, speed, and scalability for a
            seamless user experience
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl hover:border-purple-500 transition-all hover:glow-purple">
              <h3 className="text-white text-2xl font-bold mb-4">zkSTARK</h3>
              <p className="text-gray-400">
                "Leverage the power of zkSTARK proofs for scalable, trustless, and ultra-secure verification—ensuring
                privacy without compromising efficiency."
              </p>
            </Card>
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl hover:border-purple-500 transition-all hover:glow-purple">
              <h3 className="text-white text-2xl font-bold mb-4">Ponder</h3>
              <p className="text-gray-400">
                "Streamline smart contract data indexing with Ponder, enabling real-time, efficient, and reliable
                indexing for seamless blockchain interactions."
              </p>
            </Card>
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl hover:border-purple-500 transition-all hover:glow-purple">
              <h3 className="text-white text-2xl font-bold mb-4">Foundry</h3>
              <p className="text-gray-400">
                "Develop high-performance, secure, and upgradeable smart contracts with Foundry's powerful,
                developer-friendly toolset."
              </p>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-transparent border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
            >
              Know more
            </Button>
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Pricing Section */}
        <section className="text-center mb-32">
          <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Flexible and transparent pricing plans designed to scale with your needs—get the best value without
            compromise.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl hover:border-purple-500 transition-all">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-6 text-purple-500">Free Plan</h3>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-white">Up to 50 Aadhaar Verifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-white">Unlimited Appeal Participation</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-white">Seamless and Secure Voting Experience</span>
                </li>
              </ul>
              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-white text-4xl font-bold">$0</span>
                  <span className="text-gray-400 ml-2">per month</span>
                </div>
              </div>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">Get Started</Button>
            </Card>

            {/* Business Plan */}
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl hover:border-purple-500 transition-all">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-6 text-purple-500">Business Plan</h3>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-white">Unlimited Aadhaar Verifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-white">Unlimited Appeal Creation</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-white">Seamless and Secure Voting Experience</span>
                </li>
              </ul>
              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-white text-4xl font-bold">$69</span>
                  <span className="text-gray-400 ml-2">per month</span>
                </div>
              </div>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">Get Started</Button>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-12">
            Have Questions?
            <br />
            We've Got Your Answers
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl">
              <h3 className="text-white text-xl font-semibold mb-4">What is Kyrex</h3>
              <p className="text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Suspendisse potenti. Proin ac
                velit ut justo faucibus blandit. Donec vehicula, massa a interdum luctus, ipsum quam gravida odio, vel
                vulputum justo sapien at libero.
              </p>
            </Card>
            <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl">
              <h3 className="text-white text-xl font-semibold mb-4">How do I start using Kyrex</h3>
              <p className="text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Suspendisse potenti. Proin ac
                velit ut justo faucibus blandit. Donec vehicula, massa a interdum luctus, ipsum quam gravida odio.
              </p>
            </Card>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-32">
          <Card className="bg-[#12121a]/80 backdrop-blur-sm border-purple-500/20 p-8 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-purple-500 font-bold text-2xl">K</span>
              <span className="text-white font-semibold">Kyrex</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Stay ahead with Kyrex insights</h3>
            <p className="text-gray-400 mb-6">
              Share your email with us to receive the latest updates, important announcements, and exclusive insights
              straight to your inbox
            </p>
            <div className="flex gap-4">
              <Input type="email" placeholder="Enter your Email" className="bg-transparent border-white/20" />
              <Button className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap">Subscribe</Button>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400">
          <div className="flex justify-center gap-4 mb-4">
            <a href="#" className="hover:text-purple-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-purple-500 transition-colors">
              Privacy Policy
            </a>
          </div>
          <p>Copyright 2024@status_code-418</p>
        </footer>
      </div>

      </main>
    </div>
  )
}

