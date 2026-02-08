
import React, { useState, useEffect, useRef } from 'react';

export default function ChatBox({ userId, recipientName, onClose }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('Connecting...');

    useEffect(() => {
        // Create WebSocket connection
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const wsProtocol = apiBase.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = apiBase.replace(/^https?/, wsProtocol);

        const ws = new WebSocket(`${wsUrl}/ws/${userId}`);

        ws.onopen = () => {
            setStatus('Connected');
            setMessages(prev => [...prev, { text: `Connected to chat server as ${userId}`, sender: 'system' }]);
        };

        ws.onmessage = (event) => {
            setMessages(prev => [...prev, { text: event.data, sender: 'remote' }]);
        };

        ws.onclose = () => {
            setStatus('Disconnected');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [userId]);

    const sendMessage = () => {
        if (socket && input.trim()) {
            socket.send(input);
            // Optimistically add to UI (though server echoes it back in our simple implementation, so maybe strictly rely on echo? 
            // For now, let's just send and rely on the broadcast echo to avoid duplication if we add it here too)
            setInput('');
        }
    };

    return (
        <div className="chat-box" style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '320px', height: '450px',
            background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
            border: '1px solid rgba(0,0,0,0.1)'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px', background: 'var(--primary)', color: 'white',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div>
                    <div style={{ fontWeight: '600' }}>Chat with {recipientName}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{status}</div>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f5f5f7' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        marginBottom: '8px',
                        textAlign: msg.sender === 'system' ? 'center' : (msg.text.startsWith(`User ${userId}`) ? 'right' : 'left'),
                        fontSize: '0.9rem'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            background: msg.sender === 'system' ? 'transparent' : (msg.text.startsWith(`User ${userId}`) ? 'var(--primary)' : 'white'),
                            color: msg.sender === 'system' ? '#888' : (msg.text.startsWith(`User ${userId}`) ? 'white' : 'black'),
                            boxShadow: msg.sender !== 'system' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            maxWidth: '80%'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div style={{ padding: '12px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '8px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        background: 'var(--primary)', color: 'white', border: 'none',
                        borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}
