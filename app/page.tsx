'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Plus,
  Trophy,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  CheckCircle,
  Eye,
  ThumbsUp,
  X,
  ChevronRight,
  Store,
  ArrowLeft,
  Mail,
  Lock,
  Trash2,
  Award,
  Sparkles,
  Filter
} from 'lucide-react';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

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
  TO: { lat: -10.24, lng: -48.35 }
};

const FALLBACK_STATES = [
  { id: 12, sigla: 'AC', nome: 'Acre' },
  { id: 27, sigla: 'AL', nome: 'Alagoas' },
  { id: 16, sigla: 'AP', nome: 'Amapá' },
  { id: 13, sigla: 'AM', nome: 'Amazonas' },
  { id: 29, sigla: 'BA', nome: 'Bahia' },
  { id: 23, sigla: 'CE', nome: 'Ceará' },
  { id: 53, sigla: 'DF', nome: 'Distrito Federal' },
  { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
  { id: 52, sigla: 'GO', nome: 'Goiás' },
  { id: 21, sigla: 'MA', nome: 'Maranhão' },
  { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
  { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
  { id: 15, sigla: 'PA', nome: 'Pará' },
  { id: 25, sigla: 'PB', nome: 'Paraíba' },
  { id: 41, sigla: 'PR', nome: 'Paraná' },
  { id: 26, sigla: 'PE', nome: 'Pernambuco' },
  { id: 22, sigla: 'PI', nome: 'Piauí' },
  { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
  { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
  { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
  { id: 11, sigla: 'RO', nome: 'Rondônia' },
  { id: 14, sigla: 'RR', nome: 'Roraima' },
  { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
  { id: 35, sigla: 'SP', nome: 'São Paulo' },
  { id: 28, sigla: 'SE', nome: 'Sergipe' },
  { id: 17, sigla: 'TO', nome: 'Tocantins' }
];

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Leite Integral 1L', price: 4.49, marketName: 'Assaí', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', lat: -23.561, lng: -46.656, category: 'Alimentos', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u1', authorUsername: 'carlos_achados', authorRole: 'consumidor', isVerified: false, confirms: 45, views: 230, isFeatured: true },
  { id: '2', name: 'Cerveja Lata 350ml', price: 2.79, marketName: 'Extra', neighborhood: 'Vila Madalena', city: 'São Paulo', state: 'SP', lat: -23.555, lng: -46.680, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1608270104332-9f8997ef5f3d?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u2', authorUsername: 'supermercado_bompreco', authorRole: 'lojista', isVerified: true, confirms: 98, views: 512, isFeatured: false },
  { id: '3', name: 'Arroz 5kg Tipo 1', price: 21.90, marketName: 'Carrefour', neighborhood: 'Itaim Bibi', city: 'São Paulo', state: 'SP', lat: -23.585, lng: -46.680, category: 'Alimentos', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u1', authorUsername: 'carlos_achados', authorRole: 'consumidor', isVerified: false, confirms: 12, views: 85, isFeatured: false },
  { id: '4', name: 'Dac Desinfetante 2L', price: 6.99, marketName: 'Atacadão', neighborhood: 'Mooca', city: 'São Paulo', state: 'SP', lat: -23.550, lng: -46.600, category: 'Limpeza', imageUrl: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u3', authorUsername: 'ana_limpeza', authorRole: 'consumidor', isVerified: false, confirms: 34, views: 140, isFeatured: false },
  { id: '5', name: 'Tomate Italiano Kg', price: 5.99, marketName: 'Assaí', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', lat: -23.565, lng: -46.650, category: 'Hortifruti', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u2', authorUsername: 'supermercado_bompreco', authorRole: 'lojista', isVerified: true, confirms: 120, views: 780, isFeatured: true },
  { id: '6', name: 'Picanha Bovina Kg', price: 49.90, marketName: 'Carrefour', neighborhood: 'Morumbi', city: 'São Paulo', state: 'SP', lat: -23.600, lng: -46.700, category: 'Carnes', imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u1', authorUsername: 'carlos_achados', authorRole: 'consumidor', isVerified: false, confirms: 89, views: 450, isFeatured: false },
  { id: '7', name: 'Refrigerante Cola 2L', price: 7.49, marketName: 'Extra', neighborhood: 'Consolação', city: 'São Paulo', state: 'SP', lat: -23.550, lng: -46.650, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u3', authorUsername: 'ana_limpeza', authorRole: 'consumidor', isVerified: false, confirms: 22, views: 110, isFeatured: false },
  { id: '8', name: 'Sabão em Pó 1.6kg', price: 18.50, marketName: 'Atacadão', neighborhood: 'Santana', city: 'São Paulo', state: 'SP', lat: -23.500, lng: -46.620, category: 'Limpeza', imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u2', authorUsername: 'supermercado_bompreco', authorRole: 'lojista', isVerified: true, confirms: 64, views: 320, isFeatured: false },
  { id: '9', name: 'Batata Inglesa Kg', price: 4.99, marketName: 'Assaí', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', lat: -23.560, lng: -46.660, category: 'Hortifruti', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u1', authorUsername: 'carlos_achados', authorRole: 'consumidor', isVerified: false, confirms: 40, views: 190, isFeatured: false },
  { id: '10', name: 'Coxa com Sopa Frango Kg', price: 9.99, marketName: 'Carrefour', neighborhood: 'Tatuapé', city: 'São Paulo', state: 'SP', lat: -23.540, lng: -46.570, category: 'Carnes', imageUrl: 'https://images.unsplash.com/photo-1607623814075-eaf1df15c7f3?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u3', authorUsername: 'ana_limpeza', authorRole: 'consumidor', isVerified: false, confirms: 55, views: 260, isFeatured: false },
  { id: '11', name: 'Água Mineral 500ml', price: 1.50, marketName: 'Extra', neighborhood: 'Liberdade', city: 'São Paulo', state: 'SP', lat: -23.555, lng: -46.635, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4c?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u2', authorUsername: 'supermercado_bompreco', authorRole: 'lojista', isVerified: true, confirms: 77, views: 390, isFeatured: false },
  { id: '12', name: 'Papel Higiênico 16un', price: 14.90, marketName: 'Atacadão', neighborhood: 'Lapa', city: 'São Paulo', state: 'SP', lat: -23.520, lng: -46.700, category: 'Limpeza', imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u1', authorUsername: 'carlos_achados', authorRole: 'consumidor', isVerified: false, confirms: 31, views: 150, isFeatured: false },
  { id: '13', name: 'Alface Crespa Unid', price: 2.29, marketName: 'Assaí', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', lat: -23.563, lng: -46.658, category: 'Hortifruti', imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u3', authorUsername: 'ana_limpeza', authorRole: 'consumidor', isVerified: false, confirms: 18, views: 95, isFeatured: false },
  { id: '14', name: 'Contrafilé Bovino Kg', price: 38.90, marketName: 'Carrefour', neighborhood: 'Jabaquara', city: 'São Paulo', state: 'SP', lat: -23.640, lng: -46.640, category: 'Carnes', imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=85', createdAt: Date.now(), authorId: 'u2', authorUsername: 'supermercado_bompreco', authorRole: 'lojista', isVerified: true, confirms: 105, views: 620, isFeatured: false },
  { id: '15', name: 'Feijão Preto 1kg', price: 6.89, marketName: 'Extra', neighborhood: 'Perdizes', city: 'São Paulo', state: 'SP', lat: -23.535, lng: -46.670, category: 'Alimentos', imageUrl: 'https://images.unsplash.com/photo-1585849803444-bcbc5d3b6311?auto=format&fit=crop&w=500&q=80', createdAt: Date.now(), authorId: 'u1', authorUsername: 'carlos_achados', authorRole: 'consumidor', isVerified: false, confirms: 50, views: 210, isFeatured: false }
];

export default function AchadexApp() {
  const [selectedState, setSelectedState] = useState<{ sigla: string; nome: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [states, setStates] = useState<any[]>(FALLBACK_STATES);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationStep, setLocationStep] = useState<'state' | 'city'>('state');

  const [users, setUsers] = useState<any[]>([
    { id: 'u1', username: 'carlos_achados', email: 'carlos@mail.com', role: 'consumidor', xp: 250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos' },
    { id: 'u2', username: 'supermercado_bompreco', email: 'loja@mail.com', role: 'lojista', storeName: 'Bom Preço Express', storeAddress: 'Av Paulista 1000', xp: 500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=loja', isVerified: true },
    { id: 'u3', username: 'ana_limpeza', email: 'ana@mail.com', role: 'consumidor', xp: 120, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana' }
  ]);
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<1 | 2 | 3>(1);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'consumidor' | 'lojista'>('consumidor');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    storeName: '',
    storeAddress: '',
    neighborhood: '',
    state: 'SP',
    city: 'São Paulo'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    marketName: '',
    neighborhood: '',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'
  });

  const [adminTab, setAdminTab] = useState<'Dashboard' | 'Usuarios' | 'Produtos' | 'Cidades'>('Dashboard');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -23.55, lng: -46.63 });
  const [adminSearch, setAdminSearch] = useState('');

  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'newpass'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCodeInput, setForgotCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [rankingModalOpen, setRankingModalOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const savedLoc = localStorage.getItem('achadex-location-v1');
    const savedUsers = localStorage.getItem('achadex-users-v1');
    const savedProducts = localStorage.getItem('achadex-products-v1');
    const savedAuth = localStorage.getItem('achadex-auth-v1');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedAuth) {
      const u = JSON.parse(savedAuth);
      setUser(u);
      if (u.email === 'kryptonhostingv@gmail.com') setIsAdmin(true);
    }

    if (savedLoc) {
      const loc = JSON.parse(savedLoc);
      setSelectedState(loc.state);
      setSelectedCity(loc.city);
      if (CAPITALS[loc.state.sigla]) {
        setMapCenter(CAPITALS[loc.state.sigla]);
      }
    } else {
      setSelectedState({ sigla: 'SP', nome: 'São Paulo' });
      setSelectedCity('São Paulo');
      setLocationModalOpen(false);
    }

    fetchStates();
  }, []);

  useEffect(() => {
    localStorage.setItem('achadex-users-v1', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('achadex-products-v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('achadex-auth-v1', JSON.stringify(user));
    } else {
      localStorage.removeItem('achadex-auth-v1');
    }
  }, [user]);

  const fetchStates = async () => {
    try {
      setLoadingStates(true);
      const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      const data = await res.json();
      if (data && data.length > 0) {
        setStates(data);
      }
    } catch {
      setStates(FALLBACK_STATES);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCitiesByUF = async (uf: string) => {
    try {
      setLoadingCities(true);
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
      const data = await res.json();
      setCities(data);
    } catch {
      setCities([{ id: 1, nome: 'Capital' }]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSelectState = (st: any) => {
    setSelectedState(st);
    setLocationStep('city');
    fetchCitiesByUF(st.sigla);
  };

  const handleSelectCity = (ct: any) => {
    const cityName = typeof ct === 'string' ? ct : ct.nome;
    setSelectedCity(cityName);
    if (selectedState && CAPITALS[selectedState.sigla]) {
      setMapCenter(CAPITALS[selectedState.sigla]);
    }
    localStorage.setItem('achadex-location-v1', JSON.stringify({ state: selectedState, city: cityName }));
    setLocationModalOpen(false);
    addToast(`Achadex configurado para ${cityName} - ${selectedState?.sigla}`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.includes('@') || formData.password.length < 4) {
      addToast('Preencha os campos corretamente (senha mínima 4 dígitos).', 'error');
      return;
    }
    if (users.some((u) => u.username === formData.username || u.email === formData.email)) {
      addToast('Usuário ou e-mail já cadastrados.', 'error');
      return;
    }

    const isSystemAdmin = formData.email === 'kryptonhostingv@gmail.com' && formData.password === 'jaohjhjwe1i6eA@';

    const newUser = {
      id: 'u_' + Date.now(),
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: isSystemAdmin ? 'admin' : authRole,
      storeName: authRole === 'lojista' ? formData.storeName : undefined,
      storeAddress: authRole === 'lojista' ? formData.storeAddress : undefined,
      xp: 50,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
      isVerified: authRole === 'lojista' || isSystemAdmin
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    if (isSystemAdmin) {
      setIsAdmin(true);
      addToast('Bem-vindo, Administrador Supremo!');
    } else {
      addToast('Conta criada com sucesso! +50 XP ganho.');
    }
    setAuthModalOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(
      (u) => (u.username === formData.username || u.email === formData.username) && u.password === formData.password
    );

    if (!found) {
      addToast('Credenciais inválidas.', 'error');
      return;
    }

    if (found.email === 'kryptonhostingv@gmail.com' && found.password === 'jaohjhjwe1i6eA@') {
      setIsAdmin(true);
      addToast('Bem-vindo Admin.');
    } else {
      setIsAdmin(false);
      addToast(`Bem-vindo de volta, ${found.username}!`);
    }

    setUser(found);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    addToast('Sessão encerrada.');
  };

  const enviarCodigoRecuperacao = async () => {
    if (!forgotEmail || !forgotEmail.includes('@')) {
      addToast('Digite um e-mail válido.', 'error');
      return;
    }
    const userExist = users.some((u) => u.email === forgotEmail);
    if (!userExist) {
      addToast('E-mail não cadastrado.', 'error');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    localStorage.setItem('achadex-reset', JSON.stringify({ code, expires: Date.now() + 600000 }));
    setForgotLoading(true);

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: forgotEmail,
        to_name: forgotEmail.split('@')[0],
        code: code
      }, PUBLIC_KEY);
      addToast('Código enviado para o seu e-mail.');
    } catch (err) {
      console.log('MODO TESTE Código de recuperação:', code, err);
      addToast(`MODO TESTE: Seu código é ${code}`);
    } finally {
      setForgotLoading(false);
      setForgotStep('code');
    }
  };

  const verificarCodigo = () => {
    const saved = localStorage.getItem('achadex-reset');
    if (!saved) {
      addToast('Código expirado ou inválido.', 'error');
      return;
    }
    const data = JSON.parse(saved);
    if (Date.now() > data.expires) {
      addToast('Código expirado.', 'error');
      return;
    }
    if (data.code !== forgotCodeInput) {
      addToast('Código incorreto.', 'error');
      return;
    }
    addToast('Código correto!');
    setForgotStep('newpass');
  };

  const salvarNovaSenha = () => {
    if (newPassword.length < 4 || newPassword !== confirmNewPassword) {
      addToast('Senhas não conferem ou são curtas (mín 4).', 'error');
      return;
    }
    const updatedUsers = users.map((u) => {
      if (u.email === forgotEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.removeItem('achadex-reset');
    addToast('Senha alterada com sucesso!');
    setAuthStep(2);
    setForgotStep('email');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!newProduct.name || !newProduct.price || !newProduct.marketName || !newProduct.neighborhood) {
      addToast('Preencha todos os campos do achado.', 'error');
      return;
    }

    const rndLat = mapCenter.lat + (Math.random() - 0.5) * 0.04;
    const rndLng = mapCenter.lng + (Math.random() - 0.5) * 0.04;

    const prod = {
      id: 'p_' + Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      marketName: newProduct.marketName,
      neighborhood: newProduct.neighborhood,
      city: selectedCity || 'São Paulo',
      state: selectedState?.sigla || 'SP',
      lat: rndLat,
      lng: rndLng,
      category: newProduct.category,
      imageUrl: newProduct.imageUrl,
      createdAt: Date.now(),
      authorId: user.id,
      authorUsername: user.username,
      authorRole: user.role,
      isVerified: user.role === 'lojista' || user.isVerified || false,
      confirms: 1,
      views: 10
    };

    setProducts([prod, ...products]);

    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        const newXp = (u.xp || 0) + 10;
        const updatedUser = { ...u, xp: newXp };
        setUser(updatedUser);
        return updatedUser;
      }
      return u;
    });
    setUsers(updatedUsers);

    addToast('Achado publicado com sucesso! +10 XP');
    setAddModalOpen(false);
    setNewProduct({ name: '', price: '', marketName: '', neighborhood: '', category: 'Alimentos', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80' });
  };

  const handleConfirmPrice = (productId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setProducts(products.map((p) => (p.id === productId ? { ...p, confirms: p.confirms + 1 } : p)));
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        const newXp = (u.xp || 0) + 50;
        const updated = { ...u, xp: newXp };
        setUser(updated);
        return updated;
      }
      return u;
    });
    setUsers(updatedUsers);
    addToast('Preço confirmado! +50 XP');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCity = selectedCity ? p.city?.toLowerCase() === selectedCity.toLowerCase() : true;
      const matchState = selectedState ? p.state?.toUpperCase() === selectedState.sigla.toUpperCase() : true;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.marketName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchCity && matchState && matchSearch && matchCat;
    });
  }, [products, selectedCity, selectedState, searchQuery, selectedCategory]);

  const topCityStats = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const key = `${p.city} - ${p.state}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    let top = 'Nenhuma';
    let max = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        top = k;
      }
    });
    return top;
  }, [products]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-[#D4FF32] neon-glow" />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur border-b border-[#2A2A2A] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-2xl font-black tracking-wider text-[#D4FF32]">
            ACHADEX <span className="text-white text-lg">X</span>
          </h1>
          <button
            onClick={() => { setLocationModalOpen(true); setLocationStep('state'); }}
            className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-1.5 rounded-full text-xs font-medium hover:border-[#D4FF32] transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4FF32]" />
            <span>{selectedCity && selectedState ? `${selectedCity} - ${selectedState.sigla}` : 'Selecionar Cidade'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              onClick={() => setIsAdmin(false)}
              className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-500/30 transition flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Sair do Admin</span>
            </button>
          ) : user?.email === 'kryptonhostingv@gmail.com' ? (
            <button
              onClick={() => setIsAdmin(true)}
              className="bg-[#D4FF32] text-black px-4 py-2 rounded-full text-xs font-bold neon-glow flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Painel Admin</span>
            </button>
          ) : null}

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRankingModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1.5 rounded-full text-xs font-bold hover:border-[#D4FF32] transition"
              >
                <Trophy className="w-3.5 h-3.5 text-[#D4FF32]" />
                <span>{user.xp} XP</span>
              </button>
              <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] pl-1 pr-3 py-1 rounded-full">
                <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full bg-[#2A2A2A]" />
                <span className="text-xs font-medium max-w-[100px] truncate">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full hover:border-red-500 transition text-[#888] hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setAuthModalOpen(true); setAuthStep(1); }}
              className="bg-[#D4FF32] text-black font-bold px-5 py-2 rounded-full text-xs neon-glow hover:bg-[#c2eb22] transition"
            >
              Entrar / Cadastrar
            </button>
          )}
        </div>
      </header>

      {isAdmin ? (
        <div className="flex flex-1">
          <aside className="w-60 bg-[#1A1A1A] border-r border-[#2A2A2A] p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-[#888] uppercase px-3 mb-2">Painel de Controle</span>
            {['Dashboard', 'Usuarios', 'Produtos', 'Cidades'].map((tab) => (
              <button
                key={tab}
                onClick={() => setAdminTab(tab as any)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition ${adminTab === tab ? 'bg-[#D4FF32] text-black' : 'text-[#888] hover:bg-[#2A2A2A] hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </aside>
          <main className="flex-1 p-8 bg-[#0A0A0A]">
            {adminTab === 'Dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading">Visão Geral</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                    <p className="text-xs text-[#888]">Total Usuários</p>
                    <p className="text-3xl font-black mt-2">{users.length}</p>
                  </div>
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                    <p className="text-xs text-[#888]">Total Produtos</p>
                    <p className="text-3xl font-black mt-2 text-[#D4FF32]">{products.length}</p>
                  </div>
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                    <p className="text-xs text-[#888]">Total Lojistas</p>
                    <p className="text-3xl font-black mt-2 text-blue-400">{users.filter((u) => u.role === 'lojista').length}</p>
                  </div>
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                    <p className="text-xs text-[#888]">Top Cidade</p>
                    <p className="text-lg font-bold mt-2 truncate">{topCityStats}</p>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'Usuarios' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-heading">Gerenciar Usuários</h2>
                  <input
                    type="text"
                    placeholder="Buscar usuário..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-2 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                  />
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#2A2A2A]/50 text-[#888]">
                      <tr>
                        <th className="p-4">Usuário</th>
                        <th className="p-4">E-mail</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">XP</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {users.filter((u) => u.username.toLowerCase().includes(adminSearch.toLowerCase())).map((u) => (
                        <tr key={u.id}>
                          <td className="p-4 flex items-center gap-3">
                            <img src={u.avatar} alt="" className="w-7 h-7 rounded-full bg-[#2A2A2A]" />
                            <span className="font-bold">{u.username}</span>
                          </td>
                          <td className="p-4 text-[#888]">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.role === 'lojista' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#D4FF32]/20 text-[#D4FF32]'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">{u.xp} XP</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setUsers(users.map((usr) => (usr.id === u.id ? { ...usr, role: 'lojista', isVerified: true } : usr)));
                                addToast('Selo de loja concedido!');
                              }}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-bold hover:bg-blue-500/30"
                            >
                              Dar Selo
                            </button>
                            <button
                              onClick={() => {
                                setUsers(users.filter((usr) => usr.id !== u.id));
                                addToast('Usuário removido.');
                              }}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'Produtos' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-heading">Gerenciar Produtos</h2>
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-2 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                  />
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#2A2A2A]/50 text-[#888]">
                      <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Mercado</th>
                        <th className="p-4">Local</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {products.filter((p) => p.name.toLowerCase().includes(adminSearch.toLowerCase())).map((p) => (
                        <tr key={p.id}>
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover bg-[#2A2A2A]" />
                            <span className="font-bold">{p.name}</span>
                          </td>
                          <td className="p-4 text-[#D4FF32] font-bold">R$ {p.price.toFixed(2)}</td>
                          <td className="p-4">{p.marketName}</td>
                          <td className="p-4 text-[#888]">{p.city} - {p.state}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setProducts(products.map((prod) => (prod.id === p.id ? { ...prod, isFeatured: !prod.isFeatured } : prod)));
                                addToast('Destaque alterado!');
                              }}
                              className={`px-3 py-1 rounded-lg font-bold ${p.isFeatured ? 'bg-[#D4FF32] text-black' : 'bg-[#2A2A2A] text-white'}`}
                            >
                              Destacar
                            </button>
                            <button
                              onClick={() => {
                                setProducts(products.filter((prod) => prod.id !== p.id));
                                addToast('Produto excluído.');
                              }}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'Cidades' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading">Estatísticas por Cidade</h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(
                    products.reduce((acc: any, p) => {
                      const key = `${p.city} - ${p.state}`;
                      acc[key] = (acc[key] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([cityKey, count]: [string, any]) => (
                    <div key={cityKey} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
                      <p className="text-sm font-bold">{cityKey}</p>
                      <p className="text-2xl font-black text-[#D4FF32] mt-2">{count} achados</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        <main className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#888]" />
              <input
                type="text"
                placeholder="Buscar produto ou mercado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] pl-11 pr-4 py-3 rounded-full text-xs outline-none focus:border-[#D4FF32] transition"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['Todos', 'Alimentos', 'Bebidas', 'Limpeza', 'Hortifruti', 'Carnes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${selectedCategory === cat ? 'bg-[#D4FF32] text-black' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-[#2A2A2A] relative">
            <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {filteredProducts.map((p) => (
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading">Achados em {selectedCity}</h2>
              <span className="text-xs text-[#888]">{filteredProducts.length} itens encontrados</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-12 text-center space-y-4">
                <p className="text-sm text-[#888]">Nenhum achado em {selectedCity} ainda. Seja o primeiro a postar!</p>
                <button
                  onClick={() => {
                    if (!user) setAuthModalOpen(true);
                    else setAddModalOpen(true);
                  }}
                  className="bg-[#D4FF32] text-black font-bold px-6 py-2.5 rounded-full text-xs neon-glow"
                >
                  Adicionar Achado
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-[#D4FF32] transition group"
                  >
                    <img src={p.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover bg-[#2A2A2A]" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold group-hover:text-[#D4FF32] transition">{p.name}</h3>
                          {p.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                        </div>
                        <p className="text-xs text-[#888] mt-0.5">{p.marketName} • {p.neighborhood}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-base font-black text-[#D4FF32]">R$ {p.price.toFixed(2)}</span>
                        <div className="flex items-center gap-3 text-[10px] text-[#888]">
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {p.confirms}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      <button
        onClick={() => {
          if (!user) setAuthModalOpen(true);
          else setAddModalOpen(true);
        }}
        className="fixed bottom-6 left-6 z-40 bg-[#D4FF32] text-black font-black p-4 rounded-full neon-glow hover:scale-105 transition flex items-center justify-center shadow-2xl"
      >
        <Plus className="w-6 h-6" />
      </button>

      {locationModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading">
                {locationStep === 'state' ? 'Escolha o Estado' : `Municípios de ${selectedState?.nome}`}
              </h3>
              <button onClick={() => setLocationModalOpen(false)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {locationStep === 'state' ? (
              <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-2">
                {states.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelectState(st)}
                    className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-left hover:border-[#D4FF32] hover:bg-[#D4FF32] hover:text-black transition group"
                  >
                    <p className="font-black text-sm">{st.sigla}</p>
                    <p className="text-[10px] text-[#888] group-hover:text-black truncate">{st.nome}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setLocationStep('state')}
                  className="flex items-center gap-2 text-xs text-[#888] hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" /> <span>Voltar para estados</span>
                </button>
                <input
                  type="text"
                  placeholder="Buscar município..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                />
                <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                  {loadingCities ? (
                    <p className="text-xs text-[#888] text-center py-4">Carregando municípios...</p>
                  ) : (
                    cities
                      .filter((c) => c.nome.toLowerCase().includes(searchCity.toLowerCase()))
                      .map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectCity(c)}
                          className="w-full text-left px-4 py-2.5 rounded-xl text-xs hover:bg-[#D4FF32] hover:text-black transition font-medium"
                        >
                          {c.nome}
                        </button>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {authModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading">
                {authStep === 1 ? 'Como você quer entrar?' : authStep === 2 ? (authMode === 'login' ? 'Entrar' : 'Criar Conta') : 'Recuperar Senha'}
              </h3>
              <button onClick={() => setAuthModalOpen(false)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setAuthRole('consumidor'); setAuthStep(2); setAuthMode('register'); }}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] p-6 rounded-2xl text-left hover:border-[#D4FF32] transition space-y-2 group"
                >
                  <Sparkles className="w-6 h-6 text-[#D4FF32]" />
                  <p className="font-bold text-sm">Consumidor</p>
                  <p className="text-[10px] text-[#888]">Ache barato e ganhe XP</p>
                </button>
                <button
                  onClick={() => { setAuthRole('lojista'); setAuthStep(2); setAuthMode('register'); }}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] p-6 rounded-2xl text-left hover:border-blue-400 transition space-y-2 group"
                >
                  <Store className="w-6 h-6 text-blue-400" />
                  <p className="font-bold text-sm">Dono de Loja</p>
                  <p className="text-[10px] text-[#888]">Selo azul verificado</p>
                </button>
              </div>
            )}

            {authStep === 2 && (
              <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome de usuário ou e-mail"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                />
                {authMode === 'register' && (
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                  />
                )}
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                />
                {authRole === 'lojista' && authMode === 'register' && (
                  <>
                    <input
                      type="text"
                      placeholder="Nome da Loja"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                    />
                    <input
                      type="text"
                      placeholder="Endereço da Loja"
                      value={formData.storeAddress}
                      onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                    />
                  </>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-xl text-xs neon-glow hover:bg-[#c2eb22] transition"
                >
                  {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                </button>
                <div className="flex justify-between items-center text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-[#888] hover:text-white"
                  >
                    {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthStep(3); setForgotStep('email'); }}
                    className="text-[#D4FF32] underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </form>
            )}

            {authStep === 3 && (
              <div className="space-y-4">
                {forgotStep === 'email' && (
                  <>
                    <p className="text-xs text-[#888]">Digite seu e-mail cadastrado para receber o código de recuperação.</p>
                    <input
                      type="email"
                      placeholder="Seu e-mail cadastrado"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                    />
                    <button
                      onClick={enviarCodigoRecuperacao}
                      disabled={forgotLoading}
                      className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-xl text-xs neon-glow"
                    >
                      {forgotLoading ? 'Enviando...' : 'Enviar código de 6 dígitos'}
                    </button>
                  </>
                )}
                {forgotStep === 'code' && (
                  <>
                    <p className="text-xs text-[#888]">Digite o código de 6 dígitos enviado para {forgotEmail}</p>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={forgotCodeInput}
                      onChange={(e) => setForgotCodeInput(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-center tracking-widest text-2xl py-3 rounded-xl font-mono outline-none focus:border-[#D4FF32]"
                    />
                    <button
                      onClick={verificarCodigo}
                      className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-xl text-xs neon-glow"
                    >
                      Verificar código
                    </button>
                  </>
                )}
                {forgotStep === 'newpass' && (
                  <>
                    <input
                      type="password"
                      placeholder="Nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                    />
                    <input
                      type="password"
                      placeholder="Confirmar nova senha"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
                    />
                    <button
                      onClick={salvarNovaSenha}
                      className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-xl text-xs neon-glow"
                    >
                      Salvar nova senha
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading">Publicar Novo Achado</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-3 rounded-xl text-xs text-[#888]">
                Publicando em <span className="text-white font-bold">{selectedCity} - {selectedState?.sigla}</span> (Automático)
              </div>
              <input
                type="text"
                placeholder="Nome do Produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço (Ex: 4.99)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
              />
              <input
                type="text"
                placeholder="Nome do Mercado (Ex: Assaí)"
                value={newProduct.marketName}
                onChange={(e) => setNewProduct({ ...newProduct, marketName: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
              />
              <input
                type="text"
                placeholder="Bairro"
                value={newProduct.neighborhood}
                onChange={(e) => setNewProduct({ ...newProduct, neighborhood: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-xs outline-none focus:border-[#D4FF32]"
              >
                {['Alimentos', 'Bebidas', 'Limpeza', 'Hortifruti', 'Carnes'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-[#D4FF32] text-black font-bold py-3 rounded-xl text-xs neon-glow hover:bg-[#c2eb22] transition"
              >
                Publicar Achado
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading">Detalhes do Achado</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedProduct.imageUrl} alt="" className="w-full h-48 rounded-2xl object-cover bg-[#2A2A2A]" />
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold">{selectedProduct.name}</h4>
                <span className="text-2xl font-black text-[#D4FF32]">R$ {selectedProduct.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#888]">{selectedProduct.marketName} • {selectedProduct.neighborhood} • {selectedProduct.city}/{selectedProduct.state}</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-[#888]">Postado por:</span>
                <span className="text-xs font-bold">{selectedProduct.authorUsername}</span>
                {selectedProduct.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleConfirmPrice(selectedProduct.id)}
                className="flex-1 bg-[#D4FF32] text-black font-bold py-3 rounded-xl text-xs neon-glow flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" /> Confirmar Preço (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {rankingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading">Ranking de XP</h3>
              <button onClick={() => setRankingModalOpen(false)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {users.sort((a, b) => b.xp - a.xp).map((u, index) => (
                <div key={u.id} className="flex items-center justify-between bg-[#0A0A0A] border border-[#2A2A2A] p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-[#D4FF32]">#{index + 1}</span>
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-[#2A2A2A]" />
                    <div>
                      <p className="text-xs font-bold">{u.username}</p>
                      <p className="text-[10px] text-[#888]">{u.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#D4FF32]">{u.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
