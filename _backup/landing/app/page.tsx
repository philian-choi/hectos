'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Check, ShieldCheck, Minus, Plus, Smartphone, Star } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// --- i18n: Native-Level Copy (H01 "Auto-Counting" Message First) ---
const T = {
  ko: {
    meta: { title: "Hectos | 숫자는 앱이, 집중은 당신이", desc: "터치 없이 자동 카운팅. 당신은 근육에만 집중하세요." },
    hero: {
      tag: "10,000+ Home Gymmers가 선택했습니다",
      headline: <>숫자는 앱이.<br /><span className="text-white">집중은 당신이.</span></>,
      sub: "폰을 바닥에 두세요. 나머지는 저희가 할게요.",
      inputLabel: "현재 최대 개수",
      calcBtn: "내 6주 플랜 보기",
      trust: "3일 무료 · 카드 등록 없음 · 평생 이용"
    },
    compare: {
      title: "혼자 하면 왜 안 될까요?",
      headers: ["", "혼자 / 다른 앱", "HECTOS"],
      rows: [
        ["카운팅", "세다가 까먹음", "알아서 세줌"],
        ["효과", "대충 해서 제자리", "정확한 자세만 인정"],
        ["꾸준함", "작심삼일", "매일 딱 맞는 목표"],
        ["가격", "매달 결제", "한 번 결제, 평생 내 것"]
      ]
    },
    howItWorks: {
      title: "이렇게 작동해요",
      steps: [
        { num: "1", title: "폰을 바닥에", desc: "운동할 곳에 폰을 놓으세요" },
        { num: "2", title: "얼굴 인식", desc: "AI가 당신의 얼굴을 감지합니다" },
        { num: "3", title: "자동 카운팅", desc: "푸쉬업을 하면 자동으로 셉니다" }
      ]
    },
    reviews: [
      { name: "Kevin J.", text: "이제 머릿속으로 숫자 안 세도 돼요. 폼에만 집중하니까 근육이 확 느껴집니다.", stars: 5 },
      { name: "박**", text: "폰 두고 운동만 하면 돼서 진짜 편해요. 개수 신경 안 써도 됨.", stars: 5 },
      { name: "김**", text: "구독 없는 게 제일 좋아요. 한 번 사면 끝.", stars: 5 }
    ],
    cta: {
      desktop: "폰으로 스캔하세요",
      mobile: "10개 테스트하기",
      note: "지금 시작하면 6주 뒤 100개 가능"
    },
    modal: {
      subtitle: "맞춤 플랜 완성",
      title: (reps: number) => `${reps}개 → 100개`,
      btn: "이 플랜으로 시작",
      week: "주차"
    },
    footer: { privacy: '개인정보처리방침', terms: '이용약관', support: '문의' }
  },
  en: {
    meta: { title: "Hectos | Stop Counting. Start Pushing.", desc: "Touchless auto-counting. You focus on muscle, not numbers." },
    hero: {
      tag: "Trusted by 10,000+ Home Gymmers",
      headline: <>We count.<br /><span className="text-white">You push.</span></>,
      sub: "Drop your phone. We handle the rest.",
      inputLabel: "Your current max",
      calcBtn: "See my 6-week plan",
      trust: "3 days free · No card needed · Lifetime access"
    },
    compare: {
      title: "Why can't you do it alone?",
      headers: ["", "Solo / Other apps", "HECTOS"],
      rows: [
        ["Counting", "Lose track mid-set", "Counted for you"],
        ["Results", "Sloppy form, no gains", "Perfect depth or no count"],
        ["Consistency", "Quit after 3 days", "Right-sized daily goals"],
        ["Price", "Monthly fees", "One payment, yours forever"]
      ]
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        { num: "1", title: "Drop your phone", desc: "Place it on the floor where you work out" },
        { num: "2", title: "Face detected", desc: "AI recognizes your face instantly" },
        { num: "3", title: "Auto-count", desc: "Do pushups, we count for you" }
      ]
    },
    reviews: [
      { name: "Kevin J.", text: "Finally, I can focus on my form instead of counting numbers in my head.", stars: 5 },
      { name: "Jake M.", text: "I just drop my phone and push. No thinking, just gains.", stars: 5 },
      { name: "Sarah K.", text: "No subscription BS. Paid once, done.", stars: 5 }
    ],
    cta: {
      desktop: "Scan with your phone",
      mobile: "Try 10 counts",
      note: "Start today, hit 100 in 6 weeks"
    },
    modal: {
      subtitle: "Your custom plan is ready",
      title: (reps: number) => `${reps} → 100`,
      btn: "Start this plan",
      week: "Week"
    },
    footer: { privacy: 'Privacy', terms: 'Terms', support: 'Support' }
  }
};

