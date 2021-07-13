import FileSaver from 'file-saver'
import Papa from 'papaparse'

const getCSVContent = (tableHeader, tableData) => {
  const nowDate = new Date()
  const tableArr = Papa.unparse([
    [
      'Date',
      `${nowDate.getDate()}-${nowDate.getMonth() + 1}-${nowDate.getFullYear()}`
    ],
    [''],
    ...[tableHeader],
    ...tableData.map(itemArr =>
      itemArr.map(item => (item && item.data ? item.data : item))
    )
  ])

  return tableArr
}

const exportToFile = (tableHeader, tableData, exportFileName) => {
  if (tableHeader && tableData) {
    const blob = new Blob([getCSVContent(tableHeader, tableData)], {
      type: 'text/csv;charset=utf-8;'
    })
    FileSaver.saveAs(blob, exportFileName)
  }
}

export { getCSVContent, exportToFile }
