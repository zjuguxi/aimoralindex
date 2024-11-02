import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-gray-100 text-gray-800 p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-4 text-center text-blue-600">AI Morality Index</h2>
      <p className="text-lg mb-4">
        The <strong>AI Morality Index</strong> is a project designed to compare the ethical and legal awareness of three popular AI models: ChatGPT, Claude, and Gemini. By automating the process of posing ethical and legal questions to these AIs and scoring their responses based on predefined criteria, the project offers a clear comparison of their performance.
      </p>
      <p className="text-lg mb-4">
        This system includes a backend that manages the querying and scoring of AI responses, as well as a frontend that presents the results in an interactive and visually engaging way. The goal of the project is to assess how well each AI model aligns with established moral and legal standards, providing insights into their strengths and weaknesses in these critical areas.
      </p>
      <p className="text-lg">
        The daily scores are updated automatically, enabling ongoing comparison and trend analysis. By evaluating these AI models, the AI Morality Index helps to shed light on the moral and legal decision-making capabilities of modern artificial intelligence.
      </p>
    </section>
  );
};

export default About;
