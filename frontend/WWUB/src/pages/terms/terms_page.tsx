import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          홈으로 돌아가기
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          <header className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
            <p className="text-gray-600">시행일: 2024-01-01</p>
          </header>

          <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-3">목차</h2>
            <ol className="space-y-1 text-sm">
              <li>
                <a href="#purpose" className="text-purple-600 hover:underline">
                  1. 목적
                </a>
              </li>
              <li>
                <a href="#definitions" className="text-purple-600 hover:underline">
                  2. 용어 정의
                </a>
              </li>
              <li>
                <a href="#service-usage" className="text-purple-600 hover:underline">
                  3. 서비스 이용 및 계정
                </a>
              </li>
              <li>
                <a href="#account-security" className="text-purple-600 hover:underline">
                  4. 계정 보안과 관리 책임
                </a>
              </li>
              <li>
                <a href="#intellectual-property" className="text-purple-600 hover:underline">
                  5. 지적재산권 및 콘텐츠 사용
                </a>
              </li>
              <li>
                <a href="#prohibited-acts" className="text-purple-600 hover:underline">
                  6. 금지 행위
                </a>
              </li>
              <li>
                <a href="#service-changes" className="text-purple-600 hover:underline">
                  7. 서비스 변경, 중단
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-purple-600 hover:underline">
                  8. 보증의 부인 및 면책
                </a>
              </li>
              <li>
                <a href="#liability-limitation" className="text-purple-600 hover:underline">
                  9. 책임의 제한
                </a>
              </li>
              <li>
                <a href="#terms-changes" className="text-purple-600 hover:underline">
                  10. 약관의 변경 및 고지
                </a>
              </li>
              <li>
                <a href="#governing-law" className="text-purple-600 hover:underline">
                  11. 준거법 및 분쟁 해결
                </a>
              </li>
              <li>
                <a href="#contact" className="text-purple-600 hover:underline">
                  12. 문의처
                </a>
              </li>
            </ol>
          </nav>

          <div className="prose prose-gray max-w-none space-y-8">
            <section id="purpose">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 목적</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 "너 커서 뭐할래?" 서비스(이하 "서비스")를 제공하는 CareerFit(이하
                "회사")와 서비스를 이용하는 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
                규정함을 목적으로 합니다.
              </p>
            </section>

            <section id="definitions">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 용어 정의</h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>"서비스"</strong>: AI 기반 진로 추천 및 관련 서비스
                </li>
                <li>
                  <strong>"회원"</strong>: 본 약관에 동의하고 서비스를 이용하는 자
                </li>
                <li>
                  <strong>"계정"</strong>: 회원 식별과 서비스 이용을 위한 아이디와 비밀번호
                </li>
                <li>
                  <strong>"콘텐츠"</strong>: 서비스 내 모든 정보, 데이터, 텍스트, 이미지 등
                </li>
              </ul>
            </section>

            <section id="service-usage">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 서비스 이용 및 계정</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회원가입을 통해 계정을 생성하고 서비스를 이용할 수 있습니다. 회원은 정확한 정보를
                제공해야 하며, 변경사항이 있을 경우 즉시 업데이트해야 합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                만 14세 미만의 경우 법정대리인의 동의가 필요합니다.
              </p>
            </section>

            <section id="account-security">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 계정 보안과 관리 책임</h2>
              <p className="text-gray-700 leading-relaxed">
                회원은 계정의 보안을 유지할 책임이 있으며, 계정 정보의 도용이나 무단 사용으로 인한
                손해에 대해 회사는 책임지지 않습니다. 계정 도용이 의심되는 경우 즉시 회사에 신고해야
                합니다.
              </p>
            </section>

            <section id="intellectual-property">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. 지적재산권 및 콘텐츠 사용
              </h2>
              <p className="text-gray-700 leading-relaxed">
                서비스의 모든 콘텐츠에 대한 지적재산권은 회사에 귀속됩니다. 회원이 생성한 콘텐츠에
                대한 권리는 회원에게 있으나, 서비스 제공을 위한 필요한 범위 내에서 회사가 이용할 수
                있습니다.
              </p>
            </section>

            <section id="prohibited-acts">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 금지 행위</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• 타인의 개인정보 도용 또는 허위 정보 입력</li>
                <li>• 서비스의 안정적 운영을 방해하는 행위</li>
                <li>• 불법적이거나 부적절한 콘텐츠 게시</li>
                <li>• 상업적 목적의 무단 이용</li>
                <li>• 기타 관련 법령에 위반되는 행위</li>
              </ul>
            </section>

            <section id="service-changes">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 서비스 변경, 중단</h2>
              <p className="text-gray-700 leading-relaxed">
                회사는 서비스의 개선이나 기술적 사유로 서비스를 변경하거나 중단할 수 있습니다.
                중요한 변경사항은 사전에 공지하며, 불가피한 경우 사후 공지할 수 있습니다.
              </p>
            </section>

            <section id="disclaimer">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 보증의 부인 및 면책</h2>
              <p className="text-gray-700 leading-relaxed">
                서비스는 "있는 그대로" 제공되며, 회사는 서비스의 완전성, 정확성, 신뢰성에 대해
                보증하지 않습니다. AI 추천 결과는 참고용이며, 최종 결정은 회원의 책임입니다.
              </p>
            </section>

            <section id="liability-limitation">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. 책임의 제한</h2>
              <p className="text-gray-700 leading-relaxed">
                회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지
                않습니다. 회원의 고의나 과실로 인한 손해에 대해서도 책임을 지지 않습니다.
              </p>
            </section>

            <section id="terms-changes">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. 약관의 변경 및 고지</h2>
              <p className="text-gray-700 leading-relaxed">
                약관 변경 시 시행일 7일 전까지 서비스 내 공지사항을 통해 알려드립니다. 중요한
                변경사항의 경우 이메일로도 개별 통지할 수 있습니다.
              </p>
            </section>

            <section id="governing-law">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. 준거법 및 분쟁 해결</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 회사 소재지 관할 법원에서
                해결합니다.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. 문의처</h2>
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
