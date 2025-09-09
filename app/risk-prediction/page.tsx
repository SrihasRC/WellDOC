"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, CheckCircle, Clock, Heart, Activity, FileText, Calendar, TrendingUp, Users, Database } from 'lucide-react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProtectedRoute } from "@/components/protected-route"
import { MLLoadingProgress } from "@/components/ml-loading-progress"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Patient interface matching our database structure
interface PatientData {
  id: string
  name: string
  age: number
  gender: string
  demographics: {
    date_of_birth: string
    insurance: string
    emergency_contact: string
  }
  conditions: string[]
  lastVisit: string
  notes: string
  clinicalData: {
    age: number
    gender_male: number
    bmi: number
    systolic_bp: number
    diastolic_bp: number
    has_diabetes: number
    has_hypertension: number
    has_heart_disease: number
    has_kidney_disease: number
    has_copd: number
    has_stroke: number
    has_cancer: number
    smoking_status: number
    comorbidity_count: number
    heart_rate: number
    glucose: number
    hba1c: number
    creatinine: number
    medication_count: number
    total_encounters: number
    emergency_visits: number
    inpatient_visits: number
    total_conditions: number
    pain_score: number
    depression_score: number
    insurance_medicaid: number
    insurance_medicare: number
    insurance_private: number
    days_since_last_visit: number
    hospitalization_last_year: number
    specialist_visits: number
    lab_abnormal: number
    vaccination_current: number
    adherence_score: number
  }
}

interface RiskPredictionResult {
  patient_id: string
  risk_assessment: {
    deterioration_probability: number
    risk_level: string
    priority: string
    urgency: string
    confidence: number
  }
  class_probabilities: {
    high_risk: number
    medium_risk: number
    low_risk: number
  }
  recommendations: Array<{
    category: string
    recommendation: string
    priority: string
    rationale: string
  }>
  model_info: {
    model_name: string
    model_version: string
    performance: {
      auroc: number
      accuracy: number
    }
  }
  prediction_timestamp: string
}

