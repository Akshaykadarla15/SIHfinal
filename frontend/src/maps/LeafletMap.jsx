import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFlood } from '../context/FloodContext';
import { Layers, Eye, Brain, Info } from 'lucide-react';

// Fix Leaflet's default icon paths in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CITY_COORDINATES = {
  Hyderabad: [17.4200, 78.4350],
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.6139, 77.2090],
  Chennai: [13.0200, 80.2000]
};

export const LeafletMap = ({ zones = [], citizenReports = [], height = '550px', showControls = true, onSelectZone }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const drainageLayerRef = useRef(null);

  const { city, activeLocation, selectDynamicLocation, setSelectedZone, setExplainZone } = useFlood();

  const [activeLayer, setActiveLayer] = useState('all'); // 'all', 'risk', 'drainage'
  const [filterRisk, setFilterRisk] = useState('all'); // 'all', 'Critical', 'High', 'Moderate', 'Safe'

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const center = (activeLocation?.lat && activeLocation?.lng) 
        ? [activeLocation.lat, activeLocation.lng] 
        : (CITY_COORDINATES[city] || [17.4200, 78.4350]);

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 12,
        scrollWheelZoom: true,
        zoomControl: false
      });

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Light-themed CartoDB Positron / OpenStreetMap Light tiles for public safety dashboard
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      drainageLayerRef.current = L.layerGroup().addTo(map);

      // Click anywhere to predict flood risk for that exact coordinate
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (selectDynamicLocation) {
          selectDynamicLocation({
            name: `Location (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`,
            lat: lat,
            lng: lng,
            isDynamic: true
          });
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center when City or activeLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (activeLocation?.lat && activeLocation?.lng) {
      mapInstanceRef.current.flyTo([activeLocation.lat, activeLocation.lng], 13, { duration: 1.2 });
    } else if (CITY_COORDINATES[city]) {
      mapInstanceRef.current.flyTo(CITY_COORDINATES[city], 12, { duration: 1.0 });
    }
  }, [city, activeLocation]);

  // Render Overlays & Risk Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();
    drainageLayerRef.current.clearLayers();

    const getRiskColor = (prob) => {
      if (prob >= 75) return { fill: '#ef4444', border: '#b91c1c', badge: 'Critical' };
      if (prob >= 50) return { fill: '#f97316', border: '#c2410c', badge: 'High' };
      if (prob >= 25) return { fill: '#eab308', border: '#a16207', badge: 'Moderate' };
      return { fill: '#10b981', border: '#047857', badge: 'Safe' };
    };

    zones.forEach((z) => {
      if (filterRisk !== 'all' && z.risk_level !== filterRisk) return;

      const risk = getRiskColor(z.flood_probability);
      const isCritical = z.flood_probability >= 75;

      // 1. Risk Zone Circle Overlay (Geospatial Inundation Footprint)
      const circleRadius = isCritical ? 900 : (z.flood_probability >= 50 ? 750 : 550);
      const circle = L.circle([z.latitude, z.longitude], {
        color: risk.border,
        fillColor: risk.fill,
        fillOpacity: isCritical ? 0.35 : 0.22,
        weight: isCritical ? 2.5 : 1.5,
        radius: circleRadius
      });

      // 2. Center Marker with Pin / Pulse
      const markerHtml = `
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${risk.fill};
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          ${isCritical ? 'animation: pulseGlow 1.8s infinite ease-in-out;' : ''}
        ">
          ${Math.round(z.flood_probability)}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-flood-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([z.latitude, z.longitude], { icon: customIcon });

      // Click Event on Marker or Circle
      const handleSelect = () => {
        setSelectedZone(z);
        if (onSelectZone) onSelectZone(z);
      };

      marker.on('click', handleSelect);
      circle.on('click', handleSelect);

      // Detailed Leaflet Popup content
      const popupContent = document.createElement('div');
      popupContent.style.width = '290px';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 1.05rem; color: #0f172a;">${z.name}</strong>
            <span class="badge-${z.risk_level.toLowerCase()}">${z.risk_level === 'Critical' ? '🛑 ' : z.risk_level === 'High' ? '⚠️ ' : z.risk_level === 'Moderate' ? '▲ ' : '✓ '}${z.risk_level}</span>
          </div>
          <div style="font-size: 0.75rem; color: #64748b;">${z.city} • Elev: ${z.elevation}m • Slope: ${z.slope || 1.8}%</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem; margin-bottom: 8px;">
          <div><span style="color:#64748b;">Rainfall:</span> <strong>${z.rainfall_rate} mm/hr</strong></div>
          <div><span style="color:#64748b;">Forecast:</span> <strong>${z.forecast_rainfall} mm/hr</strong></div>
          <div><span style="color:#64748b;">Drain Capacity:</span> <strong>${z.drainage_capacity} mm/hr</strong></div>
          <div><span style="color:#64748b;">Drain Load:</span> <strong>${z.drainage_utilization}%</strong></div>
          <div><span style="color:#64748b;">Water Ponding:</span> <strong>${z.water_accumulation || 'Moderate'}</strong></div>
          <div><span style="color:#64748b;">Expected Time:</span> <strong style="color:#b91c1c;">${z.predicted_time}</strong></div>
        </div>

        <div style="background: #f8fafc; border-radius: 6px; padding: 8px; font-size: 0.75rem; color: #334155; margin-bottom: 10px; border: 1px solid #e2e8f0;">
          <strong style="color: #0284c7;">Action:</strong> ${z.recommended_action}
        </div>

        <div style="display: flex; gap: 6px;">
          <button id="btn-explain-${z.location_id}" style="
            flex: 1;
            background: #0284c7;
            color: #fff;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          ">
            <span>Why at risk? (XAI)</span>
          </button>
        </div>
      `;

      // Attach button listener inside popup
      const explainBtn = popupContent.querySelector(`#btn-explain-${z.location_id}`);
      if (explainBtn) {
        explainBtn.onclick = (e) => {
          e.stopPropagation();
          setExplainZone(z);
        };
      }

      marker.bindPopup(popupContent);
      circle.bindPopup(popupContent);

      layerGroupRef.current.addLayer(circle);
      layerGroupRef.current.addLayer(marker);

      // Drainage Network lines (Simulated trunk outfall channels)
      if (activeLayer === 'all' || activeLayer === 'drainage') {
        const drainOffsetLat = z.latitude - 0.008;
        const drainOffsetLng = z.longitude + 0.009;
        const drainLine = L.polyline([
          [z.latitude, z.longitude],
          [drainOffsetLat, drainOffsetLng]
        ], {
          color: z.drainage_utilization > 80 ? '#ef4444' : '#0284c7',
          weight: 3.5,
          dashArray: '6, 6',
          opacity: 0.8
        });
        drainLine.bindTooltip(`Storm Drain ${z.drain_id || 'DR-101'} (${z.drainage_utilization}% Load)`, { sticky: true });
        drainageLayerRef.current.addLayer(drainLine);
      }
    });

    // Render Citizen Waterlogging Incident Pins
    if (citizenReports && citizenReports.length > 0) {
      citizenReports.forEach((rep) => {
        if (!rep.latitude || !rep.longitude) return;
        const citizenPinHtml = `
          <div style="
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #16a34a;
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 14px;
            cursor: pointer;
          " title="Citizen Waterlogging Report: ${rep.location_name || rep.zone}">
            📸
          </div>
        `;

        const pinIcon = L.divIcon({
          html: citizenPinHtml,
          className: 'citizen-report-pin',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const pinMarker = L.marker([rep.latitude, rep.longitude], { icon: pinIcon });
        pinMarker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; max-width: 220px;">
            <div style="font-size: 0.68rem; color: #16a34a; font-weight: 800; text-transform: uppercase;">Citizen Report</div>
            <strong style="font-size: 0.95rem; color: #0f172a;">${rep.location_name || rep.zone}</strong>
            <div style="font-size: 0.78rem; color: #dc2626; font-weight: 700; margin: 4px 0;">Depth: ${rep.water_depth || rep.depth}</div>
            <div style="font-size: 0.78rem; color: #334155;">${rep.description}</div>
            ${rep.photo_url ? `<img src="${rep.photo_url}" style="width: 100%; border-radius: 4px; margin-top: 6px; max-height: 100px; object-fit: cover;" />` : ''}
            <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 4px;">Reporter: ${rep.reporter_name || 'Resident'}</div>
          </div>
        `);
        layerGroupRef.current.addLayer(pinMarker);
      });
    }

  }, [zones, citizenReports, filterRisk, activeLayer]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden' }}>
      {/* Map Container Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Filter & Layer Overlay Controls */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 400,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Risk Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Filter:</span>
            {['all', 'Critical', 'High', 'Moderate', 'Safe'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                style={{
                  background: filterRisk === lvl ? '#0284c7' : '#f1f5f9',
                  color: filterRisk === lvl ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {lvl === 'all' ? 'All Zones' : lvl}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '18px', background: '#cbd5e1' }} />

          {/* Layer Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#0284c7" />
            <button
              onClick={() => setActiveLayer(activeLayer === 'all' ? 'risk' : 'all')}
              style={{
                background: activeLayer === 'all' ? '#e0f2fe' : '#f8fafc',
                color: activeLayer === 'all' ? '#0369a1' : '#475569',
                border: '1px solid #bae6fd',
                borderRadius: '5px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {activeLayer === 'all' ? 'Drainage Channels: ON' : 'Drainage Channels: OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 400,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(4px)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '8px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.75rem'
      }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Flood Risk Classification</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>✓ Safe (0–25%)</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
            <span>▲ Moderate (25–50%)</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
            <span>⚠️ High (50–75%)</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span>🛑 Critical (75–100%)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
