export const wordResponseMapper = wordData => ({
    id: wordData._id,
    word: wordData.word,
    translate: wordData.translate,
    progress: wordData.progress,
    isFavorite: wordData.isFavorite,
    isLearned: wordData.isLearned,
    lastUpdate: wordData.lastUpdate
});
