import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Loader2, X, Globe } from 'lucide-react';
import { apiService } from '../services/api';

export const DynamicLocationBar = ({ onSelectLocation, activeLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced autocomplete search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await apiService.searchLocations(query.trim());
        setSuggestions(results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // GPS Auto-detect handler
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          // Reverse geocode locality name
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const address = data.address || {};
          const locality = address.suburb || address.neighbourhood || address.city || address.town || address.village || 'Current Location';
          const state = address.state ? `, ${address.state}` : '';
          onSelectLocation({
            name: `${locality}${state}`,
            lat: lat,
            lng: lng,
            isDynamic: true
          });
        } catch {
          onSelectLocation({
            name: `My GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            lat: lat,
            lng: lng,
            isDynamic: true
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert(`Location detection failed: ${error.message}. Please search your city or allow location access.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '440px' }} ref={dropdownRef}>
      {/* GPS Button */}
      <button
        onClick={handleDetectGPS}
        disabled={isLocating}
        type="button"
        title="Detect My Current GPS Location"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: isLocating ? '#0284c7' : '#f0f9ff',
          color: isLocating ? '#ffffff' : '#0284c7',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '7px 11px',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: isLocating ? 'wait' : 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}
      >
        {isLocating ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={14} color="#0284c7" />}
        <span>{isLocating ? 'Locating...' : 'GPS'}</span>
      </button>

      {/* Global Locality Search Bar */}
      <div style={{ position: 'relative', flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '6px 10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          {isSearching ? <Loader2 size={15} color="#0284c7" style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} color="#64748b" />}
          <input
            type="text"
            placeholder="Search any locality, city, district..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.82rem',
              color: '#0f172a',
              background: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setSuggestions([]); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {showDropdown && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
            zIndex: 999,
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '6px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              Matching Locations (Global Live Weather)
            </div>
            {suggestions.map((item) => (
              <div
                key={item.id || `${item.latitude}-${item.longitude}`}
                onClick={() => {
                  onSelectLocation({
                    name: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}`,
                    lat: item.latitude,
                    lng: item.longitude,
                    isDynamic: true
                  });
                  setQuery('');
                  setShowDropdown(false);
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#1e293b',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="#0284c7" />
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: '#64748b', marginLeft: '5px', fontSize: '0.76rem' }}>
                      ({item.admin1 ? `${item.admin1}, ` : ''}{item.country})
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
