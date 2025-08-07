import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, you'd use MongoDB
let forms: any[] = []

export async function GET() {
  return NextResponse.json(forms)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    const newForm = {
      _id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      responses: 0
    }
    
    forms.push(newForm)
    
    return NextResponse.json(newForm, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    )
  }
}
