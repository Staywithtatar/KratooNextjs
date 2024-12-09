"use client"

import Image from "next/image";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Vercel from '../../public/vercel.svg'
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";
import AllPosts from "./components/AllPosts";
import Comments from "./components/Comments";

// app/page.jsx
export default function Home() {
  const { data: session } = useSession();

  return (
      <main className='bg-gradient-to-b from-white to-blue-50 min-h-screen'>
          <Container>
              <Navbar session={session} />
              <div className="flex-grow">
                  <div className="text-center py-12 bg-white shadow-sm">
                      <h3 className="text-4xl font-bold text-blue-900 mb-2">KRATOO.DEK.CS.NPRU</h3>
                      <p className="text-blue-600 text-lg">StaywithtatarJohnydeffOnetap</p>
                  </div>
                  
                  {/* Posts Section */}
                  <div className="max-w-6xl mx-auto py-12">
                      <AllPosts />
                  </div>
              </div>
              <Footer />
          </Container>
      </main>
  );
}