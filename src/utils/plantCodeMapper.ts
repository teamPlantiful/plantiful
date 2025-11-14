// 농사로 API 코드 매핑 유틸리티

const LIGHT_DEMAND_MAP: Record<string, string> = {
  '055001': '낮은 광도 (300~800 Lux)',
  '055002': '중간 광도 (800~1,500 Lux)',
  '055003': '높은 광도 (1,500~10,000 Lux)',
}

const WATER_CYCLE_MAP: Record<string, string> = {
  '053001': '항상 흙을 축축하게',
  '053002': '흙을 촉촉하게 유지',
  '053003': '토양 표면이 마르면',
  '053004': '화분 흙 대부분 마르면',
}

const TEMPERATURE_MAP: Record<string, string> = {
  '082001': '10~15℃',
  '082002': '16~20℃',
  '082003': '21~25℃',
  '082004': '26~30℃',
}

const HUMIDITY_MAP: Record<string, string> = {
  '083001': '40% 미만',
  '083002': '40~70%',
  '083003': '70% 이상',
}

export const PlantCodeMapper = {
  getLightDemand: (code: string | null | undefined): string => {
    return code ? LIGHT_DEMAND_MAP[code] || '정보 없음' : '정보 없음'
  },

  getWaterCycle: (code: string | null | undefined): string => {
    return code ? WATER_CYCLE_MAP[code] || '정보 없음' : '정보 없음'
  },

  getTemperature: (code: string | null | undefined): string => {
    return code ? TEMPERATURE_MAP[code] || '정보 없음' : '정보 없음'
  },

  getHumidity: (code: string | null | undefined): string => {
    return code ? HUMIDITY_MAP[code] || '정보 없음' : '정보 없음'
  },
}
