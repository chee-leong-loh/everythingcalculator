'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, Share2, Lock, MoreHorizontal, Loader2, Send } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function Workbench() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const prompt = searchParams.get('prompt') || ''

  const [annualSpending, setAnnualSpending] = useState(40000)
  const [currentPortfolio, setCurrentPortfolio] = useState(500000)
  const [annualSavings, setAnnualSavings] = useState(50000)
  const [withdrawalRate, setWithdrawalRate] = useState(4.0)

  // Scenario B state
  const [annualSpendingB, setAnnualSpendingB] = useState(40000)
  const [currentPortfolioB, setCurrentPortfolioB] = useState(500000)
  const [annualSavingsB, setAnnualSavingsB] = useState(50000)
  const [withdrawalRateB, setWithdrawalRateB] = useState(4.0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?auth=required')
    }
  }, [user, loading, router])

  if (loading) return <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex items-center justify-center">Loading...</div>
  if (!user) return null

  // Fake chart data
  const chartData = Array.from({ length: 40 }, (_, i) => ({
    year: i + 1,
    portfolio: Math.round((currentPortfolio * Math.pow(1.07, i)) / 1000000 * 100) / 100, // in millions
    portfolioA: Math.round((currentPortfolio * Math.pow(1.07, i)) / 1000000 * 100) / 100,
    portfolioB: Math.round((currentPortfolioB * Math.pow(1.07, i)) / 1000000 * 100) / 100
  }))

  const fireNumber = Math.round(annualSpending / (withdrawalRate / 100))
  const yearsToFire = Math.max(0, Math.round((fireNumber - currentPortfolio) / annualSavings))

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#18181b] border-r border-[#27272a] flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold">∞ Everything Calculator</Link>
        </div>
        <div className="px-6 pb-4">
          <Button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white">New Calculator</Button>
        </div>
        <div className="px-6 pb-4">
          <Textarea
            value={decodeURIComponent(prompt)}
            placeholder="Describe your calculation..."
            className="min-h-20 bg-[#09090b] border-[#27272a] text-[#fafafa] placeholder-[#a1a1aa] resize-y"
          />
          <Button variant="outline" className="w-full mt-2 border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">Regenerate →</Button>
        </div>
        <Separator className="bg-[#27272a]" />
        <div className="p-6">
          <h3 className="text-sm font-semibold text-[#a1a1aa] mb-4">My Saved Tools</h3>
          <div className="space-y-2">
            {[
              { title: 'FIRE Runway Calculator', category: 'Finance', date: '2 days ago', active: true },
              { title: 'Mortgage Affordability', category: 'Finance', date: '1 week ago', active: false },
              { title: 'Macro Split Tracker', category: 'Health', date: '2 weeks ago', active: false },
              { title: 'SaaS Churn Rate', category: 'Business', date: '1 month ago', active: false },
            ].map((tool, index) => (
              <div key={index} className={`p-3 rounded-lg cursor-pointer ${tool.active ? 'border-l-4 border-[#a855f7] bg-[#27272a]' : 'hover:bg-[#27272a]'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tool.title}</p>
                    <Badge variant="outline" className="text-xs mt-1 border-[#27272a] text-[#a1a1aa]">{tool.category}</Badge>
                  </div>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-1">{tool.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-[#27272a]">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.user_metadata?.full_name?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
              <Link href="/dashboard" className="text-xs text-[#a855f7] hover:underline">Dashboard →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Main Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading State - commented out for now */}
        {/* <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#a855f7] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Building your calculator...</h2>
            <div className="space-y-2 text-[#a1a1aa]">
              <p>✓ Understanding your calculation</p>
              <p>✓ Defining inputs and formulas</p>
              <p>⟳ Generating interactive components...</p>
            </div>
          </div>
        </div> */}

        {/* Tool Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">FIRE Runway Calculator</h2>
              <Badge className="mt-2 bg-[#a855f7] text-white">Finance</Badge>
              <p className="text-[#a1a1aa] mt-2">Calculate how long it will take to reach Financial Independence and Retire Early (FIRE).</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">
                <Lock className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Card */}
            <Card className="bg-[#18181b] border-[#27272a]">
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Spending</label>
                  <input
                    type="range"
                    min="20000"
                    max="200000"
                    step="1000"
                    value={annualSpending}
                    onChange={(e) => setAnnualSpending(Number(e.target.value))}
                    className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-right text-[#a855f7] font-semibold mt-1">${annualSpending.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Portfolio</label>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={currentPortfolio}
                    onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                    className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-right text-[#a855f7] font-semibold mt-1">${currentPortfolio.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Savings</label>
                  <Input
                    type="number"
                    value={annualSavings}
                    onChange={(e) => setAnnualSavings(Number(e.target.value))}
                    className="bg-[#09090b] border-[#27272a] text-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Safe Withdrawal Rate</label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="0.1"
                    value={withdrawalRate}
                    onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                    className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-right text-[#a855f7] font-semibold mt-1">{withdrawalRate}%</div>
                </div>
              </CardContent>
            </Card>

            {/* Output Card */}
            <Card className="bg-[#18181b] border-[#27272a]">
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#a1a1aa]">Your FIRE Number</p>
                    <p className="text-3xl font-bold text-[#a855f7]">${fireNumber.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a1a1aa]">Years to FIRE</p>
                    <p className="text-3xl font-bold text-[#a855f7]">{yearsToFire} years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <Card className="mt-8 bg-[#18181b] border-[#27272a]">
            <CardHeader>
              <CardTitle>Portfolio Growth Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis dataKey="year" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" label={{ value: 'Portfolio ($M)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    labelStyle={{ color: '#fafafa' }}
                    itemStyle={{ color: '#a855f7' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="portfolioA"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={false}
                    filter="drop-shadow(0 0 6px rgba(168, 85, 247, 0.3))"
                    name="Scenario A"
                  />
                  <Line
                    type="monotone"
                    dataKey="portfolioB"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={false}
                    filter="drop-shadow(0 0 6px rgba(34, 211, 238, 0.3))"
                    name="Scenario B"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feature Tabs */}
          <Tabs defaultValue="split-view" className="mt-8">
            <TabsList className="grid w-full grid-cols-3 bg-[#18181b] border-[#27272a]">
              <TabsTrigger value="split-view" className="data-[state=active]:bg-[#a855f7]">Split View</TabsTrigger>
              <TabsTrigger value="show-work" className="data-[state=active]:bg-[#a855f7]">Show Your Work</TabsTrigger>
              <TabsTrigger value="talk-edit" className="data-[state=active]:bg-[#a855f7]">Talk to Edit</TabsTrigger>
            </TabsList>

            <TabsContent value="split-view" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scenario A */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardHeader>
                    <CardTitle>Scenario A</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Annual Spending</label>
                      <input
                        type="range"
                        min="20000"
                        max="200000"
                        step="1000"
                        value={annualSpending}
                        onChange={(e) => setAnnualSpending(Number(e.target.value))}
                        className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-right text-[#a855f7] font-semibold mt-1">${annualSpending.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Portfolio</label>
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        step="10000"
                        value={currentPortfolio}
                        onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                        className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-right text-[#a855f7] font-semibold mt-1">${currentPortfolio.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Annual Savings</label>
                      <Input
                        type="number"
                        value={annualSavings}
                        onChange={(e) => setAnnualSavings(Number(e.target.value))}
                        className="bg-[#09090b] border-[#27272a] text-[#fafafa]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Safe Withdrawal Rate</label>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        step="0.1"
                        value={withdrawalRate}
                        onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                        className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-right text-[#a855f7] font-semibold mt-1">{withdrawalRate}%</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario B */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Scenario B
                      <Button variant="outline" size="sm" onClick={() => {
                        setAnnualSpendingB(annualSpending)
                        setCurrentPortfolioB(currentPortfolio)
                        setAnnualSavingsB(annualSavings)
                        setWithdrawalRateB(withdrawalRate)
                      }} className="border-[#27272a] text-[#fafafa] hover:bg-[#27272a]">
                        Reset B to match A
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Annual Spending</label>
                      <input
                        type="range"
                        min="20000"
                        max="200000"
                        step="1000"
                        value={annualSpendingB}
                        onChange={(e) => setAnnualSpendingB(Number(e.target.value))}
                        className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-right text-[#22d3ee] font-semibold mt-1">${annualSpendingB.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Portfolio</label>
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        step="10000"
                        value={currentPortfolioB}
                        onChange={(e) => setCurrentPortfolioB(Number(e.target.value))}
                        className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-right text-[#22d3ee] font-semibold mt-1">${currentPortfolioB.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Annual Savings</label>
                      <Input
                        type="number"
                        value={annualSavingsB}
                        onChange={(e) => setAnnualSavingsB(Number(e.target.value))}
                        className="bg-[#09090b] border-[#27272a] text-[#fafafa]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Safe Withdrawal Rate</label>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        step="0.1"
                        value={withdrawalRateB}
                        onChange={(e) => setWithdrawalRateB(Number(e.target.value))}
                        className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-right text-[#22d3ee] font-semibold mt-1">{withdrawalRateB}%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="show-work" className="mt-4">
              <div className="space-y-6">
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardHeader>
                    <CardTitle>FIRE Number</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: katex.renderToString('\\text{FIRE Number} = \\frac{\\text{Annual Spend}}{\\text{Withdrawal Rate}}') }} />
                    <p className="text-[#a1a1aa] mt-2">The total portfolio value you need to retire, based on how much you spend annually and your planned withdrawal rate.</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardHeader>
                    <CardTitle>Years to FIRE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: katex.renderToString('\\text{Years to FIRE} = \\frac{\\text{FIRE Number} - \\text{Current Portfolio}}{\\text{Annual Savings}}') }} />
                    <p className="text-[#a1a1aa] mt-2">The number of years it will take to reach your FIRE number, assuming consistent annual savings.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="talk-edit" className="mt-4">
              <Card className="bg-[#18181b] border-[#27272a] h-96 flex flex-col">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-[#a855f7] text-white p-3 rounded-lg max-w-xs">
                      Can you add inflation as a variable?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[#27272a] text-[#fafafa] p-3 rounded-lg max-w-xs">
                      Sure! I've added an 'Expected Inflation Rate' slider (default 3%). The FIRE number and years calculations now account for real vs nominal returns.
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t border-[#27272a]">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask me to change anything... e.g. 'Add inflation rate as a variable'"
                      className="flex-1 bg-[#09090b] border-[#27272a] text-[#fafafa] placeholder-[#a1a1aa]"
                    />
                    <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}