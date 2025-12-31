
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import Card from './common/Card';
import { SettingsContext } from '../contexts/SettingsContext';
import { BaggageDataContext } from '../contexts/BaggageDataContext';
import { User, BaggageRecord, WorldTracerConfig, AuditEntry, AuditCategory } from '../types';
// Added UserIcon to the imported icons from common/icons
import { SettingsIcon, UserGroupIcon, PhotoIcon, TrashIcon, CheckCircleIcon, WorldIcon, UploadIcon, BellIcon, SparklesIcon, ChartIcon, ShieldCheckIcon, UserIcon } from './common/icons';
import { base64FromFile } from '../utils/imageUtils';
import StrategicSummary from './StrategicSummary';

type ManagementTab = 'logistics' | 'security' | 'audit' | 'settings' | 'strategic';

// --- مكونات الإدارة المتكاملة ---

const LogoManagement: React.FC = () => {
    const settings = useContext(SettingsContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await base64FromFile(file);
            settings?.setLogoUrl(base64);
        }
    };

    return (
        <Card className="bg-brand-gray-dark/40 border-brand-green/20">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <PhotoIcon className="w-5 h-5 text-brand-green" /> إدارة الهوية البصرية (SGS Branding)
            </h4>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-brand-gray rounded-2xl border-2 border-dashed border-brand-gray-light flex items-center justify-center overflow-hidden shadow-inner">
                    {settings?.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                        <PhotoIcon className="w-10 h-10 text-gray-700" />
                    )}
                </div>
                <div className="space-y-4 flex-1">
                    <p className="text-xs text-gray-400 leading-relaxed">تخصيص شعار المبادرة لتعزيز الهوية المؤسسية في كافة التقارير الاستراتيجية.</p>
                    <div className="flex gap-3">
                        <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2 bg-brand-green text-brand-gray-dark text-xs font-black rounded-lg hover:bg-brand-green-light transition-all shadow-lg">تحميل الشعار</button>
                        {settings?.logoUrl && (
                            <button onClick={() => settings.setLogoUrl(null)} className="px-5 py-2 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 hover:bg-red-500/20">حذف</button>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                </div>
            </div>
        </Card>
    );
};

