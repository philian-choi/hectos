import React from 'react';

export const metadata = {
    title: 'Terms of Service - Hectos',
};

export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 bg-white text-slate-800 font-sans leading-relaxed">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="text-sm text-slate-500 mb-12">Last Updated: January 18, 2026</p>

            <section className="space-y-6 mb-16">
                <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>
                    By downloading or using the Hectos app, these terms will automatically apply to you. You should make sure therefore that you read them carefully before using the app.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Medical Disclaimer</h2>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-900">
                    <p className="font-bold mb-2">Consult a Doctor Before Exercise</p>
                    <p>
                        Hectos is not a medical device and provides information for educational and fitness purposes only.
                        You should consult your physician or other health care professional before starting this or any other fitness program to determine if it is right for your needs.
                    </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. In-App Purchases</h2>
                <p>
                    The app may offer In-App Purchases. If you choose to make a purchase, you acknowledge and agree that additional terms and conditions may apply.
                    All billing and refund inquiries are handled by the Apple App Store.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Changes to Terms</h2>
                <p>
                    We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes.
                </p>
            </section>

            <hr className="border-slate-200 my-12" />

            <h1 className="text-4xl font-bold mb-8">이용약관</h1>
            <section className="space-y-6">
                <p>
                    Hectos 앱을 다운로드하거나 사용함으로써 귀하는 본 약관에 동의하게 됩니다.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. 의료 면책 조항</h2>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-900">
                    <p className="font-bold mb-2">운동 전 전문가와 상담하세요</p>
                    <p>
                        Hectos는 의료 기기가 아니며, 피트니스 정보만을 제공합니다.
                        새로운 운동 프로그램을 시작하기 전에 의사나 전문가와 상담하여 자신의 건강 상태에 적합한지 확인해야 합니다.
                        운동 중 통증이나 불편함을 느끼면 즉시 중단하십시오.
                    </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. 인앱 결제</h2>
                <p>
                    앱 내에서 구매가 발생할 수 있습니다. 결제, 청구 및 환불과 관련된 모든 사항은 Apple App Store의 정책 및 이용 약관을 따릅니다.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. 연락처</h2>
                <p>
                    문의사항: support@hectos.app
                </p>
            </section>
        </main>
    );
}
