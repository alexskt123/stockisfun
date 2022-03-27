import { sendUserByType, sendUserByID } from '@/lib/email'

export const priceMAList = [
  {
    id: '20<50',
    name: '20-MA lower than 50-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '20<150',
    name: '20-MA lower than 150-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '50<150',
    name: '50-MA lower than 150-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '20>50',
    name: '20-MA higher than 150-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '20>150',
    name: '20-MA higher than 150-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '50>150',
    name: '50-MA higher than 150-MA',
    tickersInfo: [],
    tickersChart: []
  }
]

export const typeFunctPairsSettings = ({ id, uid }) => [
  {
    type: 'priceMA',
    funct: sendUserByType,
    params: { type: 'priceMA' }
  },
  {
    type: 'earningsDate',
    funct: sendUserByType,
    params: { type: 'earningsDate' }
  },
  {
    type: 'id',
    funct: sendUserByID,
    params: { id, uid }
  }
]
