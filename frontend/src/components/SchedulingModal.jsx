
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Simple modal styles for MVP
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
    }
};

export default function SchedulingModal({ isOpen, onClose, facultyId, facultyName }) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('10:00');
    const [status, setStatus] = useState('');

    if (!isOpen) return null;

    const handleBook = async () => {
        setStatus('Booking...');

        // Simulate API call to backend
        const dateTime = new Date(date);
        const [hours, minutes] = time.split(':');
        dateTime.setHours(parseInt(hours), parseInt(minutes));

        try {
            const res = await fetch('http://localhost:8000/schedule/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    faculty_id: facultyId,
                    student_id: "current_student", // Replace with actual context
                    date_time: dateTime.toISOString()
                })
            });

            if (res.ok) {
                setStatus('Success! Meeting booked.');
                setTimeout(() => {
                    setStatus('');
                    onClose();
                }, 1500);
            } else {
                const err = await res.json();
                setStatus('Error: ' + (err.detail || 'Failed to book'));
            }
        } catch (e) {
            setStatus('Error: Network failed');
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <h3>Schedule with {facultyName}</h3>
                <div style={{ margin: '1rem 0' }}>
                    <Calendar onChange={setDate} value={date} />
                </div>

                <div style={{ margin: '1rem 0' }}>
                    <label>Select Time: </label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
                    />
                </div>

                {status && <p style={{ color: status.includes('Error') ? 'red' : 'green' }}>{status}</p>}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '4px' }}>Cancel</button>
                    <button onClick={handleBook} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px' }}>Book Meeting</button>
                </div>
            </div>
        </div>
    );
}
