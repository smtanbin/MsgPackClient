import logo from '../public/assets/SVG/logo.svg'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Heart, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Logo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                <Image src={logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Pack Tester
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Alien Tech for Earth APIs</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6 sm:gap-8">
            {/* Copyright */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm mb-2">
                <span>© 2026</span>
                <a href='https://github.com/smtanbin' target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                  Tanbin
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                <span>Built with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>for developers</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-400 mb-3">Follow me</p>
              <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6">
                <a
                  href="https://github.com/smtanbin"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                >
                  <Github className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">GitHub</span>
                </a>
                <a
                  href="https://x.com/SilentTanbin"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Twitter</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mds-tanbin/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Alien signature */}
          <div className="text-center">
            <p className="text-xs text-gray-500 italic">
              &quot;May your APIs be as fast as light speed&quot; - Tanbin, Magestica
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
