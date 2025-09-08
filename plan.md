# AI-Driven Risk Prediction Engine - Implementation Plan

## 🎯 Project Overview
Build a prototype that predicts chronic care patient deterioration risk within 90 days using AI, with explainable insights for clinicians.

## 📊 From Binary Classification to Rich Dashboard Scores

### The Key Insight: Probability Scores + Feature Analysis = Comprehensive Assessment

**Binary Classification Output**: 0 or 1 (will deteriorate / won't deteriorate)
**But we extract much more:**

1. **Risk Probability Score** (0-100%): The model's confidence in prediction
2. **Individual Risk Factors**: SHAP values for each feature 
3. **Trend Analysis**: Time-series patterns in patient data
4. **Comparative Scores**: How patient compares to similar cohort

### Dashboard Score Derivation Strategy

```
Binary Model → Probability Score → Multiple Assessment Dimensions
```

#### 1. **Overall Risk Score** (0-100)
- Direct from model probability * 100
- Color coding: Green (0-30), Yellow (30-70), Red (70-100)

#### 2. **Vital Signs Score** (0-100)
- Aggregate SHAP values for all vital-related features
- Weight by clinical importance
- Show trend: improving/stable/declining

#### 3. **Medication Adherence Score** (0-100)
- Based on adherence percentage + SHAP contribution
- Account for medication type importance

#### 4. **Lifestyle Score** (0-100)
- Exercise, diet, sleep quality combined
- Weighted by impact on risk prediction

#### 5. **Lab Results Score** (0-100)
- HbA1c, cholesterol, kidney function trends
- Time-since-last-test penalty

#### 6. **Risk Trajectory** (Trend Score)
- Compare last 30 days vs previous 30 days
- Improving/Stable/Declining with rate of change

---

## 🏗️ Complete Implementation Flow

### Phase 1: Data Architecture (2 hours)

#### 1.1 Synthetic Data Generation (45 min)
```python
# Patient data structure
{
  "patient_id": "P001",
  "demographics": {"age": 65, "gender": "M", "bmi": 28.5},
  "time_series": [
    {
      "date": "2024-01-01",
      "vitals": {"bp_sys": 140, "bp_dia": 90, "hr": 75, "glucose": 180},
      "medication_adherence": 0.85,
      "lifestyle": {"exercise_min": 30, "sleep_hours": 7, "diet_score": 6}
    }
  ],
  "labs": [
    {"date": "2024-01-01", "hba1c": 8.2, "cholesterol": 220, "creatinine": 1.1}
  ],
  "outcome": {"deterioration_90d": 1, "deterioration_date": "2024-03-15"}
}
```

#### 1.2 Feature Engineering Pipeline (45 min)
```python
# Feature categories that become dashboard scores
features = {
    "vitals_features": [
        "bp_sys_mean_30d", "bp_sys_trend", "glucose_variability",
        "hr_resting_avg", "vitals_missing_rate"
    ],
    "medication_features": [
        "adherence_30d", "adherence_trend", "critical_med_adherence"
    ],
    "lifestyle_features": [
        "exercise_consistency", "sleep_quality", "diet_trend"
    ],
    "lab_features": [
        "hba1c_latest", "hba1c_trend", "cholesterol_ratio", "kidney_function"
    ],
    "temporal_features": [
        "data_recency", "measurement_frequency", "trend_stability"
    ]
}
```

#### 1.3 Target Variable Strategy (30 min)
- **Primary**: Binary deterioration (0/1)
- **Secondary**: Risk probability (model confidence)
- **Tertiary**: Time to deterioration (for trajectory analysis)

### Phase 2: ML Pipeline (2.5 hours)

#### 2.1 Model Training (60 min)
```python
# Multi-output approach
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
import shap

# Primary model: Binary classification with probability
model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)

# Fit and get probabilities
model.fit(X_train, y_train)
risk_probabilities = model.predict_proba(X_test)[:, 1]  # Risk scores!
```

#### 2.2 Explainability Engine (45 min)
```python
# SHAP for feature importance
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Convert SHAP to dashboard scores
def calculate_dashboard_scores(shap_values, features, base_probability):
    scores = {}
    
    # Vitals score: aggregate vitals-related SHAP values
    vitals_shap = shap_values[:, vitals_feature_indices].sum(axis=1)
    scores['vitals'] = normalize_to_0_100(vitals_shap + base_probability)
    
    # Similar for other categories...
    return scores
```

#### 2.3 Evaluation Metrics (45 min)
- **AUROC**: Model discrimination ability
- **AUPRC**: Precision-recall for imbalanced data
- **Calibration**: How well probabilities match actual risk
- **Feature Importance**: Global explanations

### Phase 3: Backend API (2 hours)

#### 3.1 API Routes Structure (60 min)
```typescript
// pages/api/patients/[id].ts - Individual patient risk
export default async function handler(req, res) {
  const { id } = req.query;
  const patient = getPatientData(id);
  const prediction = await predictRisk(patient);
  
  return res.json({
    patient_id: id,
    overall_risk_score: prediction.probability * 100,
    dashboard_scores: {
      vitals: calculateVitalsScore(prediction.shap_values),
      medication: calculateMedScore(prediction.shap_values),
      lifestyle: calculateLifestyleScore(prediction.shap_values),
      labs: calculateLabScore(prediction.shap_values)
    },
    risk_factors: getTopRiskFactors(prediction.shap_values),
    trend: calculateTrend(patient.time_series),
    recommendations: generateRecommendations(prediction)
  });
}
```

#### 3.2 Cohort Analytics (60 min)
```typescript
// pages/api/cohort/risk-distribution.ts
export default async function handler(req, res) {
  const patients = getAllPatients();
  const predictions = await batchPredict(patients);
  
  return res.json({
    high_risk_count: predictions.filter(p => p.risk > 70).length,
    medium_risk_count: predictions.filter(p => p.risk >= 30 && p.risk <= 70).length,
    low_risk_count: predictions.filter(p => p.risk < 30).length,
    avg_risk_score: predictions.reduce((sum, p) => sum + p.risk, 0) / predictions.length,
    patients: predictions.map(p => ({
      id: p.patient_id,
      name: p.name,
      risk_score: p.risk,
      primary_risk_factor: p.top_risk_factor,
      last_updated: p.last_measurement_date
    }))
  });
}
```

### Phase 4: Dashboard Development (3 hours)

#### 4.1 Cohort View Components (60 min)
```typescript
// components/CohortDashboard.tsx
interface Patient {
  id: string;
  name: string;
  risk_score: number;
  primary_risk_factor: string;
  last_updated: string;
}

const CohortDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [riskDistribution, setRiskDistribution] = useState({});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Risk Distribution Chart */}
      <div className="col-span-1">
        <RiskDistributionChart data={riskDistribution} />
      </div>
      
      {/* Patient List */}
      <div className="col-span-2">
        <PatientRiskTable patients={patients} />
      </div>
    </div>
  );
};
```

#### 4.2 Individual Patient View (90 min)
```typescript
// components/PatientDetailView.tsx
const PatientDetailView = ({ patientId }: { patientId: string }) => {
  const [patientData, setPatientData] = useState(null);

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <RiskScoreCard 
        score={patientData.overall_risk_score}
        trend={patientData.trend}
      />
      
      {/* Dashboard Scores Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard 
          title="Vitals"
          score={patientData.dashboard_scores.vitals}
          icon="heart"
          trend={patientData.vitals_trend}
        />
        <ScoreCard 
          title="Medication"
          score={patientData.dashboard_scores.medication}
          icon="pill"
          trend={patientData.med_trend}
        />
        <ScoreCard 
          title="Lifestyle"
          score={patientData.dashboard_scores.lifestyle}
          icon="activity"
          trend={patientData.lifestyle_trend}
        />
        <ScoreCard 
          title="Lab Results"
          score={patientData.dashboard_scores.labs}
          icon="test-tube"
          trend={patientData.lab_trend}
        />
      </div>
      
      {/* Risk Factors Breakdown */}
      <RiskFactorsChart factors={patientData.risk_factors} />
      
      {/* Time Series Charts */}
      <PatientTimelineCharts data={patientData.time_series} />
      
      {/* Recommendations */}
      <RecommendationsPanel recommendations={patientData.recommendations} />
    </div>
  );
};
```

#### 4.3 Visualization Components (30 min)
```typescript
// components/charts/RiskScoreCard.tsx
const RiskScoreCard = ({ score, trend }: { score: number, trend: string }) => {
  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600";
    if (score >= 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'improving': return '↓';
      case 'declining': return '↑';
      default: return '→';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">90-Day Risk Score</h3>
      <div className={`text-4xl font-bold ${getRiskColor(score)}`}>
        {score.toFixed(1)}%
      </div>
      <div className="flex items-center mt-2">
        <span className="text-sm text-gray-600">
          {getTrendIcon(trend)} {trend}
        </span>
      </div>
    </div>
  );
};
```

### Phase 5: Integration & Demo (1 hour)

#### 5.1 Demo Data Scenarios (30 min)
```javascript
// Demo patients with different risk profiles
const demoPatients = [
  {
    id: "P001",
    name: "John Doe",
    scenario: "High Risk - Declining Vitals + Poor Adherence",
    risk_score: 85,
    dashboard_scores: {
      vitals: 25,      // Poor BP control, high glucose variability
      medication: 40,  // 60% adherence to critical meds
      lifestyle: 30,   // Sedentary, poor sleep
      labs: 20        // Rising HbA1c, declining kidney function
    }
  },
  {
    id: "P002", 
    name: "Jane Smith",
    scenario: "Low Risk - Stable with Good Management",
    risk_score: 15,
    dashboard_scores: {
      vitals: 85,      // Stable vitals, good control
      medication: 95,  // Excellent adherence
      lifestyle: 80,   // Active, good sleep
      labs: 75        // Improving trends
    }
  },
  {
    id: "P003",
    name: "Bob Wilson", 
    scenario: "Medium Risk - Mixed Signals",
    risk_score: 55,
    dashboard_scores: {
      vitals: 60,      // Some concerning trends
      medication: 70,  // Good but not perfect adherence  
      lifestyle: 45,   // Inconsistent habits
      labs: 85        // Good recent labs
    }
  }
];
```

#### 5.2 Demo Script (30 min)
1. **Open Cohort View**: Show risk distribution, identify high-risk patients
2. **Drill into High-Risk Patient**: Explain why they're high risk
3. **Show Explainability**: "The model flagged declining vitals and poor medication adherence"
4. **View Trends**: "Notice the glucose variability increased over the last 30 days"
5. **Clinical Recommendations**: "Suggest medication review and lifestyle counseling"
6. **Switch to Low-Risk Patient**: Show contrast in scores and trends

---

## 🎯 Key Success Metrics

### Technical Performance
- **AUROC**: >0.80 (Target: 0.85+)
- **AUPRC**: >0.70 (Important for imbalanced data)
- **Calibration**: Well-calibrated probabilities
- **Response Time**: <2s for individual predictions

### Clinical Usability
- **Interpretability**: Clear explanations for each prediction
- **Actionability**: Specific recommendations based on risk factors
- **Trust**: Confidence intervals and uncertainty quantification

### Demo Impact
- **Visual Appeal**: Clean, medical-grade interface
- **Story Flow**: Clear patient journey from data to action
- **Technical Depth**: Show ML sophistication without overwhelming

---

## 🚀 Implementation Priority

### Must-Have (Day 1)
✅ Working binary classification model
✅ Probability scores converted to dashboard metrics
✅ Basic cohort view with risk distribution
✅ Individual patient view with score breakdown
✅ Simple explainability (feature importance)

### Nice-to-Have (If Time Permits)
- Advanced SHAP visualizations
- Real-time data simulation
- Multiple model comparison
- Advanced recommendations engine

---

## 📊 Dashboard Score Calculation Examples

### Example: Converting Binary Model to Rich Scores

```python
# Patient P001 - High Risk Example
model_probability = 0.85  # 85% chance of deterioration

# SHAP values for different feature groups
shap_contributions = {
    'vitals': -0.15,      # Negative = increases risk
    'medication': -0.10,  # Poor adherence increases risk  
    'lifestyle': -0.05,   # Poor lifestyle increases risk
    'labs': -0.08,        # Concerning lab trends
    'baseline': 0.40      # Population baseline risk
}

# Convert to 0-100 dashboard scores (inverted for intuitive display)
dashboard_scores = {
    'vitals': max(0, 100 - abs(shap_contributions['vitals']) * 400),     # 25
    'medication': max(0, 100 - abs(shap_contributions['medication']) * 400), # 40
    'lifestyle': max(0, 100 - abs(shap_contributions['lifestyle']) * 400),   # 80
    'labs': max(0, 100 - abs(shap_contributions['labs']) * 400)              # 32
}
```

This approach gives us:
- **Overall Risk**: 85% (from model probability)
- **Vitals Score**: 25/100 (poor - major contributor to risk)
- **Medication Score**: 40/100 (concerning adherence)  
- **Lifestyle Score**: 80/100 (relatively good)
- **Labs Score**: 32/100 (concerning trends)

The dashboard now shows exactly **why** this patient is high-risk and **where** to focus interventions!
