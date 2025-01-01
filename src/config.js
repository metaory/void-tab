/** @type {typeof chrome} */
export const api = globalThis.browser ?? chrome

// ~debug flag~
export const IS_DEV = 0

// ~device caps~
export const caps = {
  mobile: 'ontouchstart' in window,
  lowEnd: !matchMedia('(min-device-memory: 4gb)').matches,
  lowCpu: navigator.hardwareConcurrency < 4,
  gpu: 'gpu' in navigator,
  dpr: devicePixelRatio || 1
}

// ~defaults~
export const defaults = {
  bg: '#000000',
  fg: '#44DDEE',
  friction: 0.995,
  inertia: 0.08,
  spread: caps.mobile ? 40 : 60,
  alphas: caps.mobile ? [0.4, 0.3, 0.2] : [0.5, 0.4, 0.3],
  chunkSize: caps.lowEnd ? 25 : 50,
  maxAge: caps.mobile ? 90 : 120,
  margin: { x: 0.1, y: 0.25 },
  tierRatios: caps.lowEnd 
    ? [0.010417, 0.011905, 0.027778]
    : [0.015625, 0.017857, 0.041667]
}

// ~dev cfg~
export const devCfg = cfg => {
  const colors = ['#ff0000', '#00ff00', '#0000ff']
  const sizes = [20, 16, 12]
  cfg.tiers.forEach((tier, i) => {
    tier.c = colors[i]
    tier.s = sizes[i]
    tier.a = 0.9
  })
  document.documentElement.style.setProperty('--bg', '#110022')
  return cfg
}

// ~test hex~
const testHex = color => /^#[0-9A-F]{6}$/i.test(color)

// ~load prefs~
export const loadPrefs = async () => {
  const prefs = await api.storage.sync.get(['bg', 'fg'])
  const colors = testHex(prefs.bg) && testHex(prefs.fg) ? prefs : defaults
  Object.entries(colors).forEach(([k, v]) => 
    document.documentElement.style.setProperty(`--${k}`, v))
  IS_DEV && console.log('~prefs~', colors)
  return colors
}
