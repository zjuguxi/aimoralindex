import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const getScoreAttributes = (score) => {
  if (score >= 90) {
    return { color: '#6FCF97', label: 'Excellent' };
  } else if (score >= 70) {
    return { color: '#F7C77F', label: 'Average' };
  } else {
    return { color: '#EB6A6A', label: 'Needs Improvement' };
  }
};

const AIScoreCard = ({ name, score, data }) => {
  const { color: scoreColor, label } = getScoreAttributes(score || 100); // 添加默认值以防止未定义

  return (
    <div className="w-full bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-300 rounded-lg overflow-hidden">
      <div className="py-6 rounded-t-lg" style={{ backgroundColor: scoreColor }}>
        <h2 className="text-center text-4xl font-bold text-white">{score || 100}</h2> {/* 使用默认值 */}
        <p className="text-center text-lg font-semibold text-white">{label}</p>
      </div>
      <div className="p-6">
        <div className="text-center font-bold text-2xl mb-4 text-gray-800">{name}</div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ background: 'rgba(51, 51, 51, 0.8)', border: '1px solid #e0e0e0', color: '#f5f5f5' }}
                labelStyle={{ color: '#888888' }}
              />
              <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AIScoreCard;
