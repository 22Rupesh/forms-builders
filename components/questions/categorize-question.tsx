"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Upload } from 'lucide-react'

interface CategorizeQuestionProps {
  question: any
  onChange?: (updates: any) => void
  isEditing?: boolean
  onAnswer?: (answer: any) => void
}

export function CategorizeQuestion({ question, onChange, isEditing = false, onAnswer }: CategorizeQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState<Record<string, string[]>>({})

  const addCategory = () => {
    const newCategories = [...question.data.categories, `Category ${question.data.categories.length + 1}`]
    onChange?.({ data: { ...question.data, categories: newCategories } })
  }

  const addItem = () => {
    const newItems = [...question.data.items, `Item ${question.data.items.length + 1}`]
    onChange?.({ data: { ...question.data, items: newItems } })
  }

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...question.data.categories]
    newCategories[index] = value
    onChange?.({ data: { ...question.data, categories: newCategories } })
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...question.data.items]
    newItems[index] = value
    onChange?.({ data: { ...question.data, items: newItems } })
  }

  const removeCategory = (index: number) => {
    const newCategories = question.data.categories.filter((_: any, i: number) => i !== index)
    onChange?.({ data: { ...question.data, categories: newCategories } })
  }

  const removeItem = (index: number) => {
    const newItems = question.data.items.filter((_: any, i: number) => i !== index)
    onChange?.({ data: { ...question.data, items: newItems } })
  }

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDrop = (category: string) => {
    if (draggedItem && !isEditing) {
      const newAnswer = { ...userAnswer }
      if (!newAnswer[category]) {
        newAnswer[category] = []
      }
      if (!newAnswer[category].includes(draggedItem)) {
        newAnswer[category].push(draggedItem)
      }
      setUserAnswer(newAnswer)
      onAnswer?.(newAnswer)
    }
    setDraggedItem(null)
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
          <div className="flex items-center justify-between mb-2">
            <Label>Categories</Label>
            <Button onClick={addCategory} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </Button>
          </div>
          <div className="space-y-2">
            {question.data.categories.map((category: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  placeholder="Category name"
                />
                <Button
                  onClick={() => removeCategory(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Items to Categorize</Label>
            <Button onClick={addItem} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          <div className="space-y-2">
            {question.data.items.map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder="Item name"
                />
                <Button
                  onClick={() => removeItem(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
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

      <p className="text-slate-600">Drag and drop items into the correct categories:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Items to categorize */}
        <div>
          <h4 className="font-medium mb-2">Items</h4>
          <div className="space-y-2">
            {question.data.items.map((item: string, index: number) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="p-3 bg-blue-100 border border-blue-200 rounded cursor-move hover:bg-blue-200 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            {question.data.categories.map((category: string, index: number) => (
              <Card
                key={index}
                className="min-h-[100px] border-dashed border-2 border-slate-300"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(category)}
              >
                <CardContent className="p-3">
                  <h5 className="font-medium text-slate-700 mb-2">{category}</h5>
                  <div className="space-y-1">
                    {userAnswer[category]?.map((item: string, itemIndex: number) => (
                      <div key={itemIndex} className="p-2 bg-green-100 border border-green-200 rounded text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
