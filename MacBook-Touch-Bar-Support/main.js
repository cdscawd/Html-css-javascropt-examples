const path = require('path')
const url = require('url')
const {app, BrowserWindow, TouchBar} = require('electron')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar
const reel1 = new TouchBarLabel()
const reel2 = new TouchBarLabel()
const reel3 = new TouchBarLabel()
const result = new TouchBarLabel()
let spinning = false

const spin = new TouchBarButton({
  label: '🎰 Spin',
  backgroundColor: '#7851A9',
  click: () => {
    if (spinning) {
      return
    }
    spinning = true
    result.label = ''
    let timeout = 10
    const spinLength = 4 * 1000 
    const startTime = Date.now()
    const spinReels = () => {
      updateReels()
      if ((Date.now() - startTime) >= spinLength) {
        finishSpin()
      } else {
        timeout *= 1.1
        setTimeout(spinReels, timeout)
      }
    }
    spinReels()
  }
})

const getRandomValue = () => {
  const values = ['🍒', '💎', '🚀', '🍊', '🔔', '⭐', '🍇', '🍀']
  return values[Math.floor(Math.random() * values.length)]
}

const updateReels = () => {
  reel1.label = getRandomValue()
  reel2.label = getRandomValue()
  reel3.label = getRandomValue()
}

const finishSpin = () => {
  const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size
  if (uniqueValues === 1) {
    result.label = '💰 Jackpot!'
    result.textColor = '#FDFF00'
  } else if (uniqueValues === 2) {
    result.label = '😻 Winner!'
    result.textColor = '#FDFF00'
  } else {
    result.label = '😸Spin Again'
    result.textColor = null
  }
  spinning = false
}

const touchBar = new TouchBar([
  spin,
  new TouchBarSpacer({size: 'large'}),
  reel1,
  new TouchBarSpacer({size: 'small'}),
  reel2,
  new TouchBarSpacer({size: 'small'}),
  reel3,
  new TouchBarSpacer({size: 'large'}),
  result
])

let window

function createWindow () {
  window = new BrowserWindow({
    width: 120, 
    height: 60,
    frame: false,
    titleBarStyle: 'hidden-inset',
    backgroundColor: '#000'
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.on('closed', () => {
    window = null
  })

  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})