import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
// ... other imports
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahPage from './pages/Surah';
import PrayerTimes from './pages/PrayerTimes';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Library from './pages/Library';
import BookmarksPage from './pages/Bookmarks';
import ActivityPage from './pages/Activity';
import { SettingsProvider } from './contexts/SettingsContext';
import { AudioProvider } from './contexts/AudioContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { NotificationProvider } from './contexts/NotificationContext';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quran" element={<SurahList />} />
          <Route path="surah/:id" element={<SurahPage />} />
          <Route path="prayer-times" element={<PrayerTimes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="library" element={<Library />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <ProgressProvider>
          <BookmarkProvider>
            <AudioProvider>
              <HashRouter>
                <AnimatedRoutes />
              </HashRouter>
            </AudioProvider>
          </BookmarkProvider>
        </ProgressProvider>
      </NotificationProvider>
    </SettingsProvider>
  );
}

export default App;
