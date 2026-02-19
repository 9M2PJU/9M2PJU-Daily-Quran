import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { SettingsProvider } from './contexts/SettingsContext';
import { AudioProvider } from './contexts/AudioContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Home stays eager for fastest initial load
import Home from './pages/Home';

// Lazy-loaded pages (code-split into separate chunks)
const SurahList = React.lazy(() => import('./pages/SurahList'));
const SurahPage = React.lazy(() => import('./pages/Surah'));
const PrayerTimes = React.lazy(() => import('./pages/PrayerTimes'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const Library = React.lazy(() => import('./pages/Library'));
const BookmarksPage = React.lazy(() => import('./pages/Bookmarks'));
const ActivityPage = React.lazy(() => import('./pages/Activity'));

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quran" element={<Suspense fallback={<PageFallback />}><SurahList /></Suspense>} />
          <Route path="surah/:id" element={<Suspense fallback={<PageFallback />}><SurahPage /></Suspense>} />
          <Route path="prayer-times" element={<Suspense fallback={<PageFallback />}><PrayerTimes /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageFallback />}><Settings /></Suspense>} />
          <Route path="library" element={<Suspense fallback={<PageFallback />}><Library /></Suspense>} />
          <Route path="bookmarks" element={<Suspense fallback={<PageFallback />}><BookmarksPage /></Suspense>} />
          <Route path="activity" element={<Suspense fallback={<PageFallback />}><ActivityPage /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<PageFallback />}><Notifications /></Suspense>} />
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
