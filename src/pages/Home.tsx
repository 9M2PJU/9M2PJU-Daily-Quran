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
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-white shadow-lg">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Assalamu Alaikum</h2>
                    <p className="text-emerald-50 mb-6 max-w-lg">
                        Connect with the Holy Quran daily. Read, listen, and reflect upon the verses of Allah.
                    </p>

                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-200" />
                        <input
                            type="text"
                            placeholder="Search Surah by name or number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-emerald-100/70 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
