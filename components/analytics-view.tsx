"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cohortStats } from "@/lib/demo-data";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Activity,
  Target,
  Clock,
  Zap,
  Brain
} from "lucide-react";

const ModelPerformanceCard = () => {
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
  );
};

const RiskPredictionAccuracy = () => {
  const data = [
    { month: 'Jan', accuracy: 83 },
    { month: 'Feb', accuracy: 87 },
    { month: 'Mar', accuracy: 89 },
    { month: 'Apr', accuracy: 91 },
    { month: 'May', accuracy: 86 },
    { month: 'Jun', accuracy: 89 },
  ];

  const chartConfig = {
    accuracy: {
      label: "Accuracy %",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Accuracy Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
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
    </Card>
  );
};

const FeatureImportanceChart = () => {
  const data = [
    { feature: 'Blood Pressure', importance: 28 },
    { feature: 'Medication', importance: 24 },
    { feature: 'Glucose', importance: 22 },
    { feature: 'Lab Results', importance: 15 },
    { feature: 'Lifestyle', importance: 11 },
  ];

  const chartConfig = {
    importance: {
      label: "Importance %",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
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
    </Card>
  );
};

const RiskDistributionPie = () => {
  const chartData = cohortStats.riskDistribution.map((item, index) => ({
    risk: item.range,
    count: item.count,
    fill: `var(--color-chart${index + 1})`,
  }));

  const chartConfig = {
    count: {
      label: "Patients",
    },
    chart1: {
      label: "Low",
      color: "hsl(var(--chart-1))",
    },
    chart2: {
      label: "Moderate",
      color: "hsl(var(--chart-2))",
    },
    chart3: {
      label: "High", 
      color: "hsl(var(--chart-3))",
    },
    chart4: {
      label: "Critical",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="risk"
              innerRadius={60}
              strokeWidth={5}
            >
              <Cell key="0" fill="var(--color-chart1)" />
              <Cell key="1" fill="var(--color-chart2)" />
              <Cell key="2" fill="var(--color-chart3)" />
              <Cell key="3" fill="var(--color-chart4)" />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const InterventionOutcomes = () => {
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
  );
};

const PatientOutcomesTimeline = () => {
  const data = [
    { month: 'Jan', improved: 12, stable: 8, declined: 3 },
    { month: 'Feb', improved: 15, stable: 6, declined: 2 },
    { month: 'Mar', improved: 18, stable: 4, declined: 1 },
    { month: 'Apr', improved: 14, stable: 7, declined: 2 },
    { month: 'May', improved: 20, stable: 3, declined: 1 },
    { month: 'Jun', improved: 17, stable: 5, declined: 1 },
  ];

  const chartConfig = {
    improved: {
      label: "Improved",
      color: "hsl(var(--chart-3))",
    },
    stable: {
      label: "Stable", 
      color: "hsl(var(--chart-2))",
    },
    declined: {
      label: "Declined",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Outcomes Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
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
    </Card>
  );
};

export function AnalyticsView() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="rounded-xl bg-muted/50 p-4">
        <h1 className="text-2xl font-bold">Analytics & Performance</h1>
        <p className="text-muted-foreground">
          AI-driven insights and model performance metrics
        </p>
      </div>

      {/* Key Metrics */}
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
        <ModelPerformanceCard />
        <RiskDistributionPie />
        <RiskPredictionAccuracy />
        <FeatureImportanceChart />
        <InterventionOutcomes />
        <PatientOutcomesTimeline />
      </div>

      {/* Clinical Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Impact Summary</CardTitle>
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
    </div>
  );
}
