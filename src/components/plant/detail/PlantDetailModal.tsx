'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Droplets, HeartPlus, Sprout, Trash2 } from 'lucide-react'
import cn from '@/lib/cn'

import { Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/common/modal'
import Button from '@/components/common/button'
import Input from '@/components/common/Input'
import SelectBox from '@/components/common/select-box'
import { CareGuideSection } from '@/components/shared/CareGuideSection'

import type { CareInfo } from '@/types/plant'
import { generateDayOptions, generateMonthOptions } from '@/utils/date'

type TabKey = 'status' | 'settings'

interface PlantDetail {
  id: string
  nickname: string
  species_name?: string | null
  speciesInfo?: { koreanName?: string; scientificName?: string }
  dday_water: number
  dday_fertilize: number
  dday_repot: number
  watering_interval_days: number
  fertilizer_interval_days: number
  repot_interval_days: number
  last_watered_at?: string | null
  adopted_at?: string | null
  careInfo?: CareInfo
}

interface PlantDetailModalProps {
  open: boolean
  onClose: () => void
  plant: PlantDetail
  onDelete: () => void
  onSaveNickname?: (nextName: string) => void
  onSaveIntervals?: (next: { watering: number; fertilizer: number; repotting: number }) => void
}

export default function PlantDetailModal({
  open,
  onClose,
  plant,
  onDelete,
  onSaveNickname,
  onSaveIntervals,
}: PlantDetailModalProps) {
  const [editing, setEditing] = useState<boolean>(false)
  const [nickname, setNickname] = useState<string>(plant.nickname)
  const [tab, setTab] = useState<TabKey>('status')

  const dayOptions = useMemo(() => generateDayOptions(60), [])
  const monthOptions = useMemo(() => generateMonthOptions(24), [])

  // 월/일 변환 유틸
  const clamp = (n: number, min: number) => (Number.isFinite(n) ? Math.max(min, n) : min)
  const daysToMonths = (days: number) => clamp(Math.ceil(days / 30), 1)
  const monthsToDays = (months: number) => clamp(months * 30, 30)
  // 설정 탭 선택 값(표시용): 물=일, 영/분=개월
  const [wateringInterval, setWateringInterval] = useState<string>('7')
  const [fertilizerIntervalMonth, setFertilizerIntervalMonth] = useState<string>('1')
  const [repottingIntervalMonth, setRepottingIntervalMonth] = useState<string>('12')

  // 모달 열릴 때/plant 변경 시, interval 기반으로 동기화
  useEffect(() => {
    if (!open) return
    setEditing(false)
    setNickname(plant.nickname)

    // 물: 일
    const w = clamp(plant.watering_interval_days, 1)
    setWateringInterval(String(w))

    // 영양제/분갈이: 최소 1개월
    const fM = daysToMonths(clamp(plant.fertilizer_interval_days, 30))
    const rM = daysToMonths(clamp(plant.repot_interval_days, 30))
    setFertilizerIntervalMonth(String(fM))
    setRepottingIntervalMonth(String(rM))
  }, [open, plant])

  const handleSaveNickname = (): void => {
    setEditing(false)
    const next = nickname.trim()
    if (next && next !== plant.nickname) onSaveNickname?.(next)
  }

  // 저장은 모두 '일' 단위로 변환해서 상위에 전달
  const handleSaveIntervals = (): void => {
    const wateringDays = clamp(Number(wateringInterval) || 1, 1)
    const fertilizerDays = monthsToDays(clamp(Number(fertilizerIntervalMonth) || 1, 1))
    const repottingDays = monthsToDays(clamp(Number(repottingIntervalMonth) || 1, 1))

    onSaveIntervals?.({
      watering: wateringDays,
      fertilizer: fertilizerDays,
      repotting: repottingDays,
    })
  }

  return (
    <Modal open={open} onClose={onClose} size="md" closeOnBackdrop className="animate-fade-in">
      <ModalHeader closable onClose={onClose} className="py-4">
        <div className="flex items-center gap-2 w-full">
          {editing ? (
            <>
              <div className="w-full min-w-0">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  size="sm"
                  className="flex-1 min-w-0"
                />
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (window.confirm('변경하시겠습니까?')) handleSaveNickname()
                }}
              >
                저장
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                취소
              </Button>
            </>
          ) : (
            <>
              <span className="text-base font-semibold">{plant.nickname}</span>
              <Button
                aria-label="이름 수정"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </ModalHeader>

      <ModalContent className="space-y-4 py-0">
        {/* 탭 */}
        <div
          className="grid grid-cols-2 rounded-md border p-0.5 bg-secondary/10 border-secondary/20"
          role="tablist"
          aria-label="식물 상세 탭"
        >
          <button
            id="tab-status"
            type="button"
            role="tab"
            aria-selected={tab === 'status'}
            aria-controls="panel-status"
            tabIndex={tab === 'status' ? 0 : -1}
            onClick={() => setTab('status')}
            className={cn(
              'rounded-md py-1.5 text-sm font-medium transition-colors outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              tab === 'status'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/15'
            )}
          >
            상태
          </button>

          <button
            id="tab-status"
            type="button"
            role="tab"
            aria-selected={tab === 'settings'}
            aria-controls="panel-settings"
            tabIndex={tab === 'settings' ? 0 : -1}
            onClick={() => setTab('settings')}
            className={cn(
              'rounded-md py-1.5 text-sm font-medium transition-colors outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              tab === 'settings'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/15'
            )}
          >
            설정
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {tab === 'status' && (
          <div id="panel-status" role="tabpanel" aria-labelledby="tab-status" className="space-y-4">
            <div className="space-y-3">
              {/* 물주기 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/15">
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-secondary" />
                  <span className="font-medium">물주기</span>
                </div>
                <span className="text-sm font-semibold text-secondary">{`D-${plant.dday_water}`}</span>
              </div>

              {/* 영양제 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-accent/20">
                <div className="flex items-center gap-3">
                  <HeartPlus className="h-5 w-5 text-foreground" />
                  <span className="font-medium">영양제</span>
                </div>
                <span className="text-sm font-semibold">{`D-${plant.dday_fertilize}`}</span>
              </div>

              {/* 분갈이 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted">
                <div className="flex items-center gap-3">
                  <Sprout className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">분갈이</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{`D-${plant.dday_repot}`}</span>
              </div>
            </div>

            {plant.careInfo && <CareGuideSection careInfo={plant.careInfo} />}
          </div>
        )}

        {tab === 'settings' && (
          <div
            id="panel-settings"
            role="tabpanel"
            aria-labelledby="tab-settings"
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">물주기 주기</label>
              <SelectBox
                value={wateringInterval}
                placeholder="주기 선택"
                options={dayOptions.map((o) => ({ ...o, label: `${o.value}일마다` }))}
                onSelect={setWateringInterval}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">영양제 주기</label>
              <SelectBox
                value={fertilizerIntervalMonth}
                placeholder="주기 선택"
                options={monthOptions.map((o) => ({ ...o, label: `${o.value}개월마다` }))}
                onSelect={setFertilizerIntervalMonth}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">분갈이 주기</label>
              <SelectBox
                value={repottingIntervalMonth}
                placeholder="주기 선택"
                options={monthOptions.map((o) => ({ ...o, label: `${o.value}개월마다` }))}
                onSelect={setRepottingIntervalMonth}
              />
            </div>

            <Button
              className="w-full mt-1"
              onClick={() => {
                if (window.confirm('변경하시겠습니까?')) handleSaveIntervals()
              }}
            >
              주기 저장
            </Button>
          </div>
        )}
      </ModalContent>

      <ModalFooter className="py-4">
        <Button
          variant="destructive-outline"
          className="w-full"
          onClick={() => {
            if (window.confirm('정말 삭제할까요?')) onDelete()
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          삭제하기
        </Button>
      </ModalFooter>
    </Modal>
  )
}
