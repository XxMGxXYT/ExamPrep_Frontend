import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const AnalyticsChart = () => {
    const { teachersDashBoard } = useAuth()

    const data = [
        { name: 'students', count: teachersDashBoard.studentsCount },
        { name: 'exams', count: teachersDashBoard.examsCount },
    ];

    return (
        <div style={{ width: '100%', height: 300, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333' }}>Exams analytics</h3>

            {/* ResponsiveContainer يضمن أن المخطط يتجاوب مع أحجام الشاشات المختلفة */}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    {/* خلفية شبكية للمخطط */}
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* المحاور */}
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />

                    {/* التلميحات التي تظهر عند تمرير الفأرة */}
                    <Tooltip />

                    {/* دليل الألوان أسفل المخطط */}
                    <Legend />

                    {/* الأعمدة: يمكنك تغيير اللون (fill) حسب هوية موقعك */}
                    <Bar dataKey="count" name="Full data" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;