import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Loader } from '../../components/common/Loader'
import { Send, MessageCircle, Save } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SavedInsight {
  id: string
  title: string
  query: string
  response: string
  savedAt: Date
}

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your SupplySense AI Assistant. I can help you analyze your supply chain data, predict trends, and optimize your operations. What would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([
    {
      id: '1',
      title: 'Supplier Performance Analysis',
      query: 'Which suppliers have the highest reliability scores?',
      response: 'Tech Supply Ltd leads with 97% reliability, followed by Global Parts Inc at 94%...',
      savedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Inventory Forecast',
      query: 'Predict stockout risks for next 30 days',
      response: 'Based on current trends, 3 SKUs will likely go below reorder point...',
      savedAt: new Date(Date.now() - 172800000),
    },
  ])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated AI response. In production, this would call your Python AI service with the analyzed data.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveInsight = () => {
    if (messages.length < 2) return

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
    const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')

    if (lastUserMessage && lastAssistantMessage) {
      const newInsight: SavedInsight = {
        id: Date.now().toString(),
        title: lastUserMessage.content.substring(0, 50) + '...',
        query: lastUserMessage.content,
        response: lastAssistantMessage.content,
        savedAt: new Date(),
      }
      setSavedInsights((prev) => [newInsight, ...prev])
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Widget title="AI Assistant" className="h-full">
              <div className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                        <Loader />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask me anything about your supply chain..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !loading) {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={loading || !inputValue.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Widget>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions */}
            <Widget title="Actions">
              <Button onClick={handleSaveInsight} className="w-full flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Insight
              </Button>
            </Widget>

            {/* Saved Insights */}
            <Widget title="Saved Insights">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedInsights.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No saved insights yet</p>
                ) : (
                  savedInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition"
                    >
                      <h4 className="font-semibold text-sm text-gray-900">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{insight.query.substring(0, 40)}...</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {insight.savedAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Widget>

            {/* Quick Questions */}
            <Widget title="Quick Questions">
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <MessageCircle className="w-3 h-3 inline mr-2" />
                  Predict next month demand
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <MessageCircle className="w-3 h-3 inline mr-2" />
                  Analyze supplier risks
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <MessageCircle className="w-3 h-3 inline mr-2" />
                  Optimize inventory
                </button>
              </div>
            </Widget>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
