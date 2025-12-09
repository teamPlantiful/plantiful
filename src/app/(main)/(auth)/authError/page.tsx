export default function AuthErrorPage() {
  return (
    <div className="flex items-center min-h-screen justify-center">
      <div className="p-6 animate-fade-in">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">인증 중 오류가 발생했습니다</h1>
          <p className="text-muted-foreground mb-6">
            이메일 링크가 만료되었거나 잘못된 URL일 수 있습니다.
          </p>
          <a
            href="/"
            className="inline-block mt-4 text-primary hover:underline"
          >
            기존 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}