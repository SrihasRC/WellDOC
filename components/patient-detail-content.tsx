"use client"

import { ArrowLeft, Heart, Calendar, AlertTriangle, Users } from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

// Sample patient data - would come from props or API
const patientData = {
  id: "P001",
  name: "John Smith",
  age: 65,
  gender: "Male",
  condition: "Diabetes Type 2",
  riskScore: 85,
  riskLevel: "High",
  adherence: 85,
  status: "Active",
  lastVisit: "2024-01-15",
  nextAppointment: "2024-01-22",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, ST 12345",
  emergencyContact: "Jane Smith - Wife - (555) 987-6543"
}

const glucoseData = [
  { date: "Jan 1", value: 145, target: 120 },
  { date: "Jan 3", value: 138, target: 120 },
  { date: "Jan 5", value: 152, target: 120 },
  { date: "Jan 7", value: 142, target: 120 },
  { date: "Jan 9", value: 135, target: 120 },
  { date: "Jan 11", value: 148, target: 120 },
  { date: "Jan 13", value: 141, target: 120 },
  { date: "Jan 15", value: 139, target: 120 },
]

const medicationData = [
  { medication: "Metformin", adherence: 92 },
  { medication: "Lisinopril", adherence: 88 },
  { medication: "Atorvastatin", adherence: 79 },
  { medication: "Aspirin", adherence: 95 },
]

const riskFactors = [
  { factor: "Blood Sugar Control", value: 75, color: "var(--chart-1)" },
  { factor: "Medication Adherence", value: 85, color: "var(--chart-2)" },
  { factor: "Lifestyle Factors", value: 60, color: "var(--chart-3)" },
  { factor: "Comorbidities", value: 90, color: "var(--chart-4)" },
]

const recentVisits = [
  {
    date: "2024-01-15",
    type: "Regular Checkup",
    provider: "Dr. Johnson",
    notes: "Blood sugar improving, continue current regimen",
    vitals: { bp: "142/88", hr: "78", weight: "185 lbs" }
  },
  {
    date: "2024-01-01",
    type: "Lab Results",
    provider: "Lab Tech",
    notes: "HbA1c: 7.2% (target <7%), cholesterol within range",
    vitals: { bp: "145/92", hr: "82", weight: "187 lbs" }
  },
  {
    date: "2023-12-18",
    type: "Follow-up",
    provider: "Dr. Johnson",
    notes: "Medication adjustment, increased exercise plan",
    vitals: { bp: "148/94", hr: "85", weight: "189 lbs" }
  }
]

function getRiskVariant(risk: string) {
  switch (risk.toLowerCase()) {
    case "critical":
      return "destructive"
    case "high":
      return "destructive"
    case "moderate":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

interface PatientDetailContentProps {
  patientId: string
}

export function PatientDetailContent({ patientId }: PatientDetailContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/patients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{patientData.name}</h1>
          <p className="text-muted-foreground">Patient ID: {patientData.id}</p>
        </div>
        <Badge variant={getRiskVariant(patientData.riskLevel)} className="text-sm">
          {patientData.riskLevel} Risk
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientData.riskScore}</div>
            <Progress value={patientData.riskScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientData.adherence}%</div>
            <Progress value={patientData.adherence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{patientData.lastVisit}</div>
            <p className="text-xs text-muted-foreground">Regular checkup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{patientData.nextAppointment}</div>
            <p className="text-xs text-muted-foreground">Dr. Johnson</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p>{patientData.age} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p>{patientData.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Condition</p>
                <p>{patientData.condition}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="default">{patientData.status}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{patientData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{patientData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{patientData.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p className="text-sm">{patientData.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Glucose Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Glucose Trend</CardTitle>
            <CardDescription>Recent glucose readings vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Glucose",
                  color: "var(--chart-1)",
                },
                target: {
                  label: "Target",
                  color: "var(--chart-2)",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={glucoseData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ fill: "var(--chart-1)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Medication Adherence */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence</CardTitle>
            <CardDescription>Current medication compliance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                adherence: {
                  label: "Adherence %",
                  color: "var(--chart-3)",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicationData} layout="horizontal">
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="medication" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="adherence" fill="var(--chart-3)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Analysis</CardTitle>
            <CardDescription>Contributing factors to overall risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Risk Level",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskFactors}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {riskFactors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: factor.color }}
                  />
                  <span className="text-sm">{factor.factor}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{factor.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Visit History</CardTitle>
          <CardDescription>Latest appointments and care interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVisits.map((visit, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{visit.type}</p>
                      <Badge variant="outline">{visit.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{visit.provider}</p>
                    <p className="text-sm">{visit.notes}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>BP: {visit.vitals.bp}</p>
                    <p>HR: {visit.vitals.hr}</p>
                    <p>Weight: {visit.vitals.weight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