export default function RiskPredictionPage() {
  const [loading, setLoading] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [result, setResult] = useState<RiskPredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedTimeline, setSelectedTimeline] = useState<string>("90")
  const [patients, setPatients] = useState<PatientData[]>([])
  
  // Load patient database on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoadingPatients(true)
        const response = await fetch('/data/patient_database.json')
        if (!response.ok) {
          throw new Error('Failed to load patient database')
        }
        const data = await response.json()
        setPatients(data.patients)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patients')
      } finally {
        setLoadingPatients(false)
      }
    }
    
    loadPatients()
  }, [])

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId)
    setResult(null)
    setError(null)
  }

  const handleTimelineChange = (timeline: string) => {
    setSelectedTimeline(timeline)
    setResult(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      setError("Please select a patient first")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Find the selected patient in our database
      const patient = patients.find(p => p.id === selectedPatient)
      if (!patient) {
        throw new Error("Patient not found in database")
      }

      // Prepare clinical data for ML model prediction
      const clinicalPayload = {
        patient_id: patient.id,
        ...patient.clinicalData
      }

      console.log('Sending patient data to ML model:', clinicalPayload)

      // Send to backend for REAL ML prediction
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clinicalPayload)
      })

      if (!response.ok) {
        throw new Error(`ML prediction failed: ${response.statusText}`)
      }

      const predictionResult = await response.json()
      console.log('Received ML prediction:', predictionResult)
      
      setResult(predictionResult)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during prediction')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const selectedPatientData = patients.find(p => p.id === selectedPatient)

  if (loadingPatients) {
    return (
      <ProtectedRoute>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
                  <Card>
                    <CardContent className="text-center py-12">
                      <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <h3 className="text-lg font-medium mb-2">Loading Patient Database</h3>
                      <p className="text-muted-foreground">
                        Connecting to EHR/EMR system...
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">AI Risk Prediction</h1>
                <p className="text-muted-foreground mt-2">
                  Predict 90-day deterioration risk for chronic care patients using AI
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>Connected to EHR Database • {patients.length} patients loaded</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Selection Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Select Patient
                      </CardTitle>
                      <CardDescription>
                        Choose a patient from the EHR database
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient-select">Patient</Label>
                        <Select value={selectedPatient} onValueChange={handlePatientChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient..." />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                <div className="flex items-center gap-2">
                                  <span>{patient.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {patient.age}y {patient.gender}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedPatientData && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Patient Demographics</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Age:</span>
                              <span className="text-foreground">{selectedPatientData.age} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Gender:</span>
                              <span className="text-foreground">{selectedPatientData.gender}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>BMI:</span>
                              <span className="text-foreground">{selectedPatientData.clinicalData.bmi}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Visit:</span>
                              <span className="text-foreground">{selectedPatientData.lastVisit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Insurance:</span>
                              <span className="text-foreground text-xs">{selectedPatientData.demographics.insurance}</span>
                            </div>
                          </div>
                          
                          {selectedPatientData.conditions.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium mb-1">Active Conditions</h5>
                              <div className="flex flex-wrap gap-1">
                                {selectedPatientData.conditions.map((condition, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3">
                            <h5 className="font-medium mb-1">Clinical Notes</h5>
                            <p className="text-xs text-muted-foreground">{selectedPatientData.notes}</p>
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-2">
                        <Label>Prediction Timeline</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "30", label: "30 days" },
                            { value: "60", label: "60 days" },
                            { value: "90", label: "90 days" },
                            { value: "180", label: "180 days" }
                          ].map((option) => (
                            <Button
                              key={option.value}
                              variant={selectedTimeline === option.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleTimelineChange(option.value)}
                              className="text-xs"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              {option.label}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          *Currently all predictions use 90-day model
                        </p>
                      </div>

                      <Button 
                        onClick={handleSubmit} 
                        disabled={!selectedPatient || loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                            Running ML Prediction...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Predict Risk with AI
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2">
                  {error && (
                    <Alert className="mb-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Prediction Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* ML Processing Progress */}
                  <MLLoadingProgress isLoading={loading} />

                  {result && (
                    <div className="space-y-6">
                      {/* Risk Assessment Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            AI Risk Assessment Results
                          </CardTitle>
                          <CardDescription>
                            {selectedTimeline}-day deterioration risk analysis for {selectedPatientData?.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Main Risk Badge */}
                            <div className="text-center">
                              <div className="mb-4">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getRiskColor(result.risk_assessment.risk_level)} text-lg font-semibold`}>
                                  {getRiskIcon(result.risk_assessment.risk_level)}
                                  {result.risk_assessment.risk_level.toUpperCase()} RISK
                                </div>
                              </div>
                              <div className="text-3xl font-bold mb-1">
                                {(result.risk_assessment.deterioration_probability * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Deterioration Probability
                              </div>
                              <div className="mt-2 text-sm">
                                <Badge variant="outline">
                                  {(result.risk_assessment.confidence * 100).toFixed(1)}% confidence
                                </Badge>
                              </div>
                            </div>

                            {/* Risk Distribution */}
                            <div>
                              <h4 className="font-medium mb-3">Risk Distribution</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">High Risk</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-muted rounded-full h-2">
                                      <div 
                                        className="bg-destructive h-2 rounded-full" 
                                        style={{ width: `${result.class_probabilities.high_risk * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                      {(result.class_probabilities.high_risk * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Medium Risk</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-muted rounded-full h-2">
                                      <div 
                                        className="bg-yellow-500 h-2 rounded-full" 
                                        style={{ width: `${result.class_probabilities.medium_risk * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                      {(result.class_probabilities.medium_risk * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Low Risk</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-muted rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${result.class_probabilities.low_risk * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                      {(result.class_probabilities.low_risk * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(result.risk_assessment.priority)}
                              <span className="font-medium">Priority:</span>
                              <Badge variant="outline">{result.risk_assessment.priority}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Urgency:</span>
                              <span className="font-medium">{result.risk_assessment.urgency}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Clinical Recommendations */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Clinical Recommendations
                          </CardTitle>
                          <CardDescription>
                            Evidence-based actions to reduce deterioration risk
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {result.recommendations.slice(0, 5).map((rec, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {getPriorityIcon(rec.priority)}
                                    <span className="font-medium">{rec.category}</span>
                                  </div>
                                  <Badge className={getRiskColor(rec.priority)}>
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm mb-2">{rec.recommendation}</p>
                                <p className="text-xs text-muted-foreground">{rec.rationale}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Model Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-purple-500" />
                            Model Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Model:</span>
                              <p className="font-medium">{result.model_info.model_name}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">AUROC:</span>
                              <p className="font-medium">{(result.model_info.performance.auroc * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Accuracy:</span>
                              <p className="font-medium">{(result.model_info.performance.accuracy * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Processed:</span>
                              <p className="font-medium">
                                {new Date(result.prediction_timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {!result && !error && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Ready for AI Risk Analysis</h3>
                        <p className="text-muted-foreground">
                          Select a patient and click &ldquo;Predict Risk with AI&rdquo; to see machine learning prediction
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  )
}
