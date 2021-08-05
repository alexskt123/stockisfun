export const priceChangeDateRangeSelectAttr = {
  formControl: {
    as: 'select',
    size: 'sm',
    className: 'my-1 mr-sm-2',
    name: 'year'
  },
  options: [
    {
      label: '15 years',
      value: '15'
    },
    {
      label: '25 years',
      value: '25'
    },
    {
      label: '20 years',
      value: '20'
    },
    {
      label: '10 years',
      value: '10'
    },
    {
      label: '5 years',
      value: '5'
    },
    {
      label: '3 years',
      value: '3'
    },
    {
      label: '1 year',
      value: '1'
    }
  ]
}

export const userListOptions = [
  {
    label: 'Watch List',
    value: ['watchList']
  },
  {
    label: 'Bought List',
    value: ['boughtList']
  },
  {
    label: 'Stock List',
    value: ['stockList']
  },
  {
    label: 'ETF List',
    value: ['etfList']
  }
]

export const userListSelectAttr = {
  formControl: {
    as: 'select',
    size: 'sm',
    className: 'my-1 mr-sm-2 ml-1',
    name: 'formList',
    style: { width: 'auto' }
  },
  options: [
    {
      label: 'Your Choice',
      value: ''
    },
    ...userListOptions,
    {
      label: 'ALL',
      value: userListOptions.map(u => u.value)
    }
  ]
}

export const buttonSettings = {
  Go: {
    label: 'Go',
    attr: {
      size: 'sm',
      variant: 'success',
      type: 'submit'
    }
  },
  ClearAll: {
    label: 'Clear All',
    attr: {
      size: 'sm',
      className: 'ml-3',
      variant: 'danger'
    }
  },
  Export: {
    label: 'Export',
    attr: {
      size: 'sm',
      className: 'ml-3',
      variant: 'info'
    }
  },
  FromWatchList: {
    label: 'Watch List',
    attr: {
      size: 'sm',
      className: 'ml-3',
      variant: 'secondary'
    }
  }
}
