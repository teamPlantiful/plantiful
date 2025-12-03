'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import cn from '@/lib/cn'

import { Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/common/modal'
import Button from '@/components/common/button'
import type { Plant } from '@/types/plant'
import { deletePlantAction } from '@/app/actions/plant/deletePlantAction'

import PlantDetailHeader from '@/components/plant/detail/PlantDetailHeader'
import PlantDetailStatusTab from '@/components/plant/detail/PlantDetailStatusTab'
import PlantDetailSettingsTab, {
  PlantIntervalsUpdatePayload,
} from '@/components/plant/detail/PlantDetailSettingsTab'

type TabKey = 'status' | 'settings'

interface PlantDetailModalProps {
  open: boolean
  onClose: () => void
  plant: Plant
  onDelete: () => void
  onSaveNickname?: (nextName: string) => void
  onSaveIntervals?: (next: PlantIntervalsUpdatePayload) => void
  confirmOnSave?: boolean
  confirmOnDelete?: boolean
}

export default function PlantDetailModal({
  open,
  onClose,
  plant,
  onDelete,
  onSaveNickname,
  onSaveIntervals,
  confirmOnSave = true,
  confirmOnDelete = true,
}: PlantDetailModalProps) {
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(plant.nickname)
  const [tab, setTab] = useState<TabKey>('status')

  // 모달 열릴 때 닉네임 상태 초기화
  useEffect(() => {
    if (!open) return
    setEditing(false)
    setNickname(plant.nickname)
  }, [open, plant.nickname])

  return (
    <Modal open={open} onClose={onClose} size="md" closeOnBackdrop className="animate-fade-in">
      <div className="flex max-h-[80vh] flex-col">
        {/* 헤더 (닉네임 / 수정 폼) */}
        <ModalHeader closable onClose={onClose} className="pb-4 shrink-0">
          <PlantDetailHeader
            plant={plant}
            nickname={nickname}
            editing={editing}
            setNickname={setNickname}
            setEditing={setEditing}
            confirmOnSave={confirmOnSave}
            onSaveNickname={onSaveNickname}
          />
        </ModalHeader>

        <ModalContent className="flex-1 overflow-y-auto space-y-4 scrollbar-overlay">
          {/* 탭 스위처 */}
          <div
            className="grid grid-cols-2 gap-1 rounded-md border bg-secondary/10 border-secondary/20 overflow-hidden"
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
                'rounded-md text-sm py-1.5 font-medium transition-colors outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                tab === 'status'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary/15'
              )}
            >
              상태
            </button>

            <button
              id="tab-settings"
              type="button"
              role="tab"
              aria-selected={tab === 'settings'}
              aria-controls="panel-settings"
              tabIndex={tab === 'settings' ? 0 : -1}
              onClick={() => setTab('settings')}
              className={cn(
                'rounded-md text-sm py-1.5 font-medium transition-colors outline-none',
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
          {tab === 'status' && <PlantDetailStatusTab plant={plant} nickname={nickname} />}

          {tab === 'settings' && (
            <PlantDetailSettingsTab
              plant={plant}
              open={open}
              confirmOnSave={confirmOnSave}
              onSaveIntervals={onSaveIntervals}
              onDone={() => setTab('status')}
            />
          )}
        </ModalContent>

        {/* 삭제 버튼 */}
        <ModalFooter className="pt-4 shrink-0">
          <form
            action={deletePlantAction}
            className="w-full"
            onSubmit={(e) => {
              if (confirmOnDelete && !window.confirm('정말 삭제할까요?')) {
                e.preventDefault()
                return
              }
              onDelete()
            }}
          >
            <input type="hidden" name="id" value={plant.id} />
            <Button type="submit" variant="destructive-outline" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제하기
            </Button>
          </form>
        </ModalFooter>
      </div>
    </Modal>
  )
}
