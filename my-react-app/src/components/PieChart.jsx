import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const AnalyticsPieChart = () => {

    const { teachersDashBoard } = useAuth()

    // 2. Transforming the object into a Recharts-friendly array structure
    const data = [
        { name: 'Students', value: teachersDashBoard.studentsCount },
        { name: 'Exams', value: teachersDashBoard.examsCount },
    ];

    // 3. Defining modern, clean colors for each segment
    const COLORS = ['#4f46e5', '#10b981']; // Indigo for Students, Emerald for Exams

    return (
        <div style={{
            width: '100%',
            height: 350,
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '18px', fontWeight: 600 }}>
                Dashboard Summary
            </h3>

            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}  // This creates the "donut" hole in the middle
                        outerRadius={90}
                        paddingAngle={5}  // Adds a sleek gap between the slices
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    {/* Interactive hover tooltips */}
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />

                    {/* Clean, descriptive bottom legend */}
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span style={{ color: '#4b5563', fontWeight: 500 }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsPieChart;