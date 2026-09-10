# Hydrological Modeling Methodology & Scale Limitations

*Urban Flood Nowcasting System — Smart India Hackathon (SIH) Technical Documentation*

---

## 1. Overview of the Hydrological Pipeline

The Urban Flood Nowcasting System uses a hybrid modeling architecture that fuses **empirical hydraulic physics** with **supervised machine learning ensemble inference**.

```
[ Atmospheric Rainfall (mm/hr) ]
              │
              ▼
   [ Impervious Cover C % ] ──► [ Rational Method Peak Runoff: Q = C · I · A ]
              │                                      │
              ▼                                      ▼
[ Surcharged Culvert Capacity ] ◄─── [ Drainage Headroom & Blockage % ]
              │
              ▼
[ Random Forest (120 Estimators) ] ──► [ Flood Probability % (0–100) ± Uncertainty ]
              │
              ▼
[ Nowcasting Windows: 0–15m, 15–30m, 30–60m, 1–2h, 2–3h ]
```

---

## 2. Rational Method Formulation

For localized urban catchments, peak surface water discharge is estimated using the standard civil engineering **Rational Method**:

$$Q = C \cdot I \cdot A$$

Where:
- **$Q$** = Peak stormwater discharge rate ($m^3/s$ or equivalent $mm/hr$ depth).
- **$C$** = Dimensionless runoff coefficient determined by urban land use. In dense concrete and asphalt commercial districts (such as Begumpet and Kukatpally), $C \approx 0.75 - 0.90$. In vegetated or permeable zones, $C \approx 0.25 - 0.40$.
- **$I$** = Rainfall intensity ($mm/hr$) monitored across AWS rain gauges or live Doppler radar.
- **$A$** = Contributing sub-catchment basin area.

### Drainage Surcharge Ratio
When stormwater inflow $Q$ exceeds the effective hydraulic capacity of the storm sewer network:

$$\text{Effective Capacity} = \text{Design Capacity} \times \left(1 - \frac{\text{Blockage } \%}{100}\right)$$

$$\text{Surcharge Ratio} = \frac{Q}{\text{Effective Capacity}}$$

A surcharge ratio $> 1.0$ indicates that the subterranean storm conduit has converted from gravity open-channel flow to pressurized pipe surcharge, triggering surface ponding at street manholes and inlet grates within 15–30 minutes.

---

## 3. Machine Learning Ensemble: Random Forest

### Model Architecture
- **Algorithm**: `RandomForestClassifier` (scikit-learn)
- **Estimator Count**: 120 decision trees
- **Splitting Criterion**: Gini impurity
- **Max Depth**: None (expanded until all leaves contain $< 2$ samples)
- **Features (11 Dimensions)**:
  1. `rainfall_intensity` (mm/hr) — Primary hydraulic driving force
  2. `forecast_rainfall` (mm/hr) — Short-term progression vector
  3. `cumulative_rainfall` (mm) — Soil antecedent moisture saturation
  4. `drainage_capacity` (mm/hr) — Subsurface conduit conveyance limit
  5. `drainage_utilization` (%) — Instantaneous hydraulic load
  6. `drainage_blockage` (%) — Solid waste / silt obstruction factor
  7. `elevation` (m MSL) — Digital Elevation Model baseline
  8. `slope` (%) — Topographic hydraulic gradient
  9. `impervious_surface` (%) — Concretization coefficient
  10. `historical_flood_frequency` (1–10) — Monsoonal empirical susceptibility
  11. `water_accumulation` — Surface depression ponding level

### Uncertainty Quantification
Rather than outputting an overconfident scalar probability, the system evaluates the distribution of predictions across all 120 individual decision trees:

$$\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^N (p_i - \bar{p})^2}$$

The confidence band is exposed to operators as:

$$\bar{p} \pm \Delta p \quad (\text{e.g., } 82\% \pm 6\%)$$

---

## 4. Known Limitations at Municipal Scale

While effective for real-time nowcasting, operational users must recognize key simplifications:

1. **Lumped Catchment vs. 2D Hydrodynamics**:
   - The system utilizes lumped hydrological routing rather than full 2D Saint-Venant shallow water differential equations (e.g., SWMM, HEC-RAS, or TUFLOW). Micro-topographical backwater effects and curb-level hydraulic jumps are simplified into localized water accumulation indices.

2. **Sub-Grid Micro-Obstructions**:
   - Culvert trash accumulation fluctuates dynamically during storm peaks. Blockage percentages rely on field officer IoT telemetry or inspections, and sudden debris jams may cause localized backflooding faster than radar time steps.

3. **Infiltration Saturation Thresholds**:
   - High-intensity cloudbursts ($> 80\text{ mm/hr}$) quickly exceed the infiltration capacity of even permeable soils, causing urban green spaces to behave as quasi-impervious surfaces.

4. **Tidal & Estuarine Outfall Boundary Conditions**:
   - In coastal cities (such as Mumbai and Chennai), high-tide spring cycles can lock flap gates and prevent gravity outfall discharge regardless of sewer capacity.
