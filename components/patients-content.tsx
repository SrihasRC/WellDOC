"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Eye, Calendar, Activity } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const patients = [
  {
    id: "P001",
    name: "John Smith",
    age: 65,
    gender: "Male",
    condition: "Diabetes Type 2",
    riskScore: 85,
    riskLevel: "High",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    adherence: 85,
    status: "Active",
    bloodSugar: "142 mg/dL",
    bloodPressure: "145/92"
  },
  {
    id: "P002", 
    name: "Maria Garcia",
    age: 58,
    gender: "Female", 
    condition: "Hypertension",
    riskScore: 62,
    riskLevel: "Moderate",
    lastVisit: "2024-01-14",
    nextAppointment: "2024-01-28",
    adherence: 92,
    status: "Active",
    bloodSugar: "98 mg/dL",
    bloodPressure: "138/88"
  },
  {
    id: "P003",
    name: "Robert Johnson", 
    age: 72,
    gender: "Male",
    condition: "Heart Disease",
    riskScore: 78,
    riskLevel: "High",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-01-19",
    adherence: 78,
    status: "Active",
    bloodSugar: "105 mg/dL",
    bloodPressure: "152/95"
  },
  {
    id: "P004",
    name: "Lisa Chen",
    age: 45,
    gender: "Female",
    condition: "Diabetes Type 1",
    riskScore: 35,
    riskLevel: "Low",
    lastVisit: "2024-01-16",
    nextAppointment: "2024-02-16",
    adherence: 95,
    status: "Active",
    bloodSugar: "115 mg/dL",
    bloodPressure: "120/80"
  },
  {
    id: "P005",
    name: "Michael Brown",
    age: 68,
    gender: "Male",
    condition: "COPD",
    riskScore: 92,
    riskLevel: "Critical",
    lastVisit: "2024-01-17",
    nextAppointment: "2024-01-20",
    adherence: 65,
    status: "Monitoring",
    bloodSugar: "88 mg/dL",
    bloodPressure: "165/100"
  },
  {
    id: "P006",
    name: "Sarah Wilson",
    age: 55,
    gender: "Female",
    condition: "Diabetes Type 2",
    riskScore: 58,
    riskLevel: "Moderate",
    lastVisit: "2024-01-13",
    nextAppointment: "2024-01-27",
    adherence: 88,
    status: "Active",
    bloodSugar: "128 mg/dL",
    bloodPressure: "132/85"
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

function getRiskColor(score: number) {
  if (score >= 80) return "text-red-600"
  if (score >= 60) return "text-yellow-600"
  return "text-green-600"
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "default"
    case "monitoring":
      return "secondary"
    case "inactive":
      return "outline"
    default:
      return "outline"
  }
}

export function PatientsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === "all" || patient.riskLevel.toLowerCase() === riskFilter
    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter
    return matchesSearch && matchesRisk && matchesStatus
  })

  return (
    <>
      {/* Summary Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">In care management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.riskLevel === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length)}
            </div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Appointments today</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>Complete patient roster with risk assessments and care status</CardDescription>
          
          {/* Search and Filters */}
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, ID, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead>Vitals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{patient.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{patient.age} years</div>
                      <div className="text-sm text-muted-foreground">{patient.gender}</div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={getRiskColor(patient.riskScore)}>{patient.riskScore}</span>
                        <Badge variant={getRiskVariant(patient.riskLevel)} className="text-xs">
                          {patient.riskLevel}
                        </Badge>
                      </div>
                      <Progress value={patient.riskScore} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{patient.adherence}%</div>
                      <Progress value={patient.adherence} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>BP: {patient.bloodPressure}</div>
                      <div className="text-muted-foreground">BG: {patient.bloodSugar}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.nextAppointment}</TableCell>
                  <TableCell>
                    <Link href={`/patients/${patient.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
