"use client"

import { useState, useEffect } from "react"
import { Brain, Users, AlertTriangle, CheckCircle, Activity, TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Patient data interface
interface PatientData {
  id: string
  name: string
  age: number
  gender: string
  conditions: string[]
  lastVisit: string
  clinicalData: Record<string, number | string | boolean>
}

// Risk prediction result interface
interface RiskResult {
  patient_id: string
  risk_assessment: {
    deterioration_probability: number
    risk_level: string
    priority: string
    urgency: string
    confidence: number
  }
  feature_contributions?: Array<{
    feature: string
    contribution: number
    clinical_name: string
  }>
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return 'text-destructive'
    case 'medium':
      return 'text-orange-600'
    case 'low':
      return 'text-green-600'
    default:
      return 'text-muted-foreground'
  }
}

function getRiskIcon(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-destructive" />
    case 'medium':
      return <TrendingUp className="h-5 w-5 text-orange-600" />
    case 'low':
      return <CheckCircle className="h-5 w-5 text-green-600" />
    default:
      return <Activity className="h-5 w-5 text-muted-foreground" />
  }
}

export function RiskPredictionContent() {
  const [patients, setPatients] = useState<PatientData[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [prediction, setPrediction] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetch('/data/patient_database.json')
        const data = await response.json()
        setPatients(data.patients)
      } catch (err) {
        setError('Failed to load patients')
        console.error('Patient loading error:', err)
      }
    }

    loadPatients()
  }, [])

  const handlePredictRisk = async () => {
    if (!selectedPatientId) return

    const selectedPatient = patients.find(p => p.id === selectedPatientId)
    if (!selectedPatient) return

    try {
      setLoading(true)
      setError(null)
      setPrediction(null)

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          ...selectedPatient.clinicalData
        })
      })

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`)
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError('Failed to get risk prediction')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Risk Prediction</h1>
        <p className="text-muted-foreground">
          Get real-time 90-day deterioration risk assessment for individual patients
        </p>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Patient
          </CardTitle>
          <CardDescription>
            Choose a patient from the chronic care cohort for risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-select">Patient</Label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.age}y - {patient.conditions.join(', ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPatient && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Patient Information</h4>
              <div className="grid gap-2 text-sm">
                <div><strong>Name:</strong> {selectedPatient.name}</div>
                <div><strong>Age:</strong> {selectedPatient.age} years</div>
                <div><strong>Gender:</strong> {selectedPatient.gender}</div>
                <div><strong>Conditions:</strong> {selectedPatient.conditions.join(', ')}</div>
                <div><strong>Last Visit:</strong> {new Date(selectedPatient.lastVisit).toLocaleDateString()}</div>
              </div>
            </div>
          )}

          <Button 
            onClick={handlePredictRisk} 
            disabled={!selectedPatientId || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Generating Prediction...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Predict Risk
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRiskIcon(prediction.risk_assessment.risk_level)}
                Risk Assessment Results
              </CardTitle>
              <CardDescription>
                AI-generated 90-day deterioration risk for {selectedPatient?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Risk Score */}
              <div className="text-center p-6 border rounded-lg">
                <div className={`text-4xl font-bold mb-2 ${getRiskColor(prediction.risk_assessment.risk_level)}`}>
                  {(prediction.risk_assessment.deterioration_probability * 100).toFixed(1)}%
                </div>
                <div className="text-lg text-muted-foreground mb-4">
                  90-Day Deterioration Risk
                </div>
                <Badge 
                  variant={prediction.risk_assessment.risk_level === 'high' ? 'destructive' : 'default'}
                  className="text-sm px-3 py-1"
                >
                  {prediction.risk_assessment.risk_level.toUpperCase()} RISK
                </Badge>
              </div>

              <Separator />

              {/* Assessment Details */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(prediction.risk_assessment.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold capitalize">
                    {prediction.risk_assessment.priority}
                  </div>
                  <div className="text-sm text-muted-foreground">Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold capitalize">
                    {prediction.risk_assessment.urgency}
                  </div>
                  <div className="text-sm text-muted-foreground">Urgency</div>
                </div>
              </div>

              {/* Clinical Recommendations */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Clinical Recommendations
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {prediction.risk_assessment.risk_level === 'high' && (
                    <>
                      • Schedule immediate follow-up within 1-2 weeks<br/>
                      • Consider medication review and optimization<br/>
                      • Implement enhanced monitoring protocols<br/>
                      • Coordinate with care team for intervention planning
                    </>
                  )}
                  {prediction.risk_assessment.risk_level === 'medium' && (
                    <>
                      • Schedule follow-up within 2-4 weeks<br/>
                      • Review medication adherence<br/>
                      • Monitor key vital signs and symptoms<br/>
                      • Patient education on warning signs
                    </>
                  )}
                  {prediction.risk_assessment.risk_level === 'low' && (
                    <>
                      • Continue routine monitoring schedule<br/>
                      • Maintain current treatment plan<br/>
                      • Encourage adherence to medications<br/>
                      • Next routine visit as scheduled
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
