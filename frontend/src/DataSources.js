import React from 'react';

const DataSources = () => {
  return (
    <section className="bg-gray-100 text-gray-900 p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Data Sources</h2>
      
      <p className="text-lg mb-6 text-gray-700 text-center">
        Below are the categories of questions, the associated risk levels, and the number of questions per level and category.
      </p>
      
      {/* 数据表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 text-gray-700 font-semibold text-center">Question Category</th>
              <th className="py-3 px-6 bg-gray-200 text-gray-700 font-semibold text-center">Risk Levels</th>
              <th className="py-3 px-6 bg-gray-200 text-gray-700 font-semibold text-center">Number of Questions</th>
            </tr>
          </thead>
          <tbody>
            {['Copyright', 'Porn', 'Crime', 'Political Sensitivity', 'Hate Speech'].map((category, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-3 px-6 text-center text-gray-600">{category}</td>
                <td className="py-3 px-6 text-center text-gray-600">High, Medium, Low</td>
                <td className="py-3 px-6 text-center text-gray-600">10 questions per level</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataSources;
