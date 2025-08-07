"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Upload } from 'lucide-react'

interface ComprehensionQuestionProps {
  question: any
  onChange?: (updates: any) => void
  isEditing?: boolean
  onAnswer?: (answer: any) => void
}

export function ComprehensionQuestion({ question, onChange, isEditing = false, onAnswer }: ComprehensionQuestionProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})

  const addSubQuestion = () => {
    const newQuestions = [
      ...question.data.questions,
      {
        question: "New question?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      }
    ]
    onChange?.({ data: { ...question.data, questions: newQuestions } })
  }

  const updateSubQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...question.data.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    onChange?.({ data: { ...question.data, questions: newQuestions } })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...question.data.questions]
    const newOptions = [...newQuestions[questionIndex].options]
    newOptions[optionIndex] = value
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions }
    onChange?.({ data: { ...question.data, questions: newQuestions } })
  }

  const removeSubQuestion = (index: number) => {
    const newQuestions = question.data.questions.filter((_: any, i: number) => i !== index)
    onChange?.({ data: { ...question.data, questions: newQuestions } })
  }

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = { ...userAnswers, [questionIndex]: optionIndex }
    setUserAnswers(newAnswers)
    onAnswer?.(newAnswers)
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
          <Label htmlFor="passage">Reading Passage</Label>
          <Textarea
            id="passage"
            value={question.data.passage}
            onChange={(e) => onChange?.({ data: { ...question.data, passage: e.target.value } })}
            placeholder="Enter the reading passage"
            rows={6}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Comprehension Questions</Label>
            <Button onClick={addSubQuestion} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Question
            </Button>
          </div>

          <div className="space-y-4">
            {question.data.questions.map((subQ: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Question {index + 1}</Label>
                  <Button
                    onClick={() => removeSubQuestion(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <Input
                  value={subQ.question}
                  onChange={(e) => updateSubQuestion(index, 'question', e.target.value)}
                  placeholder="Enter question"
                  className="mb-2"
                />

                <div className="space-y-2">
                  {subQ.options.map((option: string, optionIndex: number) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={subQ.correct === optionIndex}
                        onChange={() => updateSubQuestion(index, 'correct', optionIndex)}
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{question.title}</h3>
      
      {question.image && (
        <div className="w-full h-48 bg-slate-200 rounded overflow-hidden">
          <img src={question.image || "/placeholder.svg"} alt="Question" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4 bg-slate-50 rounded-lg">
        <h4 className="font-medium mb-2">Reading Passage:</h4>
        <p className="text-slate-700 leading-relaxed">{question.data.passage}</p>
      </div>

      <div className="space-y-4">
        {question.data.questions.map((subQ: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg">
            <h5 className="font-medium mb-3">{index + 1}. {subQ.question}</h5>
            <RadioGroup
              value={userAnswers[index]?.toString()}
              onValueChange={(value) => handleAnswerChange(index, parseInt(value))}
            >
              {subQ.options.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={optionIndex.toString()} id={`q${index}-${optionIndex}`} />
                  <Label htmlFor={`q${index}-${optionIndex}`} className="cursor-pointer">
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  )
}
