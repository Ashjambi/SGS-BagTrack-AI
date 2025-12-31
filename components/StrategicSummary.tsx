
import React, { useState } from 'react';
import Card from './common/Card';
import { SparklesIcon, CheckCircleIcon, ChartIcon, WorldIcon, ShieldCheckIcon, CpuChipIcon, PresentationChartIcon } from './common/icons';

const StrategicSummary: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const executiveText = `
الميثاق الاستراتيجي: منظومة SGS الذكية لإدارة الأمتعة 2025
-------------------------------------------------------
الرؤية الاستراتيجية:
أتمتة العمليات اللوجستية الأرضية بنسبة 100% وتحويلها إلى تجربة رقمية استباقية تعزز ريادة الشركة السعودية للخدمات الأرضية إقليمياً ودولياً بما يتماشى مع مستهدفات رؤية المملكة 2030 في قطاع الطيران.

الوظائف والقدرات الجوهرية:
1. التتبع الذكي المتعدد (Hybrid Tracking): دمج بيانات WorldTracer مع قاعدة بيانات SGS المحلية لضمان رؤية شاملة.
2. البصمة الرقمية للأمتعة (AI Vision): استخدام رؤية الكمبيوتر (Computer Vision) لتحليل مواصفات الحقائب وتحديد العلامات المميزة آلياً.
3. بروتوكول المصادقة المزدوجة (Security Proxy): نظام أمني صارم يطابق هوية الراكب مع الصور الملتقطة للحقيبة قبل إتمام التسليم.
4. التنبؤ التشغيلي (Predictive Analytics): نظام تنبيهات مبكر للأمتعة التي تجاوزت 24 ساعة لضمان سرعة معالجتها.

الحوكمة والأمن السيبراني:
- تشفير البيانات (End-to-End Encryption): حماية كافة المراسلات والبيانات الشخصية للمسافرين.
- سجل الامتثال الشامل (Audit Trail): توثيق كل إجراء (تسجيل، تعديل، تسليم) برقم الموظف، الوقت، والموقع لضمان الشفافية المطلقة.
- الحماية من الهلوسة الرقمية: تطبيق بروتوكول صارم في الذكاء الاصطناعي يمنع توليد معلومات غير موجودة في السجلات الرسمية.

الأهداف التشغيلية (KPIs):
- تقليص وقت معالجة البلاغات بنسبة 75%.
- رفع دقة المطابقة البصرية إلى +98%.
- تحسين معدل رضا المسافرين (CSAT) إلى 4.9/5.
  `;

  const handleCopy = () => {
    navigator.clipboard.writeText(executiveText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-32 relative overflow-hidden">
      {/* Strategic Backdrop Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-green/5 to-transparent pointer-events-none"></div>
      
      {/* Executive Header Section */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-brand-green/20 pb-10 gap-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-red-600/90 text-white text-[10px] px-4 py-1 rounded-md font-black tracking-widest uppercase shadow-xl">سري للغاية / للاستخدام الداخلي</span>
            <span className="bg-brand-gray-dark border border-brand-green/40 text-brand-green font-mono text-[10px] px-3 py-1 rounded-md">ID: SGS-STRAT-HUB-2025</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            ميثاق التحول <span className="text-brand-green">الرقمي الذكي</span>
          </h1>
          <p className="text-gray-400 font-medium text-xl max-w-2xl leading-relaxed">
            وثيقة المشروع الاستراتيجي لنظام إدارة وتتبع الأمتعة الموحد - الشركة السعودية للخدمات الأرضية.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button 
            onClick={handleCopy}
            className="flex-1 lg:flex-none px-10 py-5 bg-brand-green text-brand-gray-dark rounded-2xl hover:bg-brand-green-light transition-all font-black text-sm shadow-2xl shadow-brand-green/20 flex items-center justify-center gap-3 active:scale-95"
          >
            {copySuccess ? 'تم نسخ التقرير التنفيذي ✓' : 'تصدير الوثيقة التنفيذية'}
          </button>
        </div>
      </div>

      {/* Strategic Pillars Grid - Updated to 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <CapabilityCard 
          icon={<CpuChipIcon className="w-8 h-8"/>} 
          title="الذكاء الاصطناعي" 
          desc="محرك (SGS-AI) المتطور لتحليل الصور واستخراج البصمة الرقمية للحقائب بدقة تفوق التدخل البشري."
          color="brand-green"
        />
        <CapabilityCard 
          icon={<ShieldCheckIcon className="w-8 h-8"/>} 
          title="الحوكمة والأمان" 
          desc="بروتوكول (Dual-Verify) الذي يربط التسليم الفعلي بمصادقة رقمية مشفرة لضمان أمن ممتلكات الركاب."
          color="blue-500"
        />
        <CapabilityCard 
          icon={<WorldIcon className="w-8 h-8"/>} 
          title="التكامل العالمي" 
          desc="ربط لحظي مع منظومة WorldTracer العالمية لضمان تزامن البيانات عبر كافة المطارات الدولية."
          color="purple-500"
        />
      </div>

      {/* Deep Dive Section: Goals & Differentiators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-brand-dark/40 border-l-4 border-l-brand-green p-8">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-brand-green" />
              الأهداف الاستراتيجية للمبادرة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GoalItem title="أتمتة تجربة المسافر" desc="تقديم خدمة تتبع ذاتية ذكية تقلل الضغط على منصات الخدمة بنسبة 60%." />
              <GoalItem title="تحقيق الحقيقة الرقمية" desc="القضاء على الأخطاء اليدوية في تسجيل الأمتعة عبر التوثيق البصري الإلزامي." />
              <GoalItem title="الاستجابة الاستباقية" desc="نظام إنذار مبكر للأمتعة المتأخرة لتجنب شكاوى المسافرين قبل وقوعها." />
              <GoalItem title="الريادة الابتكارية" desc="تثبيت مكانة SGS كأول مقدم خدمات أرضية يدمج الذكاء الاصطناعي التوليدي في العمليات." />
            </div>
          </Card>

          <section className="space-y-6">
            <h3 className="text-2xl font-black text-white px-2">مصفوفة التميز (القيمة المضافة)</h3>
            <div className="overflow-hidden rounded-3xl border border-white/10 glass-card">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-brand-gray-dark/80 text-white border-b border-white/10">
                    <th className="p-5 font-black text-xs uppercase text-brand-green">المعيار</th>
                    <th className="p-5 font-bold text-xs bg-red-500/5 text-red-400">النمط التقليدي</th>
                    <th className="p-5 font-black text-xs bg-brand-green/10 text-brand-green">منظومة SGS الذكية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  <ComparisonRow label="سرعة المطابقة" old="يدوي (دائماً بطيء)" smart="آلي (لحظي)" />
                  <ComparisonRow label="التوثيق الأمني" old="سجلات ورقية/نصية" smart="بصمة بصرية + سجل تدقيق مشفر" />
                  <ComparisonRow label="شفافية البيانات" old="محدودة (تحتاج اتصال)" smart="مطلقة (تتبع ذاتي 24/7)" />
                  <ComparisonRow label="اتخاذ القرار" old="قائم على الاجتهاد" smart="مدعوم ببيانات الذكاء الاصطناعي" />
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-green/10 to-transparent border-brand-green/30 h-full">
            <h3 className="text-xl font-black text-white mb-6">الحوكمة والامتثال</h3>
            <div className="space-y-6">
              <GovernanceItem 
                title="تشفير AES-256" 
                desc="حماية مطلقة لكافة سجلات الأمتعة والصور الشخصية للمسافرين وفق المعايير العالمية." 
              />
              <GovernanceItem 
                title="Audit Trail" 
                desc="سجل تدقيق غير قابل للتعديل يوثق كل دخول أو إجراء أمني لضمان المساءلة الكاملة." 
              />
              <GovernanceItem 
                title="Identity Cross-Match" 
                desc="بروتوكول صارم يمنع تسليم أي حقيبة دون مطابقة حيوية للهوية الوطنية/الجواز." 
              />
              <div className="p-4 bg-brand-green text-brand-gray-dark rounded-2xl text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1">حالة الاعتماد التقني</p>
                 <p className="text-lg font-black uppercase">CERTIFIED SECURE</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CapabilityCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
  <Card className={`bg-brand-dark/60 border-t-4 border-t-${color} hover:-translate-y-2 transition-all duration-300 group`}>
    <div className={`w-14 h-14 bg-${color}/10 rounded-2xl flex items-center justify-center text-${color} border border-${color}/20 mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h4 className="text-xl font-black text-white mb-3">{title}</h4>
    <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
  </Card>
);

const GoalItem: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
    <h5 className="font-bold text-white text-md flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
      {title}
    </h5>
    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const ComparisonRow: React.FC<{ label: string, old: string, smart: string }> = ({ label, old, smart }) => (
  <tr className="hover:bg-white/5 transition-colors">
    <td className="p-5 font-bold text-white border-l border-white/5">{label}</td>
    <td className="p-5 text-gray-500 italic bg-red-500/5">{old}</td>
    <td className="p-5 text-brand-green font-black bg-brand-green/5">{smart}</td>
  </tr>
);

const GovernanceItem: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="space-y-1">
    <h5 className="text-white font-bold text-sm flex items-center gap-2">
      <ShieldCheckIcon className="w-4 h-4 text-brand-green" />
      {title}
    </h5>
    <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default StrategicSummary;
