
import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import Modal from './common/Modal';
import Card from './common/Card';
import { BaggageReport, BaggageRecord, BaggageInfo } from '../types';
import { BaggageDataContext } from '../contexts/BaggageDataContext';
import { SettingsContext } from '../contexts/SettingsContext';
import { recordToBaggageInfo } from '../utils/baggageUtils';
import BaggageTimeline from './BaggageTimeline';
import { findBaggageByPir } from '../services/worldTracerService';
import { UserIcon, PlaneIcon, TagIcon, CameraIcon, CheckCircleIcon, ShieldCheckIcon, UserGroupIcon } from './common/icons';
import { compareBaggageImages } from '../services/geminiService';

// Add missing props interface for InfoItem
interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 space-x-reverse">
        <div className="flex-shrink-0 text-gray-400 mt-1">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-300 font-medium">{label}</p>
            <p className="font-semibold text-white">{value}</p>
        </div>
    </div>
);

// Updated interface to include recipientName
interface SecurityHandoverProtocolProps {
    onComplete: (data: { recipientName: string, idType: string, idNumber: string, phone: string, contentAns: string, marksAns: string }) => void;
    onCancel: () => void;
}

const SecurityHandoverProtocol: React.FC<SecurityHandoverProtocolProps> = ({
    onComplete,
    onCancel,
}) => {
    const [data, setData] = useState({
        recipientName: '',
        idType: 'National ID',
        idNumber: '',
        phone: '',
        contentAns: '',
        marksAns: ''
    });

    const isReady = data.recipientName.length > 5 && data.idNumber.length > 5 && data.phone.length > 8 && data.contentAns.length > 5;

    return (
        <div className="bg-brand-dark/80 border border-brand-green/30 p-6 rounded-2xl space-y-5 animate-in zoom-in-95 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 border-b border-brand-green/20 pb-4">
                <div className="p-2 bg-brand-green/20 rounded-lg text-brand-green">
                    <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-brand-green font-black text-sm uppercase">بروتوكول المصادقة الأمنية النهائي</h4>
                    <p className="text-[10px] text-gray-400">يجب استيفاء كافة البيانات قبل تسليم العهدة للراكب</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">اسم المستلم الرباعي (حسب الهوية)</label>
                    <input 
                        type="text" 
                        value={data.recipientName} 
                        onChange={e => setData({...data, recipientName: e.target.value})}
                        placeholder="أدخل الاسم الكامل"
                        className="w-full bg-brand-gray border border-brand-gray-light text-white text-xs rounded-lg p-3 outline-none focus:ring-1 focus:ring-brand-green"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">نوع الهوية الرسمية</label>
                        <select 
                            value={data.idType} 
                            onChange={e => setData({...data, idType: e.target.value})}
                            className="w-full bg-brand-gray border border-brand-gray-light text-white text-xs rounded-lg p-3 outline-none focus:ring-1 focus:ring-brand-green"
                        >
                            <option value="National ID">هوية وطنية</option>
                            <option value="Passport">جواز سفر</option>
                            <option value="Residence Permit">إقامة</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">رقم الهوية / الجواز</label>
                        <input 
                            type="text" 
                            value={data.idNumber} 
                            onChange={e => setData({...data, idNumber: e.target.value})}
                            placeholder="أدخل الرقم كما في الأصل"
                            className="w-full bg-brand-gray border border-brand-gray-light text-white text-xs rounded-lg p-3 outline-none focus:ring-1 focus:ring-brand-green"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">رقم الجوال للتواصل</label>
                    <input 
                        type="tel" 
                        value={data.phone} 
                        onChange={e => setData({...data, phone: e.target.value})}
                        placeholder="966XXXXXXXXX"
                        className="w-full bg-brand-gray border border-brand-gray-light text-white text-xs rounded-lg p-3 outline-none focus:ring-1 focus:ring-brand-green"
                    />
                </div>

                <div className="space-y-3 p-4 bg-brand-gray-dark/50 rounded-xl border border-white/5">
                    <h5 className="text-[10px] font-black text-brand-green uppercase tracking-widest flex items-center gap-2">
                        <UserGroupIcon className="w-3 h-3" /> التوثيق الشفهي (الأسئلة الأمنية)
                    </h5>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold">وصف الراكب لمحتويات الحقيبة</label>
                        <textarea 
                            value={data.contentAns} 
                            onChange={e => setData({...data, contentAns: e.target.value})}
                            placeholder="مثال: ملابس شخصية، هدايا مغلفة، مستلزمات طبية..."
                            className="w-full h-20 bg-brand-gray/50 border border-brand-gray-light text-white text-xs rounded-lg p-3 outline-none focus:ring-1 focus:ring-brand-green resize-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold">هل توجد علامات مميزة داخلية؟</label>
                        <input 
                            type="text" 
                            value={data.marksAns} 
                            onChange={e => setData({...data, marksAns: e.target.value})}
                            placeholder="ملصقات، ألوان بطانة، أغراض محددة..."
                            className="w-full bg-brand-gray/50 border border-brand-gray-light text-white text-xs rounded-lg p-3 outline-none focus:ring-1 focus:ring-brand-green"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-brand-green/10">
                <button onClick={onCancel} className="flex-1 py-3 text-xs font-bold text-gray-400 hover:text-white transition-colors">تراجع</button>
                <button 
                    disabled={!isReady}
                    onClick={() => onComplete(data)}
                    className="flex-[2] py-3 bg-brand-green text-brand-gray-dark font-black rounded-xl hover:bg-brand-green-light transition-all disabled:opacity-30 shadow-xl shadow-brand-green/20"
                >
                    اعتماد التوثيق وإتمام التسليم ✓
                </button>
            </div>
        </div>
    );
};

