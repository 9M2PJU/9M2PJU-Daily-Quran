import React, { useEffect, useState } from 'react';
import { getSurahs, type Surah } from '../services/api';
import SurahCard from '../components/SurahCard';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Home: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const data = await getSurahs();
                setSurahs(data);
                setFilteredSurahs(data);
            } catch (error) {
                console.error('Failed to fetch surahs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
    }, []);

    useEffect(() => {
        const query = search.toLowerCase();
        const filtered = surahs.filter(
            (s) =>
                s.name_simple.toLowerCase().includes(query) ||
                s.translated_name.name.toLowerCase().includes(query) ||
                String(s.id).includes(query)
        );
        setFilteredSurahs(filtered);
    }, [search, surahs]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 md:p-10 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 md:w-80 md:h-80 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 md:w-56 md:h-56 bg-yellow-400 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-4 md:space-y-6">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight">Assalamu Alaikum</h2>
                        <p className="text-emerald-50 text-sm md:text-lg max-w-lg mx-auto opacity-90 leading-relaxed md:leading-relaxed">
                            Connect with the Holy Quran daily. Read, listen, and reflect upon the verses of Allah.
                        </p>
                    </div>

                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100" />
                        <input
                            type="text"
                            placeholder="Search Surah by name or number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-emerald-100/70 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all shadow-inner text-sm md:text-base"
                        />
                    </div>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
                {filteredSurahs.map((surah) => (
                    <motion.div key={surah.id} variants={item}>
                        <SurahCard surah={surah} />
                    </motion.div>
                ))}
            </motion.div>

            {filteredSurahs.length === 0 && (
                <div className="text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
                    No Surah found matching "{search}"
                </div>
            )}
        </div>
    );
};

export default Home;
