import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const FloodContext = createContext();

export const FloodProvider = ({ children }) => {
  const [city, setCity] = useState('Hyderabad');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulatingRainfall, setIsSimulatingRainfall] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [explainZone, setExplainZone] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  const fetchCityData = useCallback(async (targetCity) => {
    setLoading(true);
    try {
      const data = await apiService.getDashboard(targetCity);
      setDashboardData(data);
      if (data.zones && data.zones.length > 0) {
        setSelectedZone(data.zones[0]);
      }
      setNotificationCount(data.active_alerts ? data.active_alerts.length : 2);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCityData(city);
    setIsSimulatingRainfall(false);
  }, [city, fetchCityData]);

  // Demonstration feature: Instant Heavy Rainfall trigger
  const triggerHeavyRainfall = async () => {
    setIsSimulatingRainfall(true);
    setLoading(true);
    try {
      const simResult = await apiService.runSimulation({
        rainfall_intensity: 105.0,
        forecast_rainfall: 125.0,
        drainage_capacity: 55.0,
        drainage_blockage: 35.0,
        elevation: 8.0,
        historical_flood_risk: "High",
        target_city: city
      });

      // Update dashboard state reflecting massive monsoonal surge
      setDashboardData(prev => {
        if (!prev) return prev;
        const updatedZones = prev.zones.map(z => {
          const isCritical = z.elevation < 14.0 || z.historical_flood_freq > 6.0;
          const prob = isCritical ? Math.min(98.5, 84.0 + Math.random() * 12.0) : Math.min(85.0, 68.0 + Math.random() * 10.0);
          const risk = prob >= 75 ? "Critical" : "High";
          return {
            ...z,
            rainfall_rate: 105.0,
            forecast_rainfall: 125.0,
            drainage_load: roundVal(105.0 * (z.impervious / 100.0)),
            drainage_utilization: roundVal((105.0 / 55.0) * 100.0),
            drainage_blockage: 35.0,
            flood_probability: roundVal(prob),
            risk_level: risk,
            predicted_time: "15 to 30 minutes",
            recommended_action: "CRITICAL: Deploy emergency teams, restrict underpass access, and activate high-capacity mobile pumps.",
            xai_factors: {
              heavy_rainfall: 96.0,
              drainage_overload: 92.0,
              low_elevation: roundVal(Math.min(98.0, (1.0 - z.elevation / 30.0) * 100.0)),
              historical_risk: 88.0,
              impervious_surface: 85.0
            }
          };
        });

        return {
          ...prev,
          metrics: {
            current_rainfall: "105.0 mm/hr",
            current_rainfall_val: 105.0,
            max_rainfall_forecast: "125.0 mm/hr",
            max_rainfall_forecast_val: 125.0,
            high_risk_zones: `${updatedZones.filter(z => z.risk_level === 'High').length} Areas`,
            high_risk_zones_count: updatedZones.filter(z => z.risk_level === 'High').length,
            critical_zones: `${updatedZones.filter(z => z.risk_level === 'Critical').length} Areas`,
            critical_zones_count: updatedZones.filter(z => z.risk_level === 'Critical').length,
            drainage_capacity: "18% Available",
            drainage_available_pct: 18.0,
            overall_city_risk: "CRITICAL"
          },
          warning_banner: "⚠️ SEVERE DELUGE SIMULATION ACTIVE: Rainfall 105 mm/hr exceeds drainage capacity. Multiple zones at critical flash flood risk!",
          active_alerts: [
            {
              id: 991,
              title: "EMERGENCY: Extreme Runoff Overload Across Municipal Basins",
              severity: "Critical",
              location_name: "City-Wide Surge",
              flood_probability: 96.5,
              expected_time: "15 to 30 minutes",
              reason: "Simulated 105 mm/hr cloudburst combined with 35% storm drain blockage.",
              recommended_action: "Activate Emergency Operations Center, sound low-lying sirens, and divert all traffic.",
              status: "active",
              created_at: "Just Now"
            },
            ...(prev.active_alerts || [])
          ],
          zones: updatedZones
        };
      });

      setNotificationCount(prev => prev + 2);
    } catch (e) {
      console.error('Simulation trigger failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setIsSimulatingRainfall(false);
    fetchCityData(city);
  };

  return (
    <FloodContext.Provider value={{
      city,
      setCity,
      dashboardData,
      loading,
      isSimulatingRainfall,
      triggerHeavyRainfall,
      resetSimulation,
      selectedZone,
      setSelectedZone,
      explainZone,
      setExplainZone,
      notificationCount,
      refreshData: () => fetchCityData(city)
    }}>
      {children}
    </FloodContext.Provider>
  );
};

const roundVal = (num) => Math.round(num * 10) / 10;

export const useFlood = () => useContext(FloodContext);
