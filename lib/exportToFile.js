import { getCSVContent } from './commonFunction'
import FileSaver from 'file-saver'

export const exportToFile = (tableHeader, tableData, exportFileName) => {
    if (tableHeader && tableData) {
        const blob = new Blob([getCSVContent(tableHeader, tableData)], { type: 'text/csv;charset=utf-8;' })
        FileSaver.saveAs(blob, exportFileName)
    }
}