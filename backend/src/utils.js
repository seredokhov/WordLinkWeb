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
    bestCorrectCount: 0,
    bestProgressPercent: 0,
    lastCorrectCount: 0,
    lastTestDate: null
});

export const userDictionaryProgressMapper = (progressData) => ({
    bestCorrectCount: progressData.bestCorrectCount,
    bestProgressPercent: progressData.bestProgressPercent,
    lastCorrectCount: progressData.lastCorrectCount,
    lastTestDate: progressData.lastTestDate
});

export const userDictionaryResponseMapper = (progressData, dictionaryTitle = null) => ({
    id: progressData._id,
    userId: progressData.userId,
    dictionaryId: progressData.dictionaryId,
    dictionaryTitle,
    totalCount: progressData.totalCount,
    ...userDictionaryProgressMapper(progressData)
});
