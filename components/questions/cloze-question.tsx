"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react'

interface ClozeQuestionProps {
  question: any
  onChange?: (updates: any) => void
  isEditing?: boolean
  onAnswer?: (answer: any) => void
}

export function ClozeQuestion({ question, onChange, isEditing = false, onAnswer }: ClozeQuestionProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>([])

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[index] = value
    setUserAnswers(newAnswers)
    onAnswer?.(newAnswers)
  }

  const renderTextWithBlanks = () => {
    const parts = question.data.text.split('___')
    const result = []
    
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>)
      
      if (i < parts.length - 1) {
        result.push(
          <Input
            key={`blank-${i}`}
            className="inline-block w-32 mx-2"
            value={userAnswers[i] || ''}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            placeholder={`Blank ${i + 1}`}
          />
        )
      }
    }
    
    return result
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="question-title">Question Title</Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={(e) => onChange?.({ title: e.target.value })}
            placeholder="Enter question title"
          />
        </div>

        <div>
          <Label>Question Image (Optional)</Label>
          <div className="flex gap-2">
            <Input
              value={question.image || ""}
              onChange={(e) => onChange?.({ image: e.target.value })}
              placeholder="Enter image URL"
            />
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {question.image && (
            <div className="mt-2 w-full h-32 bg-slate-200 rounded overflow-hidden">
              <img src={question.image || "/placeholder.svg"} alt="Question" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="cloze-text">Text with Blanks</Label>
          <Textarea
            id="cloze-text"
            value={question.data.text}
            onChange={(e) => onChange?.({ data: { ...question.data, text: e.target.value } })}
            placeholder="Enter text with ___ for blanks"
            rows={4}
          />
          <p className="text-sm text-slate-500 mt-1">Use ___ to create blanks in your text</p>
        </div>

        <div>
          <Label htmlFor="correct-answers">Correct Answers (comma-separated)</Label>
          <Input
            id="correct-answers"
            value={question.data.blanks?.join(', ') || ''}
            onChange={(e) => onChange?.({ 
              data: { 
                ...question.data, 
                blanks: e.target.value.split(',').map((s: string) => s.trim()) 
              } 
            })}
            placeholder="answer1, answer2, answer3"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{question.title}</h3>
      
      {question.image && (
        <div className="w-full h-48 bg-slate-200 rounded overflow-hidden">
          <img src={question.image || "/placeholder.svg"} alt="Question" className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-slate-600">Fill in the blanks:</p>

      <div className="text-lg leading-relaxed p-4 bg-slate-50 rounded-lg">
        {renderTextWithBlanks()}
      </div>
    </div>
  )
}
