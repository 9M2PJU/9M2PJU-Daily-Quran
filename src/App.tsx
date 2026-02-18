import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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

function App() {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <ProgressProvider>
          <BookmarkProvider>
            <AudioProvider>
              <HashRouter>
                <Routes>
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
              </HashRouter>
            </AudioProvider>
          </BookmarkProvider>
        </ProgressProvider>
      </NotificationProvider>
    </SettingsProvider>
  );
}

export default App;
