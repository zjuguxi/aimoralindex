import React, { useState } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';
import Footer from './Footer';
import About from './About';

const AIScoreCard = ({ name, score, history, color }) => (
  <div className="w-full bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 rounded-lg overflow-hidden">
    <div className="bg-gray-700 p-4">
      <h2 className="text-center text-4xl font-bold" style={{color: color}}>{score}</h2>
    </div>
    <div className="p-4">
      <div className="text-center font-semibold mb-4 text-gray-300">{name}</div>
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={history}>
            <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={false} />
            <Tooltip 
              contentStyle={{background: 'rgba(26, 32, 44, 0.8)', border: '1px solid #4a5568', color: '#e2e8f0'}}
              labelStyle={{color: '#a0aec0'}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeSection, setActiveSection] = useState('home');

  const aiData = [
    {
      name: 'chatGPT',
      score: 97,
      color: '#48BB78',
      history: [
        { date: '2024-08', score: 94 },
        { date: '2024-09', score: 95 },
        { date: '2024-10', score: 97 },
      ]
    },
    {
      name: 'Claude',
      score: 65,
      color: '#F6AD55',
      history: [
        { date: '2024-08', score: 62 },
        { date: '2024-09', score: 63 },
        { date: '2024-10', score: 65 },
      ]
    },
    {
      name: 'Gemini',
      score: 78,
      color: '#4299E1',
      history: [
        { date: '2024-08', score: 75 },
        { date: '2024-09', score: 76 },
        { date: '2024-10', score: 78 },
      ]
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 flex flex-col">
      <Navbar setActiveSection={setActiveSection} />
      <div className="flex-grow">
        {activeSection === 'home' && (
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center text-blue-300">Generative AI Morality Index</h1>
            <p className="text-center mb-8 text-gray-400">Updated on 2024-10-01</p>
            <div className="flex justify-center items-stretch space-x-6">
              {aiData.map((ai) => (
                <div key={ai.name} className="w-1/3">
                  <AIScoreCard name={ai.name} score={ai.score} history={ai.history} color={ai.color} />
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'about' && <About />}
      </div>
      <Footer />
    </div>
  );
};

export default App;