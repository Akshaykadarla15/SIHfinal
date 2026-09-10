import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Demo fallback data if backend is unreachable
const FALLBACK_HYDERABAD_ZONES = [
  {
    location_id: 1,
    name: "Kukatpally",
    city: "Hyderabad",
    latitude: 17.4933,
    longitude: 78.3914,
    elevation: 8.2,
    slope: 1.4,
    rainfall_rate: 52.0,
    forecast_rainfall: 68.0,
    drainage_capacity: 80.0,
    drainage_load: 64.0,
    drainage_utilization: 80.0,
    drainage_blockage: 25.0,
    drain_id: "DR-HYD-102",
    water_accumulation: "High",
    flood_probability: 82.4,
    risk_level: "Critical",
    predicted_time: "15 to 30 minutes",
    recommended_action: "Deploy emergency field personnel, clear blockage at Kukatpally main culvert.",
    xai_factors: {
      heavy_rainfall: 85.0,
      drainage_overload: 78.0,
      low_elevation: 84.0,
      historical_risk: 90.0,
      impervious_surface: 82.0
    },
    nowcast_timeline: [
      { window: "0-15 min", probability: 76.0, risk_level: "Critical" },
      { window: "15-30 min", probability: 82.4, risk_level: "Critical" },
      { window: "30-60 min", probability: 88.0, risk_level: "Critical" },
      { window: "1-2 hours", probability: 91.5, risk_level: "Critical" },
      { window: "2-3 hours", probability: 87.0, risk_level: "Critical" }
    ]
  },
  {
    location_id: 4,
    name: "Begumpet",
    city: "Hyderabad",
    latitude: 17.4447,
    longitude: 78.4664,
    elevation: 7.5,
    slope: 1.1,
    rainfall_rate: 58.0,
    forecast_rainfall: 74.0,
    drainage_capacity: 65.0,
    drainage_load: 58.0,
    drainage_utilization: 89.2,
    drainage_blockage: 20.0,
    drain_id: "DR-HYD-112",
    water_accumulation: "Severe",
    flood_probability: 89.0,
    risk_level: "Critical",
    predicted_time: "15 to 30 minutes",
    recommended_action: "Barricade Rasoolpura and Prakash Nagar underpasses immediately.",
    xai_factors: {
      heavy_rainfall: 92.0,
      drainage_overload: 89.0,
      low_elevation: 94.0,
      historical_risk: 95.0,
      impervious_surface: 88.0
    },
    nowcast_timeline: [
      { window: "0-15 min", probability: 82.0, risk_level: "Critical" },
      { window: "15-30 min", probability: 89.0, risk_level: "Critical" },
      { window: "30-60 min", probability: 94.0, risk_level: "Critical" },
      { window: "1-2 hours", probability: 96.0, risk_level: "Critical" },
      { window: "2-3 hours", probability: 90.0, risk_level: "Critical" }
    ]
  },
  {
    location_id: 2,
    name: "Madhapur",
    city: "Hyderabad",
    latitude: 17.4483,
    longitude: 78.3915,
    elevation: 18.5,
    slope: 3.2,
    rainfall_rate: 34.0,
    forecast_rainfall: 42.0,
    drainage_capacity: 75.0,
    drainage_load: 38.0,
    drainage_utilization: 50.6,
    drainage_blockage: 5.0,
    drain_id: "DR-HYD-105",
    water_accumulation: "Moderate",
    flood_probability: 34.0,
    risk_level: "Moderate",
    predicted_time: "1 to 2 hours",
    recommended_action: "Monitor drainage conditions along Cyber Towers junction.",
    xai_factors: {
      heavy_rainfall: 42.0,
      drainage_overload: 38.0,
      low_elevation: 32.0,
      historical_risk: 45.0,
      impervious_surface: 72.0
    },
    nowcast_timeline: [
      { window: "0-15 min", probability: 31.0, risk_level: "Moderate" },
      { window: "15-30 min", probability: 34.0, risk_level: "Moderate" },
      { window: "30-60 min", probability: 39.0, risk_level: "Moderate" },
      { window: "1-2 hours", probability: 44.0, risk_level: "Moderate" },
      { window: "2-3 hours", probability: 41.0, risk_level: "Moderate" }
    ]
  },
  {
    location_id: 3,
    name: "Gachibowli",
    city: "Hyderabad",
    latitude: 17.4401,
    longitude: 78.3489,
    elevation: 24.0,
    slope: 4.1,
    rainfall_rate: 26.0,
    forecast_rainfall: 32.0,
    drainage_capacity: 90.0,
    drainage_load: 28.0,
    drainage_utilization: 31.1,
    drainage_blockage: 2.0,
    drain_id: "DR-HYD-108",
    water_accumulation: "Low",
    flood_probability: 16.5,
    risk_level: "Safe",
    predicted_time: "No immediate flooding expected",
    recommended_action: "Continue normal monitoring. Infrastructure operating well within capacity.",
    xai_factors: {
      heavy_rainfall: 22.0,
      drainage_overload: 15.0,
      low_elevation: 12.0,
      historical_risk: 18.0,
      impervious_surface: 55.0
    },
    nowcast_timeline: [
      { window: "0-15 min", probability: 14.0, risk_level: "Safe" },
      { window: "15-30 min", probability: 16.5, risk_level: "Safe" },
      { window: "30-60 min", probability: 19.0, risk_level: "Safe" },
      { window: "1-2 hours", probability: 21.0, risk_level: "Safe" },
      { window: "2-3 hours", probability: 19.5, risk_level: "Safe" }
    ]
  }
];

