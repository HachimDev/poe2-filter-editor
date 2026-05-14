import { parseFilter } from '../utils/filter'
import type { FilterRule } from '../types'

export interface PrebuiltSet {
  id: string
  name: string
  description: string
  rules: FilterRule[]
}

const GOLD_TEXT = `
Show # Gold (Stack>=5000)
  StackSize >= 5000
  BaseType == "Gold"
  SetFontSize 40
  SetTextColor 255 255 255 255
  SetBorderColor 255 255 255 255
  SetBackgroundColor 20 20 0 255
  PlayEffect Orange
  MinimapIcon 1 Yellow Cross

Show # Gold (Stack>=2000)
  StackSize >= 2000
  BaseType == "Gold"
  SetTextColor 255 255 255 255
  SetBorderColor 255 255 255 255
  PlayEffect Orange Temp
  MinimapIcon 1 White Cross

Show # Gold (Stack>=650)
  StackSize >= 650
  BaseType == "Gold"
  SetTextColor 255 255 255 255
  SetBorderColor 255 255 255 255
  PlayEffect Orange Temp

Show # Gold (Stack>=125, Area<=16)
  StackSize >= 125
  BaseType == "Gold"
  AreaLevel <= 16
  SetTextColor 255 255 255 255
  SetBorderColor 255 255 255 255
  PlayEffect Orange Temp

Show # Gold (Stack>=250, Area<=34)
  StackSize >= 250
  BaseType == "Gold"
  AreaLevel <= 34
  SetTextColor 255 255 255 255
  SetBorderColor 255 255 255 255
  PlayEffect Orange Temp

Show # Gold (Stack>=400, Area<=64)
  StackSize >= 400
  BaseType == "Gold"
  AreaLevel <= 64
  SetTextColor 255 255 255 255
  SetBorderColor 255 255 255 255
  PlayEffect Orange Temp

Show # Gold
  BaseType == "Gold"
  SetTextColor 180 180 180
  SetBorderColor 0 0 0 255
  SetBackgroundColor 20 20 0 180
`

export const PREBUILT_SETS: PrebuiltSet[] = [
  {
    id: 'gold',
    name: 'Gold',
    description: 'Tiered gold pickup rules based on stack size and area level. Highlights large stacks prominently and quietly shows the rest.',
    rules: parseFilter(GOLD_TEXT),
  },
]
