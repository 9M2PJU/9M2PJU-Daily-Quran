export const tips = [
    "Reciting Surah Al-Mulk before sleeping is a sunnah that provides protection in the grave. Try setting a reminder for 9:00 PM.",
    "The Prophet (ﷺ) said: 'The best of you are those who learn the Quran and teach it.'",
    "Surah Al-Kahf on Friday illuminates the light between two Fridays.",
    "Recite Ayat al-Kursi after every obligatory prayer to be under Allah's protection.",
    "The Quran is a proof for you or against you. Make it your companion.",
    "Read Surah Al-Ikhlas three times to get the reward of completing the whole Quran.",
    "Make Intention (Niyyah) before reading to maximize your rewards.",
    "Tadabbur (reflection) is the key to unlocking the treasures of the Quran.",
    "Listen to Quran recitation while commuting to fill your time with barakah.",
    "Start with small consistency. Even a few verses a day is better than nothing."
];

export const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
};
