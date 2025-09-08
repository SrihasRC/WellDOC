"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cohortStats, demoPatients } from "@/lib/demo-data";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon: LucideIcon; 
  trend?: 'up' | 'down' | 'stable';
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-chart-2" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            {getTrendIcon()}
            <span>{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RiskDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cohortStats.riskDistribution}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="range" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }} 
            />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const RecentAlertsCard = () => {
  const alerts = [
    { patient: "John Mitchell", alert: "Blood pressure spike detected", severity: "high", time: "2 hours ago" },
    { patient: "Maria Rodriguez", alert: "Missed medication doses", severity: "medium", time: "4 hours ago" },
    { patient: "Robert Williams", alert: "Irregular heart rate pattern", severity: "medium", time: "6 hours ago" },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{alert.patient}</p>
                  {getSeverityBadge(alert.severity)}
                </div>
                <p className="text-sm text-muted-foreground">{alert.alert}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TopRiskPatientsCard = () => {
  const highRiskPatients = demoPatients
    .filter(p => p.status === 'high')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">High Risk Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highRiskPatients.map((patient) => (
            <Button
              key={patient.id}
              asChild
              variant="ghost"
              className="w-full h-auto p-3 justify-start"
            >
              <Link href={`/patients/${patient.id}`}>
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-destructive">{patient.riskScore}%</p>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Monitor patient risk levels and trends across your cohort</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={cohortStats.totalPatients}
          icon={Users}
          change="2 new this week"
          trend="up"
        />
        <StatCard
          title="High Risk"
          value={cohortStats.highRisk}
          icon={AlertTriangle}
          change="1 increased"
          trend="up"
        />
        <StatCard
          title="Average Risk Score"
          value={`${cohortStats.averageRiskScore}%`}
          icon={TrendingUp}
          change="2% decrease"
          trend="down"
        />
        <StatCard
          title="Active Monitoring"
          value={cohortStats.totalPatients}
          icon={Activity}
          change="All patients tracked"
          trend="stable"
        />
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionChart />
        <RecentAlertsCard />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-auto p-4 flex-col">
                  <Link href="/cohort">
                    <Users className="h-8 w-8 mb-2" />
                    <span className="font-medium">View All Patients</span>
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-auto p-4 flex-col">
                  <Link href="/analytics">
                    <TrendingUp className="h-8 w-8 mb-2" />
                    <span className="font-medium">Analytics Report</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col">
                  <Link href="/patients/P001">
                    <AlertTriangle className="h-8 w-8 mb-2" />
                    <span className="font-medium">Review Alerts</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <TopRiskPatientsCard />
      </div>
    </div>
  );
}
