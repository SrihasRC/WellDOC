"use client"

import { useState } from "react"
import { Search, Filter, Users, TrendingUp, AlertTriangle } from "lucide-react"

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

const patients = [
  {
    id: "P001",
    name: "John Smith",
    age: 65,
    condition: "Diabetes Type 2",
    riskLevel: "High",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    adherence: 85,
  },
  {
    id: "P002", 
    name: "Maria Garcia",
    age: 58,
    condition: "Hypertension",
    riskLevel: "Moderate",
    lastVisit: "2024-01-14",
    nextAppointment: "2024-01-28",
    adherence: 92,
  },
  {
    id: "P003",
    name: "Robert Johnson", 
    age: 72,
    condition: "Heart Disease",
    riskLevel: "High",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-01-19",
    adherence: 78,
  },
  {
    id: "P004",
    name: "Lisa Chen",
    age: 45,
    condition: "Diabetes Type 1",
    riskLevel: "Low",
    lastVisit: "2024-01-16",
    nextAppointment: "2024-02-16",
    adherence: 95,
  },
  {
    id: "P005",
    name: "Michael Brown",
    age: 68,
    condition: "COPD",
    riskLevel: "Critical",
    lastVisit: "2024-01-17",
    nextAppointment: "2024-01-20",
    adherence: 65,
  },
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

function getAdherenceColor(adherence: number) {
  if (adherence >= 90) return "text-green-600"
  if (adherence >= 80) return "text-yellow-600"
  return "text-red-600"
}

export function CohortContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === "all" || patient.riskLevel.toLowerCase() === riskFilter
    return matchesSearch && matchesRisk
  })

  return (
    <>
      {/* Summary Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">Active in cohort</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.riskLevel === "High" || p.riskLevel === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Adherence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Medication compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Cohort</CardTitle>
          <CardDescription>Manage and monitor patient population</CardDescription>
          
          {/* Search and Filter */}
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="moderate">Moderate Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="critical">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-mono">{patient.id}</TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskVariant(patient.riskLevel)}>
                      {patient.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={getAdherenceColor(patient.adherence)}>
                      {patient.adherence}%
                    </span>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.nextAppointment}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
