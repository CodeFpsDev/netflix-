import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { NetflixProfile, PaymentLog, AccountName, PaymentStatus, ClientStatus } from './types';
import {
  Tv,
  CheckCircle2,
  Clock,
  UserCheck,
  UserPlus,
  Calendar,
  DollarSign,
  MessageCircle,
  Edit3,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Search,
  Database,
  History,
  X,
  Lock,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  CalendarClock,
  Smartphone,
  BarChart3,
  TrendingUp,
  Percent,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const INITIAL_PROFILES: NetflixProfile[] = [
  // Cuenta 1: eliasespinola (5 perfiles)
  {
    id: 'eliasespinola_1',
    accountName: 'eliasespinola',
    profileNumber: 1,
    clientName: 'Carlos Mendoza',
    clientPhone: '+595981123456',
    paymentDate: '2026-11-06',
    paymentStatus: 'pagado',
    clientStatus: 'renovado',
    price: 35000,
    pin: '1024',
    isExtension: false,
    notes: 'Paga puntual por transferencia bancaria',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'eliasespinola_2',
    accountName: 'eliasespinola',
    profileNumber: 2,
    clientName: 'Laura Benítez',
    clientPhone: '+595982654321',
    paymentDate: '2026-10-18',
    paymentStatus: 'pendiente',
    clientStatus: 'nuevo',
    price: 35000,
    pin: '4421',
    isExtension: false,
    notes: 'Primer mes contratado, avisar un día antes',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'eliasespinola_3',
    accountName: 'eliasespinola',
    profileNumber: 3,
    clientName: 'Martín Duarte',
    clientPhone: '+595971987654',
    paymentDate: '2026-10-20',
    paymentStatus: 'pagado',
    clientStatus: 'renovado',
    price: 35000,
    pin: '8832',
    isExtension: false,
    notes: 'Cliente desde hace 6 meses',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'eliasespinola_4',
    accountName: 'eliasespinola',
    profileNumber: 4,
    clientName: 'Andrea Gómez',
    clientPhone: '+595983112233',
    paymentDate: '2026-10-22',
    paymentStatus: 'pendiente',
    clientStatus: 'renovado',
    price: 35000,
    pin: '2345',
    isExtension: false,
    notes: 'Suele pagar los días 22',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'eliasespinola_5',
    accountName: 'eliasespinola',
    profileNumber: 5,
    clientName: 'Jorge Ramírez',
    clientPhone: '+595984556677',
    paymentDate: '2026-10-25',
    paymentStatus: 'pagado',
    clientStatus: 'nuevo',
    price: 35000,
    pin: '9182',
    isExtension: false,
    notes: 'Nuevo cliente referido por Carlos',
    updatedAt: new Date().toISOString()
  },

  // Cuenta 2: mynetfilin (5 perfiles)
  {
    id: 'mynetfilin_1',
    accountName: 'mynetfilin',
    profileNumber: 1,
    clientName: 'Fernanda Ortiz',
    clientPhone: '+595985998877',
    paymentDate: '2026-11-11',
    paymentStatus: 'pagado',
    clientStatus: 'renovado',
    price: 35000,
    pin: '7721',
    isExtension: false,
    notes: 'Pago adelantado recibido',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mynetfilin_2',
    accountName: 'mynetfilin',
    profileNumber: 2,
    clientName: 'Diego Villalba',
    clientPhone: '+595972443322',
    paymentDate: '2026-10-14',
    paymentStatus: 'pendiente',
    clientStatus: 'renovado',
    price: 35000,
    pin: '3319',
    isExtension: false,
    notes: 'Vence pronto, enviar recordatorio hoy',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mynetfilin_3',
    accountName: 'mynetfilin',
    profileNumber: 3,
    clientName: 'Patricia Sosa',
    clientPhone: '+595981778899',
    paymentDate: '2026-10-16',
    paymentStatus: 'pagado',
    clientStatus: 'nuevo',
    price: 35000,
    pin: '5562',
    isExtension: false,
    notes: 'Nuevo cliente en Smart TV',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mynetfilin_4',
    accountName: 'mynetfilin',
    profileNumber: 4,
    clientName: 'Rodrigo Cáceres',
    clientPhone: '+595982334455',
    paymentDate: '2026-10-28',
    paymentStatus: 'pendiente',
    clientStatus: 'nuevo',
    price: 35000,
    pin: '6012',
    isExtension: false,
    notes: 'Activado recientemente',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mynetfilin_5',
    accountName: 'mynetfilin',
    profileNumber: 5,
    clientName: 'Valeria Rivas',
    clientPhone: '+595983990011',
    paymentDate: '2026-10-30',
    paymentStatus: 'pagado',
    clientStatus: 'renovado',
    price: 35000,
    pin: '1239',
    isExtension: false,
    notes: 'Cliente fijo',
    updatedAt: new Date().toISOString()
  },

  // Cuenta 3 / Extensión Extra: milena (1 perfil para 1 solo dispositivo)
  {
    id: 'milena_1',
    accountName: 'milena',
    profileNumber: 1,
    clientName: 'Milena',
    clientPhone: '+595981554433',
    paymentDate: '2026-11-05',
    paymentStatus: 'pagado',
    clientStatus: 'renovado',
    price: 25000,
    pin: '7391',
    isExtension: true,
    deviceLimit: '1 solo dispositivo',
    notes: 'Extensión de perfil · Habilitada para 1 solo dispositivo',
    updatedAt: new Date().toISOString()
  }
];

// Helper to calculate days remaining until renewal
export function calculateDaysRemaining(dateStr: string): {
  days: number;
  label: string;
  tone: 'ok' | 'warning' | 'urgent' | 'expired';
} {
  if (!dateStr) {
    return { days: 0, label: '(sin fecha)', tone: 'ok' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return { days: 0, label: '(fecha inválida)', tone: 'ok' };
  }

  const due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return {
      days: diffDays,
      label: `(falta ${diffDays} días)`,
      tone: diffDays <= 3 ? 'warning' : 'ok'
    };
  } else if (diffDays === 1) {
    return {
      days: 1,
      label: '(falta 1 día)',
      tone: 'warning'
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      label: '(¡vence hoy!)',
      tone: 'urgent'
    };
  } else if (diffDays === -1) {
    return {
      days: -1,
      label: '(vencido hace 1 día)',
      tone: 'expired'
    };
  } else {
    return {
      days: diffDays,
      label: `(vencido hace ${Math.abs(diffDays)} días)`,
      tone: 'expired'
    };
  }
}

export default function App() {
  const [profiles, setProfiles] = useState<NetflixProfile[]>([]);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const currencySymbol = '₲';

  // Filters & Tabs
  const [selectedAccount, setSelectedAccount] = useState<'all' | AccountName>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pagado' | 'pendiente'>('all');
  const [clientFilter, setClientFilter] = useState<'all' | 'renovado' | 'nuevo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'cuentas' | 'tabla' | 'graficos' | 'historial'>('cuentas');
  const [chartViewMode, setChartViewMode] = useState<'comparativo' | 'total'>('comparativo');

  // Modals state
  const [editingProfile, setEditingProfile] = useState<NetflixProfile | null>(null);

  // Dedicated PIN Window / Modal State
  const [pinModalProfile, setPinModalProfile] = useState<NetflixProfile | null>(null);
  const [inputPinValue, setInputPinValue] = useState<string>('');
  const [showPinDigits, setShowPinDigits] = useState<boolean>(true);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);

  // Dedicated Individual Reset Recuadro Modal State
  const [resetModalProfile, setResetModalProfile] = useState<NetflixProfile | null>(null);
  const [resetDateOption, setResetDateOption] = useState<'keep' | 'today' | 'plus30' | 'custom'>('keep');
  const [resetCustomDate, setResetCustomDate] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Subscribe to Firestore in real-time
  useEffect(() => {
    setLoading(true);
    const profilesCol = collection(db, 'netflix_profiles');

    const unsubscribe = onSnapshot(profilesCol, (snapshot) => {
      if (snapshot.empty) {
        seedInitialProfiles();
      } else {
        const loaded: NetflixProfile[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...(d.data() as Omit<NetflixProfile, 'id'>) });
        });

        // Ensure 'milena_1' is present in Firestore
        const hasMilena = loaded.some(p => p.id === 'milena_1' || p.accountName === 'milena');
        if (!hasMilena) {
          const milenaProfile = INITIAL_PROFILES.find(p => p.id === 'milena_1')!;
          setDoc(doc(db, 'netflix_profiles', 'milena_1'), milenaProfile).catch(console.error);
          loaded.push(milenaProfile);
        }

        const orderMap: Record<string, number> = {
          eliasespinola: 1,
          mynetfilin: 2,
          milena: 3
        };

        loaded.sort((a, b) => {
          const ordA = orderMap[a.accountName] || 99;
          const ordB = orderMap[b.accountName] || 99;
          if (ordA !== ordB) return ordA - ordB;
          return a.profileNumber - b.profileNumber;
        });

        setProfiles(loaded);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching netflix_profiles from Firestore:', error);
      setProfiles(INITIAL_PROFILES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Payment Logs in real-time
  useEffect(() => {
    const logsCol = collection(db, 'payment_logs');
    const logsQuery = query(logsCol, orderBy('date', 'desc'), limit(30));

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const logs: PaymentLog[] = [];
      snapshot.forEach(d => {
        logs.push({ id: d.id, ...(d.data() as Omit<PaymentLog, 'id'>) });
      });
      setPaymentLogs(logs);
    }, (err) => {
      console.warn('Payment logs listener error:', err);
    });

    return () => unsubscribe();
  }, []);

  // Seed all profiles in Firestore
  const seedInitialProfiles = async () => {
    try {
      setIsSyncing(true);
      for (const p of INITIAL_PROFILES) {
        await setDoc(doc(db, 'netflix_profiles', p.id), p);
      }
      setProfiles(INITIAL_PROFILES);
      showToast('Base de datos Firestore sincronizada con todas las cuentas y extensión.');
    } catch (err) {
      console.error('Error seeding profiles to Firestore:', err);
      setProfiles(INITIAL_PROFILES);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  // Open PIN Modal
  const handleOpenPinModal = (profile: NetflixProfile) => {
    setPinModalProfile(profile);
    setInputPinValue(profile.pin || '');
    setShowPinDigits(true);
    setCopiedPin(false);
  };

  // Save PIN directly to Firestore
  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinModalProfile) return;

    const trimmedPin = inputPinValue.trim();
    try {
      setIsSyncing(true);
      const docRef = doc(db, 'netflix_profiles', pinModalProfile.id);
      await updateDoc(docRef, {
        pin: trimmedPin,
        updatedAt: new Date().toISOString()
      });

      setPinModalProfile(prev => prev ? { ...prev, pin: trimmedPin } : null);
      showToast(`PIN guardado correctamente para ${pinModalProfile.clientName}: [${trimmedPin || 'Sin PIN'}]`);
    } catch (err) {
      console.error('Error saving PIN in Firestore:', err);
      showToast('Error al guardar el PIN en Firestore');
    } finally {
      setIsSyncing(false);
    }
  };

  // Copy PIN to clipboard
  const handleCopyPin = (pinText: string) => {
    if (!pinText) return;
    navigator.clipboard.writeText(pinText);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
    showToast(`PIN ${pinText} copiado al portapapeles`);
  };

  // Open dedicated Reset Modal for a specific Recuadro (profile)
  const handleOpenResetModal = (profile: NetflixProfile) => {
    setResetModalProfile(profile);
    setResetDateOption('keep');
    setResetCustomDate(profile.paymentDate || new Date().toISOString().slice(0, 10));
  };

  // Confirm Reset for this single Recuadro
  // GUARANTEE: Does NOT touch clientName or price loaded by the user!
  const handleConfirmResetRecuadro = async () => {
    if (!resetModalProfile) return;

    try {
      setIsSyncing(true);
      let targetDate = resetModalProfile.paymentDate;
      const todayStr = new Date().toISOString().slice(0, 10);

      if (resetDateOption === 'today') {
        targetDate = todayStr;
      } else if (resetDateOption === 'plus30') {
        const baseDate = new Date(resetModalProfile.paymentDate);
        const validDate = isNaN(baseDate.getTime()) ? new Date() : baseDate;
        validDate.setDate(validDate.getDate() + 30);
        targetDate = validDate.toISOString().slice(0, 10);
      } else if (resetDateOption === 'custom' && resetCustomDate) {
        targetDate = resetCustomDate;
      }

      const docRef = doc(db, 'netflix_profiles', resetModalProfile.id);

      // ONLY resets paymentStatus to 'pendiente' and updates the renewal cycle date.
      // Keeps clientName, price, pin, phone, notes and other settings 100% intact!
      await updateDoc(docRef, {
        paymentStatus: 'pendiente',
        paymentDate: targetDate,
        updatedAt: new Date().toISOString()
      });

      // Register in payment history
      try {
        await addDoc(collection(db, 'payment_logs'), {
          profileId: resetModalProfile.id,
          clientName: resetModalProfile.clientName,
          accountName: resetModalProfile.accountName,
          profileNumber: resetModalProfile.profileNumber,
          amount: resetModalProfile.price,
          type: 'restablecimiento',
          date: new Date().toISOString(),
          notes: `Recuadro restablecido a Pago Pendiente (nuevo ciclo: ${targetDate}). Cliente y precio intactos.`
        });
      } catch (logErr) {
        console.warn('Log error:', logErr);
      }

      showToast(`✅ Recuadro Perfil ${resetModalProfile.profileNumber} restablecido a Pago Pendiente. Cliente "${resetModalProfile.clientName}" y precio ${currencySymbol} ${resetModalProfile.price.toLocaleString()} conservados.`);
      setResetModalProfile(null);
    } catch (err) {
      console.error('Error resetting recuadro:', err);
      showToast('Error al restablecer el recuadro en Firestore');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Payment Status
  const handleTogglePayment = async (profile: NetflixProfile) => {
    const nextStatus: PaymentStatus = profile.paymentStatus === 'pagado' ? 'pendiente' : 'pagado';
    try {
      setIsSyncing(true);
      const docRef = doc(db, 'netflix_profiles', profile.id);
      await updateDoc(docRef, {
        paymentStatus: nextStatus,
        updatedAt: new Date().toISOString()
      });

      if (nextStatus === 'pagado') {
        await addDoc(collection(db, 'payment_logs'), {
          profileId: profile.id,
          clientName: profile.clientName,
          accountName: profile.accountName,
          profileNumber: profile.profileNumber,
          amount: profile.price,
          type: 'pago',
          date: new Date().toISOString(),
          notes: `Pago registrado para perfil ${profile.profileNumber} (${profile.accountName})`
        });
        showToast(`Pago registrado para ${profile.clientName} en Firestore`);
      } else {
        showToast(`Estado cambiado a Pago Pendiente para ${profile.clientName}`);
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, paymentStatus: nextStatus } : p));
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Client Type (Renovado / Nuevo cliente)
  const handleToggleClientStatus = async (profile: NetflixProfile) => {
    const nextStatus: ClientStatus = profile.clientStatus === 'renovado' ? 'nuevo' : 'renovado';
    try {
      setIsSyncing(true);
      const docRef = doc(db, 'netflix_profiles', profile.id);
      await updateDoc(docRef, {
        clientStatus: nextStatus,
        updatedAt: new Date().toISOString()
      });
      showToast(`Cliente ${profile.clientName} marcado como ${nextStatus === 'renovado' ? 'Renovado' : 'Nuevo Cliente'}`);
    } catch (err) {
      console.error('Error updating client status:', err);
      setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, clientStatus: nextStatus } : p));
    } finally {
      setIsSyncing(false);
    }
  };

  // Renew for +30 days / Next Month
  const handleRenewMonth = async (profile: NetflixProfile) => {
    const current = new Date(profile.paymentDate);
    const validDate = isNaN(current.getTime()) ? new Date() : current;
    validDate.setDate(validDate.getDate() + 30);
    const newDateStr = validDate.toISOString().slice(0, 10);

    try {
      setIsSyncing(true);
      const docRef = doc(db, 'netflix_profiles', profile.id);
      await updateDoc(docRef, {
        paymentDate: newDateStr,
        paymentStatus: 'pagado',
        clientStatus: 'renovado',
        updatedAt: new Date().toISOString()
      });

      await addDoc(collection(db, 'payment_logs'), {
        profileId: profile.id,
        clientName: profile.clientName,
        accountName: profile.accountName,
        profileNumber: profile.profileNumber,
        amount: profile.price,
        type: 'renovacion',
        date: new Date().toISOString(),
        notes: `Renovación de +30 días hasta el ${newDateStr}`
      });

      showToast(`¡${profile.clientName} renovado exitosamente hasta el ${newDateStr}!`);
    } catch (err) {
      console.error('Error renewing client:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Edit Profile Modal
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    try {
      setIsSyncing(true);
      const docRef = doc(db, 'netflix_profiles', editingProfile.id);
      await updateDoc(docRef, {
        clientName: editingProfile.clientName.trim(),
        clientPhone: editingProfile.clientPhone.trim(),
        paymentDate: editingProfile.paymentDate,
        paymentStatus: editingProfile.paymentStatus,
        clientStatus: editingProfile.clientStatus,
        price: Number(editingProfile.price) || 0,
        pin: editingProfile.pin.trim(),
        notes: editingProfile.notes.trim(),
        isExtension: !!editingProfile.isExtension,
        deviceLimit: editingProfile.isExtension ? '1 solo dispositivo' : 'Perfil estándar',
        updatedAt: new Date().toISOString()
      });
      showToast(`Datos actualizados en Firestore para ${editingProfile.clientName}`);
      setEditingProfile(null);
    } catch (err) {
      console.error('Error saving profile changes:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // WhatsApp Message Generator
  const sendWhatsAppReminder = (profile: NetflixProfile) => {
    const cleanPhone = profile.clientPhone.replace(/[^0-9]/g, '');
    const countdown = calculateDaysRemaining(profile.paymentDate);
    const extensionNote = profile.isExtension || profile.accountName === 'milena'
      ? '\n⚠️ Nota: Este perfil es una extensión exclusiva para 1 solo dispositivo.'
      : '';

    let text = '';
    if (profile.paymentStatus === 'pendiente') {
      text = `Hola ${profile.clientName}, te escribimos sobre tu perfil ${profile.profileNumber} (Cuenta: ${profile.accountName}). Tu fecha de pago es: ${profile.paymentDate} ${countdown.label}. Tu PIN es: ${profile.pin || 'Sin PIN'}. Monto mensual: ${currencySymbol} ${profile.price.toLocaleString()}.${extensionNote}\n¡Por favor confírmanos tu pago al transferir!`;
    } else {
      text = `Hola ${profile.clientName}, ¡muchas gracias por tu pago! Tu perfil ${profile.profileNumber} en la cuenta ${profile.accountName} está activo hasta el ${profile.paymentDate} ${countdown.label}. Tu PIN de acceso es: ${profile.pin || 'Sin PIN'}.${extensionNote}\n¡Que disfrutes tu servicio!`;
    }

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Calculation Metrics
  const paidProfiles = profiles.filter(p => p.paymentStatus === 'pagado');
  const pendingProfiles = profiles.filter(p => p.paymentStatus === 'pendiente');
  const renewedProfiles = profiles.filter(p => p.clientStatus === 'renovado');
  const newClients = profiles.filter(p => p.clientStatus === 'nuevo');

  const totalCollected = paidProfiles.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalPending = pendingProfiles.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalProjected = profiles.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const overallEfficiency = totalProjected > 0 ? Math.round((totalCollected / totalProjected) * 100) : 0;

  // Filtered List
  const filteredProfiles = profiles.filter(p => {
    if (selectedAccount !== 'all' && p.accountName !== selectedAccount) return false;
    if (paymentFilter !== 'all' && p.paymentStatus !== paymentFilter) return false;
    if (clientFilter !== 'all' && p.clientStatus !== clientFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.clientName.toLowerCase().includes(q);
      const matchPhone = p.clientPhone.toLowerCase().includes(q);
      const matchAccount = p.accountName.toLowerCase().includes(q);
      const matchPin = p.pin?.toLowerCase().includes(q);
      const matchNotes = p.notes?.toLowerCase().includes(q);
      return matchName || matchPhone || matchAccount || matchPin || matchNotes;
    }
    return true;
  });

  const eliasProfiles = filteredProfiles.filter(p => p.accountName === 'eliasespinola');
  const mynetProfiles = filteredProfiles.filter(p => p.accountName === 'mynetfilin');
  const milenaProfiles = filteredProfiles.filter(p => p.accountName === 'milena');

  // Profitability Chart Data for each account (eliasespinola, mynetfilin, milena)
  const getAccountRevenues = (accName: AccountName) => {
    const accProfiles = profiles.filter(p => p.accountName === accName);
    const paid = accProfiles.filter(p => p.paymentStatus === 'pagado').reduce((acc, p) => acc + (p.price || 0), 0);
    const pending = accProfiles.filter(p => p.paymentStatus === 'pendiente').reduce((acc, p) => acc + (p.price || 0), 0);
    const total = paid + pending;
    const efficiency = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { count: accProfiles.length, paid, pending, total, efficiency };
  };

  const eliasRev = getAccountRevenues('eliasespinola');
  const mynetRev = getAccountRevenues('mynetfilin');
  const milenaRev = getAccountRevenues('milena');

  const chartData = [
    {
      account: 'eliasespinola',
      displayName: 'eliasespinola',
      tipo: 'Cuenta Principal',
      perfiles: eliasRev.count,
      'Ingresos Cobrados': eliasRev.paid,
      'Ingresos Pendientes': eliasRev.pending,
      'Total Proyectado': eliasRev.total,
      tasaCobro: eliasRev.efficiency,
      barColor: '#f43f5e'
    },
    {
      account: 'mynetfilin',
      displayName: 'mynetfilin',
      tipo: 'Cuenta Principal',
      perfiles: mynetRev.count,
      'Ingresos Cobrados': mynetRev.paid,
      'Ingresos Pendientes': mynetRev.pending,
      'Total Proyectado': mynetRev.total,
      tasaCobro: mynetRev.efficiency,
      barColor: '#ef4444'
    },
    {
      account: 'milena',
      displayName: 'milena',
      tipo: 'Extensión 1 Dispositivo',
      perfiles: milenaRev.count,
      'Ingresos Cobrados': milenaRev.paid,
      'Ingresos Pendientes': milenaRev.pending,
      'Total Proyectado': milenaRev.total,
      tasaCobro: milenaRev.efficiency,
      barColor: '#d946ef'
    }
  ];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = chartData.find(d => d.displayName === label) || payload[0]?.payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 space-x-3">
            <span className="font-bold text-white text-sm">{data?.displayName}</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              {data?.tipo}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-400 font-medium">● Cobrado (Pagado):</span>
              <span className="font-bold text-emerald-300 font-mono">
                {currencySymbol} {data?.['Ingresos Cobrados']?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-amber-400 font-medium">● Pendiente por Cobrar:</span>
              <span className="font-bold text-amber-300 font-mono">
                {currencySymbol} {data?.['Ingresos Pendientes']?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4 pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-semibold">Total Mensual:</span>
              <span className="font-bold text-white font-mono">
                {currencySymbol} {data?.['Total Proyectado']?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4 pt-0.5 text-[11px] text-indigo-300">
              <span>Efectividad de Cobro:</span>
              <span className="font-bold">{data?.tasaCobro}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-rose-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 text-sm transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  StreamControl · Gestión de Perfiles
                </h1>
                <span className="text-[11px] bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded font-mono font-medium">
                  {profiles.length} Perfiles · eliasespinola, mynetfilin y milena
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center space-x-1">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firestore Cloud</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">Sincronización en vivo</span>
                {isSyncing && (
                  <span className="text-amber-400 flex items-center space-x-1 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Guardando...</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation view switches */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab('cuentas')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'cuentas' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cuentas & Extensión
              </button>
              <button
                onClick={() => setActiveTab('tabla')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'tabla' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabla General
              </button>
              <button
                onClick={() => setActiveTab('graficos')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'graficos' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Rentabilidad</span>
              </button>
              <button
                onClick={() => setActiveTab('historial')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'historial' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Historial de Pagos
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1: Cobrado */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Recaudado (Pagados)
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                {currencySymbol} {totalCollected.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{paidProfiles.length} de {profiles.length} perfiles al día</span>
            </div>
          </div>

          {/* Metric 2: Pendiente */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Por Cobrar (Pendientes)
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-bold text-amber-400">
                {currencySymbol} {totalPending.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{pendingProfiles.length} cobros pendientes</span>
            </div>
          </div>

          {/* Metric 3: Rentabilidad Total Proyectada */}
          <div
            onClick={() => setActiveTab('graficos')}
            className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-colors group"
          >
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Rentabilidad Mensual</span>
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl sm:text-2xl font-bold text-indigo-400">
                {currencySymbol} {totalProjected.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              <span>{overallEfficiency}% recaudado actualmente</span>
            </div>
          </div>

          {/* Metric 4: Clientes Renovados vs Nuevos */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Fidelidad de Clientes
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-bold text-white">
                {renewedProfiles.length}
              </span>
              <span className="text-xs text-indigo-400 font-medium">Renovados</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xl sm:text-2xl font-bold text-purple-400">
                {newClients.length}
              </span>
              <span className="text-xs text-purple-400 font-medium">Nuevos</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{profiles.length} clientes activos totales</span>
            </div>
          </div>
        </div>

        {/* Quick Profitability Banner */}
        {activeTab !== 'graficos' && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Rentabilidad por Cuenta:</span>
                  <span className="text-xs text-slate-400 font-normal">
                    eliasespinola ({currencySymbol} {eliasRev.total.toLocaleString()}) · mynetfilin ({currencySymbol} {mynetRev.total.toLocaleString()}) · milena ({currencySymbol} {milenaRev.total.toLocaleString()})
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualiza el gráfico de barras interactivo de ingresos acumulados con 'recharts'.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('graficos')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <span>Ver Gráfico de Barras</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB DE RENTABILIDAD & GRÁFICO RECHARTS */}
        {!loading && activeTab === 'graficos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header del análisis de rentabilidad */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
                <div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-rose-500" />
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Gráfico de Rentabilidad e Ingresos Acumulados
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Comparación mensual de cobros recaudados y pendientes por cada cuenta (eliasespinola, mynetfilin y milena).
                  </p>
                </div>

                {/* Switcher de modo de gráfico */}
                <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setChartViewMode('comparativo')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      chartViewMode === 'comparativo'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cobrado vs Pendiente
                  </button>
                  <button
                    onClick={() => setChartViewMode('total')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      chartViewMode === 'total'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Total Acumulado
                  </button>
                </div>
              </div>

              {/* RECHARTS BAR CHART */}
              <div className="w-full h-80 sm:h-96 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 15, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="displayName"
                      stroke="#94a3b8"
                      tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
                      tickLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickFormatter={(value) => `${currencySymbol} ${(value / 1000).toLocaleString()}k`}
                      tickLine={{ stroke: '#475569' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 15, fontSize: 12 }}
                      formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
                    />

                    {chartViewMode === 'comparativo' ? (
                      <>
                        <Bar
                          dataKey="Ingresos Cobrados"
                          name="Cobrado (Pagado)"
                          fill="#10b981"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={55}
                        />
                        <Bar
                          dataKey="Ingresos Pendientes"
                          name="Pendiente de Cobro"
                          fill="#f59e0b"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={55}
                        />
                      </>
                    ) : (
                      <Bar
                        dataKey="Total Proyectado"
                        name="Total Mensual Acumulado"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={65}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.barColor} />
                        ))}
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-850 gap-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                    <span>Cobrado (Al día)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                    <span>Pendiente de pago</span>
                  </div>
                </div>
                <span>Datos calculados en tiempo real con la base de datos Firestore</span>
              </div>
            </div>

            {/* Tarjetas de Rentabilidad Individual por Cuenta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cuenta 1: eliasespinola */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">eliasespinola</h3>
                      <span className="text-[11px] text-slate-400 font-mono">5 Perfiles</span>
                    </div>
                  </div>
                  <span className="text-xs bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded font-mono font-bold">
                    {eliasRev.efficiency}% Cobrado
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Proyectado:</span>
                    <span className="font-bold text-white font-mono">
                      {currencySymbol} {eliasRev.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400">Cobrado (Pagado):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {currencySymbol} {eliasRev.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400">Pendiente:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {currencySymbol} {eliasRev.pending.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${eliasRev.efficiency}%` }}
                  />
                </div>
              </div>

              {/* Cuenta 2: mynetfilin */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">mynetfilin</h3>
                      <span className="text-[11px] text-slate-400 font-mono">5 Perfiles</span>
                    </div>
                  </div>
                  <span className="text-xs bg-red-950/80 text-red-300 border border-red-800/60 px-2 py-0.5 rounded font-mono font-bold">
                    {mynetRev.efficiency}% Cobrado
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Proyectado:</span>
                    <span className="font-bold text-white font-mono">
                      {currencySymbol} {mynetRev.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400">Cobrado (Pagado):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {currencySymbol} {mynetRev.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400">Pendiente:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {currencySymbol} {mynetRev.pending.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${mynetRev.efficiency}%` }}
                  />
                </div>
              </div>

              {/* Cuenta 3: Extensión milena */}
              <div className="bg-slate-950 border border-fuchsia-800/50 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400 font-bold text-xs">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">milena (Extensión)</h3>
                      <span className="text-[11px] text-fuchsia-300 font-mono">1 Dispositivo</span>
                    </div>
                  </div>
                  <span className="text-xs bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/60 px-2 py-0.5 rounded font-mono font-bold">
                    {milenaRev.efficiency}% Cobrado
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Proyectado:</span>
                    <span className="font-bold text-white font-mono">
                      {currencySymbol} {milenaRev.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400">Cobrado (Pagado):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {currencySymbol} {milenaRev.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400">Pendiente:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {currencySymbol} {milenaRev.pending.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${milenaRev.efficiency}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls Bar (Visible en Vistas de Cuentas y Tabla) */}
        {activeTab !== 'graficos' && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Account Selector including Milena */}
              <div className="flex flex-wrap bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs gap-1">
                <button
                  onClick={() => setSelectedAccount('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedAccount === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({profiles.length})
                </button>
                <button
                  onClick={() => setSelectedAccount('eliasespinola')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedAccount === 'eliasespinola' ? 'bg-rose-900/60 text-rose-200 border border-rose-700/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  eliasespinola ({profiles.filter(p => p.accountName === 'eliasespinola').length})
                </button>
                <button
                  onClick={() => setSelectedAccount('mynetfilin')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedAccount === 'mynetfilin' ? 'bg-rose-900/60 text-rose-200 border border-rose-700/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  mynetfilin ({profiles.filter(p => p.accountName === 'mynetfilin').length})
                </button>
                <button
                  onClick={() => setSelectedAccount('milena')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                    selectedAccount === 'milena' ? 'bg-fuchsia-950 text-fuchsia-200 border border-fuchsia-700/60 font-semibold' : 'text-slate-400 hover:text-fuchsia-300'
                  }`}
                >
                  <Smartphone className="w-3 h-3 text-fuchsia-400" />
                  <span>milena ({profiles.filter(p => p.accountName === 'milena').length} · Extensión)</span>
                </button>
              </div>

              {/* Payment Filter */}
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setPaymentFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    paymentFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setPaymentFilter('pagado')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    paymentFilter === 'pagado' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pagados ({paidProfiles.length})
                </button>
                <button
                  onClick={() => setPaymentFilter('pendiente')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    paymentFilter === 'pendiente' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pendientes ({pendingProfiles.length})
                </button>
              </div>

              {/* Client Status Filter */}
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setClientFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    clientFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setClientFilter('renovado')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    clientFilter === 'renovado' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Renovados
                </button>
                <button
                  onClick={() => setClientFilter('nuevo')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    clientFilter === 'nuevo' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Nuevos
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar cliente, PIN..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Cargando base de datos Firestore...</p>
          </div>
        )}

        {/* TAB 1: ACCOUNTS & EXTENSION CARDS VIEW */}
        {!loading && activeTab === 'cuentas' && (
          <div className="space-y-8">
            {/* Account 1: eliasespinola */}
            {(selectedAccount === 'all' || selectedAccount === 'eliasespinola') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                        <span>Cuenta: eliasespinola</span>
                        <span className="text-xs text-rose-400 font-mono font-normal">
                          (5 Perfiles asignados)
                        </span>
                      </h2>
                      <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>5 Clientes</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {eliasProfiles.filter(p => p.paymentStatus === 'pagado').length} Pagados
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400">
                          {eliasProfiles.filter(p => p.paymentStatus === 'pendiente').length} Pendientes
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-mono font-medium">
                          Total: {currencySymbol} {eliasRev.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eliasProfiles.map(profile => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      currencySymbol={currencySymbol}
                      onOpenPinModal={() => handleOpenPinModal(profile)}
                      onTogglePayment={() => handleTogglePayment(profile)}
                      onToggleClientStatus={() => handleToggleClientStatus(profile)}
                      onRenewMonth={() => handleRenewMonth(profile)}
                      onReset={() => handleOpenResetModal(profile)}
                      onEdit={() => setEditingProfile(profile)}
                      onWhatsApp={() => sendWhatsAppReminder(profile)}
                    />
                  ))}
                  {eliasProfiles.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-slate-500 bg-slate-950/40 rounded-xl border border-slate-850">
                      No hay perfiles que coincidan con los filtros para la cuenta eliasespinola.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Account 2: mynetfilin */}
            {(selectedAccount === 'all' || selectedAccount === 'mynetfilin') && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold">
                      2
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                        <span>Cuenta: mynetfilin</span>
                        <span className="text-xs text-red-400 font-mono font-normal">
                          (5 Perfiles asignados)
                        </span>
                      </h2>
                      <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>5 Clientes</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {mynetProfiles.filter(p => p.paymentStatus === 'pagado').length} Pagados
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400">
                          {mynetProfiles.filter(p => p.paymentStatus === 'pendiente').length} Pendientes
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-mono font-medium">
                          Total: {currencySymbol} {mynetRev.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mynetProfiles.map(profile => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      currencySymbol={currencySymbol}
                      onOpenPinModal={() => handleOpenPinModal(profile)}
                      onTogglePayment={() => handleTogglePayment(profile)}
                      onToggleClientStatus={() => handleToggleClientStatus(profile)}
                      onRenewMonth={() => handleRenewMonth(profile)}
                      onReset={() => handleOpenResetModal(profile)}
                      onEdit={() => setEditingProfile(profile)}
                      onWhatsApp={() => sendWhatsAppReminder(profile)}
                    />
                  ))}
                  {mynetProfiles.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-slate-500 bg-slate-950/40 rounded-xl border border-slate-850">
                      No hay perfiles que coincidan con los filtros para la cuenta mynetfilin.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Account 3: Extensión Extra - milena */}
            {(selectedAccount === 'all' || selectedAccount === 'milena') && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-fuchsia-800/40 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-600/25 border border-fuchsia-500/50 flex items-center justify-center text-fuchsia-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                        <span>Cuenta / Extensión: milena</span>
                        <span className="text-xs bg-fuchsia-950/90 text-fuchsia-300 border border-fuchsia-700/60 px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
                          <Smartphone className="w-3 h-3 text-fuchsia-400" />
                          <span>Extensión · 1 Solo Dispositivo</span>
                        </span>
                      </h2>
                      <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>1 Perfil adicional</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {milenaProfiles.filter(p => p.paymentStatus === 'pagado').length} Pagado
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400">
                          {milenaProfiles.filter(p => p.paymentStatus === 'pendiente').length} Pendiente
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-mono font-medium">
                          Total: {currencySymbol} {milenaRev.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {milenaProfiles.map(profile => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      currencySymbol={currencySymbol}
                      onOpenPinModal={() => handleOpenPinModal(profile)}
                      onTogglePayment={() => handleTogglePayment(profile)}
                      onToggleClientStatus={() => handleToggleClientStatus(profile)}
                      onRenewMonth={() => handleRenewMonth(profile)}
                      onReset={() => handleOpenResetModal(profile)}
                      onEdit={() => setEditingProfile(profile)}
                      onWhatsApp={() => sendWhatsAppReminder(profile)}
                    />
                  ))}
                  {milenaProfiles.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-slate-500 bg-slate-950/40 rounded-xl border border-slate-850">
                      No hay perfiles que coincidan con los filtros para la extensión milena.
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: TABLE VIEW */}
        {!loading && activeTab === 'tabla' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-medium">
                    <th className="py-3 px-4">Cuenta & Perfil</th>
                    <th className="py-3 px-4">Cliente (Clic para PIN)</th>
                    <th className="py-3 px-4">Tipo / Dispositivos</th>
                    <th className="py-3 px-4">PIN del Perfil</th>
                    <th className="py-3 px-4">Fecha de Pago & Días que Faltan</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4">Estado Pago</th>
                    <th className="py-3 px-4">Tipo Cliente</th>
                    <th className="py-3 px-4 text-right">Acciones Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {filteredProfiles.map(profile => {
                    const countdown = calculateDaysRemaining(profile.paymentDate);
                    const isExt = profile.isExtension || profile.accountName === 'milena';

                    return (
                      <tr key={profile.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">
                            Perfil {profile.profileNumber}
                          </div>
                          <div className="text-[11px] text-rose-400 font-mono">
                            {profile.accountName}
                          </div>
                        </td>

                        {/* Client Name with direct button to open PIN modal */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleOpenPinModal(profile)}
                            className="font-medium text-white hover:text-rose-400 text-left transition-colors cursor-pointer group flex items-center space-x-1.5"
                            title="Hacer clic para ver y editar el PIN del perfil"
                          >
                            <span className="underline decoration-dotted decoration-slate-600 group-hover:decoration-rose-400">
                              {profile.clientName}
                            </span>
                            <Key className="w-3.5 h-3.5 text-amber-400 opacity-70 group-hover:opacity-100 shrink-0" />
                          </button>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {profile.clientPhone}
                          </div>
                        </td>

                        {/* Tipo / Dispositivo badge */}
                        <td className="py-3.5 px-4">
                          {isExt ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/70 font-medium">
                              <Smartphone className="w-3 h-3 text-fuchsia-400" />
                              <span>1 Solo Dispositivo</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">
                              Perfil estándar
                            </span>
                          )}
                        </td>

                        {/* PIN column */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleOpenPinModal(profile)}
                            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-amber-300 flex items-center space-x-1.5 cursor-pointer transition-colors"
                            title="Ver o editar PIN"
                          >
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>{profile.pin || 'Sin PIN'}</span>
                            <Edit3 className="w-3 h-3 text-slate-500 ml-1" />
                          </button>
                        </td>

                        {/* Payment Date & Days remaining */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{profile.paymentDate}</span>
                          </div>
                          {/* Días que faltan destacado */}
                          <div className="mt-1">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block ${
                                countdown.tone === 'expired'
                                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                                  : countdown.tone === 'urgent'
                                  ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                                  : countdown.tone === 'warning'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                              }`}
                            >
                              {countdown.label}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-emerald-400">
                          {currencySymbol} {profile.price.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleTogglePayment(profile)}
                            className={`px-3 py-1 rounded-lg font-medium text-xs transition-colors cursor-pointer inline-flex items-center space-x-1.5 ${
                              profile.paymentStatus === 'pagado'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/80'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900/80'
                            }`}
                          >
                            {profile.paymentStatus === 'pagado' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Pagado</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pendiente</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleClientStatus(profile)}
                            className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors cursor-pointer inline-flex items-center space-x-1.5 ${
                              profile.clientStatus === 'renovado'
                                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                                : 'bg-purple-950/80 text-purple-300 border border-purple-800'
                            }`}
                          >
                            {profile.clientStatus === 'renovado' ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Renovado</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Nuevo Cliente</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenResetModal(profile)}
                            title="Restablecer este recuadro a Pago Pendiente (conserva cliente y precio)"
                            className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 rounded-lg text-xs font-medium transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Restablecer</span>
                          </button>

                          <button
                            onClick={() => handleRenewMonth(profile)}
                            title="Extender +30 días y marcar Pagado"
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-indigo-300 rounded-lg text-xs font-medium transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>+1 Mes</span>
                          </button>

                          <button
                            onClick={() => sendWhatsAppReminder(profile)}
                            title="Enviar aviso por WhatsApp con PIN, fecha y dispositivo"
                            className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-400 rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setEditingProfile(profile)}
                            title="Editar todos los detalles"
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT LOGS (HISTORIAL) */}
        {!loading && activeTab === 'historial' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-rose-500" />
                <h3 className="font-semibold text-white text-base">
                  Historial de Pagos y Renovaciones (Firestore)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {paymentLogs.length} registros recientes
              </span>
            </div>

            <div className="divide-y divide-slate-850">
              {paymentLogs.map(log => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      log.type === 'renovacion'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {log.type === 'renovacion' ? <RefreshCw className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-white">{log.clientName}</span>
                        <span className="text-xs text-rose-400 font-mono">
                          {log.accountName} · Perfil {log.profileNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {log.notes || (log.type === 'renovacion' ? 'Renovación de suscripción mensual' : 'Cobro de mensualidad')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 pl-11 sm:pl-0">
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(log.date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <span className="font-bold text-sm text-emerald-400">
                      +{currencySymbol} {log.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              {paymentLogs.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Aún no hay cobros registrados en el historial de Firestore. Al presionar "Pagado" o "+1 Mes" se guardarán aquí automáticamente.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 1. VENTANA / MODAL DE PIN EDITABLE PARA CADA CLIENTE */}
      {pinModalProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    PIN de Perfil · {pinModalProfile.clientName}
                  </h3>
                  <span className="text-xs text-rose-400 font-mono">
                    Cuenta: {pinModalProfile.accountName} · Perfil {pinModalProfile.profileNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPinModalProfile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Device limitation indicator for Milena/Extension */}
              {(pinModalProfile.isExtension || pinModalProfile.accountName === 'milena') && (
                <div className="bg-fuchsia-950/80 border border-fuchsia-800/80 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-fuchsia-200">
                  <Smartphone className="w-4 h-4 text-fuchsia-400 shrink-0" />
                  <span>
                    <strong>Extensión de Cuenta:</strong> Este perfil está habilitado para ser utilizado en <strong>1 solo dispositivo</strong>.
                  </span>
                </div>
              )}

              {/* Info banner with renewal countdown */}
              {(() => {
                const countdown = calculateDaysRemaining(pinModalProfile.paymentDate);
                return (
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <CalendarClock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <span>Fecha de renovación: </span>
                        <strong className="text-white">{pinModalProfile.paymentDate}</strong>
                      </div>
                    </div>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        countdown.tone === 'expired'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : countdown.tone === 'warning' || countdown.tone === 'urgent'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {countdown.label}
                    </span>
                  </div>
                );
              })()}

              {/* Current PIN Display with Big Numbers */}
              <div className="text-center bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">
                  PIN Actual del Perfil
                </span>

                <div className="flex items-center justify-center space-x-2">
                  <div className="font-mono text-3xl font-extrabold tracking-widest text-amber-300 bg-slate-900 border border-amber-500/30 px-6 py-2.5 rounded-xl">
                    {showPinDigits
                      ? (pinModalProfile.pin || '----')
                      : (pinModalProfile.pin ? '••••' : '----')}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPinDigits(!showPinDigits)}
                    className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title={showPinDigits ? 'Ocultar dígitos' : 'Mostrar dígitos'}
                  >
                    {showPinDigits ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyPin(pinModalProfile.pin)}
                    className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-amber-400 rounded-xl transition-colors cursor-pointer"
                    title="Copiar PIN"
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Usa este PIN para proteger y autenticar el perfil del cliente.
                </p>
              </div>

              {/* Form to Edit PIN directly */}
              <form onSubmit={handleSavePin} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Modificar o asignar nuevo PIN:</span>
                    <span className="text-[11px] text-slate-400 font-normal">Máximo 6 dígitos</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Ej. 1234"
                      value={inputPinValue}
                      onChange={e => setInputPinValue(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                      className="w-full bg-slate-950 border border-slate-750 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-base font-mono font-bold text-white tracking-widest placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Guardar PIN en Firestore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = pinModalProfile.clientPhone.replace(/[^0-9]/g, '');
                      const countdown = calculateDaysRemaining(pinModalProfile.paymentDate);
                      const isExt = pinModalProfile.isExtension || pinModalProfile.accountName === 'milena';
                      const extText = isExt ? ' (Extensión válida para 1 solo dispositivo)' : '';
                      const text = `Hola ${pinModalProfile.clientName}, tu PIN para ingresar a tu perfil ${pinModalProfile.profileNumber} de Netflix (${pinModalProfile.accountName}${extText}) es: *${inputPinValue || pinModalProfile.pin}*. Recuerda que tu fecha de renovación es el ${pinModalProfile.paymentDate} ${countdown.label}.`;
                      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="p-2.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded-xl text-xs transition-colors cursor-pointer flex items-center space-x-1"
                    title="Enviar PIN por WhatsApp al cliente"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[11px] font-medium hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL DE EDICIÓN COMPLETA */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white text-xs font-bold">
                  {editingProfile.profileNumber}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Editar Perfil {editingProfile.profileNumber}
                  </h3>
                  <span className="text-xs text-rose-400 font-mono">
                    Cuenta: {editingProfile.accountName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Cuenta Asignada
                  </label>
                  <select
                    value={editingProfile.accountName}
                    onChange={e => {
                      const newAcc = e.target.value as AccountName;
                      setEditingProfile({
                        ...editingProfile,
                        accountName: newAcc,
                        isExtension: newAcc === 'milena' ? true : editingProfile.isExtension
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="eliasespinola">eliasespinola (Principal)</option>
                    <option value="mynetfilin">mynetfilin (Principal)</option>
                    <option value="milena">milena (Extensión 1 Dispositivo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Tipo de Perfil
                  </label>
                  <div className="flex items-center h-[42px] px-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={!!editingProfile.isExtension}
                        onChange={e => setEditingProfile({ ...editingProfile, isExtension: e.target.checked })}
                        className="rounded border-slate-700 text-fuchsia-600 focus:ring-0"
                      />
                      <span>Extensión (1 solo dispositivo)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  required
                  value={editingProfile.clientName}
                  onChange={e => setEditingProfile({ ...editingProfile, clientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingProfile.clientPhone}
                    onChange={e => setEditingProfile({ ...editingProfile, clientPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Fecha de Vencimiento / Pago
                  </label>
                  <input
                    type="date"
                    required
                    value={editingProfile.paymentDate}
                    onChange={e => setEditingProfile({ ...editingProfile, paymentDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Monto a Cobrar ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={editingProfile.price}
                    onChange={e => setEditingProfile({ ...editingProfile, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    PIN del Perfil
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Ej. 1234"
                    value={editingProfile.pin}
                    onChange={e => setEditingProfile({ ...editingProfile, pin: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Estado del Pago
                  </label>
                  <select
                    value={editingProfile.paymentStatus}
                    onChange={e => setEditingProfile({ ...editingProfile, paymentStatus: e.target.value as PaymentStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pago Pendiente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Tipo de Cliente
                  </label>
                  <select
                    value={editingProfile.clientStatus}
                    onChange={e => setEditingProfile({ ...editingProfile, clientStatus: e.target.value as ClientStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="renovado">Renovado</option>
                    <option value="nuevo">Nuevo Cliente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Notas Adicionales
                </label>
                <textarea
                  rows={2}
                  value={editingProfile.notes}
                  onChange={e => setEditingProfile({ ...editingProfile, notes: e.target.value })}
                  placeholder="Método de pago, cuenta bancaria, dispositivo usado..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 border border-slate-750 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  Guardar en Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL DE RESTABLECIMIENTO INDIVIDUAL POR RECUADRO */}
      {resetModalProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Restablecer Recuadro
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">
                    Cuenta: {resetModalProfile.accountName} · Perfil {resetModalProfile.profileNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setResetModalProfile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Data Protection Guarantee Banner */}
              <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-1 text-xs">
                    Tus datos cargados están 100% protegidos
                  </strong>
                  <span className="text-slate-350 text-[11px] leading-relaxed block">
                    El cliente cargado (<strong className="text-white">{resetModalProfile.clientName}</strong>), su precio (<strong className="text-emerald-300">{currencySymbol} {resetModalProfile.price.toLocaleString()}</strong>) y su PIN <strong>NO se modificarán ni borrarán</strong>. Solo se restablecerá el estado para el nuevo ciclo de cobro.
                  </span>
                </div>
              </div>

              {/* Preserved Data Summary Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cliente actual:</span>
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <span>{resetModalProfile.clientName}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/90 border border-emerald-850 px-1.5 py-0.5 rounded font-medium">intacto</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Precio mensual:</span>
                  <span className="font-bold text-emerald-400 font-mono flex items-center space-x-1.5">
                    <span>{currencySymbol} {resetModalProfile.price.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/90 border border-emerald-850 px-1.5 py-0.5 rounded font-medium">intacto</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PIN del perfil:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {resetModalProfile.pin || 'Sin PIN'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                  <span className="text-slate-400">Estado resultante:</span>
                  <span className="font-bold text-amber-400 bg-amber-950/80 border border-amber-800/70 px-2 py-0.5 rounded text-xs flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Pago Pendiente</span>
                  </span>
                </div>
              </div>

              {/* Renewal Date options for new cycle */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Fecha de vencimiento para el nuevo ciclo:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setResetDateOption('keep')}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      resetDateOption === 'keep'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">Mantener actual</div>
                    <div className="text-[11px] font-mono text-slate-300 mt-0.5">{resetModalProfile.paymentDate}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetDateOption('today')}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      resetDateOption === 'today'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">Fecha de hoy</div>
                    <div className="text-[11px] font-mono text-slate-300 mt-0.5">{new Date().toISOString().slice(0, 10)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetDateOption('plus30')}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      resetDateOption === 'plus30'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">Sumar +30 días</div>
                    <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                      {(() => {
                        const d = new Date(resetModalProfile.paymentDate || new Date());
                        d.setDate(d.getDate() + 30);
                        return d.toISOString().slice(0, 10);
                      })()}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetDateOption('custom')}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      resetDateOption === 'custom'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">Personalizada</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Elegir fecha...</div>
                  </button>
                </div>

                {resetDateOption === 'custom' && (
                  <div className="pt-1.5">
                    <input
                      type="date"
                      value={resetCustomDate}
                      onChange={e => setResetCustomDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setResetModalProfile(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-750 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetRecuadro}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirmar Restablecimiento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PROFILE CARD COMPONENT
interface ProfileCardProps {
  profile: NetflixProfile;
  currencySymbol: string;
  onOpenPinModal: () => void;
  onTogglePayment: () => void;
  onToggleClientStatus: () => void;
  onRenewMonth: () => void;
  onReset: () => void;
  onEdit: () => void;
  onWhatsApp: () => void;
}

function ProfileCard({
  profile,
  currencySymbol,
  onOpenPinModal,
  onTogglePayment,
  onToggleClientStatus,
  onRenewMonth,
  onReset,
  onEdit,
  onWhatsApp
}: ProfileCardProps) {
  const countdown = calculateDaysRemaining(profile.paymentDate);
  const isExt = profile.isExtension || profile.accountName === 'milena';

  return (
    <div className={`bg-slate-950/80 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
      isExt
        ? 'border-fuchsia-800/60 hover:border-fuchsia-600/80 shadow-fuchsia-950/20'
        : 'border-slate-800 hover:border-slate-750'
    }`}>
      <div>
        {/* Card Header: Profile badge, account & actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
              isExt
                ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/80'
                : 'bg-rose-950 text-rose-400 border border-rose-800/80'
            }`}>
              {profile.profileNumber}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Perfil {profile.profileNumber}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={`text-xs font-mono font-medium ${
              isExt ? 'text-fuchsia-400' : 'text-rose-400/90'
            }`}>
              {profile.accountName}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
              title="Restablecer este recuadro a Pago Pendiente (conserva cliente y precio)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              title="Editar todos los datos del cliente"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Client Name with clickable PIN window trigger */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between">
            <button
              onClick={onOpenPinModal}
              className={`text-base font-bold text-white tracking-tight text-left transition-colors cursor-pointer group/name flex items-center space-x-1.5 ${
                isExt ? 'hover:text-fuchsia-300' : 'hover:text-rose-400'
              }`}
              title="Hacer clic para abrir la ventana con el PIN de este perfil"
            >
              <span className={`underline decoration-dotted decoration-slate-600 ${
                isExt ? 'group-hover/name:decoration-fuchsia-400' : 'group-hover/name:decoration-rose-400'
              }`}>
                {profile.clientName}
              </span>
              <Key className="w-3.5 h-3.5 text-amber-400 opacity-80 group-hover/name:opacity-100 shrink-0" />
            </button>
          </div>

          {/* Extension badge for 1 device */}
          {isExt && (
            <div className="mt-1.5 mb-2 inline-flex items-center space-x-1.5 bg-fuchsia-950/80 border border-fuchsia-800/80 text-fuchsia-300 px-2 py-0.5 rounded-md text-[11px] font-semibold">
              <Smartphone className="w-3 h-3 text-fuchsia-400 shrink-0" />
              <span>Extensión · Solo 1 Dispositivo</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span className="font-mono text-slate-300">{profile.clientPhone}</span>

            {/* Quick PIN button on card that opens PIN window */}
            <button
              onClick={onOpenPinModal}
              className="bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/70 text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 transition-colors cursor-pointer"
              title="Ver y editar PIN de este perfil"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>PIN: {profile.pin || '----'}</span>
            </button>
          </div>

          {profile.notes && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic">
              "{profile.notes}"
            </p>
          )}
        </div>

        {/* Payment & Days Remaining Section */}
        <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Fecha de Pago:</span>
            </span>
            <div className="text-right">
              <span className="font-bold text-white block">{profile.paymentDate}</span>
            </div>
          </div>

          {/* DÍAS QUE FALTAN - DESTACADO */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Para renovar:</span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                countdown.tone === 'expired'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                  : countdown.tone === 'urgent'
                  ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                  : countdown.tone === 'warning'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
              }`}
            >
              {countdown.label}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800">
            <span className="text-slate-400">Monto Mensual:</span>
            <span className="font-bold text-emerald-400">
              {currencySymbol} {profile.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="space-y-2 pt-2 border-t border-slate-850">
        <div className="grid grid-cols-2 gap-2">
          {/* Botón Pagado / Pago Pendiente */}
          <button
            onClick={onTogglePayment}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
              profile.paymentStatus === 'pagado'
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/90'
                : 'bg-amber-950/90 text-amber-300 border border-amber-800 hover:bg-amber-900/90'
            }`}
          >
            {profile.paymentStatus === 'pagado' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pagado</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Pago Pendiente</span>
              </>
            )}
          </button>

          {/* Botón Renovado / Nuevo Cliente */}
          <button
            onClick={onToggleClientStatus}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
              profile.clientStatus === 'renovado'
                ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-800 hover:bg-indigo-900/90'
                : 'bg-purple-950/90 text-purple-300 border border-purple-800 hover:bg-purple-900/90'
            }`}
          >
            {profile.clientStatus === 'renovado' ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Renovado</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Nuevo Cliente</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Row: +1 Mes Renovación y WhatsApp */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRenewMonth}
            title="Suma 30 días a la fecha y marca Pagado"
            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center space-x-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-indigo-400" />
            <span>+30 Días</span>
          </button>

          <button
            onClick={onWhatsApp}
            title="Enviar mensaje con recordatorio o recibo a WhatsApp"
            className="py-1.5 px-2 bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-800/80 text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 text-emerald-400" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Fila 3: Botón individual de Restablecimiento del Recuadro */}
        <button
          onClick={onReset}
          title="Restablecer este recuadro a Pago Pendiente para un nuevo ciclo (conserva cliente y precio)"
          className="w-full py-2 px-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-600/70 text-slate-300 hover:text-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Restablecer Recuadro</span>
        </button>
      </div>
    </div>
  );
}
