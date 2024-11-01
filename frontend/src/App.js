import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import About from './About';
import Contact from './Contact';
import AIScoreCard from './AIScoreCard';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            {/* 调整标题大小 */}
            <h1 className="text-3xl font-bold mb-2 text-center text-gray-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Generative AI Morality Index
            </h1>

            {/* 显示当前日期 */}
            <div className="text-center mb-8 text-gray-700 text-2xl font-semibold flex justify-center items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-2" />
              <span className="ml-2">{getCurrentDate()}</span>
            </div>
            
            {/* 使用响应式的 grid 布局实现不同屏幕宽度下的列数调整 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiData.map((ai) => (
                <AIScoreCard key={ai.name} name={ai.name} score={ai.score} history={ai.history} />
              ))}
            </div>

            <br />
            <p className="text-center mb-8 text-gray-600">
              *&nbsp;This index measures the moral performance of AI models based on multiple criteria, including their handling of ethical issues and bias. The scores are calculated daily, using various data sources to ensure a comprehensive assessment.
            </p>
          </div>
        )}
        {activeSection === 'about' && <About />}
        {activeSection === 'contact' && <Contact />}
      </div>
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
};

export default App;
