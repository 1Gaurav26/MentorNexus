
import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../api/api';

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalytics()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-center">Loading Analytics...</div>;
    if (!data) return <div className="p-4 text-center text-red-500">Failed to load analytics.</div>;

    return (
        <div className="page-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Faculty Analytics Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Demand vs Supply */}
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                    <h3>Demand vs Supply</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{data.demand_supply.students}</div>
                            <div style={{ color: '#666' }}>Students Interested</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{data.demand_supply.capacity}</div>
                            <div style={{ color: '#666' }}>Total Project Seats</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min(100, (data.demand_supply.students / (data.demand_supply.capacity || 1)) * 100)}%`,
                            height: '100%',
                            background: 'var(--primary)'
                        }}></div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '0.5rem', color: '#888' }}>Utilization Rate</p>
                </div>

                {/* Top Interests */}
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                    <h3>Top Research Interests</h3>
                    <ul style={{ marginTop: '1rem' }}>
                        {data.top_interests.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <span>{item.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '100px', height: '6px', background: '#eee', borderRadius: '3px' }}>
                                        <div style={{ width: `${Math.min(100, item.count * 10)}%`, height: '100%', background: '#8b5cf6', borderRadius: '3px' }}></div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Top Skills */}
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                    <h3>Top Student Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {data.top_skills.map((item, idx) => (
                            <span key={idx} style={{
                                padding: '0.5rem 1rem',
                                background: '#f3f4f6',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                border: '1px solid #e5e7eb'
                            }}>
                                {item.name} <strong style={{ color: 'var(--primary)' }}>{item.count}</strong>
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
