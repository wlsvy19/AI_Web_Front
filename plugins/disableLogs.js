export function disableLogs() {
  console.log = () => {}
  // or you can override any other stuff you want
}
// console.log('=====disableLogs====', process.env.NODE_ENV)
// if (process.env.NODE_ENV === 'development') {
//   disableLogs()
// }
process.env.NODE_ENV === 'production' ? disableLogs() : null
