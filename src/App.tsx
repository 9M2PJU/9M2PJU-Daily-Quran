import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahPage from './pages/Surah';
import PrayerTimes from './pages/PrayerTimes';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/quran" element={<SurahList />} />
            <Route path="/surah/:id" element={<SurahPage />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