export const apiService = {
  // Dashboard
  getDashboard: async (city = 'Hyderabad') => {
    try {
      const res = await client.get(`/dashboard?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch (e) {
      console.warn('Backend unavailable, using rich client-side demo data fallback', e);
      return {
        city,
        metrics: {
          current_rainfall: "58.0 mm/hr",
          current_rainfall_val: 58.0,
          max_rainfall_forecast: "74.0 mm/hr",
          max_rainfall_forecast_val: 74.0,
          high_risk_zones: "3 Areas",
          high_risk_zones_count: 3,
          critical_zones: "2 Areas",
          critical_zones_count: 2,
          drainage_capacity: "64% Available",
          drainage_available_pct: 64.0,
          overall_city_risk: "CRITICAL"
        },
        rainfall_trend: [
          { time: "11:00", rainfall: 15.0, forecast: 20.0 },
          { time: "11:30", rainfall: 24.0, forecast: 30.0 },
          { time: "12:00", rainfall: 38.0, forecast: 46.0 },
          { time: "12:30", rainfall: 48.0, forecast: 60.0 },
          { time: "13:00 (Now)", rainfall: 58.0, forecast: 74.0 },
          { time: "13:30 (Pred)", rainfall: 68.0, forecast: 82.0 },
          { time: "14:00 (Pred)", rainfall: 75.0, forecast: 90.0 }
        ],
        warning_banner: "Rainfall intensity increasing rapidly. 2 low-lying basins approaching spill threshold.",
        active_alerts: [
          {
            id: 101,
            title: "CRITICAL FLOOD WARNING: Begumpet",
            severity: "Critical",
            location_name: "Begumpet",
            flood_probability: 89.0,
            expected_time: "15 to 30 minutes",
            reason: "Torrential rainfall (58.0 mm/hr) coupled with heavy drainage saturation and low terrain (7.5m).",
            recommended_action: "Deploy emergency field personnel and close vulnerable underpasses.",
            created_at: "13:12"
          },
          {
            id: 102,
            title: "HIGH FLOOD ALERT: Kukatpally",
            severity: "High",
            location_name: "Kukatpally",
            flood_probability: 82.4,
            expected_time: "15 to 30 minutes",
            reason: "Culvert DR-HYD-102 experiencing 80% flow with suspected trash blockage.",
            recommended_action: "Alert zonal storm water management teams and stage mobile pumps.",
            created_at: "13:08"
          }
        ],
        zones: FALLBACK_HYDERABAD_ZONES
      };
    }
  },

  // Risk Zones
  getRiskZones: async (city = 'Hyderabad') => {
    try {
      const res = await client.get(`/risk-zones?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch (e) {
      return { city, count: FALLBACK_HYDERABAD_ZONES.length, zones: FALLBACK_HYDERABAD_ZONES };
    }
  },

  // Rainfall
  getRainfall: async (city = 'Hyderabad') => {
    try {
      const res = await client.get(`/rainfall?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch (e) {
      return {
        city,
        summary: {
          current_rainfall: "58.0 mm/hr",
          max_station: "Begumpet AWS",
          trend_signal: "Rainfall intensity increasing rapidly",
          is_critical: true
        },
        time_chart: [
          { time: "12:00", rainfall: 12.0, status: "Moderate" },
          { time: "12:30", rainfall: 20.0, status: "Moderate" },
          { time: "13:00", rainfall: 35.0, status: "Heavy" },
          { time: "13:30", rainfall: 48.0, status: "Heavy" },
          { time: "14:00 (Live)", rainfall: 58.0, status: "Torrential" },
          { time: "14:30 (Forecast)", rainfall: 72.0, status: "Torrential" }
        ],
        stations: [
          { station_id: "STN-001", location_name: "Kukatpally", current_rainfall: 52.0, rainfall_last_1h: 42.0, rainfall_last_3h: 98.0, forecast_rainfall: 68.0, intensity_status: "Torrential", trend: "Rapidly Increasing" },
          { station_id: "STN-002", location_name: "Begumpet", current_rainfall: 58.0, rainfall_last_1h: 49.0, rainfall_last_3h: 112.0, forecast_rainfall: 74.0, intensity_status: "Torrential", trend: "Rapidly Increasing" },
          { station_id: "STN-003", location_name: "Madhapur", current_rainfall: 34.0, rainfall_last_1h: 28.0, rainfall_last_3h: 62.0, forecast_rainfall: 42.0, intensity_status: "Moderate", trend: "Increasing" },
          { station_id: "STN-004", location_name: "Gachibowli", current_rainfall: 26.0, rainfall_last_1h: 20.0, rainfall_last_3h: 45.0, forecast_rainfall: 32.0, intensity_status: "Moderate", trend: "Stable" }
        ]
      };
    }
  },

  // Drainage
  getDrainage: async (city = 'Hyderabad') => {
    try {
      const res = await client.get(`/drainage?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch (e) {
      return {
        city,
        summary: {
          total_drains: 4,
          critical_drains: 2,
          warning_drains: 1,
          normal_drains: 1,
          average_utilization: 62.7
        },
        drains: [
          { id: 1, drain_id: "DR-HYD-102", location_name: "Kukatpally", max_capacity: 80.0, current_load: 64.0, utilization_percentage: 80.0, blockage_status: "Suspected", blockage_percentage: 25.0, overflow_risk: "High", status: "Warning", last_inspection: "Today, 08:30 AM", reported_by: "Field Team Alpha" },
          { id: 2, drain_id: "DR-HYD-112", location_name: "Begumpet", max_capacity: 65.0, current_load: 58.0, utilization_percentage: 89.2, blockage_status: "Severe", blockage_percentage: 35.0, overflow_risk: "Critical", status: "Critical", last_inspection: "Today, 09:10 AM", reported_by: "Zonal Ward Officer" },
          { id: 3, drain_id: "DR-HYD-105", location_name: "Madhapur", max_capacity: 75.0, current_load: 38.0, utilization_percentage: 50.6, blockage_status: "Minor", blockage_percentage: 5.0, overflow_risk: "Moderate", status: "Normal", last_inspection: "Today, 07:45 AM", reported_by: "Municipal Inspection Unit" },
          { id: 4, drain_id: "DR-HYD-108", location_name: "Gachibowli", max_capacity: 90.0, current_load: 28.0, utilization_percentage: 31.1, blockage_status: "Clear", blockage_percentage: 0.0, overflow_risk: "Low", status: "Normal", last_inspection: "Today, 08:00 AM", reported_by: "Routine Survey" }
        ]
      };
    }
  },

  updateDrainage: async (data) => {
    try {
      const res = await client.post('/drainage/update', data);
      return res.data;
    } catch (e) {
      return { message: "Updated locally in demo mode", updated_zone: data };
    }
  },

  // Predictions
  predict: async (data) => {
    try {
      const res = await client.post('/predictions/predict', data);
      return res.data;
    } catch (e) {
      // Local estimation fallback
      const rain = data.rainfall_intensity || 50;
      const util = data.drainage_utilization || 70;
      const prob = Math.min(98, Math.max(5, Math.round(rain * 0.7 + util * 0.45)));
      const risk = prob >= 75 ? "Critical" : prob >= 50 ? "High" : prob >= 25 ? "Moderate" : "Safe";
      return {
        flood_probability: prob,
        risk_level: risk,
        predicted_time: prob > 70 ? "15 to 30 minutes" : "30 to 60 minutes",
        recommended_action: risk === "Critical" ? "Issue local warning and divert traffic." : "Continue monitoring.",
        confidence_score: 94.6,
        xai_factors: {
          heavy_rainfall: Math.min(98, rain * 1.3),
          drainage_overload: Math.min(98, util * 1.1),
          low_elevation: 75.0,
          historical_risk: 80.0,
          impervious_surface: 72.0
        },
        nowcast_timeline: [
          { window: "0-15 min", probability: Math.round(prob * 0.9), risk_level: risk },
          { window: "15-30 min", probability: prob, risk_level: risk },
          { window: "30-60 min", probability: Math.min(99, Math.round(prob * 1.15)), risk_level: risk },
          { window: "1-2 hours", probability: Math.min(99, Math.round(prob * 1.25)), risk_level: risk },
          { window: "2-3 hours", probability: Math.min(99, Math.round(prob * 1.2)), risk_level: risk }
        ]
      };
    }
  },

  // Simulation
  runSimulation: async (data) => {
    try {
      const res = await client.post('/simulation/run', data);
      return res.data;
    } catch (e) {
      const isExtreme = data.rainfall_intensity >= 80;
      return {
        simulated_rainfall: data.rainfall_intensity,
        simulated_drainage_capacity: data.drainage_capacity,
        simulated_blockage: data.drainage_blockage,
        overall_city_risk: isExtreme ? "CRITICAL" : "HIGH",
        critical_zones_count: isExtreme ? 5 : 2,
        high_risk_zones_count: isExtreme ? 4 : 3,
        moderate_zones_count: 2,
        safe_zones_count: 1,
        affected_zones: FALLBACK_HYDERABAD_ZONES.map(z => ({
          ...z,
          rainfall: data.rainfall_intensity,
          flood_probability: isExtreme ? 92.5 : 68.0,
          risk_level: isExtreme ? "Critical" : "High",
          predicted_time: isExtreme ? "15-30 minutes" : "30-45 minutes"
        })),
        general_recommendation: isExtreme ? "Immediately alert field authorities and restrict traffic in low-lying areas." : "Stage de-watering pumps and monitor rising drains."
      };
    }
  },

  // Alerts
  getAlerts: async (city = 'Hyderabad', status = null) => {
    try {
      const url = `/alerts?city=${encodeURIComponent(city)}${status ? `&status=${status}` : ''}`;
      const res = await client.get(url);
      return res.data;
    } catch (e) {
      return {
        city,
        total_alerts: 2,
        critical_count: 1,
        high_count: 1,
        alerts: [
          {
            id: 101,
            title: "CRITICAL FLOOD WARNING: Begumpet",
            location_name: "Begumpet",
            severity: "Critical",
            flood_probability: 89.0,
            expected_time: "15 to 30 minutes",
            reason: "Torrential rainfall (58.0 mm/hr) coupled with heavy drainage saturation and low terrain (7.5m).",
            recommended_action: "Deploy emergency field personnel and close vulnerable underpasses.",
            status: "active",
            created_at: "Today, 13:12"
          },
          {
            id: 102,
            title: "HIGH FLOOD ALERT: Kukatpally",
            location_name: "Kukatpally",
            severity: "High",
            flood_probability: 82.4,
            expected_time: "15 to 30 minutes",
            reason: "Storm drain DR-HYD-102 approaching overflow capacity.",
            recommended_action: "Stage mobile pumps and direct traffic onto higher ground.",
            status: "active",
            created_at: "Today, 13:08"
          }
        ]
      };
    }
  },

  updateAlertAction: async (alertId, action, officerName = "Officer Rao") => {
    try {
      const res = await client.post(`/alerts/${alertId}/action`, { action, officer_name: officerName });
      return res.data;
    } catch (e) {
      return { message: `Alert updated to ${action}`, alert_id: alertId, new_status: action };
    }
  },

  // Historical Data
  getHistoricalData: async (city = 'Hyderabad', filters = {}) => {
    try {
      const params = new URLSearchParams({ city, ...filters });
      const res = await client.get(`/historical-data?${params.toString()}`);
      return res.data;
    } catch (e) {
      return {
        city,
        total_records: 3,
        chart_data: [
          { event: "Kukatpally (2020-10)", rainfall: 192.5, water_level: 1.85, duration: 14.0 },
          { event: "Begumpet (2022-07)", rainfall: 114.0, water_level: 0.95, duration: 6.5 },
          { event: "Tolichowki (2023-08)", rainfall: 88.0, water_level: 0.55, duration: 3.5 }
        ],
        events: [
          { id: 1, location_name: "Kukatpally", event_date: "2020-10-14", rainfall_mm: 192.5, peak_water_level: 1.85, flood_duration_hours: 14.0, severity: "Severe", drainage_performance: "Surcharged & Backflowing", damage_reported: "Waterlogging in cellars, traffic paralysis for 8 hours" },
          { id: 2, location_name: "Begumpet", event_date: "2022-07-23", rainfall_mm: 114.0, peak_water_level: 0.95, flood_duration_hours: 6.5, severity: "High", drainage_performance: "Overflow at storm culverts", damage_reported: "Inundation of low-lying commercial shops" },
          { id: 3, location_name: "Tolichowki", event_date: "2023-08-19", rainfall_mm: 88.0, peak_water_level: 0.55, flood_duration_hours: 3.5, severity: "Moderate", drainage_performance: "Slow discharge due to trash debris", damage_reported: "Local traffic slow down, cleared within 3 hours" }
        ]
      };
    }
  },

  // Reports
  getReportSummary: async (city = 'Hyderabad') => {
    try {
      const res = await client.get(`/reports/summary?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch (e) {
      return {
        report_title: `MUNICIPAL URBAN FLOOD RISK ASSESSMENT BULLETIN - ${city.toUpperCase()}`,
        generated_at: new Date().toUTCString(),
        city,
        executive_summary: {
          overall_status: "CRITICAL",
          max_rainfall_recorded: "58.0 mm/hr",
          forecast_peak: "74.0 mm/hr",
          drainage_reserve: "36%",
          critical_areas_count: 2,
          high_risk_areas_count: 3,
          safe_areas_count: 7
        },
        high_risk_zones: FALLBACK_HYDERABAD_ZONES.filter(z => z.risk_level === 'Critical' || z.risk_level === 'High'),
        all_zones: FALLBACK_HYDERABAD_ZONES,
        recommendations: [
          "Maintain 24/7 dewatering pump deployment at Begumpet and Kukatpally basins.",
          "Deploy municipal marshals to redirect traffic from submerged underpasses.",
          "Issue public warning bulletins via regional alerts handles.",
          "Inspect DR-HYD-102 and DR-HYD-112 culverts for trash and debris clearance."
        ]
      };
    }
  },

  login: async (email, password) => {
    try {
      const res = await client.post('/auth/login', { email, password });
      return res.data;
    } catch (e) {
      // Local demo fallback if backend offline
      if (email === 'admin@flood.ai') return { id: 1, email, role: 'admin', name: 'Shri R. K. Sharma', badge: 'Municipal Commissioner' };
      if (email === 'officer@flood.ai') return { id: 2, email, role: 'officer', name: 'Insp. Vikram Rao', badge: 'Field Operations Chief' };
      return { id: 3, email, role: 'public', name: 'Ananya Reddy', badge: 'Citizen Public User' };
    }
  }
};