type Lang = 'ko' | 'en';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('ko');
  const [reps, setReps] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    const savedLang = localStorage.getItem('hectos_lang') as Lang;
    if (savedLang) setLang(savedLang);
    else if (navigator.language.split('-')[0] === 'en') setLang('en');
  }, []);

  useEffect(() => {
    if (mounted) {
      document.title = T[lang].meta.title;
      localStorage.setItem('hectos_lang', lang);
    }
  }, [lang, mounted]);

  if (!mounted) return null;
  const t = T[lang];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">

      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-orange-500/20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter text-orange-500">HECTOS</div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 p-0.5 rounded-full border border-white/10">
              {(['ko', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${lang === l ? 'bg-white text-black' : 'text-neutral-500'
                    }`}
                >
                  {l === 'ko' ? '한국어' : 'EN'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative pt-28 sm:pt-40 pb-16 px-5 max-w-3xl mx-auto text-center">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/10 blur-[120px] rounded-full -z-10" />

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] text-orange-500 uppercase tracking-widest font-bold mb-6">{t.hero.tag}</p>

            <h1 className="text-[15vw] sm:text-8xl font-black tracking-tight leading-[0.85] text-white mb-6">
              {lang === 'ko' ? (
                <>숫자는 앱이.<br /><span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">집중은 당신이.</span></>
              ) : (
                <>We count.<br /><span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">You push.</span></>
              )}
            </h1>

            <p className="text-lg text-neutral-400 mb-12 max-w-sm mx-auto">{t.hero.sub}</p>

            <div className="bg-neutral-900/80 border border-orange-500/20 rounded-[2rem] p-8 max-w-xs mx-auto backdrop-blur-md shadow-[0_0_50px_-12px_rgba(249,115,22,0.2)]">
              <label className="text-[10px] text-orange-500/70 uppercase tracking-widest font-bold block mb-6">{t.hero.inputLabel}</label>

              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setReps(Math.max(0, reps - 1))} className="w-12 h-12 rounded-full border border-orange-500/20 bg-orange-500/5 flex items-center justify-center active:scale-90 transition-transform">
                  <Minus size={20} className="text-orange-500/70" />
                </button>
                <div className="text-6xl font-black tabular-nums text-white">{reps}</div>
                <button onClick={() => setReps(reps + 1)} className="w-12 h-12 rounded-full border border-orange-500/20 bg-orange-500/5 flex items-center justify-center active:scale-90 transition-transform">
                  <Plus size={20} className="text-orange-500/70" />
                </button>
              </div>

              <button
                onClick={() => setShowResults(true)}
                className="w-full bg-orange-500 text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                {t.hero.calcBtn}
              </button>

              <p className="mt-6 text-[10px] text-neutral-600 flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-orange-500" />
                {t.hero.trust}
              </p>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-5"
              onClick={() => setShowResults(false)}
            >
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="max-w-md w-full" onClick={e => e.stopPropagation()}>
                <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-3 text-center">{t.modal.subtitle}</p>
                <h2 className="text-5xl font-black tracking-tight text-center mb-12">{t.modal.title(reps)}</h2>

                <div className="grid grid-cols-4 gap-2 mb-10">
                  {[1, 2, 4, 6].map(week => {
                    const goal = week === 6 ? 100 : Math.round(reps + ((100 - reps) / 6) * week);
                    const isGoal = week === 6;
                    return (
                      <div key={week} className={`p-4 rounded-2xl text-center ${isGoal ? 'bg-orange-500 text-black' : 'bg-white/5 border border-white/10'}`}>
                        <p className={`text-[9px] uppercase font-bold mb-1 ${isGoal ? 'text-black/60' : 'text-neutral-500'}`}>{t.modal.week} {week}</p>
                        <p className="text-2xl font-black">{goal}</p>
                      </div>
                    );
                  })}
                </div>

                <a
                  href="#download"
                  onClick={() => setShowResults(false)}
                  className="block w-full bg-orange-500 text-black py-5 rounded-2xl font-bold text-center active:scale-95 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                >
                  {t.modal.btn}
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How It Works Section - H01 Core Mechanic */}
        <section className="py-24 px-5 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-neutral-500 text-center mb-16 max-w-md mx-auto">
            {lang === 'ko' ? '복잡한 설정 없이, 3초면 시작할 수 있어요.' : 'No setup. Ready in 3 seconds.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.howItWorks.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-neutral-900/50 border border-orange-500/10 rounded-3xl p-8 text-center backdrop-blur-sm group hover:border-orange-500/30 transition-colors"
              >
                {/* Step Number */}
                <div className="w-14 h-14 rounded-full bg-orange-500 text-black font-black text-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm">{step.desc}</p>

                {/* Connector Arrow (except last) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="text-orange-500/30" size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-24 px-5 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">{t.compare.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4"></th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-neutral-600 font-bold">{t.compare.headers[1]}</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-orange-500 font-bold">{t.compare.headers[2]}</th>
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-6 text-neutral-400 font-bold">{row[0]}</td>
                    <td className="py-6 text-neutral-700 line-through">{row[1]}</td>
                    <td className="py-6 font-bold flex items-center gap-2">
                      <Check size={14} className="text-orange-500" />
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="py-20 overflow-hidden border-y border-white/5">
          <div className="flex gap-6 w-max animate-marquee px-5">
            {[...t.reviews, ...t.reviews].map((review, i) => (
              <div key={i} className="bg-neutral-900/50 border border-orange-500/10 p-8 rounded-3xl w-[320px] backdrop-blur-sm">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-orange-500 text-orange-500" />)}
                </div>
                <p className="text-base text-neutral-300 mb-6 whitespace-normal leading-relaxed">"{review.text}"</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="download" className="py-32 px-5 text-center">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tight mb-12 text-neutral-300">
            {lang === 'ko' ? '밀기만 하세요.' : 'Just push.'}
          </h2>

          {!isMobile ? (
            <div className="bg-white p-8 rounded-3xl inline-block mb-8">
              <QRCodeSVG value="https://landing-nine-black.vercel.app" size={180} />
              <p className="mt-4 text-black text-[10px] font-bold uppercase tracking-widest">{t.cta.desktop}</p>
            </div>
          ) : (
            <a
              href="#"
              className="inline-flex items-center gap-4 bg-orange-500 text-black px-10 py-5 rounded-2xl text-lg font-bold active:scale-95 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              <Smartphone size={24} />
              {t.cta.mobile}
            </a>
          )}
          <p className="text-neutral-500 font-bold mt-10 text-sm">{t.cta.note}</p>
        </section>

        <footer className="py-12 border-t border-white/5 px-5">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-neutral-700 font-bold uppercase tracking-widest">
            <span>HECTOS</span>
            <div className="flex gap-8">
              <a href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</a>
              <a href="mailto:support@hectos.app" className="hover:text-white transition-colors">{t.footer.support}</a>
            </div>
            <span>&copy; 2026 Hectos</span>
          </div>
        </footer>
      </main>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-orange-500/20 z-50 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <a href="#download" className="block w-full bg-orange-500 text-black py-4 rounded-2xl text-sm font-bold text-center active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            {t.cta.mobile}
          </a>
        </div>
      )}

      <style jsx global>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 40s linear infinite; }
                html { scroll-behavior: smooth; }
            `}</style>
    </div>
  );
}
