import { loadPrefs, IS_DEV, api, caps, devCfg, defaults } from './config.js'

// ~promise chain~
const openOptions = () => 
  api.runtime.openOptionsPage()
    .then(window.close)
    .catch(console.error)

// ~pure setup~
const setup = () => {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#44DDEE'

  const cfg = {
    ...defaults,
    tiers: defaults.tierRatios.map((ratio, i) => ({
      n: ~~((innerWidth + innerHeight) * ratio),
      s: [14, 12, 10][i],
      c: accent,
      v: [0.8, 0.4, 0.2][i],
      d: i === 0 ? 3 : 2
    })),
    // ~pre calc~
    pi2: Math.PI * 2,
    rand127: () => ~~(Math.random() * 127),
    rand: () => Math.random() + Math.random(),
    randCoord: () => ~~(Math.random() * 4)
  }

  IS_DEV && devCfg(cfg)

  const state = {
    w: 0, h: 0,
    vel: { x: 0, y: 0, tx: 0, ty: 0 },
    px: null, py: null,
    touch: false,
    dpr: caps.dpr
  }

  // ~typed arrays for gc~
  const stars = cfg.tiers.map(({ n, d }) => ({
    garbage: new Int16Array(n * (d - 1) * 2),
    age: d > 2 ? new Int8Array(n) : null
  }))

  return { cfg, state, stars }
}

// ~bounds check no alloc~
const isVisible = (state, x, y, p = 0) => 
  x >= -p && x <= state.w + p && y >= -p && y <= state.h + p

// ~mul over div~
const recycle = (state, cfg, garbage, i, vel) => {
  const vx = vel.x || 0.1
  const vy = vel.y || 0.1
  const dir = Math.atan2(vy, vx)

  if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
    const r = Math.max(state.w, state.h) * 0.5 + cfg.spread
    const a = dir + Math.PI + (Math.random() - 0.5) * 0.5
    garbage[i] = state.w * 0.5 + Math.cos(a) * r
    garbage[i + 1] = state.h * 0.5 + Math.sin(a) * r
  } else {
    const s = cfg.spread * 0.5
    const m = state.h * cfg.margin.y + Math.random() * state.h * 0.5
    const x = state.w * cfg.margin.x + Math.random() * state.w * 0.5
    const coords = [[x, -s], [state.w + s, m], [x, state.h + s], [-s, m]]
    ;[garbage[i], garbage[i + 1]] = coords[cfg.randCoord()]
  }
  return cfg.rand127()
}

// ~early ret no alloc~
const drawStar = (ctx, state, x, y, tx, ty, size, speed, starAge, i) => {
  if (!isVisible(state, x, y, 2)) return
  
  ctx.lineWidth = size * starAge * state.dpr
  ctx.globalAlpha = 0.5 + 0.3 * Math.random()
  
  const dx = tx * (i === 0 ? 2 * starAge : speed)
  const dy = ty * (i === 0 ? 2 * starAge : speed)
  ctx.moveTo(x, y)
  ctx.lineTo(x + dx, y + dy)
}

// ~mut array no alloc~
const updateStar = (state, cfg, garbage, age, idx, i, speed, starAge, j) => {
  const vx = state.vel.x * speed * starAge
  const vy = state.vel.y * speed * starAge
  let x = garbage[idx] + vx
  let y = garbage[idx + 1] + vy

  if (i === 0) {
    const vel = Math.hypot(state.vel.x, state.vel.y)
    if (vel < 0.02 && ++age[j] > cfg.maxAge) {
      age[j] = recycle(state, cfg, garbage, idx, state.vel)
      return
    }
    if (!isVisible(state, x, y, cfg.spread * 2)) {
      age[j] = recycle(state, cfg, garbage, idx, state.vel)
      return
    }
  } else {
    x = ((x % state.w) + state.w) % state.w
    y = ((y % state.h) + state.h) % state.h
  }

  garbage[idx] = x
  garbage[idx + 1] = y
  return [x, y]
}

// ~batch canvas ops~
const drawStars = (ctx, state, cfg, stars, tier, i) => {
  const { garbage, age } = stars[i]
  const { s: size, v: speed, c: color, n: count } = tier

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.globalAlpha = cfg.alphas[i]

  const tx = state.vel.x * 2 || 0.5
  const ty = state.vel.y * 2 || 0.5

  // ~batch size optimization~
  const batchSize = Math.min(cfg.chunkSize, ~~(count / 4))
  
  for (let chunk = 0; chunk < count; chunk += batchSize) {
    ctx.beginPath()
    const end = Math.min(chunk + batchSize, count)

    for (let j = chunk; j < end; j++) {
      const idx = j * 2
      const starAge = age ? age[j] / 127 : 1
      const coords = updateStar(state, cfg, garbage, age, idx, i, speed, starAge, j)
      if (coords) drawStar(ctx, state, coords[0], coords[1], tx, ty, size, speed, starAge, i)
    }
    ctx.stroke()
  }
  ctx.restore()
}

