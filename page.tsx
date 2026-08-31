/* app/page.tsx */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Plus, Trophy, LogOut, Shield, CheckCircle, 
  Store, User as UserIcon, X, AlertCircle, Mail, Key, ArrowLeft, 
  Trash2, Edit3, Eye, Filter, Check, ShoppingBag, Lock
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import 'leaflet/dist/leaflet.css';

// --- TYPES ---
type Role = 'consumidor' | 'lojista' | 'admin';

interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: Role;
  storeName?: string;
  storeAddress?: string;
  city?: string;
  state?: string;
  xp: number;
  avatar: string;
  isBanned?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  marketName: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  category: string;
  imageUrl: string;
  createdAt: string;
  authorId: string;
  authorUsername: string;
  authorRole: Role;
  isVerified: boolean;
  confirms: number;
  views: number;
  isFeatured?: boolean;
}

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

// --- CONSTANTS ---
const SERVICE_ID = 'service_enip5bh';
const TEMPLATE_ID = 'template_iejdtok';
const PUBLIC_KEY = 'k6HkZ7xwb74WGKZmX';

const CAPITALS: Record<string, { lat: number; lng: number }> = {
  AC: { lat: -8.77, lng: -70.55 },
  AL: { lat: -9.66, lng: -35.73 },
  AP: { lat: 0.03, lng: -51.06 },
  AM: { lat: -3.13, lng: -60.02 },
  BA: { lat: -12.97, lng: -38.51 },
  CE: { lat: -3.71, lng: -38.54 },
  DF: { lat: -15.79, lng: -47.88 },
  ES: { lat: -20.31, lng: -40.33 },
  GO: { lat: -16.68, lng: -49.25 },
  MA: { lat: -2.53, lng: -44.30 },
  MT: { lat: -15.60, lng: -56.09 },
  MS: { lat: -20.44, lng: -54.64 },
  MG: { lat: -19.91, lng: -43.93 },
  PA: { lat: -1.45, lng: -48.50 },
  PB: { lat: -7.12, lng: -34.86 },
  PR: { lat: -25.42, lng: -49.27 },
  PE: { lat: -8.05, lng: -34.87 },
  PI: { lat: -5.09, lng: -42.80 },
  RJ: { lat: -22.90, lng: -43.17 },
  RN: { lat: -5.79, lng: -35.20 },
  RS: { lat: -30.03, lng: -51.22 },
  RO: { lat: -8.76, lng: -63.90 },
  RR: { lat: 2.82, lng: -60.67 },
  SC: { lat: -27.59, lng: -48.55 },
  SP: { lat: -23.55, lng: -46.63 },
  SE: { lat: -10.90, lng: -37.07 },
  TO: { lat: -10.24, lng: -48.35 },
};

