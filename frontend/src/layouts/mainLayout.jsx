import { Outlet } from "react-router-dom"
import Navbar from "@/components/navbar"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Pas à Pas — Sneakers & SneakArt
        </div>
      </footer>
    </div>
  )
}
