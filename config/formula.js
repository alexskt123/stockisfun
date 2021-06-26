export const formulaSettings = [
  {
    id: 'annualized',
    label: 'Annualized',
    formula: '((1 + n)(1 + n)...(1 + n)) ^ (1 / y) - 1',
    remarks: ['n: Year Percentage', 'y: No. of Years']
  },
  {
    id: 'annualizedIndicator',
    label: 'Annualized Indicator',
    formula: '',
    remarks: [
      'High Growth: n > 20%',
      'Growth: 10% < n <= 20%',
      'Stable: 0% < n <= 10%',
      'Careful: n < 0%'
    ]
  },
  {
    id: 'debtClearance',
    label: 'Debt Clearance',
    formula: 'L / C',
    remarks: ['L: Total Liability', 'C: Operating Cash']
  }
]
