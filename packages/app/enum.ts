export enum RoundEndReason {
  RoundEndReasonStillInProgress = 0,
  RoundEndReasonTargetBombed = 1,
  RoundEndReasonVIPEscaped = 2,
  RoundEndReasonVIPKilled = 3,
  RoundEndReasonTerroristsEscaped = 4,
  RoundEndReasonCTStoppedEscape = 5,
  RoundEndReasonTerroristsStopped = 6,
  RoundEndReasonBombDefused = 7,
  RoundEndReasonCTWin = 8,
  RoundEndReasonTerroristsWin = 9,
  RoundEndReasonDraw = 10,
  RoundEndReasonHostagesRescued = 11,
  RoundEndReasonTargetSaved = 12,
  RoundEndReasonHostagesNotRescued = 13,
  RoundEndReasonTerroristsNotEscaped = 14,
  RoundEndReasonVIPNotEscaped = 15,
  RoundEndReasonGameStart = 16,
  RoundEndReasonTerroristsSurrender = 17,
  RoundEndReasonCTSurrender = 18,
  RoundEndReasonTerroristsPlanted = 19,
  RoundEndReasonCTsReachedHostage = 20,
}