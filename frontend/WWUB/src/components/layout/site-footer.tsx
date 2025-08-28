import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <p className="text-gray-600 font-medium">너 커서 뭐할래?</p>
            <p className="text-sm text-gray-500">
              © {currentYear} CareerFit. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <Link
              href="/terms"
              className="text-gray-600 hover:text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            >
              개인정보 처리방침
            </Link>
            <a
              href="mailto:support@careerfit.kr"
              className="text-gray-600 hover:text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            >
              문의: support@careerfit.kr
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