// ~reflow once~
const resize = (canvas, state, cfg, stars) => {
  state.dpr = devicePixelRatio || 1
  state.w = innerWidth * state.dpr
  state.h = innerHeight * state.dpr
  canvas.width = state.w
  canvas.height = state.h

  stars.forEach((star, i) => {
    const count = cfg.tiers[i].n
    for (let j = 0; j < count; j++) {
      const idx = j * 2
      if (i === 0) {
        star.garbage[idx] = state.w * cfg.margin.x + cfg.rand() * state.w * 0.8
        star.garbage[idx + 1] = state.h * cfg.margin.x + cfg.rand() * state.h * 0.8
        star.age[j] = cfg.rand127()
      } else {
        star.garbage[idx] = Math.random() * state.w
        star.garbage[idx + 1] = Math.random() * state.h
      }
    }
  })
}

// ~mut state no alloc~
const move = (state, x, y) => {
  if (state.px != null) {
    const ox = (x - state.px) * state.dpr * 0.166667
    const oy = (y - state.py) * state.dpr * 0.166667
    const dir = state.touch ? 1 : -1
    state.vel.tx += ox * dir
    state.vel.ty += oy * dir
  }
  state.px = x
  state.py = y
}

// ~raf loop~
const frame = (ctx, state, cfg, stars) => {
  ctx.clearRect(0, 0, state.w, state.h)

  state.vel.tx *= cfg.friction
  state.vel.ty *= cfg.friction
  state.vel.x += (state.vel.tx - state.vel.x) * cfg.inertia
  state.vel.y += (state.vel.ty - state.vel.y) * cfg.inertia

  cfg.tiers.forEach((tier, i) => drawStars(ctx, state, cfg, stars, tier, i))

  frame.id = requestAnimationFrame(() => frame(ctx, state, cfg, stars))
}

// ~reset state~
const clean = (ctx, state, stars) => {
  cancelAnimationFrame(frame.id)
  ctx.clearRect(0, 0, state.w, state.h)
  Object.assign(state.vel, { x: 0, y: 0, tx: 0, ty: 0 })
  state.px = state.py = null
  state.touch = false
  stars.forEach(star => {
    star.garbage.fill(0)
    star.age?.fill(0)
  })
}

/** ~void~ */
const init = () => 
  (!IS_DEV ? loadPrefs() : Promise.resolve())
    .then(() => {
      const { cfg, state, stars } = setup()
      const canvas = document.querySelector('canvas')
      // ~no read canvas~
      const ctx = canvas.getContext('2d', { 
        alpha: true, 
        desynchronized: true,
        willReadFrequently: false
      })

      // ~passive events~
      const events = {
        resize: () => resize(canvas, state, cfg, stars),
        mousemove: e => { state.touch = false; move(state, e.clientX, e.clientY) },
        touchmove: e => { state.touch = true; move(state, e.touches[0].clientX, e.touches[0].clientY); e.preventDefault() },
        mouseleave: () => { state.px = state.py = null },
        touchend: () => { state.px = state.py = null }
      }

      Object.entries(events).forEach(([event, handler]) => 
        addEventListener(event, handler, event === 'touchmove' ? { passive: false } : undefined)
      )

      // ~corner click~
      const corner = document.createElement('div')
      corner.style.cssText = `
        position: fixed;
        inset: 0 auto auto 0;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        transition: background-color 0.3s;
        border-bottom-right-radius: 1rem;
      `
      corner.addEventListener('mouseenter', () => {
        corner.style.backgroundColor = 'color-mix(in srgb, var(--fg) 20%, transparent)'
      })
      corner.addEventListener('mouseleave', () => {
        corner.style.backgroundColor = 'transparent'
      })
      corner.addEventListener('click', openOptions)
      document.body.appendChild(corner)

      resize(canvas, state, cfg, stars)
      frame(ctx, state, cfg, stars)

      if (import.meta.hot) import.meta.hot.dispose(() => clean(ctx, state, stars))
    })
    .catch(console.error)

init()
