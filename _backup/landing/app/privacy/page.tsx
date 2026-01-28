import React from 'react';

export const metadata = {
    title: 'Privacy Policy - Hectos',
};

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 bg-white text-slate-800 font-sans leading-relaxed">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-sm text-slate-500 mb-12">Last Updated: January 18, 2026</p>

            <section className="space-y-6 mb-16">
                <p>
                    Hectos ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Hectos.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. TrueDepth API & Face Data</h2>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <p className="font-semibold text-blue-900 mb-2">We use the TrueDepth API strictly for pushup counting.</p>
                    <ul className="list-disc pl-5 space-y-2 text-blue-800">
                        <li><strong>Collection:</strong> We use the camera to detect the position of your face during workouts.</li>
                        <li><strong>Usage:</strong> This data is processed locally on your device in real-time to count your pushup repetitions.</li>
                        <li><strong>Storage:</strong> We do NOT store, record, or save any face data, photos, or videos.</li>
                        <li><strong>Sharing:</strong> No face data is shared with third parties or sent to any servers.</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Data Collection</h2>
                <p>
                    The App operates primarily as a standalone application on your device. Your workout history (reps, dates) is stored locally on your device.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <strong>support@hectos.app</strong>.
                </p>
            </section>

            <hr className="border-slate-200 my-12" />

            <h1 className="text-4xl font-bold mb-8">개인정보 처리방침</h1>
            <section className="space-y-6">
                <p>
                    Hectos(이하 "회사")는 사용자의 개인정보를 중요하게 생각하며, 본 개인정보 처리방침을 통해 회사가 사용자의 정보를 어떻게 보호하는지 설명합니다.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. TrueDepth API 및 얼굴 데이터</h2>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="font-semibold mb-2">당사는 푸쉬업 카운팅 목적으로만 카메라(TrueDepth API)를 사용합니다.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>수집:</strong> 운동 중 사용자의 얼굴 위치를 감지하기 위해 카메라를 사용합니다.</li>
                        <li><strong>이용:</strong> 이 데이터는 기기 내에서 실시간으로 처리되어 운동 횟수를 세는 데에만 사용됩니다.</li>
                        <li><strong>저장:</strong> 어떠한 얼굴 데이터, 사진, 영상도 저장하거나 녹화하지 않습니다.</li>
                        <li><strong>공유:</strong> 얼굴 데이터는 제3자와 공유되거나 서버로 전송되지 않습니다.</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. 데이터 수집 및 저장</h2>
                <p>
                    앱의 모든 운동 기록(횟수, 날짜 등)은 사용자의 기기에 로컬 데이터로 저장됩니다. 별도의 회원가입이나 서버 로그인이 필요하지 않습니다.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. 문의하기</h2>
                <p>
                    개인정보 처리방침과 관련하여 문의사항이 있으시면 <strong>support@hectos.app</strong>으로 연락주시기 바랍니다.
                </p>
            </section>
        </main>
    );
}
