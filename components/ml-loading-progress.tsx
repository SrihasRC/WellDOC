"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Loader2 } from 'lucide-react'

interface LoadingStep {
  id: string
  label: string
  duration: number
  completed: boolean
}

interface MLLoadingProgressProps {
  isLoading: boolean
}

export function MLLoadingProgress({ isLoading }: MLLoadingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const steps = React.useMemo((): LoadingStep[] => [
    { id: 'validation', label: 'Validating clinical data...', duration: 300, completed: false },
    { id: 'preprocessing', label: 'Preprocessing patient features...', duration: 400, completed: false },
    { id: 'inference', label: 'Running XGBoost model inference...', duration: 500, completed: false },
    { id: 'shap', label: 'Computing SHAP explanations...', duration: 600, completed: false },
    { id: 'recommendations', label: 'Generating clinical recommendations...', duration: 400, completed: false },
  ], [])

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    let totalTime = 0
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)

    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        
        // Animate progress for current step
        const stepDuration = steps[i].duration
        const stepInterval = stepDuration / 20 // 20 updates per step
        
        for (let j = 0; j <= 20; j++) {
          const stepProgress = (totalTime + (j * stepDuration / 20)) / totalDuration * 100
          setProgress(stepProgress)
          await new Promise(resolve => setTimeout(resolve, stepInterval))
        }
        
        totalTime += stepDuration
        steps[i].completed = true
      }
      
      setProgress(100)
    }

    runSteps()
  }, [isLoading, steps])

  if (!isLoading) return null

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <h3 className="font-medium">AI Model Processing</h3>
          </div>
          
          <Progress value={progress} className="w-full" />
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-2 text-sm transition-opacity ${
                  index <= currentStep ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : index === currentStep ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted" />
                )}
                <span className={index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-3">
            Processing patient data through production ML pipeline...
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
