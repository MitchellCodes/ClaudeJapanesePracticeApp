export type ItemType = 'hiragana' | 'katakana' | 'kanji' | 'word'

export interface StudyItem {
  /** Stable id used as the stats key. Never change once released. */
  id: string
  type: ItemType
  /** The Japanese text shown to the learner. */
  jp: string
  /** Kana reading, for kanji and words written with kanji. */
  reading?: string
  romaji: string
  /** English meaning. Empty for kana. */
  en: string
  /** Sub-grouping inside a library tab. */
  group?: string
}

export const TYPE_LABELS: Record<ItemType, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  kanji: 'Kanji',
  word: 'Words',
}
