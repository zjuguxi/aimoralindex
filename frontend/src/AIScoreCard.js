import React from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

const getScoreAttributes = (score) => {
  if (score >= 90) {
    return { color: '#6FCF97', label: 'Excellent' };
  } else if (score >= 70) {
    return { color: '#F7C77F', label: 'Average' };
  } else {
    return { color: '#EB6A6A', label: 'Needs Improvement' };
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded">
        <p>{`Date: ${label}`}</p>
        <p>{`Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AIScoreCard = ({ name, score, data }) => {
  const { color: scoreColor, label } = getScoreAttributes(score);

  return (
    <div className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300 rounded-lg overflow-hidden">
      <div className="py-6 rounded-t-lg" style={{ backgroundColor: scoreColor }}>
        <h2 className="text-center text-4xl font-bold text-white">{score}</h2>
        <p className="text-center text-lg font-semibold text-white">{label}</p>
      </div>
      <div className="p-6">
        <div className="text-center font-bold text-2xl mb-4 text-gray-800">{name}</div>
        <div className="h-[100px] w-full">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2} dot={false} />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AIScoreCard;
