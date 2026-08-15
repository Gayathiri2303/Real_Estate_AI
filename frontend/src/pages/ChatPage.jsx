import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function ChatPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! 👋 I\'m your Real Estate AI assistant. I can help you with property search, price estimates, mortgages, market trends, and more. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading) return;

    const userMsg = { role: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await axios.post(`${API_URL}/chat`, {
        message,
        history
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: res.data.reply || 'Sorry, I could not generate a response.'
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I am having connection issues. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      toast.success('Listening...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      // Auto send after voice
      setTimeout(() => sendMessage(transcript), 300);
    };

    recognition.onerror = () => {
      setListening(false);
      toast.error('Could not understand');
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div style={{
      background: theme.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        color: 'white',
        padding: '18px 24px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>
          💬 Real Estate AI Assistant
        </h1>
        <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '13px' }}>
          Ask about properties, prices, mortgages & market trends
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        maxWidth: '820px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '14px'
            }}
          >
            <div style={{
              maxWidth: '78%',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user'
                ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                : theme.card,
              color: m.role === 'user' ? 'white' : theme.text,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: m.role === 'assistant' ? `1px solid ${theme.border}` : 'none',
              fontSize: '14.5px',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap'
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '12px' }}>
            AI is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '14px 16px 20px',
        background: theme.card,
        borderTop: `1px solid ${theme.border}`,
        maxWidth: '820px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={startVoice}
            disabled={listening || loading}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              background: listening ? '#ef4444' : theme.background,
              color: listening ? 'white' : theme.text,
              fontSize: '20px',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Voice input"
          >
            {listening ? '🔴' : '🎤'}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about real estate..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '13px 16px',
              borderRadius: '14px',
              border: `1px solid ${theme.border}`,
              background: theme.background,
              color: theme.text,
              fontSize: '15px',
              outline: 'none'
            }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              padding: '13px 22px',
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              flexShrink: 0
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;