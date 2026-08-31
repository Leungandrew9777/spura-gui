// spura-gui/src/components/LeagueSelector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leagues } from "@/config/leagues"

export function LeagueSelector({ onSelect, selected }: {
  onSelect: (league: string) => void
  selected: string
}) {
  return (
    <Select onValueChange={onSelect} defaultValue={selected}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select League" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(leagues).map(([code, league]) => (
          <SelectItem key={code} value={code}>
            {league.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}