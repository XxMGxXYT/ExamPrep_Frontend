import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const AnalyticsComposedChart = () => {
    // 1. Raw data object
    const { teachersDashBoard } = useAuth()

    // 2. Formatting the structure for a unified baseline
    const data = [
        { name: 'Students', count: teachersDashBoard.studentsCount },
        { name: 'Exams', count: teachersDashBoard.examsCount },
    ];

    return (
        <div style={{
            width: '100%',
            height: 350,
            backgroundColor: '#0f172a', // Modern dark mode background (Slate 900)
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '18px', fontWeight: 600 }}>
                    System Overview
                </h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                    Real-time database metrics allocation
                </p>
            </div>

            <ResponsiveContainer width="100%" height="75%">
                <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    {/* Subtle dark-mode grid lines */}
                    <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} />

                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* Elegant Dark Mode Tooltip */}
                    <Tooltip
                        cursor={{ fill: '#1e293b', opacity: 0.4 }}
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#f8fafc'
                        }}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
                    />

                    {/* Primary Data Metric (Bar) */}
                    <Bar
                        dataKey="count"
                        name="Total Records"
                        fill="#6366f1" // Vibrant Indigo
                        barSize={45}
                        radius={[6, 6, 0, 0]}
                    />

                    {/* Secondary Visual Accent (Line connects the two data points) */}
                    <Line
                        type="monotone"
                        dataKey="count"
                        name="Distribution Trend"
                        stroke="#f43f5e" // Rose pink line accent
                        strokeWidth={3}
                        dot={{ fill: '#f43f5e', r: 5, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsComposedChart;