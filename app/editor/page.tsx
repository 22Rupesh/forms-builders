"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Eye, Upload, Trash2, GripVertical } from 'lucide-react'
import Link from "next/link"
import { CategorizeQuestion } from "@/components/questions/categorize-question"
import { ClozeQuestion } from "@/components/questions/cloze-question"
import { ComprehensionQuestion } from "@/components/questions/comprehension-question"

interface Question {
  id: string
  type: 'categorize' | 'cloze' | 'comprehension'
  title: string
  image?: string
  data: any
}

export default function FormEditor() {
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [headerImage, setHeaderImage] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("")

  const addQuestion = (type: 'categorize' | 'cloze' | 'comprehension') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: `New ${type} question`,
      data: getDefaultQuestionData(type)
    }
    setQuestions([...questions, newQuestion])
    setSelectedQuestionType("")
  }

  const getDefaultQuestionData = (type: string) => {
    switch (type) {
      case 'categorize':
        return {
          categories: ['Category 1', 'Category 2'],
          items: ['Item 1', 'Item 2', 'Item 3', 'Item 4']
        }
      case 'cloze':
        return {
          text: "The quick brown ___ jumps over the lazy ___.",
          blanks: ['fox', 'dog']
        }
      case 'comprehension':
        return {
          passage: "Enter your passage here...",
          questions: [
            { question: "Sample question?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0 }
          ]
        }
      default:
        return {}
    }
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const saveForm = async () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      headerImage,
      questions
    }
    
    // Here you would save to your backend
    console.log('Saving form:', formData)
    alert('Form saved successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Forms
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Form Editor</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/preview/new">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={saveForm} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Settings Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter form title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="headerImage">Header Image URL</Label>
                  <Input
                    id="headerImage"
                    value={headerImage}
                    onChange={(e) => setHeaderImage(e.target.value)}
                    placeholder="Enter image URL"
                  />
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Label>Add Question</Label>
                  <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="categorize">Categorize</SelectItem>
                      <SelectItem value="cloze">Cloze</SelectItem>
                      <SelectItem value="comprehension">Comprehension</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedQuestionType && (
                    <Button 
                      onClick={() => addQuestion(selectedQuestionType as any)}
                      className="w-full mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add {selectedQuestionType} Question
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            {/* Form Preview Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                {headerImage && (
                  <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={headerImage || "/placeholder.svg"} 
                      alt="Form header" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{formTitle}</h2>
                {formDescription && (
                  <p className="text-slate-600">{formDescription}</p>
                )}
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-500">
                        Question {index + 1} - {question.type}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {question.type === 'categorize' && (
                      <CategorizeQuestion
                        question={question}
                        onChange={(updates) => updateQuestion(question.id, updates)}
                        isEditing={true}
                      />
                    )}
                    {question.type === 'cloze' && (
                      <ClozeQuestion
                        question={question}
                        onChange={(updates) => updateQuestion(question.id, updates)}
                        isEditing={true}
                      />
                    )}
                    {question.type === 'comprehension' && (
                      <ComprehensionQuestion
                        question={question}
                        onChange={(updates) => updateQuestion(question.id, updates)}
                        isEditing={true}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}

              {questions.length === 0 && (
                <Card className="border-dashed border-2 border-slate-300">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plus className="w-12 h-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No questions yet</h3>
                    <p className="text-slate-500 text-center mb-4">
                      Add your first question using the sidebar
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
