import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Search, Shield, Zap } from 'lucide-react'

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f] font-sans">
            {/* Header */}
            <header className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
                <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <span className="text-xl font-semibold tracking-tight text-gray-900">
                            MentorNexus
                        </span>
                    </div>
                    <div className="flex flex-1 justify-end gap-x-6">
                        <Link to="/login" className="text-sm font-medium leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-medium leading-6 text-blue-600 hover:text-blue-700 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="relative isolate pt-32 px-6 lg:px-8">
                <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6">
                        Mentorship. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071E3] to-[#40C4FF]">
                            Reimagined.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-500 max-w-2xl mx-auto">
                        Connect with world-class faculty. Secure your research future with blockchain-verified matches.
                        Simple, transparent, and intelligent.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            to="/register"
                            className="rounded-full bg-[#0071E3] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0077ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] transition-all transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-[#0071E3] transition-colors">
                            Live Demo <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-panel p-8 rounded-2xl hover:shadow-apple-hover transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Zap className="h-6 w-6 text-[#0071E3]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">AI-Powered Matching</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Our advanced NLP engine analyzes semantic connections between your profile and faculty research to uncover hidden opportunities.
                        </p>
                    </div>
                    <div className="glass-panel p-8 rounded-2xl hover:shadow-apple-hover transition-all duration-300">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Blockchain Verified</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Peace of mind built-in. Every mentorship agreement is immutably recorded on Ethereum, ensuring total transparency.
                        </p>
                    </div>
                    <div className="glass-panel p-8 rounded-2xl hover:shadow-apple-hover transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Smart Scheduling</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Effortless coordination. Book interviews and management meetings directly within the platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
