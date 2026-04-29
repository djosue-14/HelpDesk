export interface ScoreTransactionDto {
  scoreTransactionId: number
  userId: string | null
  ticketId: number
  points: number
  reason: string | null
  createdAt: string
}

export interface UserScoreDto {
  userScoreId: number
  userId: string | null
  currentPoints: number
  level: string | null
  scoreTransactions: ScoreTransactionDto[] | null
}
