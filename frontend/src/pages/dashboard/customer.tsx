import React, { useState } from 'react';
import { 
  Wrench, 
  LogOut, 
  Bell, 
  Droplet, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Star,
  Search,
  MessageSquare,
  Send,
  X,
  Heart,
  Calendar,
  Clock,
  Upload,
  UserCheck,
  Briefcase
} from 'lucide-react';

export default function Dashboard() {
  // --- USER STATE ---
  const [user, setUser] = useState({
    name: 'Aayush Maharjan',
    email: 'aayush@example.com',
    phone: '9841234567',
    location: 'Lalitpur, Nepal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: true,
  });

  // --- NAVIGATION & VIEW STATES ---
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [activeTab, setActiveTab] = useState('hired'); 

  // --- BUSINESS LOGIC & DATA STATES ---
  const [hiredWorkers, setHiredWorkers] = useState([
    { id: 101, name: 'Ramesh Thapa', phone: '9812345678', location: 'Patan, Lalitpur', skill: 'Senior Plumber', category: 'Plumbing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', hireCount: 5, rating: 4.8, hasRated: true, status: 'Completed', date: '2026-08-20', rate: 'Rs. 700/hr', jobsDone: 142, bio: 'Expert plumber with over 8 years of experience fixing leaks, pipe installation, and bathroom fixtures in Lalitpur area.' },
    { id: 102, name: 'Suman Shrestha', phone: '9823456789', location: 'Jawalakhel, Lalitpur', skill: 'Master Electrician', category: 'Electrical', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', hireCount: 3, rating: 4.9, hasRated: true, status: 'In Progress', date: '2026-08-26', rate: 'Rs. 900/hr', jobsDone: 98, bio: 'Certified electrical systems technician specializing in house rewiring, generator repairs, and smart lighting installation.' }
  ]);
  
  const [favoriteWorkers, setFavoriteWorkers] = useState([
    { id: 103, name: 'Bijay Maharjan', phone: '9834567890', location: 'Mangal Bazaar, Lalitpur', category: 'Carpentry', rating: 4.7, hasRated: true, jobsDone: 64, rate: 'Rs. 800/hr', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80', verified: true, bio: 'Custom woodwork and furniture repairing specialist.' }
  ]);

  const [activeReviews, setActiveReviews] = useState([
    { id: 1, workerName: 'Ramesh Thapa', rating: 5, comment: 'Did an exceptional plumbing fix in our kitchen. Highly professional!', date: '2 days ago' }
  ]);

  // --- MARKETPLACE PROVIDERS DIRECTORY STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableProviders, setAvailableProviders] = useState([
    { id: 101, name: 'Ramesh Thapa', phone: '9812345678', category: 'Plumbing', rating: 4.8, hasRated: true, jobsDone: 142, rate: 'Rs. 700/hr', location: 'Patan, Lalitpur', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', verified: true, bio: 'Expert plumber with over 8 years of experience fixing leaks, pipe installation, and bathroom fixtures in Lalitpur area.' },
    { id: 102, name: 'Suman Shrestha', phone: '9823456789', category: 'Electrical', rating: 4.9, hasRated: true, jobsDone: 98, rate: 'Rs. 900/hr', location: 'Jawalakhel, Lalitpur', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', verified: true, bio: 'Certified electrical systems technician specializing in house rewiring, generator repairs, and smart lighting installation.' },
    { id: 103, name: 'Bijay Maharjan', phone: '9834567890', category: 'Carpentry', rating: 4.7, hasRated: true, jobsDone: 64, rate: 'Rs. 800/hr', location: 'Mangal Bazaar, Lalitpur', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80', verified: true, bio: 'Custom woodwork and furniture repairing specialist.' },
    { id: 104, name: 'Sunita Gurung', phone: '9845678901', category: 'Cleaning', rating: 4.9, hasRated: true, jobsDone: 210, rate: 'Rs. 600/hr', location: 'Sanepa, Lalitpur', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80', verified: true, bio: 'Deep cleaning specialist for houses and office premises.' },
    { id: 105, name: 'Deepak K.C.', phone: '9856789012', category: 'Painting', rating: null, hasRated: false, jobsDone: 0, rate: 'Rs. 750/hr', location: 'Pulchowk, Lalitpur', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80', verified: false, bio: 'Professional interior and exterior house painter.' }
  ]);

  // --- MODALS & INTERACTIONS STATE ---
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProfileDetailModalOpen, setIsProfileDetailModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNote, setBookingNote] = useState('');

  // Chat Modal State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatWorker, setActiveChatWorker] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'worker', text: 'Namaste! How can I help you with your maintenance needs today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Notification Drawer State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Booking Confirmed', message: 'Suman Shrestha accepted your electrical maintenance request.', time: '10m ago', read: false },
    { id: 2, title: 'Payment Success', message: 'Payment of Rs. 1,500 completed for Ramesh Thapa.', time: '1d ago', read: true }
  ]);

  // Profile Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPhone, setTempPhone] = useState(user.phone);
  const [tempLocation, setTempLocation] = useState(user.location);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Profile updated successfully!');
  const [phoneError, setPhoneError] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (tempPhone && !/^(98|97)\d{8}$/.test(tempPhone)) {
      setPhoneError('Please enter a valid Nepalese mobile number (e.g., 98xxxxxxxx)');
      return;
    }
    setPhoneError('');
    setUser(prev => ({
      ...prev,
      phone: tempPhone,
      location: tempLocation,
      avatar: tempAvatar,
      isVerified: true
    }));
    setIsModalOpen(false);
    triggerToast("Profile updated successfully!");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of Kamdar Nepal?")) {
      triggerToast("Logged out successfully.");
    }
  };

  const handleOpenProviderDetail = (provider) => {
    setSelectedProvider(provider);
    setIsProfileDetailModalOpen(true);
  };

  const handleOpenBooking = (provider) => {
    setSelectedProvider(provider);
    setIsProfileDetailModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setAvailableProviders(prev => prev.map(p => {
      if (p.id === selectedProvider.id) {
        return { ...p, jobsDone: p.jobsDone + 1 };
      }
      return p;
    }));

    const newHired = {
      id: selectedProvider.id || Date.now(),
      name: selectedProvider.name,
      phone: selectedProvider.phone,
      location: selectedProvider.location,
      skill: (selectedProvider.category || selectedProvider.skill || 'General') + ' Expert',
      category: selectedProvider.category || 'Maintenance',
      avatar: selectedProvider.avatar,
      hireCount: 1,
      rating: selectedProvider.rating || 5.0,
      hasRated: true,
      status: 'Requested',
      date: bookingDate || new Date().toISOString().split('T')[0],
      rate: selectedProvider.rate,
      jobsDone: selectedProvider.jobsDone || 10,
      bio: selectedProvider.bio || 'Experienced artisan.'
    };
    
    // Filter existing duplicate if re-booking
    const filteredHired = hiredWorkers.filter(w => w.id !== newHired.id);
    setHiredWorkers([newHired, ...filteredHired]);

    setIsBookingModalOpen(false);
    setSelectedProvider(null);
    setBookingDate('');
    setBookingTime('');
    setBookingNote('');
    triggerToast(`Successfully dispatched booking request to ${selectedProvider.name}!`);
    setCurrentView('dashboard');
    setActiveTab('hired');
  };

  const handleToggleFavorite = (provider) => {
    const exists = favoriteWorkers.some(fav => fav.id === provider.id);
    if (exists) {
      setFavoriteWorkers(favoriteWorkers.filter(fav => fav.id !== provider.id));
      triggerToast(`Removed ${provider.name} from favorites.`);
    } else {
      setFavoriteWorkers([...favoriteWorkers, provider]);
      triggerToast(`Added ${provider.name} to favorites!`);
    }
  };

  const handleOpenChat = (worker) => {
    setActiveChatWorker(worker);
    setChatMessages([
      { sender: 'worker', text: `Namaste! This is ${worker.name}. How can I assist you?` }
    ]);
    setIsChatOpen(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { sender: 'user', text: newMessage };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = newMessage;
    setNewMessage('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'worker', text: `Thanks for your message regarding "${currentInput}". I will check my schedule and update you shortly!` }
      ]);
    }, 1000);
  };

  const popularServices = [
    { name: 'Plumbing', icon: <Droplet className="w-5 h-5 text-blue-400" /> },
    { name: 'Electrical', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { name: 'Carpentry', icon: <Hammer className="w-5 h-5 text-amber-500" /> },
    { name: 'Painting', icon: <Paintbrush className="w-5 h-5 text-purple-400" /> },
    { name: 'Cleaning', icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
  ];

  const filteredProviders = availableProviders.filter(provider => {
    const matchesCategory = selectedCategory === 'All' || provider.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isProfileIncomplete = !user.phone || !user.location;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative">
      
      {/* Dynamic Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/95 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="border-b border-slate-800/60 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => setCurrentView('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Kamdar<span className="text-orange-500">Nepal</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {currentView === 'explore' ? (
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-medium transition-all"
            >
              ← Back to Dashboard
            </button>
          ) : (
            <button 
              onClick={() => setCurrentView('explore')}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Artisans</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setNotifications(notifications.map(n => ({ ...n, read: true })));
              }}
              className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-slate-800/50"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No new notifications</p>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-300">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/30 px-3.5 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* --- VIEW 1: DASHBOARD VIEW --- */}
        {currentView === 'dashboard' && (
          <>
            {/* Profile Completion Alert Banner */}
            {isProfileIncomplete && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">Complete your profile to start hiring</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Please add your phone number and service location so artisans can reach you accurately.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setTempPhone(user.phone);
                    setTempLocation(user.location);
                    setTempAvatar(user.avatar);
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 shrink-0"
                >
                  Complete Now
                </button>
              </div>
            )}

            {/* Customer Account Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#10141f] to-slate-900 border border-slate-800/80 p-6 sm:p-8 shadow-2xl shadow-black/40">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
                    />
                    {user.isVerified && (
                      <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full text-xs shadow-md" title="Verified Customer">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                      <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Client Account
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>{user.phone || 'Phone not set'}</span>
                      <span className="text-slate-600">•</span>
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>{user.location || 'Location not set'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button 
                    onClick={() => {
                      setTempPhone(user.phone);
                      setTempLocation(user.location);
                      setTempAvatar(user.avatar);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-3 rounded-xl transition-all border border-slate-700/60 shadow-md text-center"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setCurrentView('explore')}
                    className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Explore Artisans</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Service Categories Bar */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Quick Hire Services</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {popularServices.map((service, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(service.name);
                      setCurrentView('explore');
                    }}
                    className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all group text-left"
                  >
                    <div className="p-2 rounded-xl bg-slate-800 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{service.name}</h4>
                      <p className="text-[10px] text-slate-400">Find experts</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Tabs Section */}
            <section className="space-y-6">
              <div className="flex border-b border-slate-800 gap-8">
                <button
                  onClick={() => setActiveTab('hired')}
                  className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'hired' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  My Hired Workers ({hiredWorkers.length})
                  {activeTab === 'hired' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'favorites' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Favorite Artisans ({favoriteWorkers.length})
                  {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'reviews' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  My Reviews ({activeReviews.length})
                  {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
              </div>

              {/* Tab 1: Hired Workers */}
              {activeTab === 'hired' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hiredWorkers.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-slate-900/40 border border-slate-800 rounded-3xl">
                      <p className="text-sm text-slate-400">You haven't hired any workers yet.</p>
                      <button onClick={() => setCurrentView('explore')} className="mt-3 text-xs bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">Explore Workers</button>
                    </div>
                  ) : (
                    hiredWorkers.map(worker => (
                      <div 
                        key={worker.id} 
                        onClick={() => handleOpenProviderDetail(worker)}
                        className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-blue-500/60 hover:shadow-blue-500/10 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 group-hover:scale-105 transition-transform" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{worker.name}</h4>
                                <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium">View Profile</span>
                              </div>
                              <p className="text-xs text-blue-400 font-medium">{worker.skill}</p>
                              
                              <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-300">
                                <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span className="font-mono">{worker.phone}</span>
                                </span>
                                <span className="flex items-center space-x-1 text-slate-400">
                                  <MapPin className="w-3 h-3 text-orange-400" />
                                  <span>{worker.location || 'Lalitpur, Nepal'}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            worker.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {worker.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center space-x-4 text-slate-400">
                            <span className="flex items-center space-x-1 font-mono"><span>{worker.date}</span></span>
                            {worker.rate && <span className="text-slate-200 font-semibold">{worker.rate}</span>}
                            {worker.hasRated && worker.rating && (
                              <span className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{worker.rating}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleOpenChat(worker)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 border border-slate-700/60"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Chat</span>
                            </button>
                            <button 
                              onClick={() => handleOpenBooking(worker)}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl transition-all shadow-md"
                            >
                              Book Again
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Favorites */}
              {activeTab === 'favorites' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteWorkers.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-slate-900/40 border border-slate-800 rounded-3xl">
                      <p className="text-sm text-slate-400">No favorite artisans bookmarked yet.</p>
                    </div>
                  ) : (
                    favoriteWorkers.map(fav => (
                      <div key={fav.id} className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleOpenProviderDetail(fav)}>
                          <img src={fav.avatar} alt={fav.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                          <div>
                            <h4 className="text-sm font-bold text-white hover:text-blue-400 transition-colors">{fav.name}</h4>
                            <p className="text-xs text-blue-400">{fav.category || fav.skill}</p>
                            <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-300">
                              <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span className="font-mono">{fav.phone}</span>
                              </span>
                              <span className="text-slate-200 font-semibold">{fav.rate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleOpenChat(fav)}
                            className="p-2.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                            title="Chat with Artisan"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenBooking(fav)}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Reviews */}
              {activeTab === 'reviews' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeReviews.map(rev => (
                    <div key={rev.id} className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{rev.workerName}</h4>
                        <div className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs font-bold">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* --- VIEW 2: EXPLORE ARTISANS DIRECTORY --- */}
        {currentView === 'explore' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, or location in Lalitpur..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {['All', 'Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Painting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-slate-900/30 border border-slate-800/60 rounded-3xl">
                  <p className="text-slate-400 text-sm">No local artisans found matching your query.</p>
                </div>
              ) : (
                filteredProviders.map(provider => {
                  const isFav = favoriteWorkers.some(f => f.id === provider.id);
                  return (
                    <div 
                      key={provider.id} 
                      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-2xl relative hover:border-blue-500/50 transition-all cursor-pointer group"
                      onClick={() => handleOpenProviderDetail(provider)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700 group-hover:scale-105 transition-transform" />
                            {provider.verified && (
                              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full text-[10px]" title="Verified Provider">
                                <CheckCircle2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{provider.name}</h3>
                            <p className="text-xs text-blue-400 font-semibold">{provider.category} Expert</p>
                            <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                              <MapPin className="w-3 h-3 text-orange-400" />
                              <span>{provider.location}</span>
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(provider);
                          }}
                          className={`p-2.5 rounded-2xl border transition-all ${
                            isFav 
                              ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                        </button>
                      </div>

                      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400 flex items-center space-x-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Direct Contact:</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                            {provider.phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">Hourly Rate:</span>
                          <span className="font-bold text-white">{provider.rate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Verified Rating:</span>
                          {provider.rating ? (
                            <span className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{provider.rating} / 5.0</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">No ratings yet</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleOpenChat(provider)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-2xl transition-all border border-slate-700/60 flex items-center justify-center space-x-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Now</span>
                        </button>
                        <button 
                          onClick={() => handleOpenBooking(provider)}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-1.5"
                        >
                          <span>Hire Artisan</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL 1: PROVIDER PROFILE DETAIL POPUP --- */}
      {isProfileDetailModalOpen && selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img src={selectedProvider.avatar} alt={selectedProvider.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/50 shadow-xl" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{selectedProvider.name}</h3>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">{selectedProvider.category || selectedProvider.skill} Expert</p>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>{selectedProvider.location}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsProfileDetailModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Rating</span>
                  <span className="text-sm font-black text-amber-400 flex items-center justify-center space-x-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedProvider.rating || '5.0'}</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Jobs Done</span>
                  <span className="text-sm font-black text-blue-400 mt-0.5 block">{selectedProvider.jobsDone || 10}+</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Hourly Rate</span>
                  <span className="text-sm font-black text-emerald-400 mt-0.5 block">{selectedProvider.rate || 'Rs. 700/hr'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">About Artisan</h4>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  {selectedProvider.bio || 'Professional handyman providing top-quality repair and setup services across Lalitpur and Kathmandu area.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => {
                    setIsProfileDetailModalOpen(false);
                    handleOpenChat(selectedProvider);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3.5 rounded-2xl transition-all border border-slate-700/60 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Chat</span>
                </button>
                <button 
                  onClick={() => handleOpenBooking(selectedProvider)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Book / Hire Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: BOOKING MODAL (WORKING NATIVE PICKERS & VISIBLE ICONS) --- */}
      {isBookingModalOpen && selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={selectedProvider.avatar} alt={selectedProvider.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                <div>
                  <h3 className="text-base font-bold text-white">Book {selectedProvider.name}</h3>
                  <p className="text-xs text-blue-400 font-medium">{selectedProvider.category || selectedProvider.skill} • {selectedProvider.rate}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
              
              {/* SERVICE DATE INPUT WITH RIGHT-ALIGNED VISIBLE ICON & PICKER TRIGGER */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Service Date</label>
                <div 
                  className="relative flex items-center cursor-pointer"
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector('input');
                    if (input && input.showPicker) input.showPicker();
                  }}
                >
                  <input 
                    type="date" 
                    required
                    style={{ colorScheme: 'dark' }}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#05070c] border border-slate-700 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <Calendar className="w-5 h-5 text-blue-400 absolute right-4 pointer-events-none" />
                </div>
              </div>

              {/* PREFERRED TIME INPUT WITH RIGHT-ALIGNED VISIBLE ICON & PICKER TRIGGER */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Preferred Time</label>
                <div 
                  className="relative flex items-center cursor-pointer"
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector('input');
                    if (input && input.showPicker) input.showPicker();
                  }}
                >
                  <input 
                    type="time" 
                    required
                    style={{ colorScheme: 'dark' }}
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#05070c] border border-slate-700 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <Clock className="w-5 h-5 text-yellow-400 absolute right-4 pointer-events-none" />
                </div>
              </div>

              {/* QUICK TIME SLOT PRESETS */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Popular Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00 AM', '01:00 PM', '04:00 PM'].map((slot) => {
                    const slotValue = slot.includes('PM') && !slot.startsWith('12')
                      ? `${parseInt(slot) + 12}:00`
                      : slot.split(' ')[0];
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingTime(slotValue)}
                        className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                          bookingTime === slotValue 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* JOB NOTE */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Job Description / Note</label>
                <textarea 
                  rows={3}
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  placeholder="Describe your maintenance issue..."
                  className="w-full bg-[#05070c] border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs py-3.5 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: LIVE CHAT DRAWER --- */}
      {isChatOpen && activeChatWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md h-[550px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={activeChatWorker.avatar} alt={activeChatWorker.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-white">{activeChatWorker.name}</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Online & Ready</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#07090e]">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: PROFILE EDIT MODAL WITH LOCAL FILE UPLOAD & URL TOGGLE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Customer Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="98xxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                {phoneError && <p className="text-[10px] text-red-400 mt-1">{phoneError}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Service Location</label>
                <input 
                  type="text" 
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="e.g., Jawalakhel, Lalitpur"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* PROFILE IMAGE SOURCE OPTION TOGGLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">Profile Image</label>
                  <div className="flex space-x-2 text-[10px]">
                    <button 
                      type="button" 
                      onClick={() => setUploadMode('file')}
                      className={`px-2 py-0.5 rounded-lg transition-all ${uploadMode === 'file' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Local File
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setUploadMode('url')}
                      className={`px-2 py-0.5 rounded-lg transition-all ${uploadMode === 'url' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {uploadMode === 'file' ? (
                  <div className="flex items-center space-x-3">
                    <img src={tempAvatar} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                    <label className="flex-1 bg-slate-950 border border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-3 text-center cursor-pointer transition-all flex items-center justify-center space-x-2 text-xs text-slate-300">
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>Upload from device</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange}
                        className="hidden" 
                      />
                    </label>
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={tempAvatar}
                    onChange={(e) => setTempAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}