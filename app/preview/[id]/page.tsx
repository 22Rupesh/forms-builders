"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import Link from "next/link"
import { CategorizeQuestion } from "@/components/questions/categorize-question"
import { ClozeQuestion } from "@/components/questions/cloze-question"
import { ComprehensionQuestion } from "@/components/questions/comprehension-question"

// Mock form data
const mockForm = {
  title: "Sample Assessment Form",
  description: "A comprehensive form with categorize, cloze, and comprehension questions",
  headerImage: "/placeholder.svg?height=200&width=600&text=Assessment+Form+Header",
  questions: [
    {
      id: "1",
      type: "categorize",
      title: "Categorize the following animals",
      image: "/placeholder.svg?height=200&width=400&text=Animal+Categories",
      data: {
        categories: ["Mammals", "Birds", "Fish"],
        items: ["Dog", "Eagle", "Salmon", "Cat", "Parrot", "Shark", "Elephant", "Penguin"]
      }
    },
    {
      id: "2",
      type: "cloze",
      title: "Complete the sentence",
      data: {
        text: "The ___ is the largest planet in our ___ system, and it has more than ___ moons.",
        blanks: ["Jupiter", "solar", "70"]
      }
    },
    {
      id: "3",
      type: "comprehension",
      title: "Reading Comprehension",
      data: {
        passage: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate change is a natural phenomenon, scientific evidence shows that human activities have been the main driver of climate change since the 1800s. The burning of fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures.",
        questions: [
          {
            question: "What is the main driver of climate change since the 1800s?",
            options: ["Natural phenomena", "Human activities", "Solar radiation", "Ocean currents"],
            correct: 1
          },
          {
            question: "How do greenhouse gases affect Earth's temperature?",
            options: ["They cool the planet", "They trap heat like a blanket", "They reflect sunlight", "They have no effect"],
            correct: 1
          }
        ]
      }
    }
  ]
}

export default function FormPreview({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = mockForm
  const progress = ((currentQuestion + 1) / form.questions.length) * 100

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestion < form.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitForm = async () => {
    // Here you would submit to your backend
    console.log('Submitting answers:', answers)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Form Submitted!</h2>
            <p className="text-green-600 mb-4">Thank you for completing the assessment.</p>
            <Link href="/">
              <Button>Back to Forms</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = form.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Forms
          </Link>
          
          {form.headerImage && (
            <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 overflow-hidden">
              <img 
                src={form.headerImage || "/placeholder.svg"} 
                alt="Form header" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{form.title}</h1>
          <p className="text-slate-600">{form.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {form.questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {currentQ.type === 'categorize' && (
              <CategorizeQuestion
                question={currentQ}
                onAnswer={(answer) => handleAnswer(currentQ.id, answer)}
              />
            )}
            {currentQ.type === 'cloze' && (
              <ClozeQuestion
                question={currentQ}
                onAnswer={(answer) => handleAnswer(currentQ.id, answer)}
              />
            )}
            {currentQ.type === 'comprehension' && (
              <ComprehensionQuestion
                question={currentQ}
                onAnswer={(answer) => handleAnswer(currentQ.id, answer)}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === form.questions.length - 1 ? (
            <Button onClick={submitForm} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Submit Form
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
