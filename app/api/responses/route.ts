import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, you'd use MongoDB
let responses: any[] = []

export async function POST(request: NextRequest) {
  try {
    const responseData = await request.json()
    
    const newResponse = {
      _id: Date.now().toString(),
      ...responseData,
      submittedAt: new Date().toISOString()
    }
    
    responses.push(newResponse)
    
    return NextResponse.json(newResponse, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const formId = searchParams.get('formId')
  
  if (formId) {
    const formResponses = responses.filter(r => r.formId === formId)
    return NextResponse.json(formResponses)
  }
  
  return NextResponse.json(responses)
}