const WorldTracerSettings: React.FC = () => {
    const settings = useContext(SettingsContext);
    const config = settings?.wtConfig;
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<WorldTracerConfig>>({});

    useEffect(() => {
        if (config) setFormData(config);
    }, [config]);

    const handleSave = () => {
        settings?.updateWtConfig(formData);
        setEditMode(false);
    };

    return (
        <Card className="bg-brand-gray-dark/40 border-blue-500/20">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                    <WorldIcon className="w-5 h-5 text-blue-400" /> تكامل ورلد تريسر (API Gateway)
                </h4>
                <button 
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className={`text-[10px] px-3 py-1 rounded border ${editMode ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-brand-gray text-gray-400 border-white/10'}`}
                >
                    {editMode ? 'حفظ الإعدادات' : 'تعديل الربط'}
                </button>
            </div>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] text-gray-500 font-bold uppercase">كود المحطة (Station)</label>
                        {editMode ? (
                            <input value={formData.stationCode} onChange={e => setFormData({...formData, stationCode: e.target.value})} className="w-full bg-brand-gray border border-white/10 rounded px-2 py-1 text-xs text-white" />
                        ) : (
                            <div className="p-2 bg-brand-gray/30 rounded border border-white/5 text-white font-mono text-xs">{config?.stationCode || 'JED'}</div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] text-gray-500 font-bold uppercase">كود الناقل (Airline)</label>
                        {editMode ? (
                            <input value={formData.airlineCode} onChange={e => setFormData({...formData, airlineCode: e.target.value})} className="w-full bg-brand-gray border border-white/10 rounded px-2 py-1 text-xs text-white" />
                        ) : (
                            <div className="p-2 bg-brand-gray/30 rounded border border-white/5 text-white font-mono text-xs">{config?.airlineCode || 'SV'}</div>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 font-bold uppercase">رابط الخادم (Base URL)</label>
                    {editMode ? (
                        <input value={formData.baseUrl} onChange={e => setFormData({...formData, baseUrl: e.target.value})} className="w-full bg-brand-gray border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" placeholder="https://api.worldtracer.aero/v1" />
                    ) : (
                        <div className="p-2 bg-brand-gray/30 rounded border border-white/5 text-gray-300 font-mono text-[10px] truncate">{config?.baseUrl || 'https://api.worldtracer.aero/v1'}</div>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 font-bold uppercase">مفتاح المصادقة (API Key)</label>
                    {editMode ? (
                        <input type="password" value={formData.apiKey} onChange={e => setFormData({...formData, apiKey: e.target.value})} className="w-full bg-brand-gray border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" placeholder="SITA-API-KEY-..." />
                    ) : (
                        <div className="p-2 bg-brand-gray/30 rounded border border-white/5 text-gray-300 font-mono text-[10px] truncate">
                            {config?.apiKey ? '•••••••••••••••••••••' : 'Not Configured'}
                        </div>
                    )}
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${config?.isConnected ? 'bg-green-500/10 border-green-500/20' : 'bg-brand-gray/50 border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${config?.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                        <span className="text-xs text-gray-300 font-bold">{config?.isConnected ? 'قناة المزامنة الحية نشطة' : 'وضع المحاكاة (Simulation Mode)'}</span>
                    </div>
                    <button 
                        onClick={() => settings?.updateWtConfig({ isConnected: !config?.isConnected })}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${config?.isConnected ? 'bg-red-500/20 text-red-400' : 'bg-blue-600 text-white shadow-xl'}`}
                    >
                        {config?.isConnected ? 'قطع الاتصال' : 'تفعيل المزامنة'}
                    </button>
                </div>
            </div>
        </Card>
    );
};

const UserManagement: React.FC = () => {
    const settings = useContext(SettingsContext);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ 
        name: '', 
        employeeId: '', 
        role: 'Staff' as const,
        jobTitle: ''
    });

    const handleAdd = () => {
        if (!newUser.name || !newUser.employeeId || !newUser.jobTitle) {
            alert('يرجى تعبئة كافة الحقول الأساسية (الاسم، الرقم الوظيفي، المسمى).');
            return;
        }
        
        settings?.addUser({ 
            id: Date.now().toString(), 
            name: newUser.name, 
            employeeId: newUser.employeeId, 
            role: newUser.role, 
            status: 'Active',
            jobTitle: newUser.jobTitle
        });

        // Reset and close
        setNewUser({ name: '', employeeId: '', role: 'Staff', jobTitle: '' });
        setIsAdding(false);
    };

    const inputStyle = "w-full bg-brand-gray border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-purple-500";
    const labelStyle = "text-[10px] text-gray-400 font-bold uppercase mb-1 block";

    return (
        <Card className="bg-brand-gray-dark/40 border-purple-500/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-white font-bold flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-purple-400" /> إدارة الكوادر التشغيلية (HR)
                </h4>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${isAdding ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-purple-600 text-white hover:bg-purple-500 border border-purple-400/30'}`}
                >
                    {isAdding ? 'إلغاء' : '+ موظف جديد'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-brand-gray/20 p-5 rounded-xl border border-purple-500/20 mb-6 animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className={labelStyle}>اسم الموظف</label>
                            <input value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className={inputStyle} placeholder="الاسم الكامل" />
                        </div>
                        <div>
                            <label className={labelStyle}>الرقم الوظيفي</label>
                            <input value={newUser.employeeId} onChange={e => setNewUser({...newUser, employeeId: e.target.value})} className={inputStyle} placeholder="مثال: 10452" />
                        </div>
                        <div>
                            <label className={labelStyle}>المسمى الوظيفي</label>
                            <input value={newUser.jobTitle} onChange={e => setNewUser({...newUser, jobTitle: e.target.value})} className={inputStyle} placeholder="مثال: أخصائي عمليات" />
                        </div>
                        <div>
                            <label className={labelStyle}>مستوى الصلاحيات</label>
                            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})} className={inputStyle}>
                                <option value="Staff">موظف (Staff)</option>
                                <option value="Manager">مشرف (Manager)</option>
                                <option value="Admin">مدير نظام (Admin)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-white/5">
                        <button onClick={handleAdd} className="px-6 py-2 bg-purple-600 text-white text-xs font-black rounded-lg hover:bg-purple-500 transition-all shadow-lg">حفظ البيانات</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {settings?.users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-brand-gray/20 rounded-xl border border-white/5 hover:bg-brand-gray/40 transition-all group hover:border-purple-500/30">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs border border-purple-500/20">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h5 className="text-white text-xs font-bold">{user.name}</h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-400 bg-brand-gray px-1.5 py-0.5 rounded border border-white/5">{user.employeeId}</span>
                                    <span className="text-[10px] text-purple-300">{user.jobTitle || 'موظف'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${user.role === 'Admin' ? 'bg-red-500/20 text-red-400' : (user.role === 'Manager' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400')}`}>
                                {user.role}
                            </span>
                             <button onClick={() => settings.removeUser(user.id)} className="text-gray-600 hover:text-red-500 transition-colors" title="حذف الموظف">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- المكونات الرئيسية ---

const SecurityAuditView: React.FC = () => {
    const settings = useContext(SettingsContext);
    const securityLogs = useMemo(() => {
        return (settings?.auditLogs || []).filter(log => log.category === 'Security');
    }, [settings?.auditLogs]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-brand-green/10 border border-brand-green/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-green text-brand-gray-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand-green/20">
                        <ShieldCheckIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-lg">سجل التوثيق الأمني (Security Audit)</h4>
                        <p className="text-xs text-gray-400">توثيق كافة عمليات المصادقة المزدوجة والتسليم النهائي للأمتعة.</p>
                    </div>
                </div>
                <div className="bg-brand-gray-dark/80 px-4 py-2 rounded-lg border border-brand-green/20 text-brand-green font-mono text-xs font-black">
                    إجمالي الوثائق: {securityLogs.length}
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {securityLogs.map(log => (
                    <Card key={log.id} className="border-brand-green/20 hover:bg-brand-gray/40 transition-all p-5">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green">
                                    <SparklesIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h5 className="text-white font-black text-sm">{log.action}</h5>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${log.status === 'Success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed font-medium">{log.details}</p>
                                    <div className="flex items-center gap-4 mt-4 border-t border-white/5 pt-3">
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                                            <UserIcon className="w-3 h-3" /> {log.user}
                                        </div>
                                        <div className="text-[10px] text-gray-600 font-mono">ID: {log.id}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <span className="text-[10px] text-gray-400 font-black bg-brand-gray-dark px-3 py-1 rounded-full border border-white/5">
                                    {new Date(log.timestamp).toLocaleString('ar-SA')}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
                {securityLogs.length === 0 && (
                    <div className="text-center py-24 bg-brand-gray/20 rounded-3xl border border-dashed border-white/5">
                        <ChartIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold text-sm">لا توجد سجلات أمنية موثقة حالياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const LogisticsDashboard: React.FC = () => {
    const dataContext = useContext(BaggageDataContext);
    const baggage = dataContext?.baggageData || [];

    // الحساب الديناميكي لمؤشرات الأداء بناءً على البيانات الحقيقية
    const stats = useMemo(() => {
        const total = baggage.length;
        const now = new Date().getTime();
        
        // الحالات العاجلة
        const urgent = baggage.filter(b => b.Status === 'Urgent').length;
        
        // حالات خطر SLA (تجاوزت 18 ساعة ولم تُسلم)
        const atRisk = baggage.filter(b => b.Status !== 'Delivered' && (now - new Date(b.LastUpdate).getTime()) / (1000 * 3600) >= 18).length;
        
        // الحالات المسلمة
        const delivered = baggage.filter(b => b.Status === 'Delivered').length;

        // حساب KPIs الديناميكية
        // 1. الامتثال: نسبة الحالات المسلمة أو التي لم تتجاوز الخطر
        const complianceRate = total > 0 ? Math.round(((total - atRisk) / total) * 100) : 100;
        
        // 2. الدقة: نسبة الحالات الموثقة من الركاب (Confirmed)
        const confirmed = baggage.filter(b => b.IsConfirmedByPassenger === true || b.IsConfirmedByPassenger === 'TRUE').length;
        const accuracyRate = total > 0 ? Math.round((confirmed / (total || 1)) * 100) : 100;

        // 3. الوقاية: نسبة الحالات التي ليست "عاجلة" (تم التعامل معها قبل التصعيد)
        const preventionRate = total > 0 ? Math.round(((total - urgent) / total) * 100) : 100;

        // 4. الرضا: معادلة تقريبية تعتمد على سرعة الإنجاز وقلة الشكاوى
        // (100 - نسبة العاجل - نصف نسبة الخطر)
        const satisfactionRate = total > 0 ? Math.round(100 - ((urgent / total) * 100) - ((atRisk / total) * 50)) : 100;

        return {
            total,
            urgent,
            atRisk,
            delivered,
            kpis: [
                { v: complianceRate, l: 'الامتثال', c: 'brand-green' },
                { v: accuracyRate, l: 'الدقة', c: 'cyan-400' },
                { v: preventionRate, l: 'الوقاية', c: 'yellow-500' },
                { v: Math.max(0, satisfactionRate), l: 'الرضا', c: 'blue-400' }
            ]
        };
    }, [baggage]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-brand-gray-dark border-l-4 border-l-blue-500"><p className="text-[10px] text-gray-500 font-black uppercase">إجمالي الحالات</p><h3 className="text-3xl font-black text-white">{stats.total}</h3></Card>
                <Card className="bg-brand-gray-dark border-l-4 border-l-red-500"><p className="text-[10px] text-gray-500 font-black uppercase">بلاغات عاجلة</p><h3 className="text-3xl font-black text-red-500">{stats.urgent}</h3></Card>
                <Card className="bg-yellow-500/10 border-l-4 border-l-yellow-500"><p className="text-[10px] text-yellow-500 font-black uppercase">خطر SLA</p><h3 className="text-3xl font-black text-yellow-500">{stats.atRisk}</h3></Card>
                <Card className="bg-brand-gray-dark border-l-4 border-l-brand-green"><p className="text-[10px] text-gray-500 font-black uppercase">تم التسليم</p><h3 className="text-3xl font-black text-brand-green">{stats.delivered}</h3></Card>
            </div>
            <div className="bg-brand-gray-dark/50 p-8 rounded-3xl border border-white/5">
                <h4 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                    <ChartIcon className="w-5 h-5 text-brand-green" /> 
                    <span>تحليل كفاءة المحطة (JED Hub)</span>
                    <span className="text-[9px] bg-brand-gray px-2 py-1 rounded-full text-gray-400 font-mono">Live Data Source</span>
                </h4>
                <div className="h-64 flex items-end justify-around gap-2 px-4 border-b border-brand-gray-light">
                    {stats.kpis.map((s, i) => (
                        <div key={i} className={`w-20 bg-${s.c}/20 border-t-2 border-${s.c} rounded-t-xl relative transition-all duration-1000 ease-out`} style={{height: `${s.v}%`}}>
                            <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-black text-${s.c}`}>{s.v}%</span>
                            <p className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-bold whitespace-nowrap">{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ManagementView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ManagementTab>('strategic');

    const tabStyles = (tab: ManagementTab) => 
        `flex items-center gap-2 px-6 py-4 text-xs font-black transition-all border-b-2 whitespace-nowrap ${
            activeTab === tab ? 'border-brand-green text-brand-green bg-brand-green/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
        }`;

    return (
        <div className="space-y-8 pb-32">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">مركز القيادة الاستراتيجي</h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">المبادرة الاستراتيجية للتحول الرقمي - محطة جدة.</p>
                </div>
                <div className="bg-brand-gray-dark/80 backdrop-blur-md p-1 rounded-2xl border border-white/5 flex overflow-x-auto custom-scrollbar max-w-full shadow-2xl">
                    <button onClick={() => setActiveTab('strategic')} className={tabStyles('strategic')}>الميثاق</button>
                    <button onClick={() => setActiveTab('logistics')} className={tabStyles('logistics')}>العمليات</button>
                    <button onClick={() => setActiveTab('security')} className={tabStyles('security')}>الأمن</button>
                    <button onClick={() => setActiveTab('settings')} className={tabStyles('settings')}>الإعدادات</button>
                </div>
            </header>

            <main className="min-h-[60vh]">
                {activeTab === 'strategic' && <StrategicSummary />}
                {activeTab === 'logistics' && <LogisticsDashboard />}
                {activeTab === 'security' && <SecurityAuditView />}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                        <LogoManagement />
                        <WorldTracerSettings />
                        <div className="lg:col-span-2"><UserManagement /></div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManagementView;
