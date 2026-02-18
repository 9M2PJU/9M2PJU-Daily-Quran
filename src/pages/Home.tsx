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
        <div className="space-y-6">
            <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search Surah by name or number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                    }}
                />
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
