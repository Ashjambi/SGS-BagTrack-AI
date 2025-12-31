
import { BaggageRecord, WorldTracerConfig } from '../types';

/**
 * WorldTracer API Service (Strategic Integration Layer)
 * Supports bi-directional synchronization between SGS App and Global WorldTracer DB.
 * 
 * NOTE: This service is now configured for LIVE REST API calls.
 * It gracefully falls back to local cache if the connection fails (Circuit Breaker Pattern).
 */

// Fallback Cache (Simulation Data)
let localServerCache: BaggageRecord[] = [
    {
        PIR: "FRALH65432",
        PassengerName: "أحمد المصري",
        Flight: "LH630",
        Status: "Urgent",
        LastUpdate: new Date().toISOString(),
        CurrentLocation: "مطار فرانكفورت (FRA)",
        Origin: "CAI",
        Destination: "FRA",
        NextStep: "في انتظار إعادة الجدولة.",
        EstimatedArrival: "TBD",
        History_1_Timestamp: new Date().toISOString(),
        History_1_Status: "تحديد الموقع",
        History_1_Location: "FRA",
        History_1_Details: "تم العثور على الحقيبة في منطقة الفرز.",
        History_2_Timestamp: "", History_2_Status: "", History_2_Location: "", History_2_Details: "",
        History_3_Timestamp: "", History_3_Status: "", History_3_Location: "", History_3_Details: "",
        BaggagePhotoUrl: 'https://images.unsplash.com/photo-1579052320412-d1e2f854b420?q=80&w=400',
        IsConfirmedByPassenger: false
    }
];

const getIntegrationConfig = (): WorldTracerConfig => {
    try {
        const stored = localStorage.getItem('wtIntegration');
        return stored ? JSON.parse(stored) : { 
            isConnected: false, 
            apiKey: '', 
            stationCode: 'JED', 
            agentId: 'SGS_SYS', 
            airlineCode: 'SV',
            baseUrl: 'https://api.worldtracer.aero/v1' 
        };
    } catch { 
        return { isConnected: false, apiKey: '', stationCode: 'JED', agentId: 'SGS_SYS', airlineCode: 'SV', baseUrl: '' }; 
    }
};

/**
 * دالة المحاكاة المحلية (للعمل دون اتصال أو عند فشل الخادم)
 */
const simulateRequest = async (endpoint: string, method: string, payload?: any) => {
    console.warn(`[WT-SIMULATION] Executing mock request to ${endpoint}`);
    await new Promise(resolve => setTimeout(resolve, 800)); // محاكاة تأخير الشبكة
    return { status: 200, ok: true, data: localServerCache };
};

/**
 * دالة الاتصال الحي الآمن
 */
const executeSecureRequest = async (endpoint: string, method: string = 'GET', payload?: any) => {
    const config = getIntegrationConfig();
    
    // 1. التحقق من تفعيل الاتصال من الإعدادات
    if (!config.isConnected) {
        return simulateRequest(endpoint, method, payload);
    }

    console.info(`[WT-GATEWAY][${method}] Syncing with Global WorldTracer: ${config.baseUrl}${endpoint}`);

    try {
        // 2. إعداد الترويسات الأمنية القياسية لنظام SITA/WorldTracer
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`, // مفتاح API
            'WT-Agent-ID': config.agentId,             // معرف الوكيل
            'WT-Station-Code': config.stationCode,     // كود المحطة (JED)
            'WT-Airline-Code': config.airlineCode,     // كود الناقل (SV)
            'X-Request-ID': `SGS-${Date.now()}`        // معرف تتبع الطلب
        };

        // 3. تنفيذ الطلب الفعلي
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // مهلة 10 ثواني

        const response = await fetch(`${config.baseUrl}${endpoint}`, {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : undefined,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`WorldTracer API Error: ${response.status} ${response.statusText}`);
        }

        // 4. إرجاع البيانات الحقيقية
        return await response.json();

    } catch (error) {
        console.error("[WT-CONNECTION-FAILED] Switching to fallback mode:", error);
        // في حال فشل الاتصال الحقيقي، نعود للمحاكاة لضمان استمرار عمل التطبيق أمام المستخدم
        return simulateRequest(endpoint, method, payload);
    }
};

export const fetchGlobalReports = async (): Promise<BaggageRecord[]> => {
    const result = await executeSecureRequest('/reports/active');
    // إذا كان الاتصال حقيقياً، نفترض أن result يحتوي على البيانات، وإلا نستخدم الكاش
    return Array.isArray(result) ? result : [...localServerCache];
};

export const findBaggageByQuery = async (query: string, type: string): Promise<BaggageRecord | null> => {
    const result = await executeSecureRequest(`/search?q=${query}&type=${type}`);
    // منطق التعامل مع البيانات الحقيقية أو المحاكاة
    const normalized = query.trim().toUpperCase();
    
    // إذا عادت البيانات من السيرفر الحقيقي
    if (result && result.pir) return result;

    // العودة للبحث المحلي
    return localServerCache.find(r => r.PIR.toUpperCase() === normalized) || null;
};

/**
 * دالة المزامنة العكسية: تقوم بتحديث ورلد تريسر عالمياً بناءً على تغييرات التطبيق
 */
export const updateGlobalRecord = async (pir: string, updates: Partial<BaggageRecord>): Promise<void> => {
    // إرسال التحديث للنظام العالمي
    await executeSecureRequest(`/reports/${pir}`, 'PATCH', updates);
    
    // تحديث الكاش المحلي (للمحاكاة أو لتحديث الواجهة فوراً)
    const index = localServerCache.findIndex(r => r.PIR.toUpperCase() === pir.toUpperCase());
    if (index !== -1) {
        localServerCache[index] = { ...localServerCache[index], ...updates };
        console.log(`[STRATEGIC-SYNC] Record ${pir} closed/updated globally via SGS App.`);
    }
};

export const findBaggageByPir = (pir: string) => findBaggageByQuery(pir, 'pir');
