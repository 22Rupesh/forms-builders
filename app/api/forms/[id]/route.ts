import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, you'd use MongoDB
let forms: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const form = forms.find(f => f._id === params.id)
  
  if (!form) {
    return NextResponse.json(
      { error: 'Form not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(form)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const formIndex = forms.findIndex(f => f._id === params.id)
    
    if (formIndex === -1) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }
    
    forms[formIndex] = { ...forms[formIndex], ...updates }
    
    return NextResponse.json(forms[formIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formIndex = forms.findIndex(f => f._id === params.id)
  
  if (formIndex === -1) {
    return NextResponse.json(
      { error: 'Form not found' },
      { status: 404 }
    )
  }
  
  forms.splice(formIndex, 1)
  
  return NextResponse.json({ message: 'Form deleted successfully' })
}
