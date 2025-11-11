import Header from '@/components/Header'
import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab'

export default function Home() {
  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection />
        <PlantListSection />
        <PlantRegistrationFab />
      </div>
    </>
  )
}
