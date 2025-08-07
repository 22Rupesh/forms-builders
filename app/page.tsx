"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Link from "next/link"

interface Form {
  _id: string
  title: string
  description: string
  headerImage?: string
  questions: any[]
  createdAt: string
  responses: number
}

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([
    {
      _id: "1",
      title: "Sample Assessment Form",
      description: "A comprehensive form with categorize, cloze, and comprehension questions",
      headerImage: "/placeholder.svg?height=200&width=400&text=Sample+Form+Header",
      questions: [],
      createdAt: "2024-01-15",
      responses: 12
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Form Builder</h1>
          <p className="text-slate-600">Create interactive forms with categorize, cloze, and comprehension questions</p>
        </div>

        {/* Create New Form Button */}
        <div className="mb-8">
          <Link href="/editor">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Create New Form
            </Button>
          </Link>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                {form.headerImage && (
                  <div className="w-full h-32 bg-slate-200 rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={form.headerImage || "/placeholder.svg"} 
                      alt="Form header" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>Created: {form.createdAt}</span>
                  <span>{form.responses} responses</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/editor/${form._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/preview/${form._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {forms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No forms yet</h3>
            <p className="text-slate-500 mb-4">Create your first form to get started</p>
            <Link href="/editor">
              <Button>Create New Form</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
