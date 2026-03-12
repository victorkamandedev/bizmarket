// src/App.jsx – root component, handles top-level view routing
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header       from './components/Header';
import Footer       from './components/Footer';
import FilterBar    from './components/FilterBar';
import LandingPage  from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import BusinessNews from './pages/BusinessNews';
import AuthPage     from './pages/AuthPage';
import AdminPage    from './pages/AdminPage';

export default function App() {
  const [view, setView]       = useState('landing'); // 'landing' | 'marketplace' | 'news' | 'auth' | 'admin'
  const [search, setSearch]   = useState('');
  const [selCats, setSelCats] = useState([]);

  const toggleCat  = c => setSelCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const clearCats  = ()  => setSelCats([]);

  return (
    <AuthProvider>
      {view === 'auth'  && <AuthPage  onDone={() => setView('landing')} />}
      {view === 'admin' && <AdminPage onBack={() => setView('marketplace')} />}
      
      {['landing', 'marketplace', 'news'].includes(view) && (
        <>
          <Header
            currentTab={view}
            onTabChange={setView}
            search={search}
            onSearch={setSearch}
            selCats={selCats}
            toggleCat={toggleCat}
            clearCats={clearCats}
            onLoginClick={() => setView('auth')}
            onAdminClick={() => setView('admin')}
          />
          
          {view === 'marketplace' && (
            <FilterBar
              selCats={selCats}
              toggleCat={toggleCat}
              clearCats={clearCats}
            />
          )}

          {view === 'landing'     && <LandingPage onGetStarted={() => setView('marketplace')} />}
          {view === 'marketplace' && <MarketplacePage search={search} selCats={selCats} onLoginClick={() => setView('auth')} />}
          {view === 'news'        && <BusinessNews />}
          
          <Footer />
        </>
      )}
    </AuthProvider>
  );
}
