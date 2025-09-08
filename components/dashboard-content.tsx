"use client"

import { TrendingUp, Users, AlertTriangle, Activity } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const dashboardData = [
  { risk: "Low", patients: 45 },
  { risk: "Moderate", patients: 32 },
  { risk: "High", patients: 18 },
  { risk: "Critical", patients: 5 },
]

const chartConfig = {
  patients: {
    label: "Patients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function RiskOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution Overview</CardTitle>
        <CardDescription>Current patient risk levels in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={dashboardData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="risk"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="patients" fill="var(--color-patients)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total active patients: 100 <Users className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Risk assessment updated daily
        </div>
      </CardFooter>
    </Card>
  )
}

function RecentAlertsCard() {
  const alerts = [
    {
      id: "P001",
      name: "John Smith",
      condition: "Hypertension spike detected",
      time: "2 hours ago",
      severity: "high",
    },
    {
      id: "P023",
      name: "Maria Garcia",
      condition: "Missed medication doses",
      time: "4 hours ago", 
      severity: "moderate",
    },
    {
      id: "P012",
      name: "Robert Johnson",
      condition: "Irregular glucose readings",
      time: "6 hours ago",
      severity: "high",
    },
  ]

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "moderate":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Latest high-priority patient alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.name}</span>
                  <Badge variant={getSeverityVariant(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.condition}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <AlertTriangle className="h-4 w-4 mr-2" />
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  )
}

export function DashboardContent() {
  return (
    <>
      {/* Key Metrics */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-muted-foreground">↑ 5 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">↓ 2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Interventions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <p className="text-xs text-muted-foreground">↑ 2.1% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RiskOverviewChart />
        <RecentAlertsCard />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              View All Patients
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              Review Alerts
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Activity className="h-6 w-6" />
              Analytics Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
