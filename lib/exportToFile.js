import FileSaver from 'file-saver'

import { getCSVContent } from './commonFunction'

export const exportToFile = (tableHeader, tableData, exportFileName) => {
  if (tableHeader && tableData) {
    const blob = new Blob([getCSVContent(tableHeader, tableData)], {
      type: 'text/csv;charset=utf-8;'
    })
    FileSaver.saveAs(blob, exportFileName)
  }
}
