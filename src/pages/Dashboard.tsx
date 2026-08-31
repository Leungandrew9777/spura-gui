// spura-gui/src/pages/Dashboard.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeagueSelector } from "@/components/LeagueSelector"
import { Progress } from "@/components/ui/progress"
import { useWebSocket } from "@/hooks/useWebSocket"
import { api } from "@/config/api"
import { leagues } from "@/config/leagues"

interface LivePrediction {
  player: number
  player_name: string | null
  probability: number
  fair_odds: number
  market_odds: number
  ev: number
}

export default function Dashboard() {
  const [selectedLeague, setSelectedLeague] = useState<string>(Object.keys(leagues)[0])
  const [syncTaskId, setSyncTaskId] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<LivePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { lastMessage, isConnected } = useWebSocket(syncTaskId)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const load = async () => {
      try {
        const res = await fetch(`${api.predictions(selectedLeague)}&min_ev=-1`)
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        if (!cancelled) setPredictions(data.predictions || [])
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load predictions')
          setPredictions([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [selectedLeague])

  const handleLeagueChange = (league: string) => {
    setSelectedLeague(league)
    setSyncTaskId(null)
  }

  const handleSyncData = async () => {
    try {
      const response = await fetch(api.syncData(selectedLeague, '2023-24'), { method: 'POST' })
      const data = await response.json()
      setSyncTaskId(data.task_id)
    } catch (e) {
      console.error('Sync failed:', e)
      setError(e instanceof Error ? e.message : 'Sync failed')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Spura</h1>
        <p className="text-gray-600">Multi-League Player Goalscorer Prediction Dashboard</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* League Controls */}
        <Card>
          <CardHeader>
            <CardTitle>League Controls</CardTitle>
            <CardDescription>Select league and trigger operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LeagueSelector onSelect={handleLeagueChange} selected={selectedLeague} />

            <div className="space-y-2">
              <button
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                onClick={handleSyncData}
                disabled={isConnected}
              >
                {isConnected ? 'Syncing...' : 'Sync Data'}
              </button>

              {syncTaskId && (
                <div className="text-sm text-gray-600">
                  Task ID: {syncTaskId}
                  {lastMessage && (
                    <Progress value={JSON.parse(lastMessage).progress || 0} className="mt-2" />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Predictions Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Predictions & Value Bets</CardTitle>
            <CardDescription>
              Upcoming fixtures with predicted anytime goalscorer probabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-600 mb-4">Failed to load: {error} (is the API running at {api.baseUrl}?)</p>}
            {loading ? (
              <p className="text-gray-500">Loading predictions...</p>
            ) : predictions.length === 0 ? (
              <p className="text-gray-500">
                No value predictions available for this league. Try syncing data and recalibrating the model.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2">Player</th>
                      <th className="text-left px-4 py-2">Probability</th>
                      <th className="text-left px-4 py-2">Fair Odds</th>
                      <th className="text-left px-4 py-2">Market Odds</th>
                      <th className="text-left px-4 py-2">EV%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {predictions.map((pred) => (
                      <tr key={pred.player}>
                        <td className="px-4 py-2">{pred.player_name ?? `#${pred.player}`}</td>
                        <td className="px-4 py-2">{(pred.probability * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2">{pred.fair_odds.toFixed(2)}</td>
                        <td className="px-4 py-2">{pred.market_odds.toFixed(2)}</td>
                        <td className={`px-4 py-2 font-medium ${pred.ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(pred.ev * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
