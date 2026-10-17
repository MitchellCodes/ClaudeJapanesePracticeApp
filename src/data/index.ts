import { HIRAGANA, KATAKANA } from './kana'
import { KANJI } from './kanji'
import { VOCAB } from './vocab'
import type { ItemType, StudyItem } from './types'

export * from './types'

export const ITEMS_BY_TYPE: Record<ItemType, StudyItem[]> = {
  hiragana: HIRAGANA,
  katakana: KATAKANA,
  kanji: KANJI,
  word: VOCAB,
}

export const ALL_ITEMS: StudyItem[] = [...HIRAGANA, ...KATAKANA, ...KANJI, ...VOCAB]
