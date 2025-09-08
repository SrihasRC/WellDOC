"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { demoPatients, cohortStats } from "@/lib/demo-data";
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Search,
  Eye
} from "lucide-react";
import Link from "next/link";

const getRiskBadgeVariant = (status: string) => {
  switch (status) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'improving':
      return '↓';
    case 'declining':
      return '↑';
    default:
      return '→';
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'improving':
      return 'text-chart-2';
    case 'declining':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export function CohortView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'lastUpdated'>('risk');
  const [filterByRisk, setFilterByRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredPatients = demoPatients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterByRisk === 'all' || patient.status === filterByRisk;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'risk':
          return b.riskScore - a.riskScore;
        case 'lastUpdated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Cohort</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage all patients in your care</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{cohortStats.totalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{cohortStats.highRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((cohortStats.highRisk / cohortStats.totalPatients) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risk</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{cohortStats.mediumRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((cohortStats.mediumRisk / cohortStats.totalPatients) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Risk</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{cohortStats.lowRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((cohortStats.lowRisk / cohortStats.totalPatients) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Risk Filter */}
            <Select value={filterByRisk} onValueChange={(value: 'all' | 'high' | 'medium' | 'low') => setFilterByRisk(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'name' | 'risk' | 'lastUpdated') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk">Sort by Risk Score</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="lastUpdated">Sort by Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Patient Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.age} years, {patient.gender}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground">{patient.condition}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-foreground">{patient.riskScore}%</span>
                      <Badge variant={getRiskBadgeVariant(patient.status)}>
                        {patient.status.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className={`text-lg ${getTrendColor(patient.trends.vitals)}`}>
                        {getTrendIcon(patient.trends.vitals)}
                      </span>
                      <span className={`text-sm ${getTrendColor(patient.trends.vitals)}`}>
                        {patient.trends.vitals}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">
                      {new Date(patient.lastUpdated).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/patients/${patient.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No patients found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
