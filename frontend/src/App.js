import React, { useState } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';
import Footer from './Footer';
import About from './About';
import Contact from './Contact';
import DataSources from './DataSources';
import HowItsCalculated from './HowItsCalculated';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getScoreAttributes = (score) => {
  if (score >= 90) {
    return { color: '#6FCF97', label: 'Excellent' };
  } else if (score >= 70) {
    return { color: '#F7C77F', label: 'Average' };
  } else {
    return { color: '#EB6A6A', label: 'Needs Improvement' };
  }
};

const AIScoreCard = ({ name, score, history }) => {
  const { color: scoreColor, label } = getScoreAttributes(score);

  return (
    <div className="w-full bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-300 rounded-lg overflow-hidden">
      <div className="py-6 rounded-t-lg" style={{ backgroundColor: scoreColor }}>
        <h2 className="text-center text-4xl font-bold text-white">{score}</h2>
        <p className="text-center text-lg font-semibold text-white">{label}</p>
      </div>
      <div className="p-6">
        <div className="text-center font-bold text-2xl mb-4 text-gray-800">{name}</div>
        <div className="h-[100px] w-full">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={history}>
              <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2} dot={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(51, 51, 51, 0.8)', border: '1px solid #e0e0e0', color: '#f5f5f5' }}
                labelStyle={{ color: '#888888' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const aiData = [
    {
      name: 'chatGPT',
      score: 95,
      history: [
        { date: '2024-08', score: 94 },
        { date: '2024-09', score: 95 },
        { date: '2024-10', score: 97 },
      ]
    },
    {
      name: 'Claude',
      score: 65,
      history: [
        { date: '2024-08', score: 62 },
        { date: '2024-09', score: 63 },
        { date: '2024-10', score: 65 },
      ]
    },
    {
      name: 'Gemini',
      score: 78,
      history: [
        { date: '2024-08', score: 75 },
        { date: '2024-09', score: 76 },
        { date: '2024-10', score: 78 },
      ]
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 flex flex-col">
      <Navbar setActiveSection={setActiveSection} />
      <div className="flex-grow">
        {activeSection === 'home' && (
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800">Generative AI Morality Index</h1>
            
            {/* 增加标题和日期的间距 */}
            <div className="text-center mt-4 mb-8 text-gray-700 text-2xl font-semibold flex justify-center items-center">
              <span className="bg-gray-200 rounded-full p-2 mr-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
              </span>
              <span className="ml-2">{getCurrentDate()}</span>
            </div>
            
            {/* 卡片布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiData.map((ai) => (
                <AIScoreCard key={ai.name} name={ai.name} score={ai.score} history={ai.history} />
              ))}
            </div>
            
            {/* 调整卡片下方说明文字的样式 */}
            <p className="text-center mt-8 text-gray-500 font-semibold">
              *&nbsp;This index measures the moral performance of AI models based on multiple criteria, including their handling of ethical issues and bias. The scores are calculated daily, using various data sources to ensure a comprehensive assessment.
            </p>
          </div>
        )}
        {activeSection === 'about' && <About />}
        {activeSection === 'contact' && <Contact />}
        {activeSection === 'data-sources' && <DataSources />}
        {activeSection === 'calculation' && <HowItsCalculated />}
        {activeSection === 'privacy-policy' && <PrivacyPolicy />}
        {activeSection === 'terms-of-use' && <TermsOfUse />}
      </div>
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
};

export default App;
