import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Simple LLM simulation using pattern matching and responses
const generateResponse = (messages: Message[]): string => {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''

  // Greeting patterns
  if (/^(hi|hello|hey|greetings)/i.test(lastMessage)) {
    return "Hello! I'm an AI assistant. How can I help you today?"
  }

  // Question about the assistant
  if (/(who are you|what are you|your name)/i.test(lastMessage)) {
    return "I'm an AI language model assistant designed to help answer questions and have conversations. I can assist with a wide variety of topics!"
  }

  // How are you
  if (/(how are you|how's it going)/i.test(lastMessage)) {
    return "I'm functioning well, thank you for asking! I'm here and ready to help you with any questions or tasks you might have."
  }

  // Math questions
  if (/what is \d+[\s\+\-\*\/]+\d+/i.test(lastMessage)) {
    try {
      const match = lastMessage.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/)
      if (match) {
        const [, a, op, b] = match
        const num1 = parseInt(a)
        const num2 = parseInt(b)
        let result = 0

        switch (op) {
          case '+': result = num1 + num2; break
          case '-': result = num1 - num2; break
          case '*': result = num1 * num2; break
          case '/': result = num2 !== 0 ? num1 / num2 : NaN; break
        }

        if (!isNaN(result)) {
          return `The answer is ${result}.`
        }
      }
    } catch (e) {
      // Fall through to default response
    }
  }

  // Help/capabilities
  if (/(what can you do|help me|capabilities)/i.test(lastMessage)) {
    return "I can help with various tasks including:\n\n• Answering general questions\n• Providing explanations\n• Having conversations\n• Offering suggestions\n• Basic calculations\n• And much more!\n\nJust ask me anything you'd like to know!"
  }

  // Thank you
  if (/(thank you|thanks|appreciate)/i.test(lastMessage)) {
    return "You're very welcome! If you have any other questions or need further assistance, feel free to ask!"
  }

  // Goodbye
  if (/(bye|goodbye|see you|farewell)/i.test(lastMessage)) {
    return "Goodbye! It was nice chatting with you. Come back anytime you need assistance!"
  }

  // Programming questions
  if (/(programming|code|coding|javascript|python|react)/i.test(lastMessage)) {
    return "I'd be happy to help with programming! I can assist with various programming languages and concepts including JavaScript, Python, React, and more. Could you provide more details about what you'd like to know?"
  }

  // Weather (simulated)
  if (/(weather|temperature|forecast)/i.test(lastMessage)) {
    return "I don't have access to real-time weather data, but I can suggest checking weather.com or your local weather service for current conditions and forecasts!"
  }

  // Time/date
  if (/(what time|what date|current time)/i.test(lastMessage)) {
    const now = new Date()
    return `The current date and time is: ${now.toLocaleString()}`
  }

  // Default responses based on question type
  if (lastMessage.includes('?')) {
    const responses = [
      "That's an interesting question! Based on what you're asking, I'd say it depends on the specific context and requirements. Could you provide more details?",
      "Great question! The answer can vary, but generally speaking, it's important to consider multiple factors. What specific aspect are you most interested in?",
      "I appreciate your curiosity! To give you the most accurate answer, I'd need a bit more context about your specific situation.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Default conversational responses
  const responses = [
    "That's interesting! Could you tell me more about that?",
    "I understand. Is there anything specific you'd like to know or discuss about this topic?",
    "Thanks for sharing that with me. How can I assist you further?",
    "I see. What would you like to explore or learn more about?",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Generate response
    const responseMessage = generateResponse(messages)

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
