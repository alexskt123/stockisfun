export const priceChangeDateRangeSelectAttr = {
  formControl: {
    as: 'select',
    size: 'sm',
    className: 'my-1 mr-sm-2',
    name: 'formYear'
  },
  dateRangeOptions: [
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