const FALLBACK_STATES: IBGEState[] = [
  { id: 12, sigla: 'AC', nome: 'Acre' }, { id: 27, sigla: 'AL', nome: 'Alagoas' },
  { id: 16, sigla: 'AP', nome: 'Amapá' }, { id: 13, sigla: 'AM', nome: 'Amazonas' },
  { id: 29, sigla: 'BA', nome: 'Bahia' }, { id: 23, sigla: 'CE', nome: 'Ceará' },
  { id: 53, sigla: 'DF', nome: 'Distrito Federal' }, { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
  { id: 52, sigla: 'GO', nome: 'Goiás' }, { id: 21, sigla: 'MA', nome: 'Maranhão' },
  { id: 51, sigla: 'MT', nome: 'Mato Grosso' }, { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { id: 31, sigla: 'MG', nome: 'Minas Gerais' }, { id: 15, sigla: 'PA', nome: 'Pará' },
  { id: 25, sigla: 'PB', nome: 'Paraíba' }, { id: 41, sigla: 'PR', nome: 'Paraná' },
  { id: 26, sigla: 'PE', nome: 'Pernambuco' }, { id: 22, sigla: 'PI', nome: 'Piauí' },
  { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' }, { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
  { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' }, { id: 11, sigla: 'RO', nome: 'Rondônia' },
  { id: 14, sigla: 'RR', nome: 'Roraima' }, { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
  { id: 35, sigla: 'SP', nome: 'São Paulo' }, { id: 28, sigla: 'SE', nome: 'Sergipe' },
  { id: 17, sigla: 'TO', nome: 'Tocantins' }
];

const CATEGORIES = ['Todos', 'Alimentos', 'Bebidas', 'Limpeza', 'Hortifruti', 'Carnes'];

const INITIAL_PRODUCTS: Product[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: `Produto Exemplo ${i + 1}`,
  price: parseFloat((Math.random() * 50 + 5).toFixed(2)),
  marketName: ['Assaí', 'Extra', 'Carrefour', 'Atacadão'][i % 4],
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  lat: -23.561 + (Math.random() - 0.5) * 0.05,
  lng: -46.656 + (Math.random() - 0.5) * 0.05,
  category: CATEGORIES[(i % 5) + 1],
  imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
  createdAt: new Date().toISOString(),
  authorId: 'admin-1',
  authorUsername: 'AdminAchadex',
  authorRole: 'admin',
  isVerified: i % 2 === 0,
  confirms: Math.floor(Math.random() * 115) + 5,
  views: Math.floor(Math.random() * 780) + 20,
  isFeatured: i === 0,
}));

// Dynamic Map components
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

export default function AchadexApp() {
  // --- STATES ---
  const [selectedState, setSelectedState] = useState<IBGEState | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [states, setStates] = useState<IBGEState[]>(FALLBACK_STATES);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationStep, setLocationStep] = useState<'state' | 'city'>('state');

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<1 | 2 | 3>(1);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<Role>('consumidor');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    storeName: '',
    storeAddress: '',
    neighborhood: '',
    state: '',
    city: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    marketName: '',
    neighborhood: '',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'
  });

  const [adminTab, setAdminTab] = useState<'Dashboard' | 'Usuarios' | 'Produtos' | 'Cidades'>('Dashboard');
  const [adminSearch, setAdminSearch] = useState('');

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -23.55, lng: -46.63 });

  // Forgot password states
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'newpass'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCodeInput, setForgotCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- TOAST HELPER ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- INITIALIZATION & LOCALSTORAGE ---
  useEffect(() => {
    // Load persisted data
    const savedUsers = localStorage.getItem('achadex-users-v1');
    const savedProducts = localStorage.getItem('achadex-products-v1');
    const savedAuth = localStorage.getItem('achadex-auth-v1');
    const savedLocation = localStorage.getItem('achadex-location-v1');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedAuth) {
      const parsedUser = JSON.parse(savedAuth);
      setUser(parsedUser);
      if (parsedUser.role === 'admin' || parsedUser.email === 'kryptonhostingv@gmail.com') {
        setIsAdmin(true);
      }
    }

    if (savedLocation) {
      const loc = JSON.parse(savedLocation);
      setSelectedState(loc.state);
      setSelectedCity(loc.city);
      if (loc.state && CAPITALS[loc.state.sigla]) {
        setMapCenter(CAPITALS[loc.state.sigla]);
      }
    } else {
      setLocationModalOpen(true);
    }

    // Fetch IBGE States
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStates(data);
        }
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  // Sync users & products to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('achadex-users-v1', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('achadex-products-v1', JSON.stringify(products));
  }, [products]);

  // IBGE Cities Fetcher
  const fetchCitiesByUF = (uf: string) => {
    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(res => res.json())
      .then(data => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch(() => {
        setCities([]);
        setLoadingCities(false);
      });
  };

  const handleSelectState = (st: IBGEState) => {
    setSelectedState(st);
    setLocationStep('city');
    fetchCitiesByUF(st.sigla);
  };

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    const locationData = { state: selectedState, city: cityName };
    localStorage.setItem('achadex-location-v1', JSON.stringify(locationData));
    
    if (selectedState && CAPITALS[selectedState.sigla]) {
      setMapCenter(CAPITALS[selectedState.sigla]);
    }
    
    setLocationModalOpen(false);
    addToast(`Achadex configurado para ${cityName} - ${selectedState?.sigla}`);
  };

  // --- AUTH LOGIC ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.includes('@') || formData.password.length < 4) {
      addToast('Preencha os campos corretamente (senha mín. 4 caracteres)', 'error');
      return;
    }

    const exists = users.some(u => u.username === formData.username || u.email === formData.email);
    if (exists) {
      addToast('Usuário ou e-mail já cadastrados', 'error');
      return;
    }

    if (authRole === 'lojista' && (!formData.storeName || !formData.state || !formData.city)) {
      addToast('Preencha os dados da loja', 'error');
      return;
    }

    const isAdm = formData.email === 'kryptonhostingv@gmail.com' && formData.password === 'jaohjhjwe1i6eA@';
    const finalRole: Role = isAdm ? 'admin' : authRole;

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: finalRole,
      storeName: formData.storeName,
      storeAddress: formData.storeAddress,
      city: formData.city,
      state: formData.state,
      xp: 50,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.username}`
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    if (isAdm) setIsAdmin(true);

    localStorage.setItem('achadex-auth-v1', JSON.stringify(newUser));
    setAuthModalOpen(false);
    addToast(isAdm ? 'Bem-vindo Admin!' : 'Conta criada com sucesso! +50 XP');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(
      u => (u.username === formData.username || u.email === formData.username) && u.password === formData.password
    );

    const isAdm = formData.username === 'kryptonhostingv@gmail.com' && formData.password === 'jaohjhjwe1i6eA@';

    if (found) {
      if (found.isBanned) {
        addToast('Esta conta foi banida.', 'error');
        return;
      }
      setUser(found);
      const admCheck = found.role === 'admin' || found.email === 'kryptonhostingv@gmail.com';
      setIsAdmin(admCheck);
      localStorage.setItem('achadex-auth-v1', JSON.stringify(found));
      setAuthModalOpen(false);
      addToast(`Bem-vindo de volta, ${found.username}!`);
    } else if (isAdm) {
      const adminUser: User = {
        id: 'admin-master',
        username: 'Admin',
        email: 'kryptonhostingv@gmail.com',
        role: 'admin',
        xp: 999,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('achadex-auth-v1', JSON.stringify(adminUser));
      setAuthModalOpen(false);
      addToast('Bem-vindo Admin!');
    } else {
      addToast('Credenciais inválidas', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('achadex-auth-v1');
    addToast('Sessão encerrada');
  };

  // --- FORGOT PASSWORD FLOW ---
  const enviarCodigoRecuperacao = () => {
    if (!forgotEmail || !forgotEmail.includes('@')) {
      addToast('Digite um e-mail válido', 'error');
      return;
    }
    const userExists = users.some(u => u.email === forgotEmail) || forgotEmail === 'kryptonhostingv@gmail.com';
    if (!userExists) {
      addToast('E-mail não cadastrado', 'error');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    localStorage.setItem(`achadex-reset-${forgotEmail}`, JSON.stringify({ code, expires: Date.now() + 600000 }));
    
    setForgotLoading(true);
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: forgotEmail,
      to_name: forgotEmail.split('@')[0],
      code: code
    }, PUBLIC_KEY)
      .then(() => {
        addToast('Código enviado para o e-mail');
        setForgotLoading(false);
        setForgotStep('code');
      })
      .catch((err) => {
        console.log('MODO TESTE EmailJS Error:', err);
        addToast(`MODO TESTE: Código é ${code}`, 'info');
        setForgotLoading(false);
        setForgotStep('code');
      });
  };

  const verificarCodigo = () => {
    const savedReset = localStorage.getItem(`achadex-reset-${forgotEmail}`);
    if (!savedReset) {
      addToast('Código expirado ou inválido', 'error');
      return;
    }
    const data = JSON.parse(savedReset);
    if (Date.now() > data.expires) {
      addToast('Código expirado', 'error');
      return;
    }
    if (data.code !== forgotCodeInput) {
      addToast('Código incorreto', 'error');
      return;
    }
    addToast('Código correto!');
    setForgotStep('newpass');
  };

  const salvarNovaSenha = () => {
    if (newPassword.length < 4 || newPassword !== confirmNewPassword) {
      addToast('Senhas não conferem ou são curtas', 'error');
      return;
    }

    const updatedUsers = users.map(u => {
      if (u.email === forgotEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.removeItem(`achadex-reset-${forgotEmail}`);
    addToast('Senha alterada com sucesso!');
    setAuthStep(2);
    setForgotStep('email');
  };

  // --- PRODUCT CREATION ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!newProduct.name || !newProduct.price || !newProduct.marketName || !newProduct.neighborhood) {
      addToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    const baseCoords = (selectedState && CAPITALS[selectedState.sigla]) || { lat: -23.55, lng: -46.63 };
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      marketName: newProduct.marketName,
      neighborhood: newProduct.neighborhood,
      city: selectedCity || 'São Paulo',
      state: selectedState?.sigla || 'SP',
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.02,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.02,
      category: newProduct.category,
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorUsername: user.username,
      authorRole: user.role,
      isVerified: user.role === 'lojista',
      confirms: 1,
      views: 10,
    };

    setProducts(prev => [newProd, ...prev]);
    
    // Add XP to user
    const updatedUser = { ...user, xp: user.xp + 10 };
    setUser(updatedUser);
    localStorage.setItem('achadex-auth-v1', JSON.stringify(updatedUser));
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    setAddModalOpen(false);
    setNewProduct({ name: '', price: '', marketName: '', neighborhood: '', category: 'Alimentos', imageUrl: '' });
    addToast('Produto publicado! +10 XP');
  };

  // --- FILTERED PRODUCTS ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCity = selectedCity ? p.city.toLowerCase() === selectedCity.toLowerCase() : true;
      const matchState = selectedState ? p.state.toUpperCase() === selectedState.sigla.toUpperCase() : true;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.marketName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;

      return matchCity && matchState && matchSearch && matchCategory;
    });
  }, [products, selectedCity, selectedState, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      
      {/* TOASTS CONTAINER */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto"
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-[#D4FF32] shrink-0" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LOCATION MODAL */}
      <AnimatePresence>
        {locationModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[24px] p-6 max-w-lg w-full shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#D4FF32]">
                  {locationStep === 'state' ? 'Escolha seu Estado' : `Municípios de ${selectedState?.nome}`}
                </h2>
                {selectedCity && (
                  <button onClick={() => setLocationModalOpen(false)} className="text-[#888] hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {locationStep === 'state' ? (
                <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 flex-1">
                  {states.map(st => (
                    <button
                      key={st.id}
                      onClick={() => handleSelectState(st)}
                      className="bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D4FF32] hover:bg-[#D4FF32] hover:text-black p-3 rounded-xl transition font-bold text-center flex flex-col items-center justify-center group"
                    >
                      <span className="text-lg font-['Space_Grotesk']">{st.sigla}</span>
                      <span className="text-[10px] text-[#888] group-hover:text-black truncate w-full">{st.nome}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setLocationStep('state')}
                      className="text-xs text-[#888] hover:text-white flex items-center gap-1 bg-[#0A0A0A] px-3 py-1.5 rounded-full border border-[#2A2A2A]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Voltar estados
                    </button>
                    <input
                      type="text"
                      placeholder="Pesquisar município..."
                      value={searchCity}
                      onChange={e => setSearchCity(e.target.value)}
                      className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-[#D4FF32]"
                    />
                  </div>

                  {loadingCities ? (
                    <div className="flex-1 flex items-center justify-center text-[#888]">
                      Carregando municípios de {selectedState?.sigla}...
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 max-h-72">
                      {cities
                        .filter(c => c.nome.toLowerCase().includes(searchCity.toLowerCase()))
                        .map(c => (
                          <button
                            key={c.id}
                            onClick={() => handleSelectCity(c.nome)}
                            className="text-left px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D4FF32] transition text-sm font-medium flex justify-between items-center group"
                          >
                            <span>{c.nome}</span>
                            <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#D4FF32]" />
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-[#D4FF32] tracking-wider">
            ACHADEX <span className="text-white text-sm">X</span>
          </h1>

          <button
            onClick={() => { setLocationStep('state'); setLocationModalOpen(true); }}
            className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] px-3.5 py-1.5 rounded-full text-xs font-medium hover:border-[#D4FF32] transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4FF32]" />
            <span>{selectedCity ? `${selectedCity} - ${selectedState?.sigla}` : 'Selecionar Cidade'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdmin(false)}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-500/20 transition"
              >
                Voltar Mapa
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className="bg-[#D4FF32] text-black px-3.5 py-1.5 rounded-full text-xs font-bold neon-glow-sm"
              >
                Painel Admin
              </button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1 rounded-full text-xs">
                <Trophy className="w-3.5 h-3.5 text-[#D4FF32]" />
                <span className="font-bold">{user.xp} XP</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] p-1.5 rounded-full pr-3">
                <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full bg-[#2A2A2A]" />
                <span className="text-xs font-bold">{user.username}</span>
              </div>
              <button onClick={handleLogout} className="text-[#888] hover:text-red-400 p-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setAuthStep(1); setAuthModalOpen(true); }}
              className="bg-[#D4FF32] text-black px-4 py-2 rounded-full text-xs font-bold font-['Space_Grotesk'] neon-glow"
            >
              Entrar
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {isAdmin ? (
        // ADMIN PANEL
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-56 bg-[#1A1A1A] border-r border-[#2A2A2A] p-4 flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase text-[#888] px-2 mb-2">Administração</h2>
            {(['Dashboard', 'Usuarios', 'Produtos', 'Cidades'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setAdminTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${adminTab === tab ? 'bg-[#D4FF32] text-black' : 'text-[#888] hover:bg-[#2A2A2A] hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </aside>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-['Space_Grotesk']">{adminTab}</h2>
              <input
                type="text"
                placeholder="Buscar no painel..."
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-full px-4 py-2 text-xs w-64 focus:outline-none focus:border-[#D4FF32]"
              />
            </div>

            {adminTab === 'Dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                  <span className="text-[#888] text-xs">Total Usuários</span>
                  <h3 className="text-3xl font-bold font-['Space_Grotesk'] mt-1">{users.length}</h3>
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                  <span className="text-[#888] text-xs">Total Produtos</span>
                  <h3 className="text-3xl font-bold font-['Space_Grotesk'] mt-1">{products.length}</h3>
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                  <span className="text-[#888] text-xs">Total Lojistas</span>
                  <h3 className="text-3xl font-bold font-['Space_Grotesk'] mt-1">
                    {users.filter(u => u.role === 'lojista').length}
                  </h3>
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                  <span className="text-[#888] text-xs">Total Views</span>
                  <h3 className="text-3xl font-bold font-['Space_Grotesk'] mt-1">
                    {products.reduce((acc, p) => acc + p.views, 0)}
                  </h3>
                </div>
              </div>
            )}

            {adminTab === 'Usuarios' && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#888]">
                      <th className="p-3">Usuário</th>
                      <th className="p-3">E-mail</th>
                      <th className="p-3">Função</th>
                      <th className="p-3">Loja</th>
                      <th className="p-3">Cidade/Estado</th>
                      <th className="p-3">XP</th>
                      <th className="p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.username.toLowerCase().includes(adminSearch.toLowerCase())).map(u => (
                      <tr key={u.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/20">
                        <td className="p-3 font-bold flex items-center gap-2">
                          <img src={u.avatar} className="w-5 h-5 rounded-full" /> {u.username}
                        </td>
                        <td className="p-3 text-[#888]">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-[#D4FF32] text-black' : u.role === 'lojista' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#2A2A2A] text-[#888]'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">{u.storeName || '-'}</td>
                        <td className="p-3">{u.city ? `${u.city}/${u.state}` : '-'}</td>
                        <td className="p-3">{u.xp}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => {
                              setUsers(users.filter(item => item.id !== u.id));
                              addToast('Usuário excluído');
                            }}
                            className="bg-red-500/10 text-red-400 p-1.5 rounded-lg hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {adminTab === 'Produtos' && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#888]">
                      <th className="p-3">Produto</th>
                      <th className="p-3">Preço</th>
                      <th className="p-3">Mercado</th>
                      <th className="p-3">Cidade/Estado</th>
                      <th className="p-3">Autor</th>
                      <th className="p-3">Views</th>
                      <th className="p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.name.toLowerCase().includes(adminSearch.toLowerCase())).map(p => (
                      <tr key={p.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/20">
                        <td className="p-3 font-bold flex items-center gap-2">
                          <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" /> {p.name}
                        </td>
                        <td className="p-3 text-[#D4FF32] font-bold">R$ {p.price.toFixed(2)}</td>
                        <td className="p-3">{p.marketName}</td>
                        <td className="p-3">{p.city}/{p.state}</td>
                        <td className="p-3">{p.authorUsername}</td>
                        <td className="p-3">{p.views}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => {
                              setProducts(products.map(item => item.id === p.id ? { ...item, isFeatured: !item.isFeatured } : item));
                              addToast(p.isFeatured ? 'Removido dos destaques' : 'Produto destacado');
                            }}
                            className={`p-1.5 rounded-lg ${p.isFeatured ? 'bg-[#D4FF32] text-black' : 'bg-[#2A2A2A] text-[#888]'}`}
                          >
                            <Trophy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setProducts(products.filter(item => item.id !== p.id));
                              addToast('Produto excluído');
                            }}
                            className="bg-red-500/10 text-red-400 p-1.5 rounded-lg hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {adminTab === 'Cidades' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(
                  products.reduce((acc: Record<string, number>, p) => {
                    acc[p.city] = (acc[p.city] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([city, count]) => (
                  <div key={city} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl">
                    <h4 className="font-bold text-base">{city}</h4>
                    <span className="text-xs text-[#888]">{count} produtos cadastrados</span>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      ) : (
        // NORMAL MAP & PRODUCT VIEW
        <div className="flex-1 flex flex-col p-4 max-w-7xl mx-auto w-full gap-4">
          
          {/* SEARCH & CATEGORIES */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#888]" />
              <input
                type="text"
                placeholder="Buscar produtos, mercados..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-[#D4FF32] text-black neon-glow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* MAP */}
          <div className="w-full h-[380px] rounded-[20px] overflow-hidden border border-[#2A2A2A] relative">
            <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} zoomControl={false} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {filteredProducts.map(p => (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lng]}
                  eventHandlers={{
                    click: () => setSelectedProduct(p)
                  }}
                />
              ))}
            </MapContainer>
          </div>

          {/* PRODUCT LIST */}
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-lg font-bold font-['Space_Grotesk']">Achados em {selectedCity || 'sua região'}</h2>
            <button
              onClick={() => {
                if (!user) setAuthModalOpen(true);
                else setAddModalOpen(true);
              }}
              className="bg-[#D4FF32] text-black px-4 py-2 rounded-full text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 neon-glow-sm"
            >
              <Plus className="w-4 h-4" /> Adicionar Produto
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[20px] p-8 text-center flex flex-col items-center justify-center gap-3">
              <ShoppingBag className="w-10 h-10 text-[#888]" />
              <p className="text-sm text-[#888]">Nenhum achado em {selectedCity} ainda, seja o primeiro!</p>
              <button
                onClick={() => {
                  if (!user) setAuthModalOpen(true);
                  else setAddModalOpen(true);
                }}
                className="bg-[#D4FF32] text-black px-4 py-2 rounded-full text-xs font-bold font-['Space_Grotesk']"
              >
                Adicionar Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setProducts(products.map(item => item.id === p.id ? { ...item, views: item.views + 1 } : item));
                  }}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4FF32] transition rounded-[20px] p-3 flex gap-3 cursor-pointer group"
                >
                  <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-[#2A2A2A]" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-sm group-hover:text-[#D4FF32] transition truncate">{p.name}</h3>
                        {p.isVerified && <CheckCircle className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />}
                      </div>
                      <span className="text-[11px] text-[#888]">{p.marketName} • {p.neighborhood}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-base font-bold font-['Space_Grotesk'] text-[#D4FF32]">R$ {p.price.toFixed(2)}</span>
                      <span className="text-[10px] text-[#888]">{p.confirms} confirmações</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOTTOM SHEET / PRODUCT DETAILS */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-t-[24px] sm:rounded-[24px] p-6 max-w-md w-full shadow-2xl flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <img src={selectedProduct.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base font-['Space_Grotesk']">{selectedProduct.name}</h3>
                      {selectedProduct.isVerified && <CheckCircle className="w-4 h-4 text-[#3B82F6]" />}
                    </div>
                    <span className="text-xs text-[#888]">{selectedProduct.marketName} • {selectedProduct.neighborhood}</span>
                    <p className="text-[11px] text-[#888] mt-0.5">{selectedProduct.city} - {selectedProduct.state}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-[#888] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-between items-center bg-[#0A0A0A] border border-[#2A2A2A] p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-[#888] uppercase font-bold">Preço Achado</span>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#D4FF32]">
                    R$ {selectedProduct.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#888] uppercase font-bold">Publicado por</span>
                  <div className="text-xs font-bold">{selectedProduct.authorUsername}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setProducts(products.map(item => item.id === selectedProduct.id ? { ...item, confirms: item.confirms + 1 } : item));
                    setSelectedProduct(prev => prev ? { ...prev, confirms: prev.confirms + 1 } : null);
                    addToast('Preço confirmado! +50 XP');
                  }}
                  className="flex-1 bg-[#D4FF32] text-black font-bold py-3 rounded-full text-xs font-['Space_Grotesk'] neon-glow-sm"
                >
                  Confirmar preço (+50 XP)
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="bg-[#2A2A2A] text-white px-4 py-3 rounded-full text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[24px] p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#D4FF32]">Publicar Achado</h3>
                <button onClick={() => setAddModalOpen(false)} className="text-[#888] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-2.5 rounded-xl text-xs text-[#888] mb-4">
                Publicando em <span className="text-white font-bold">{selectedCity} - {selectedState?.sigla}</span> (automático)
              </div>

              <form onSubmit={handleAddProduct} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Preço (R$)"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                />
                <input
                  type="text"
                  placeholder="Nome do Mercado"
                  value={newProduct.marketName}
                  onChange={e => setNewProduct({ ...newProduct, marketName: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                />
                <input
                  type="text"
                  placeholder="Bairro"
                  value={newProduct.neighborhood}
                  onChange={e => setNewProduct({ ...newProduct, neighborhood: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                />
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                >
                  {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="URL da Imagem (opcional)"
                  value={newProduct.imageUrl}
                  onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-full text-xs font-['Space_Grotesk'] mt-2 neon-glow-sm"
                >
                  Publicar
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[24px] p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#D4FF32]">
                  {authStep === 1 ? 'Escolha seu perfil' : authStep === 2 ? (authMode === 'login' ? 'Entrar' : 'Criar Conta') : 'Recuperar Senha'}
                </h3>
                <button onClick={() => setAuthModalOpen(false)} className="text-[#888] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {authStep === 1 && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setAuthRole('consumidor'); setAuthStep(2); setAuthMode('register'); }}
                    className="bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D4FF32] p-4 rounded-2xl text-left transition group"
                  >
                    <div className="font-bold text-sm group-hover:text-[#D4FF32]">Quero achar barato</div>
                    <span className="text-xs text-[#888]">Consumidor buscando economia</span>
                  </button>
                  <button
                    onClick={() => { setAuthRole('lojista'); setAuthStep(2); setAuthMode('register'); }}
                    className="bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D4FF32] p-4 rounded-2xl text-left transition group"
                  >
                    <div className="font-bold text-sm group-hover:text-[#D4FF32]">Sou dono de loja</div>
                    <span className="text-xs text-[#888]">Lojista divulgando ofertas</span>
                  </button>
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() => { setAuthStep(2); setAuthMode('login'); }}
                      className="text-xs text-[#888] hover:text-white underline"
                    >
                      Já tenho conta. Entrar
                    </button>
                  </div>
                </div>
              )}

              {authStep === 2 && (
                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Username ou E-mail"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                  />
                  {authMode === 'register' && (
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                    />
                  )}
                  <input
                    type="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                  />

                  {authMode === 'register' && authRole === 'lojista' && (
                    <>
                      <input
                        type="text"
                        placeholder="Nome da Loja"
                        value={formData.storeName}
                        onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      />
                      <input
                        type="text"
                        placeholder="Endereço da Loja"
                        value={formData.storeAddress}
                        onChange={e => setFormData({ ...formData, storeAddress: e.target.value })}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      />
                      <select
                        value={formData.state}
                        onChange={e => {
                          setFormData({ ...formData, state: e.target.value });
                          fetchCitiesByUF(e.target.value);
                        }}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      >
                        <option value="">Selecione o Estado</option>
                        {states.map(st => (
                          <option key={st.id} value={st.sigla}>{st.nome}</option>
                        ))}
                      </select>
                      <select
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      >
                        <option value="">Selecione a Cidade</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.nome}>{c.nome}</option>
                        ))}
                      </select>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-full text-xs font-['Space_Grotesk'] mt-2 neon-glow-sm"
                  >
                    {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                  </button>

                  <div className="flex justify-between items-center mt-2 text-xs">
                    {authMode === 'login' ? (
                      <button
                        type="button"
                        onClick={() => setAuthStep(3)}
                        className="text-[#D4FF32] underline"
                      >
                        Esqueceu a senha?
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="text-[#888] hover:text-white"
                    >
                      {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
                    </button>
                  </div>
                </form>
              )}

              {authStep === 3 && (
                <div className="flex flex-col gap-3">
                  {forgotStep === 'email' && (
                    <>
                      <input
                        type="email"
                        placeholder="Seu e-mail cadastrado"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      />
                      <button
                        type="button"
                        onClick={enviarCodigoRecuperacao}
                        disabled={forgotLoading}
                        className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-full text-xs font-['Space_Grotesk'] neon-glow-sm"
                      >
                        {forgotLoading ? 'Enviando...' : 'Enviar código de 6 dígitos'}
                      </button>
                    </>
                  )}

                  {forgotStep === 'code' && (
                    <>
                      <p className="text-xs text-[#888]">Digite o código enviado para {forgotEmail}</p>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={forgotCodeInput}
                        onChange={e => setForgotCodeInput(e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-center tracking-widest text-2xl font-mono focus:outline-none focus:border-[#D4FF32]"
                      />
                      <button
                        type="button"
                        onClick={verificarCodigo}
                        className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-full text-xs font-['Space_Grotesk'] neon-glow-sm"
                      >
                        Verificar código
                      </button>
                      <button
                        type="button"
                        onClick={enviarCodigoRecuperacao}
                        className="text-xs text-[#888] underline text-center"
                      >
                        Reenviar código
                      </button>
                    </>
                  )}

                  {forgotStep === 'newpass' && (
                    <>
                      <input
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      />
                      <input
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4FF32]"
                      />
                      <button
                        type="button"
                        onClick={salvarNovaSenha}
                        className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-full text-xs font-['Space_Grotesk'] neon-glow-sm"
                      >
                        Salvar nova senha
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => { setAuthStep(2); setForgotStep('email'); }}
                    className="text-xs text-[#888] text-center mt-2"
                  >
                    Voltar ao login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
