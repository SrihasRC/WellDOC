"use client"

import { TrendingUp, Activity, Clock, Zap, Brain, Target } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, Bar, BarChart, YAxis, Area, AreaChart, Pie, PieChart, Cell } from "recharts"

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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Model Performance Chart
const modelPerformanceData = [
  { month: "Jan", accuracy: 83 },
  { month: "Feb", accuracy: 87 },
  { month: "Mar", accuracy: 89 },
  { month: "Apr", accuracy: 91 },
  { month: "May", accuracy: 86 },
  { month: "Jun", accuracy: 89 },
]

const modelPerformanceConfig = {
  accuracy: {
    label: "Accuracy %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function ModelPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Accuracy Over Time</CardTitle>
        <CardDescription>Model performance metrics by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={modelPerformanceConfig}>
          <LineChart
            accessibilityLayer
            data={modelPerformanceData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="accuracy"
              type="natural"
              stroke="var(--color-accuracy)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-accuracy)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing accuracy percentage for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

// Feature Importance Chart
const featureImportanceData = [
  { feature: "Blood Pressure", importance: 28 },
  { feature: "Medication", importance: 24 },
  { feature: "Glucose", importance: 22 },
  { feature: "Lab Results", importance: 15 },
  { feature: "Lifestyle", importance: 11 },
]

const featureImportanceConfig = {
  importance: {
    label: "Importance %",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function FeatureImportanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
        <CardDescription>Most impactful features in risk prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={featureImportanceConfig}>
          <BarChart
            accessibilityLayer
            data={featureImportanceData}
            layout="horizontal"
            margin={{
              left: -20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="importance" hide />
            <YAxis
              dataKey="feature"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="importance" fill="var(--color-importance)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Based on model feature attribution analysis
        </div>
      </CardFooter>
    </Card>
  )
}

// Risk Distribution Pie Chart
const riskDistributionData = [
  { risk: "Low", count: 45, fill: "var(--color-low)" },
  { risk: "Moderate", count: 32, fill: "var(--color-moderate)" },
  { risk: "High", count: 18, fill: "var(--color-high)" },
  { risk: "Critical", count: 5, fill: "var(--color-critical)" },
]

const riskDistributionConfig = {
  count: {
    label: "Patients",
  },
  low: {
    label: "Low Risk",
    color: "var(--chart-3)",
  },
  moderate: {
    label: "Moderate Risk",
    color: "var(--chart-2)",
  },
  high: {
    label: "High Risk",
    color: "var(--chart-1)",
  },
  critical: {
    label: "Critical Risk",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function RiskDistributionChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Current patient risk levels</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={riskDistributionConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={riskDistributionData}
              dataKey="count"
              nameKey="risk"
              innerRadius={60}
              strokeWidth={5}
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total active patients: 100
        </div>
      </CardFooter>
    </Card>
  )
}

// Patient Outcomes Area Chart
const outcomesData = [
  { month: "Jan", improved: 12, stable: 8, declined: 3 },
  { month: "Feb", improved: 15, stable: 6, declined: 2 },
  { month: "Mar", improved: 18, stable: 4, declined: 1 },
  { month: "Apr", improved: 14, stable: 7, declined: 2 },
  { month: "May", improved: 20, stable: 3, declined: 1 },
  { month: "Jun", improved: 17, stable: 5, declined: 1 },
]

const outcomesConfig = {
  improved: {
    label: "Improved",
    color: "var(--chart-3)",
  },
  stable: {
    label: "Stable",
    color: "var(--chart-2)",
  },
  declined: {
    label: "Declined",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function PatientOutcomesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Outcomes Timeline</CardTitle>
        <CardDescription>Monthly patient status changes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={outcomesConfig}>
          <AreaChart
            accessibilityLayer
            data={outcomesData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillImproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-improved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-improved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillStable" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-stable)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-stable)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDeclined" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-declined)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-declined)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="declined"
              type="natural"
              fill="url(#fillDeclined)"
              fillOpacity={0.4}
              stroke="var(--color-declined)"
              stackId="a"
            />
            <Area
              dataKey="stable"
              type="natural"
              fill="url(#fillStable)"
              fillOpacity={0.4}
              stroke="var(--color-stable)"
              stackId="a"
            />
            <Area
              dataKey="improved"
              type="natural"
              fill="url(#fillImproved)"
              fillOpacity={0.4}
              stroke="var(--color-improved)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Patient outcomes improving <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Monthly status tracking for last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Model Performance Metrics Card
function ModelMetricsCard() {
  const metrics = [
    { name: 'AUROC', value: 0.87, target: 0.80, status: 'excellent' },
    { name: 'AUPRC', value: 0.74, target: 0.70, status: 'good' },
    { name: 'Precision', value: 0.81, target: 0.75, status: 'good' },
    { name: 'Recall', value: 0.78, target: 0.70, status: 'good' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary'; 
      case 'needs-improvement': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Model Performance Metrics
        </CardTitle>
        <CardDescription>Key performance indicators for the AI model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={metric.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{metric.name}</span>
                </div>
                <Badge variant={getStatusVariant(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {metric.value.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: {metric.target.toFixed(2)}
                </div>
              </div>
              {index < metrics.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Intervention Success Rates
function InterventionCard() {
  const data = [
    { intervention: 'Medication Review', success: 85, total: 100 },
    { intervention: 'Lifestyle Coaching', success: 72, total: 95 },
    { intervention: 'Care Coordination', success: 90, total: 110 },
    { intervention: 'Remote Monitoring', success: 78, total: 88 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Success Rates</CardTitle>
        <CardDescription>Effectiveness of different intervention types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => {
            const successRate = (item.success / item.total) * 100;
            return (
              <div key={item.intervention} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.intervention}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.success}/{item.total}
                    </span>
                    <Badge variant="secondary">
                      {successRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={successRate} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsContent() {
  return (
    <>
      {/* Key Metrics Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <p className="text-xs text-muted-foreground">↑ 2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Early Interventions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prevented Hospitalizations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Estimated based on interventions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Prediction latency</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <ModelMetricsCard />
        <RiskDistributionChart />
        <ModelPerformanceChart />
        <FeatureImportanceChart />
        <InterventionCard />
        <PatientOutcomesChart />
      </div>

      {/* Clinical Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Impact Summary</CardTitle>
          <CardDescription>Overall impact of the AI risk prediction system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-6 text-center">
              <div className="text-3xl font-bold mb-2">94%</div>
              <p className="text-sm text-muted-foreground">High-risk patients identified early</p>
            </div>
            <div className="rounded-lg border p-6 text-center">
              <div className="text-3xl font-bold mb-2">76%</div>
              <p className="text-sm text-muted-foreground">Successful intervention rate</p>
            </div>
            <div className="rounded-lg border p-6 text-center">
              <div className="text-3xl font-bold mb-2">$125K</div>
              <p className="text-sm text-muted-foreground">Estimated cost savings this quarter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
