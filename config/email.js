import { sendUserByType, sendUserByID } from '@/lib/email'

export const priceMAList = [
  {
    id: '5<20',
    name: '5-MA lower than 20-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '5<60',
    name: '5-MA lower than 60-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '20<60',
    name: '20-MA lower than 60-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '5>20',
    name: '5-MA higher than 20-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '5>60',
    name: '5-MA higher than 60-MA',
    tickersInfo: [],
    tickersChart: []
  },
  {
    id: '20>60',
    name: '20-MA higher than 60-MA',
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
