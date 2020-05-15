function toaster(text) {
  console.log('toaster runs ', text)
  document.getElementById(
    'error-toaster',
  ).innerHTML = `<div class="warning-toaster-text">WARNING!!!</div><div class="warning-toaster-content">${text}</div>`

  document.getElementById('error-toaster').style.visibility = 'visible'

  setTimeout(function () {
    document.getElementById('error-toaster').style.visibility = 'hidden'
  }, 2000)
}

export default toaster