// Fix: Define the missing ReportDetailModalProps interface
interface ReportDetailModalProps {
    report: BaggageReport;
    onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
    const dataContext = useContext(BaggageDataContext);
    const settingsContext = useContext(SettingsContext);
    const [detailedRecord, setDetailedRecord] = useState<BaggageRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSecurityProtocol, setShowSecurityProtocol] = useState(false);
    
    const [currentStatus, setCurrentStatus] = useState<BaggageReport['status']>(report.status);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<string | null>(null);
    const [timelineInfo, setTimelineInfo] = useState<BaggageInfo | null>(null);

    const recordFromContext = useMemo(() => {
        return dataContext?.baggageData?.find(r => r.PIR.toUpperCase() === report.pir.toUpperCase());
    }, [dataContext?.baggageData, report.pir]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!dataContext) return;
            let record = dataContext.dataSource === 'excel' ? recordFromContext : await findBaggageByPir(report.pir);
            if (record) {
                setDetailedRecord(record);
                setTimelineInfo(recordToBaggageInfo(record));
                setCurrentStatus(record.Status as any);
            }
            setIsLoading(false);
        };
        fetchDetails();
    }, [report.pir, dataContext?.dataSource, recordFromContext]);
    
    const handleAiCompare = useCallback(async () => {
        if (!detailedRecord?.PassengerPhotoUrl || !detailedRecord?.BaggagePhotoUrl) return "";
        setIsComparing(true);
        try {
            const result = await compareBaggageImages(detailedRecord.PassengerPhotoUrl, detailedRecord.BaggagePhotoUrl);
            setComparisonResult(result);
            return result;
        } catch { return "Service unavailable"; } finally { setIsComparing(false); }
    }, [detailedRecord]);

    const handleSecurityHandoverComplete = useCallback(async (securityData: { recipientName: string, idType: string, idNumber: string, phone: string, contentAns: string, marksAns: string }) => {
        if (!dataContext || !detailedRecord) return;
        const now = new Date().toISOString();
        const pir = detailedRecord.PIR;

        // تحديث السجل ببيانات التوثيق الأمني الكاملة
        await dataContext.updateBaggageRecord(pir, { 
            Status: 'Delivered', 
            LastUpdate: now,
            IsConfirmedByPassenger: true,
            History_1_Timestamp: now,
            History_1_Status: 'تسليم أمني موثق (SGS Handover)',
            History_1_Location: detailedRecord.CurrentLocation,
            History_1_Details: `تم التسليم للمستلم: ${securityData.recipientName}. الهوية: ${securityData.idType} (${securityData.idNumber}). الجوال: ${securityData.phone}. إفادة المحتويات: ${securityData.contentAns}.`
        });

        // تسجيل في سجل التدقيق الأمني الإداري
        settingsContext?.addAuditLog({
            user: 'SGS Operation Officer',
            category: 'Security',
            action: 'إتمام تسليم أمني نهائي',
            details: `الحقيبة: ${pir}. تم التسليم للمستلم: ${securityData.recipientName} بعد التحقق من الهوية (${securityData.idNumber}).`,
            status: 'Success'
        });

        setCurrentStatus('Delivered');
        setShowSecurityProtocol(false);
        alert(`تم توثيق الاستلام الأمني للحقيبة ${pir} بنجاح باسم المستلم ${securityData.recipientName}.`);
        onClose();
    }, [dataContext, detailedRecord, settingsContext, onClose]);

    const handleCancelProtocol = useCallback(() => setShowSecurityProtocol(false), []);

    const statusText: { [key in BaggageReport['status']]: string } = {
        'Urgent': 'عاجل', 'In Progress': 'قيد المتابعة', 'Resolved': 'تم الحل', 'Needs Staff Review': 'تحتاج مراجعة',
        'Out for Delivery': 'خرجت للتوصيل', 'Delivered': 'تم التسليم', 'Found - Awaiting Claim': 'معثور عليها'
    };

    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Urgent': return 'bg-red-500/20 text-red-200';
            case 'Delivered': return 'bg-green-500/20 text-green-200';
            case 'Found - Awaiting Claim': return 'bg-cyan-500/20 text-cyan-200';
            default: return 'bg-slate-500/20 text-slate-200';
        }
    }

    // تعديل الشرط: السماح بالتوثيق الأمني لكافة الحالات ما دامت لم تسلم بعد
    const canHandover = currentStatus !== 'Delivered';

    return (
        <Modal isOpen={true} onClose={onClose} title="إدارة ملف الأمتعة الاستراتيجي" size="5xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Security Action Section */}
                    {canHandover && (
                        <div className="animate-in slide-in-from-top-4 duration-500">
                            {!showSecurityProtocol ? (
                                <button 
                                    onClick={() => setShowSecurityProtocol(true)} 
                                    className="w-full py-4 bg-brand-green text-brand-gray-dark font-black rounded-xl hover:bg-brand-green-light shadow-2xl shadow-brand-green/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    بدء التوثيق الأمني للتسليم
                                </button>
                            ) : (
                                <SecurityHandoverProtocol 
                                    onCancel={handleCancelProtocol} 
                                    onComplete={handleSecurityHandoverComplete} 
                                />
                            )}
                        </div>
                    )}

                    {currentStatus === 'Delivered' && (
                        <Card className="bg-brand-green/10 border-brand-green/30 text-center py-6">
                            <CheckCircleIcon className="w-12 h-12 text-brand-green mx-auto mb-3" />
                            <h4 className="text-white font-black">تم التسليم الأمني الموثق</h4>
                            <p className="text-[10px] text-brand-green font-bold uppercase mt-1 tracking-widest">SGS Security Certified</p>
                        </Card>
                    )}

                    {/* AI Comparison Module */}
                    <div className="bg-brand-gray-dark/50 p-4 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="text-xs font-black text-brand-green uppercase flex items-center gap-2">
                            <CameraIcon className="w-4 h-4" /> المطابقة البصرية (AI Sync)
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <p className="text-[8px] text-gray-400 text-center font-bold">بلاغ الراكب</p>
                                <div className="aspect-square bg-brand-gray rounded-lg overflow-hidden border border-white/5">
                                    {detailedRecord?.PassengerPhotoUrl ? <img src={detailedRecord.PassengerPhotoUrl} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[8px] text-gray-700">N/A</div>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] text-gray-400 text-center font-bold">SGS - وجه 1</p>
                                <div className="aspect-square bg-brand-gray rounded-lg overflow-hidden border border-white/5">
                                    {detailedRecord?.BaggagePhotoUrl ? <img src={detailedRecord.BaggagePhotoUrl} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[8px] text-gray-700">N/A</div>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] text-gray-400 text-center font-bold">SGS - وجه 2</p>
                                <div className="aspect-square bg-brand-gray rounded-lg overflow-hidden border border-white/5">
                                    {detailedRecord?.BaggagePhotoUrl_2 ? <img src={detailedRecord.BaggagePhotoUrl_2} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[8px] text-gray-700">N/A</div>}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleAiCompare}
                            disabled={isComparing || !detailedRecord?.PassengerPhotoUrl}
                            className="w-full py-2.5 bg-brand-green/10 text-brand-green border border-brand-green/30 rounded-lg text-[10px] font-black hover:bg-brand-green/20 transition-all disabled:opacity-30"
                        >
                            {isComparing ? 'جاري التحليل...' : 'بدء المطابقة الذكية 🤖'}
                        </button>
                        {comparisonResult && (
                            <div className={`p-3 rounded-xl text-[10px] border leading-relaxed ${comparisonResult.includes('YES') ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-brand-gray border-brand-gray-light text-gray-300'}`}>
                                <p className="font-bold mb-1 underline">نتيجة الفحص الأمني:</p>
                                {comparisonResult}
                            </div>
                        )}
                    </div>

                    {/* Operational Status Select */}
                    {!showSecurityProtocol && (
                        <div className="bg-brand-gray p-4 rounded-xl border border-white/5">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">تحديث الحالة التشغيلية</label>
                            <select 
                                value={currentStatus} 
                                onChange={(e) => {
                                    const newStatus = e.target.value as any;
                                    setCurrentStatus(newStatus);
                                    dataContext?.updateBaggageRecord(report.pir, { Status: newStatus, LastUpdate: new Date().toISOString() });
                                }} 
                                className="w-full px-4 py-3 bg-brand-gray-dark border border-white/10 text-white rounded-lg outline-none focus:ring-1 focus:ring-brand-green text-sm"
                            >
                                {Object.entries(statusText).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {/* Passenger & Flight Summary Card */}
                    <Card className="grid grid-cols-2 gap-6 border-brand-green/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 blur-3xl rounded-full"></div>
                        <InfoItem icon={<UserIcon className="h-5 w-5"/>} label="الراكب" value={detailedRecord?.PassengerName || report.passengerName} />
                        <InfoItem icon={<PlaneIcon className="h-5 w-5"/>} label="الرحلة" value={detailedRecord?.Flight || report.flight} />
                        <InfoItem icon={<TagIcon className="h-5 w-5"/>} label="PIR / TAG" value={report.pir} />
                        <div>
                             <p className="text-sm text-gray-300 font-medium mb-1">الحالة الحالية</p>
                             <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/5 ${getStatusColorClass(currentStatus)}`}>
                                    {statusText[currentStatus] || currentStatus}
                                </span>
                                {detailedRecord?.IsConfirmedByPassenger && (
                                    <span className="bg-brand-green text-brand-gray-dark px-2 py-0.5 rounded-full text-[9px] font-black">
                                        مصادق ✓
                                    </span>
                                )}
                             </div>
                        </div>
                    </Card>
                    
                    {/* Audit Trail Section */}
                    <div className="bg-brand-gray-dark/40 rounded-3xl p-6 border border-white/5 max-h-[55vh] overflow-y-auto custom-scrollbar">
                        <h4 className="text-xs font-black text-white mb-6 border-b border-white/5 pb-2 uppercase tracking-widest flex items-center justify-between">
                            سجل تتبع الملف (Audit Trail)
                            <span className="text-[9px] text-gray-500 font-mono">Secured with AES-256</span>
                        </h4>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
                                <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black animate-pulse">جاري فك تشفير السجلات...</p>
                            </div>
                        ) : timelineInfo && (
                            <BaggageTimeline baggageInfo={timelineInfo} />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReportDetailModal;
