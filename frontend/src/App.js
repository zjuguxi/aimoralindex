import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AIScoreCard from './AIScoreCard';
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

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [aiData, setAiData] = useState([]);

  useEffect(() => {
    // 使用 REACT_APP_API_URL
    axios.get(process.env.REACT_APP_API_URL)
      .then(response => {
        const formattedData = response.data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          chatGPT: item.chatgpt,
          claude: item.claude,
          gemini: item.gemini,
        }));

        // 按日期排序
        formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setAiData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <AIScoreCard 
                name="ChatGPT" 
                score={aiData[aiData.length - 1]?.chatGPT || 0} // 提取最新的 ChatGPT 分数或设置默认值 0
                data={aiData.map(d => ({ date: d.date, score: d.chatGPT }))}
              />
              <AIScoreCard 
                name="Claude" 
                score={aiData[aiData.length - 1]?.claude || 0} // 提取最新的 Claude 分数或设置默认值 0
                data={aiData.map(d => ({ date: d.date, score: d.claude }))}
              />
              <AIScoreCard 
                name="Gemini" 
                score={aiData[aiData.length - 1]?.gemini || 0} // 提取最新的 Gemini 分数或设置默认值 0
                data={aiData.map(d => ({ date: d.date, score: d.gemini }))}
              />
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