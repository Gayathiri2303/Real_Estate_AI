import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Compare() {
  const [allProperties, setAllProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/properties`);
      let propertyData = response.data.properties || response.data || [];
      setAllProperties(propertyData);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = (id) => {
    if (selectedProperties.length >= 4) {
      alert('You can compare up to 4 properties');
      return;
    }
    const property = allProperties.find(p => p.id === id);
    if (property && !selectedProperties.find(p => p.id === id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const removeProperty = (id) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📊 Compare Properties</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>Add Properties to Compare</h3>
        <select
          onChange={(e) => addProperty(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        >
          <option value="">Select a property...</option>
          {allProperties
            .filter(p => !selectedProperties.find(sp => sp.id === p.id))
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.address}, {p.city} - ${p.price?.toLocaleString()}
              </option>
            ))
          }
        </select>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
          Selected: {selectedProperties.length}/4 properties
        </p>
      </div>

      {selectedProperties.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px'
        }}>
          <h2>No properties selected</h2>
          <p>Select properties from the dropdown above to compare</p>
        </div>
      ) : (
        <div style={{
          overflowX: 'auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Feature</th>
                {selectedProperties.map((prop) => (
                  <th key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                    <div>
                      <button
                        onClick={() => removeProperty(prop.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f44336',
                          fontSize: '18px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>{prop.address}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{prop.city}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Price</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0', color: '#1976d2', fontWeight: 'bold' }}>
                    ${prop.price?.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Bedrooms</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    {prop.bedrooms}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Bathrooms</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    {prop.bathrooms}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Square Feet</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    {prop.sqft}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Year Built</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    {prop.year_built}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Condition</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    {prop.condition}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>Price/Sqft</td>
                {selectedProperties.map((prop) => (
                  <td key={prop.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    ${(prop.price / prop.sqft).toFixed(0)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Compare;