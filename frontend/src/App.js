import React, { useState, useRef } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';
import Footer from './Footer';
import About from './About';
import Contact from './Contact';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 根据分数决定颜色和状态
const getScoreAttributes = (score) => {
  if (score >= 90) {
    return { color: '#48BB78', label: 'Excellent' }; // 绿色
  } else if (score >= 70) {
    return { color: '#F6AD55', label: 'Average' }; // 橙色
  } else {
    return { color: '#E53E3E', label: 'Needs Improvement' }; // 红色
  }
};

const AIScoreCard = ({ name, score, history }) => {
  // 根据当前分数获取颜色和状态标签
  const { color: scoreColor, label } = getScoreAttributes(score);

  return (
    <div className="w-full bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-700 p-4">
        {/* 使用动态计算的颜色设置分数颜色 */}
        <h2 className="text-center text-4xl font-bold" style={{ color: scoreColor }}>{score}</h2>
        <p className="text-center text-lg font-semibold" style={{ color: scoreColor }}>{label}</p>
      </div>
      <div className="p-4">
        <div className="text-center font-bold text-2xl mb-4 text-gray-300">{name}</div>
        <div className="h-[100px] w-full">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={history}>
              {/* 使用动态颜色为历史分数线条着色 */}
              <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2} dot={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(26, 32, 44, 0.8)', border: '1px solid #4a5568', color: '#e2e8f0' }}
                labelStyle={{ color: '#a0aec0' }}
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
  const [selectedDate, setSelectedDate] = useState(new Date()); // 默认显示当前日期
  const datePickerRef = useRef(null); 

   // 打开日期选择器
   const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const aiData = [
    {
      name: 'chatGPT',
      score: 95,
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
            {/* 动态日期选择，带有日历图标 */}
            <div className="text-center mb-8 text-gray-400 text-2xl font-semibold flex justify-center items-center">
              <FontAwesomeIcon 
                icon={faCalendarAlt} 
                className="text-blue-300 cursor-pointer" 
                onClick={handleIconClick} // 点击图标打开日期选择器
              />
              <DatePicker 
                selected={selectedDate} 
                onChange={(date) => setSelectedDate(date)} 
                dateFormat="yyyy-MM-dd"
                className="bg-transparent text-center"
                ref={datePickerRef} // 使用 ref 以便通过图标点击控制其打开状态
              />
            </div>
            <div className="flex justify-center items-stretch space-x-6">
              {aiData.map((ai) => (
                <div key={ai.name} className="w-1/3">
                  <AIScoreCard name={ai.name} score={ai.score} history={ai.history} color={ai.color} />
                </div>
              ))}
            </div>
            <br />
            <p className="text-center mb-8 text-gray-400">
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