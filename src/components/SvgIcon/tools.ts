// 废弃无用了
export const getSvgFiles = () => {
  const svgs = import.meta.glob('/src/assets/icons/**/*.svg')
  const components:any = {}
  for (let s in svgs) {
    components[genFileName(s)] = svgs[s]
  }
  return components
}

const genFileName = (path:string) => {
  path = path.replace('.svg', '')
  const nameArr = path.split('/')
  const len = nameArr.length
  let folderName = ''
  let fileName = ''
  // for (let i = len - 1; i <= 0; i--) {
  fileName = nameArr[len - 1]
  folderName = nameArr[len - 2]
  if (folderName !== 'icons') {
    return folderName + '-' + fileName
  }
  return fileName
}
