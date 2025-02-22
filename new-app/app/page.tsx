"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import Image from "next/image";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/feed");
    }
  }, [isConnected, router]);

  return (
    <main className="flex min-h-screen bg-gray-950">
      <div className="m-auto max-w-md w-full px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              width={64}
              height={64}
              alt="Kyrex Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-white text-5xl font-bold text-center">
            Kyrex
          </h2>

          <p className="text-lg text-center text-gray-400 max-w-sm">
            Secure your Aadhaar data and participate in democratic voting
          </p>

          {isConnected ? (
            <p className="text-green-500 text-lg font-medium">Redirecting to feed...</p>
          ) : (
            <div className="w-full flex justify-center">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Wallet } from "lucide-react"

// export default function Page() {
//   return (
//     <div className="min-h-screen bg-[#0D0D12] text-white relative overflow-hidden">
//       {/* Particles */}
//       <div className="absolute inset-0">
//         <div className="absolute h-2 w-2 bg-white/10 rounded-full top-[20%] left-[15%] animate-pulse"></div>
//         <div className="absolute h-2 w-2 bg-white/10 rounded-full top-[40%] right-[25%] animate-pulse"></div>
//         <div className="absolute h-2 w-2 bg-white/10 rounded-full top-[60%] left-[35%] animate-pulse"></div>
//         <div className="absolute h-2 w-2 bg-white/10 rounded-full top-[80%] right-[15%] animate-pulse"></div>
//       </div>

//       {/* Navigation */}
//       <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-8">
//         <div className="flex items-center gap-2">
//           <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-[#A020F0]" stroke="currentColor" strokeWidth="2" />
//             <path d="M2 17L12 22L22 17" className="fill-[#A020F0]" stroke="currentColor" strokeWidth="2" />
//             <path d="M2 12L12 17L22 12" className="fill-[#A020F0]" stroke="currentColor" strokeWidth="2" />
//           </svg>
//           <span className="text-xl font-bold">Kyrex</span>
//         </div>

//         <div className="hidden md:flex items-center gap-8">
//           <Link href="/" className="text-white hover:text-white/80">
//             Home
//           </Link>
//           <Link href="/technology" className="text-gray-400 hover:text-gray-300">
//             Technology
//           </Link>
//           <Link href="/pricing" className="text-gray-400 hover:text-gray-300">
//             Pricing
//           </Link>
//           <Link href="/faq" className="text-gray-400 hover:text-gray-300">
//             FAQ
//           </Link>
//         </div>

//         <Button variant="outline" className="gap-2 bg-transparent border-gray-700 hover:bg-gray-800">
//           <Wallet className="h-4 w-4" />
//           Connect Wallet
//         </Button>
//       </nav>

//       {/* Hero Section */}
//       <main className="relative z-10 px-6 pt-16 mx-auto max-w-7xl lg:px-8">
//         <div className="text-center space-y-8">
//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
//             <span className="text-[#A020F0]">Zero Knowledge Proof</span>
//             <br />
//             <span className="text-white">BlockChain based </span>
//             <span className="text-[#FF1493]">Voting</span>
//             <span className="text-white"> Application</span>
//           </h1>

//           <p className="mx-auto max-w-2xl text-lg text-gray-400">
//             Revolutionize voting with our zero-knowledge-based application—ensuring complete privacy, security, and
//             transparency.
//             <br />
//             Cast your vote with confidence, knowing your identity and choices remain fully anonymous!
//           </p>

//           <div>
//             <Button className="bg-[#A020F0] hover:bg-[#8010D0] text-white px-8 py-6 text-lg rounded-full">
//               Get Started
//             </Button>
//           </div>
//         </div>
//       </main>

//       {/* Bottom Curve */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <div className="relative">
//           <div className="absolute bottom-0 h-72 w-full bg-gradient-to-t from-gray-900/50 to-transparent rounded-[100%] transform translate-y-1/2"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

