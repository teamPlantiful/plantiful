import { Pencil } from 'lucide-react'

import Input from '@/components/common/input'
import Button from '@/components/common/button'
import type { Plant } from '@/types/plant'

interface PlantDetailHeaderProps {
  plant: Plant
  nickname: string
  editing: boolean
  setNickname: (name: string) => void
  setEditing: (value: boolean) => void
  confirmOnSave: boolean
  onSaveNickname?: (nextName: string) => void
}

export default function PlantDetailHeader({
  plant,
  nickname,
  editing,
  setNickname,
  setEditing,
  confirmOnSave,
  onSaveNickname,
}: PlantDetailHeaderProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {editing ? (
        <form
          className="flex w-full items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()

            if (confirmOnSave && !window.confirm('변경하시겠습니까?')) {
              return
            }

            const next = nickname.trim()
            if (next && next !== plant.nickname) {
              onSaveNickname?.(next)
            }

            setEditing(false)
          }}
        >
          <div className="w-full min-w-0">
            <Input
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              size="sm"
              className="flex-1 min-w-0"
            />
          </div>
          <Button size="sm" type="submit">
            저장
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setNickname(plant.nickname)
              setEditing(false)
            }}
            className="border"
          >
            취소
          </Button>
        </form>
      ) : (
        <>
          <span className="text-lg font-semibold">{nickname}</span>
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
  )
}
