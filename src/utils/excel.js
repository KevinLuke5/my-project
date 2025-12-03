import * as XLSX from 'xlsx'
import axios from 'axios'

// excel文件url转html
export const excelToHtml = async (fileUrl) => {
  return new Promise((resolve, reject) => {
    let excelHtml = ''
    const excelHtmlList = []

    axios.get(fileUrl, {
      responseType: 'arraybuffer'
    }).then((res) => {
      let rejectMsg = undefined
      const workbook = XLSX.read(res.data)
      console.log(workbook)
      // debugger
      for (let i = 0; i < workbook.SheetNames.length; i++) {
        const ws = workbook.Sheets[workbook.SheetNames[i]]
        // console.log(ws)
        // 存在!ref证明当前sheet里面有数据
        if (ws['!ref']) {
          let str = XLSX.utils.sheet_to_html(ws, {
            header: 1,
            defval: ''
          })
          console.log(workbook.SheetNames[i], str, str.length)
          // debugger
          if (str.length > 9027657) { // 大概10M
            rejectMsg = '文件内容较多，无法在线预览！'
            break
          } else {
            // 只截取table的内容
            const startNo = str.indexOf('<table>')
            const endNo = str.indexOf('</table>')
            str = str.substring(startNo, endNo + '</table>'.length)

            str = str.replace(/(\b(?:id|t|v)=".*?")/g, '')
            str = str.replace(
              '<table>',
              '<table border="1" style="border-collapse:collapse;width:100%;margin-top:15px;">'
            )

            excelHtml += str
            // console.log(excelHtml)
            excelHtmlList.push({ sheetName: workbook.SheetNames[i], html: str })
            // console.log(excelHtmlList)
          }
        }
      }
      if (rejectMsg) {
        reject({ msg: rejectMsg, isTooMuch: true })
      } else {
        resolve({ excelHtmlList, excelHtml })
      }
    }).catch(() => {
      reject({ msg: '文件读取失败！', isTooMuch: false })
    })
  })
}