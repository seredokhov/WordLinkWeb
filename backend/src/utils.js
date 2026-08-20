export const wordResponseMapper = wordData => ({
    id: wordData._id,
    word: wordData.word,
    translate: wordData.translate,
    progress: wordData.progress,
    isFavorite: wordData.isFavorite,
    isLearned: wordData.isLearned,
    lastUpdate: wordData.lastUpdate
});

export const defaultDictionaryProgress = () => ({
    bestCorrectAnswers: 0,
    bestProgressPercent: 0,
    lastCorrectCount: 0,
    lastTestDate: null
});

export const userDictionaryProgressMapper = (progressData) => ({
    bestCorrectAnswers: progressData.bestCorrectAnswers,
    bestProgressPercent: progressData.bestProgressPercent,
    lastCorrectCount: progressData.lastCorrectCount,
    lastTestDate: progressData.lastTestDate
});

export const userDictionaryResponseMapper = (progressData, dictionary = null) => ({
    id: progressData._id,
    userId: progressData.userId,
    dictionaryId: progressData.dictionaryId,
    dictionaryTitle: dictionary?.title ?? null,
    dictionaryTheme: dictionary?.theme || dictionary?.title || null,
    totalWords: progressData.totalWords,
    ...userDictionaryProgressMapper(progressData)
});
