import Header from "@/components/Header"

export default function Home() {
  return (
  <>
  <Header />
    <div className="max-w-xl mx-auto p-4 space-y-6 animate-fade-in">
      
      {/* 3D 식물 표시 박스 */}
      <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">오늘의 식물</h2>
              <span className="text-sm text-muted-foreground">식물 이름</span>
            </div>
            <div className="w-full h-80 border-1 rounded-lg bg-primary/10 grid justify-center items-center">3D 이미지 박스</div>
      </section>
      
      {/* 식물 검색 */}
      <section className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
              placeholder="식물 이름 검색"   
          />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">내 식물들</h2>
          <span className="text-sm text-muted-foreground">물주기 우선</span>
        </div>
      </section>

      {/* 내 식물 표기 공간 */}
      <section>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">아직 등록된 식물이 없습니다</p>
        </div>
      </section>

      <button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-float bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      >+</button>
    </div>
    </>
  );
}