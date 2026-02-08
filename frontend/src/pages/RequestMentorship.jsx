import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sendMentorshipRequest, getFacultyRequests } from '../api/api'
import useAuthStore from '../stores/useAuthStore'
import { ArrowLeft, Send, Sparkles, User, Info, CheckCircle2 } from 'lucide-react'

export default function RequestMentorship() {
    const { facultyId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [facultyName, setFacultyName] = useState('Faculty Member')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // In a real app, fetch faculty details. 
        // For now, we'll try to get it from state or just use a placeholder
        // Since we don't have a getFacultyById endpoint yet, we'll just use ID
        setFacultyName(`Faculty ID: ${facultyId}`)
    }, [facultyId])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!message.trim()) return

        setSending(true)
        setError('')

        try {
            await sendMentorshipRequest({
                student_id: user.id,
                student_name: user.name,
                faculty_id: facultyId,
                faculty_name: facultyName,
                message: message,
                status: 'pending'
            })
            setSuccess(true)
            setTimeout(() => navigate('/student/dashboard'), 2000)
        } catch (err) {
            setError('Failed to send request. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20 font-sans">
            <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 px-4 rounded-xl hover:bg-gray-50 -ml-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 pt-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Mentorship</h1>
                    <p className="text-gray-500">Reach out to faculty members to express your interest in their research.</p>
                </div>

                {success ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-apple border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <h2 className="text-24 font-bold text-gray-900 mb-4">Request Sent!</h2>
                        <p className="text-gray-500 mb-8">Dr. {facultyName} will be notified of your interest. You'll be redirected to your dashboard shortly.</p>
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="text-primary font-bold hover:underline"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Faculty Card Mini */}
                        <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{facultyName}</h3>
                                    <p className="text-xs text-gray-500 font-medium">Faculty Member</p>
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold text-gray-900">Your Message</h2>
                            </div>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="I am very interested in your research on..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-5 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none resize-none min-h-[220px] leading-relaxed"
                            />

                            <div className="mt-6 flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Tips: Be genuine, mention specific research interests, and highlight why you're a good fit for their lab.
                                </p>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={handleSend}
                                    disabled={sending || !message.trim()}
                                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Send Request
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 bg-white border border-gray-100 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            {error && (
                                <p className="mt-4 text-center text-red-500 text-sm font-bold">{error}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
