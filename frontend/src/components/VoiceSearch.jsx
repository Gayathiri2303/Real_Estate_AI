import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function VoiceSearch() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [listening, setListening] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [allStates, setAllStates] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/properties`)
      .then(res => {
        const props = res.data.properties || [];
        const cities = [...new Set(props.map(p => p.city).filter(Boolean))];
        const states = [...new Set(props.map(p => p.state).filter(Boolean))];
        setAllCities(cities);
        setAllStates(states);
      })
      .catch(() => {});
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice search not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setListening(true);
      toast.success('Listening... Speak now');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Voice transcript:', transcript);
      toast.success(`Heard: "${transcript}"`);

      const params = new URLSearchParams();

      // ===== STATE MATCHING =====
      let matchedState = null;
      const stateAliases = {
        'florida': 'FL',
        'california': 'CA',
        'texas': 'TX',
        'new york': 'NY',
        'illinois': 'IL',
        'washington': 'WA',
        'massachusetts': 'MA',
        'colorado': 'CO',
        'arizona': 'AZ',
        'georgia': 'GA',
        'north carolina': 'NC',
        'ohio': 'OH',
        'pennsylvania': 'PA',
        'michigan': 'MI',
        'nevada': 'NV',
        'oregon': 'OR',
        'tennessee': 'TN'
      };

      for (const [key, value] of Object.entries(stateAliases)) {
        if (transcript.includes(key)) {
          matchedState = value;
          break;
        }
      }

      // Also check real state names from data
      if (!matchedState) {
        for (const state of allStates) {
          if (transcript.includes(state.toLowerCase())) {
            matchedState = state;
            break;
          }
        }
      }

      if (matchedState) {
        params.set('state', matchedState);
      }

      // ===== CITY MATCHING =====
      let matchedCity = null;
      for (const city of allCities) {
        const cityLower = city.toLowerCase();
        if (transcript.includes(cityLower)) {
          matchedCity = city;
          break;
        }
      }

      // Common city aliases
      if (!matchedCity) {
        const aliases = {
          'new york': 'New York',
          'nyc': 'New York',
          'la': 'Los Angeles',
          'los angeles': 'Los Angeles',
          'sf': 'San Francisco',
          'san fran': 'San Francisco',
          'dallas': 'Dallas',
          'houston': 'Houston',
          'austin': 'Austin',
          'chicago': 'Chicago',
          'seattle': 'Seattle',
          'boston': 'Boston',
          'miami': 'Miami',
          'denver': 'Denver',
          'atlanta': 'Atlanta',
          'phoenix': 'Phoenix',
          'sacramento': 'Sacramento',
          'portland': 'Portland',
          'nashville': 'Nashville',
          'tampa': 'Tampa',
          'orlando': 'Orlando',
          'las vegas': 'Las Vegas',
          'san diego': 'San Diego'
        };
        for (const [key, value] of Object.entries(aliases)) {
          if (transcript.includes(key)) {
            const found = allCities.find(c => c.toLowerCase() === value.toLowerCase());
            matchedCity = found || value;
            break;
          }
        }
      }

      if (matchedCity) {
        params.set('city', matchedCity);
      }

      // ===== BEDROOMS =====
      const bedMatch = transcript.match(/(\d+)\s*(bed|bedroom|br|beds)/i);
      if (bedMatch) params.set('bedrooms', bedMatch[1]);

      // ===== BATHROOMS =====
      const bathMatch = transcript.match(/(\d+\.?\d*)\s*(bath|bathroom|ba|baths)/i);
      if (bathMatch) params.set('bathrooms', bathMatch[1]);

      // ===== PRICE UNDER =====
      const underMatch = transcript.match(/(?:under|below|less than|max|maximum)\s*\$?\s*([\d,]+)\s*(k|thousand)?/i);
      if (underMatch) {
        let val = parseInt(underMatch[1].replace(/,/g, ''));
        if (underMatch[2] || val < 1000) val = val * 1000;
        params.set('max_price', val);
      }

      // ===== PRICE OVER =====
      const overMatch = transcript.match(/(?:over|above|more than|min|minimum)\s*\$?\s*([\d,]+)\s*(k|thousand)?/i);
      if (overMatch) {
        let val = parseInt(overMatch[1].replace(/,/g, ''));
        if (overMatch[2] || val < 1000) val = val * 1000;
        params.set('min_price', val);
      }

      const query = params.toString();
      console.log('Navigating with filters:', query);
      navigate(`/properties${query ? '?' + query : ''}`);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setListening(false);
      toast.error('Could not understand. Please try again.');
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      style={{
        padding: '9px 16px',
        background: listening ? '#ef4444' : theme.primary,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {listening ? '🔴 Listening...' : '🎤 Voice Search'}
    </button>
  );
}

export default VoiceSearch;