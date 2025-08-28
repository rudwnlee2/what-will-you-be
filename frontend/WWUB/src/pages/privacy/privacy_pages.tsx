import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          홈으로 돌아가기
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          <header className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보 처리방침</h1>
            <p className="text-gray-600">시행일: 2024-01-01 / 최종 업데이트: 2024-01-01</p>
          </header>

          <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-3">목차</h2>
            <ol className="space-y-1 text-sm">
              <li>
                <a href="#collection" className="text-purple-600 hover:underline">
                  1. 수집하는 개인정보 항목 및 수집 방법
                </a>
              </li>
              <li>
                <a href="#purpose" className="text-purple-600 hover:underline">
                  2. 개인정보의 처리 목적
                </a>
              </li>
              <li>
                <a href="#retention" className="text-purple-600 hover:underline">
                  3. 개인정보의 보유 및 이용기간
                </a>
              </li>
              <li>
                <a href="#third-party" className="text-purple-600 hover:underline">
                  4. 개인정보의 제3자 제공 및 처리위탁
                </a>
              </li>
              <li>
                <a href="#overseas" className="text-purple-600 hover:underline">
                  5. 국외 이전
                </a>
              </li>
              <li>
                <a href="#rights" className="text-purple-600 hover:underline">
                  6. 이용자의 권리와 행사 방법
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-purple-600 hover:underline">
                  7. 쿠키의 사용 및 거부 방법
                </a>
              </li>
              <li>
                <a href="#security" className="text-purple-600 hover:underline">
                  8. 개인정보의 안전성 확보 조치
                </a>
              </li>
              <li>
                <a href="#minors" className="text-purple-600 hover:underline">
                  9. 만 14세 미만 아동의 개인정보 처리
                </a>
              </li>
              <li>
                <a href="#policy-changes" className="text-purple-600 hover:underline">
                  10. 개인정보 처리방침의 변경 및 고지
                </a>
              </li>
              <li>
                <a href="#contact" className="text-purple-600 hover:underline">
                  11. 문의처
                </a>
              </li>
            </ol>
          </nav>

          <div className="prose prose-gray max-w-none space-y-8">
            <section id="collection">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. 수집하는 개인정보 항목 및 수집 방법
              </h2>

              <h3 className="text-lg font-medium text-gray-800 mb-3">회원가입 시 수집 정보</h3>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>• 필수: 아이디, 이름, 이메일, 비밀번호, 생년월일, 성별</li>
                <li>• 선택: 전화번호, 학교명</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">서비스 이용 시 수집 정보</h3>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>• 진로 관련 정보: 장래희망, MBTI, 홀란드 유형, 관심 과목, 직업 가치관</li>
                <li>• 자동 수집: IP주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">소셜 로그인 시 수집 정보</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Google: 이름, 이메일, 프로필 사진</li>
                <li>• Kakao: 닉네임, 이메일, 프로필 사진</li>
              </ul>
            </section>

            <section id="purpose">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 처리 목적</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• 회원 가입 및 관리, 본인 확인</li>
                <li>• AI 기반 맞춤형 진로 추천 서비스 제공</li>
                <li>• 진로 미션 생성 및 관리</li>
                <li>• 친구 기능 및 소셜 서비스 제공</li>
                <li>• 고객 문의 및 불만 처리</li>
                <li>• 서비스 개선 및 통계 분석</li>
                <li>• 법령상 의무 이행</li>
              </ul>
            </section>

            <section id="retention">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. 개인정보의 보유 및 이용기간
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회원 탈퇴 시까지 보유하며, 탈퇴 즉시 지체없이 파기합니다.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다:
              </p>
              <ul className="space-y-1 text-gray-700 mt-2">
                <li>• 계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
                <li>• 소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
                <li>• 로그인 기록: 3개월 (통신비밀보호법)</li>
              </ul>
            </section>

            <section id="third-party">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. 개인정보의 제3자 제공 및 처리위탁
              </h2>
              <p className="text-gray-700 leading-relaxed">
                회사는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한 요구가
                있는 경우에는 관련 법령에 따라 제공할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                현재 개인정보 처리위탁 업체: 해당 없음
              </p>
            </section>

            <section id="overseas">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 국외 이전</h2>
              <p className="text-gray-700 leading-relaxed">
                현재 개인정보의 국외 이전은 하지 않습니다. 향후 국외 이전이 필요한 경우 사전에
                고지하고 동의를 받겠습니다.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. 이용자의 권리와 행사 방법
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                이용자는 언제든지 다음 권리를 행사할 수 있습니다:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• 개인정보 처리현황 통지 요구</li>
                <li>• 개인정보 열람 요구</li>
                <li>• 개인정보 정정·삭제 요구</li>
                <li>• 개인정보 처리정지 요구</li>
                <li>• 손해배상 청구</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                권리 행사는 서비스 내 '내 정보 수정' 메뉴 또는 support@careerfit.kr로 요청하실 수
                있습니다.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. 쿠키의 사용 및 거부 방법
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                서비스 이용 편의를 위해 쿠키를 사용합니다. 쿠키는 로그인 상태 유지, 서비스 이용 통계
                등에 활용됩니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                브라우저 설정을 통해 쿠키를 거부할 수 있으나, 일부 서비스 이용에 제한이 있을 수
                있습니다.
              </p>
            </section>

            <section id="security">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. 개인정보의 안전성 확보 조치
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>• 개인정보 암호화 저장 및 전송</li>
                <li>• 접근권한 관리 및 접근통제 시스템 운영</li>
                <li>• 개인정보 처리 시스템 접속기록 보관</li>
                <li>• 보안프로그램 설치 및 갱신</li>
                <li>• 물리적 보안 조치</li>
                <li>• 개인정보 보호 교육 실시</li>
              </ul>
            </section>

            <section id="minors">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. 만 14세 미만 아동의 개인정보 처리
              </h2>
              <p className="text-gray-700 leading-relaxed">
                만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의를 받습니다. 법정대리인은
                아동의 개인정보 처리에 대한 동의를 철회하거나 처리 정지를 요구할 수 있습니다.
              </p>
            </section>

            <section id="policy-changes">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. 개인정보 처리방침의 변경 및 고지
              </h2>
              <p className="text-gray-700 leading-relaxed">
                개인정보 처리방침 변경 시 시행일 7일 전까지 서비스 내 공지사항을 통해 알려드립니다.
                중요한 변경사항의 경우 이메일로도 개별 통지할 수 있습니다.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. 문의처</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>이메일:</strong> support@careerfit.kr
                  <br />
                  <strong>운영시간:</strong> 평일 09:00 - 18:00 (주말, 공휴일 제외)
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
