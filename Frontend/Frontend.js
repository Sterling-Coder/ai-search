// AI Search Bar (Enhanced UI)
// A magical, helpful search assistant that can guide you through anything ✨

const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [dotCount, setDotCount] = useState(0);

  // Animation for typing effect
  useEffect(() => {
    if (response && !loading) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= response.length) {
          setTypingText(response.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [response, loading]);

  // Animation for typing dots
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDotCount(prev => (prev + 1) % 4);
      }, 300);
      return () => clearInterval(interval);
    } else {
      setDotCount(0);
    }
  }, [loading]);

  const askAssistant = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setResponse('');
    setTypingText('');
    setError(null);

    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:8000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ question: question })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.answer) {
                responseText += data.answer;
                setResponse(responseText);
                setTypingText(responseText);
                console.log('Received chunk:', data.answer);
              } else if (data.error) {
                console.error('Server error:', data.error);
                setError(data.error);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get response from server. Please try again.');
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0F172A] to-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/40 backdrop-blur-md border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-bold text-xl">AI Search</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-indigo-400 transition-colors">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-indigo-400 transition-colors">Try Demo</a>
              <a href="#pricing" className="text-gray-300 hover:text-indigo-400 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-indigo-400 transition-colors">Contact</a>
              <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-500 hover:to-cyan-500 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-cyan-500/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-extrabold sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 mb-8">
              Transform Your Website<br />With AI Search
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Empower your website with intelligent search capabilities. Our AI-powered solution understands context, learns from interactions, and provides accurate answers to your visitors' questions.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-500 hover:to-cyan-500 transition-all transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all border border-indigo-500/20">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-indigo-500/10 bg-gradient-to-r from-indigo-900/10 to-cyan-900/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">99%</div>
              <div className="mt-2 text-gray-400">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50ms</div>
              <div className="mt-2 text-gray-400">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="mt-2 text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="mt-2 text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-cyan-900/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Powerful Features</h2>
            <p className="mt-4 text-xl text-gray-400">Everything you need to enhance your website's search capabilities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Vector Database Integration",
                description: "Store and search through your content efficiently with our advanced vector database technology.",
                icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              },
              {
                title: "Context-Aware Responses",
                description: "Our AI understands the context of questions and provides relevant, accurate answers.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              {
                title: "Real-time Learning",
                description: "System continuously learns from interactions to improve response accuracy.",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              },
              {
                title: "Easy Integration",
                description: "Simple API and SDK for seamless integration with any website or platform.",
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              },
              {
                title: "Analytics Dashboard",
                description: "Track usage, popular queries, and system performance in real-time.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              },
              {
                title: "Multi-language Support",
                description: "Support for multiple languages to serve global audiences effectively.",
                icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="relative py-24 bg-gradient-to-b from-transparent via-indigo-900/10 to-cyan-900/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Try It Yourself</h2>
            <p className="mt-4 text-xl text-gray-400">Experience the power of our AI search</p>
          </div>

          {/* Search Bar */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-indigo-500/20">
            <div className="relative group">
              <div className="flex gap-2 items-center transform transition-all duration-300 group-hover:scale-[1.02]">
                <input
                  type="text"
                  placeholder="Ask anything about our product..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
                  className="flex-1 p-4 text-lg rounded-xl border border-indigo-500/20 bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-300"
                />
                <button
                  onClick={askAssistant}
                  disabled={loading}
                  className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <span className="typing-dot bg-white"></span>
                      <span className="typing-dot bg-white"></span>
                      <span className="typing-dot bg-white"></span>
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Response Area */}
            {(typingText || loading) && (
              <div className="mt-6 space-y-4">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 animate-fade-in overflow-hidden">
                  <div className="prose max-w-none">
                    <div className="text-white text-lg whitespace-pre-line space-y-4">
                      {typingText.split('---').map((section, index) => {
                        if (index === 0) {
                          if (section.includes("I don't have enough information")) {
                            return (
                              <div key={index} className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-yellow-500 font-medium">Database Response</span>
                                  </div>
                                  <p className="text-gray-300">{section.trim()}</p>
                                </div>
                                {typingText.includes("Direct AI Response:") && (
                                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                      <span className="text-white font-medium">AI Response</span>
                                    </div>
                                    <p className="text-gray-300">{typingText.split('Direct AI Response:')[1].trim()}</p>
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center space-x-2 mb-2">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-white font-medium">Database Response</span>
                                </div>
                                <p className="text-gray-300">{section.trim()}</p>
                              </div>
                            );
                          }
                        }
                        return null;
                      })}
                      {loading && !typingText && (
                        <div className="flex items-center justify-center space-x-2 py-4">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-indigo-900/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Simple Pricing</h2>
            <p className="mt-4 text-xl text-gray-400">Choose the plan that's right for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$5",
                features: [
                  "10,000 searches/month",
                  "Basic vector database",
                  "Standard support",
                  "1 website integration"
                ]
              },
              {
                name: "Professional",
                price: "$9",
                features: [
                  "1,00,000 searches/month",
                  "Advanced vector database",
                  "Priority support",
                  "5 website integrations",
                  "Analytics dashboard"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited searches",
                  "Custom vector database",
                  "24/7 dedicated support",
                  "Unlimited integrations",
                  "Advanced analytics",
                  "Custom features"
                ]
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-black/40 backdrop-blur-md p-8 rounded-xl border ${plan.popular ? 'border-indigo-500/40' : 'border-indigo-500/20'} hover:border-indigo-500/40 transition-all duration-300 relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-6">{plan.price}</div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-medium transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500' : 'bg-white/5 text-white hover:bg-white/10 border border-indigo-500/20'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-24 bg-gradient-to-t from-indigo-900/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Get in Touch</h2>
            <p className="mt-4 text-xl text-gray-400">Have questions? We're here to help</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-4 rounded-xl border border-indigo-500/20 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 rounded-xl border border-indigo-500/20 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full p-4 rounded-xl border border-indigo-500/20 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-cyan-500 transition-all transform hover:scale-105">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-indigo-500/10 text-center text-gray-400">
            © 2024 AI Search. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
