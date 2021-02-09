
export const sortTableItem = async (tableItemArr, checkIndex, ascSort) => {
    return [...tableItemArr].sort(function (a, b) {

        const bf = (a[checkIndex] || '').toString().replace(/\+|\%/gi, '')
        const af = (b[checkIndex] || '').toString().replace(/\+|\%/gi, '')
        
        if (isNaN(bf))
            return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)       
        else
            return ascSort ? bf - af : af - bf

    })
}
