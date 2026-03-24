import React from 'react'
import { MdEmail } from 'react-icons/md'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import useViewportInfo from '../hooks/useViewportInfo'

function ContactIcon({ label }) {
  if (label === 'Email') {
    return <MdEmail size={18} aria-hidden="true" />
  }

  if (label === 'GitHub') {
    return <FaGithub size={16} aria-hidden="true" />
  }

  if (label === 'X') {
    return <FaXTwitter size={16} aria-hidden="true" />
  }

  if (label === 'Instagram') {
    return <FaInstagram size={16} aria-hidden="true" />
  }

  return label
}

function SectorPanel({ activeSection, mode, mobileTouch = false, isCompact = false, isShort = false }) {
  const mobilePanelStyle = mobileTouch
    ? {
        left: 12,
        right: 12,
        top: isShort ? 84 : 96,
        bottom: 'auto',
        width: 'auto',
        padding: isCompact ? '11px 12px' : '13px 14px',
        maxHeight: isShort ? '38vh' : '44vh',
        overflowY: 'auto',
      }
    : undefined

  if (mode === 'map' && !activeSection) {
    return (
      <div className="panel panel-main right-mid" style={mobilePanelStyle}>
        <div className="tagline" style={{ fontSize: mobileTouch ? '0.58rem' : undefined }}>Star Map</div>
        <div className="title-md" style={{ fontSize: mobileTouch ? (isCompact ? '1.06rem' : '1.16rem') : undefined }}>Sector Overview</div>
        <p className="body-copy" style={{ fontSize: mobileTouch ? (isCompact ? '0.74rem' : '0.8rem') : undefined, lineHeight: mobileTouch ? 1.45 : undefined }}>
          Press <strong>M</strong> again to return to flight mode. Press <strong>R</strong> to
          reset the ship to the starting corridor.
        </p>
      </div>
    )
  }

  if (!activeSection) return null

  return (
    <div className="panel panel-main right-mid" style={{ pointerEvents: 'auto', ...mobilePanelStyle }}>
      <div className="tagline" style={{ fontSize: mobileTouch ? '0.58rem' : undefined }}>{activeSection.eyebrow}</div>
      <div className="title-md" style={{ fontSize: mobileTouch ? (isCompact ? '1.06rem' : '1.16rem') : undefined }}>{activeSection.title}</div>
      <p className="body-copy" style={{ whiteSpace: 'pre-line', fontSize: mobileTouch ? (isCompact ? '0.74rem' : '0.8rem') : undefined, lineHeight: mobileTouch ? 1.45 : undefined }}>{activeSection.body}</p>
      <div className="pills" style={{ pointerEvents: 'auto' }}>
        {activeSection.cta.map((item) => {
          const label = typeof item === 'string' ? item : item.label
          const href = typeof item === 'string' ? '#' : item.href
          const external = href && !href.startsWith('mailto:')
          return (
            <a
              key={label}
              className="pill"
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto', cursor: 'pointer', textDecoration: 'none' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <ContactIcon label={label} />
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export function IntroOverlay({ phase, reveal, loadingProgress }) {
  const { isMobile, isCompact } = useViewportInfo()
  if (phase === 'play') return null

  const loading = phase === 'loading'
  const introPercent = Math.round(reveal * 100)
  const progressValue = loading ? Math.min(90, Math.round(loadingProgress)) : introPercent

  return (
    <div
      className="overlay"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        pointerEvents: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,4,12,0.98), rgba(2,4,12,0.76))',
          opacity: loading ? 1 : Math.max(0, 0.9 - reveal * 1.1),
          transition: 'opacity 300ms ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          opacity: loading ? 1 : Math.max(0, 1 - reveal * 0.9),
        }}
      >
        <div style={{ width: isCompact ? 'calc(100vw - 28px)' : isMobile ? 'min(560px, calc(100vw - 36px))' : 'min(560px, calc(100vw - 56px))' }}>
          <div className="tagline">{loading ? 'Initializing' : 'Expanding Star Map'}</div>
          <div className="title-lg" style={{ fontSize: isCompact ? '2.3rem' : isMobile ? '2.9rem' : undefined, lineHeight: isCompact ? 1.08 : undefined }}>{loading ? 'Deep Space Systems' : `World Build ${introPercent}%`}</div>
          <div className="body-copy" style={{ maxWidth: 560, marginInline: 'auto', fontSize: isCompact ? '1rem' : undefined }}>
            {loading
              ? 'Loading flight systems, sector signatures, and celestial landmarks.'
              : 'Camera is descending into the navigable universe. Control will be transferred after the map expansion completes.'}
          </div>

          <div style={{ marginTop: 22, width: '100%' }}>
            <div
              style={{
                height: 8,
                width: '100%',
                borderRadius: 999,
                overflow: 'hidden',
                background: 'rgba(196, 214, 255, 0.14)',
                boxShadow: 'inset 0 0 0 1px rgba(196, 214, 255, 0.08)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressValue}%`,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, rgba(116,164,255,0.92), rgba(189,224,255,0.96))',
                  boxShadow: '0 0 18px rgba(116,164,255,0.35)',
                  transition: 'width 180ms ease',
                }}
              />
            </div>
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: '0.82rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(214, 228, 255, 0.72)',
              }}
            >
              <span>{loading ? 'System Load' : 'Map Deployment'}</span>
              <span>{progressValue}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ControlsPanel({ show }) {
  const { isMobile, isCompact, isTouch } = useViewportInfo()
  if (!show || isTouch) return null
  return (
    <div
      className="panel panel-main top-left"
      style={{
        position: 'absolute',
        top: isMobile ? 82 : 104,
        left: isMobile ? 12 : 24,
        right: isMobile ? 12 : 'auto',
        maxWidth: isMobile ? 'none' : isCompact ? 'calc(100vw - 24px)' : 280,
        zIndex: 13,
      }}
    >
      <div className="tagline">Controls (Press H to hide)</div>
      <div className="body-copy" style={{ fontSize: isCompact ? '0.72rem' : '0.8rem', lineHeight: 1.4 }}>
        <strong>W</strong> / ↑ thrust · <strong>S</strong> / ↓ brake · <strong>A,D</strong> turn · <strong>Space</strong> / <strong>Ctrl</strong> pitch · <strong>Shift</strong> boost · <strong>M</strong> map · <strong>R</strong> reset
      </div>
    </div>
  )
}

export function MobileControls({ visible, phase, mode, setMode, onReset, setHasInteracted, setShowControls, setInput }) {
  const { width, isMobile, isCompact, isShort, isTouch } = useViewportInfo()

  if (!visible || !isTouch || phase !== 'play') return null

  const stop = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const setPress = (key, value) => (e) => {
    stop(e)
    setInput((prev) => ({ ...prev, [key]: value }))
    if (value) setHasInteracted(true)
  }

  const tap = (handler) => (e) => {
    stop(e)
    setHasInteracted(true)
    handler()
  }

  const buttonBase = {
    border: '1px solid rgba(196,214,255,0.14)',
    background: 'linear-gradient(180deg, rgba(9,15,28,0.84), rgba(5,10,20,0.7))',
    color: '#e9f2ff',
    borderRadius: 16,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    letterSpacing: '0.08em',
  }

  const dpadSize = isCompact ? 54 : isMobile ? 60 : 66
  const actionWidth = isCompact ? 72 : 82
  const actionHeight = isCompact ? 54 : 60
  const boostWidth = isCompact ? 92 : 108
  const boostHeight = isCompact ? 58 : 66
  const bottomOffset = isShort ? 12 : 18
  const isNarrow = width <= 390
  const isTiny = width <= 360
  const dpadFontSize = isTiny ? '0.62rem' : isCompact ? '0.68rem' : '0.72rem'
  const topButtonHeight = isTiny ? 32 : isNarrow ? 34 : 36
  const topButtonFontSize = isTiny ? '0.6rem' : isNarrow ? '0.64rem' : '0.68rem'
  const topButtonMinWidth = isTiny ? 48 : isNarrow ? 56 : 60
  const topHudMinWidth = isTiny ? 42 : isNarrow ? 50 : 54
  const compactDpad = isTiny ? dpadSize - 6 : dpadSize
  const compactActionWidth = isTiny ? actionWidth - 8 : actionWidth
  const compactActionHeight = isTiny ? actionHeight - 6 : actionHeight
  const compactBoostWidth = isTiny ? boostWidth - 12 : boostWidth
  const compactBoostHeight = isTiny ? boostHeight - 8 : boostHeight

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 21,
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: isTiny ? 68 : isShort ? 72 : 82,
          right: 12,
          display: 'flex',
          gap: 6,
          pointerEvents: 'auto',
        }}
      >
        <button style={{ ...buttonBase, height: topButtonHeight, minWidth: topButtonMinWidth, padding: isNarrow ? '0 8px' : '0 12px', fontSize: topButtonFontSize }} onPointerDown={tap(() => setMode((prev) => (prev === 'flight' ? 'map' : 'flight')))}>
          MAP
        </button>
        <button style={{ ...buttonBase, height: topButtonHeight, minWidth: topButtonMinWidth, padding: isNarrow ? '0 8px' : '0 12px', fontSize: topButtonFontSize }} onPointerDown={tap(() => { setMode('flight'); onReset() })}>
          RESET
        </button>
        <button style={{ ...buttonBase, height: topButtonHeight, minWidth: topHudMinWidth, padding: isNarrow ? '0 7px' : '0 10px', fontSize: topButtonFontSize }} onPointerDown={tap(() => setShowControls((prev) => !prev))}>
          HUD
        </button>
      </div>

      {mode === 'flight' && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 12,
              bottom: bottomOffset,
              display: 'grid',
              gridTemplateColumns: `${compactDpad}px ${compactDpad}px ${compactDpad}px`,
              gridTemplateRows: `${compactDpad}px ${compactDpad}px ${compactDpad}px`,
              gap: isTiny ? 6 : 8,
              pointerEvents: 'auto',
            }}
          >
            <div />
            <button style={{ ...buttonBase, width: compactDpad, height: compactDpad, fontSize: dpadFontSize }} onPointerDown={setPress('forward', true)} onPointerUp={setPress('forward', false)} onPointerCancel={setPress('forward', false)} onPointerLeave={setPress('forward', false)}>FWD</button>
            <div />
            <button style={{ ...buttonBase, width: compactDpad, height: compactDpad, fontSize: dpadFontSize }} onPointerDown={setPress('left', true)} onPointerUp={setPress('left', false)} onPointerCancel={setPress('left', false)} onPointerLeave={setPress('left', false)}>LEFT</button>
            <div />
            <button style={{ ...buttonBase, width: compactDpad, height: compactDpad, fontSize: dpadFontSize }} onPointerDown={setPress('right', true)} onPointerUp={setPress('right', false)} onPointerCancel={setPress('right', false)} onPointerLeave={setPress('right', false)}>RIGHT</button>
            <div />
            <button style={{ ...buttonBase, width: compactDpad, height: compactDpad, fontSize: dpadFontSize }} onPointerDown={setPress('back', true)} onPointerUp={setPress('back', false)} onPointerCancel={setPress('back', false)} onPointerLeave={setPress('back', false)}>BACK</button>
            <div />
          </div>

          <div
            style={{
              position: 'absolute',
              right: 12,
              bottom: bottomOffset,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: isTiny ? 6 : 8,
              pointerEvents: 'auto',
            }}
          >
            <button style={{ ...buttonBase, width: compactActionWidth, height: compactActionHeight, fontSize: isTiny ? '0.74rem' : '0.82rem' }} onPointerDown={setPress('up', true)} onPointerUp={setPress('up', false)} onPointerCancel={setPress('up', false)} onPointerLeave={setPress('up', false)}>UP</button>
            <div style={{ display: 'flex', gap: isTiny ? 6 : 8 }}>
              <button style={{ ...buttonBase, width: compactBoostWidth, height: compactBoostHeight, fontSize: isTiny ? '0.68rem' : '0.78rem' }} onPointerDown={setPress('boost', true)} onPointerUp={setPress('boost', false)} onPointerCancel={setPress('boost', false)} onPointerLeave={setPress('boost', false)}>
                BOOST
              </button>
              <button style={{ ...buttonBase, width: compactActionWidth, height: compactActionHeight, fontSize: isTiny ? '0.74rem' : '0.82rem' }} onPointerDown={setPress('down', true)} onPointerUp={setPress('down', false)} onPointerCancel={setPress('down', false)} onPointerLeave={setPress('down', false)}>DOWN</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function HUD({ hud, activeSection, mode, phase, boostLevel, hasInteracted, showControls, isShipMoving }) {
  const { width, isMobile, isCompact, isShort, isTouch } = useViewportInfo()

  if (phase !== 'play') return null

  const mobileTouch = isMobile && isTouch
  const isNarrowMobile = mobileTouch && width <= 390
  const isTinyMobile = mobileTouch && width <= 360
  const currentTop = mobileTouch ? (isTinyMobile ? 112 : isShort ? 126 : 138) : undefined
  const boostTop = mobileTouch ? (isTinyMobile ? 180 : isShort ? 204 : 224) : undefined
  const showStatsPanel = !(mobileTouch && activeSection)
  const sharedMobileWidth = 'calc(100vw - 24px)'
  const statsPanelWidth = mobileTouch
    ? (isTinyMobile ? 'min(220px, calc(100vw - 24px))' : 'min(248px, calc(100vw - 24px))')
    : isCompact
      ? 'calc(100vw - 24px)'
      : undefined

  return (
    <div
      className={`overlay ${boostLevel > 0.08 ? 'overlay-boost' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div className="vignette" />
      <div className="speed-lines" style={{ opacity: Math.min(1, boostLevel) }} />

      {!mobileTouch && (
        <div className="panel panel-compact top-left" style={{ left: isMobile ? 12 : undefined, top: isMobile ? 12 : undefined, maxWidth: isCompact ? 170 : 180 }}>
          <div className="tagline" style={{ fontSize: isCompact ? '0.62rem' : undefined }}>DRYTRON SATELLAR</div>
          <div className="title-sm" style={{ fontSize: isCompact ? '0.9rem' : undefined }}>ELUNERAS</div>
        </div>
      )}

      <ControlsPanel show={showControls && !isShipMoving} />

      {!mobileTouch && (
        <div className="panel panel-compact top-right" style={{ right: isMobile ? 12 : undefined, top: isMobile ? 12 : undefined, maxWidth: isCompact ? 106 : undefined }}>
          <div className="tagline" style={{ fontSize: isCompact ? '0.62rem' : undefined }}>{mode === 'map' ? 'Mode' : 'Velocity'}</div>
          <div className="kv" style={{ fontSize: isCompact ? '1rem' : undefined }}>{mode === 'map' ? 'MAP' : hud.speed}</div>
          <div className="muted" style={{ fontSize: isCompact ? '0.68rem' : undefined }}>{mode === 'map' ? 'press M to exit' : 'units / sec'}</div>
        </div>
      )}

      {!activeSection && (
        <div
          className="panel panel-main"
          style={{
            position: 'absolute',
            left: isMobile ? 12 : 24,
            right: mobileTouch ? 12 : 'auto',
            top: currentTop,
            bottom: mobileTouch ? 'auto' : 24,
            width: isCompact ? sharedMobileWidth : isMobile ? 'min(360px, calc(100vw - 24px))' : 'min(300px, calc(100vw - 420px))',
            padding: mobileTouch ? (isTinyMobile ? '7px 12px' : isNarrowMobile ? '8px 13px' : '9px 14px') : isCompact ? '10px 12px' : '14px 16px',
            zIndex: 12,
          }}
        >
          <div className="tagline" style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.54rem' : '0.58rem') : isCompact ? '0.62rem' : undefined }}>Current Sector</div>
          <div className="title-sm" style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.84rem' : '0.9rem') : isCompact ? '0.92rem' : '1rem', marginBottom: 6 }}>
            {hud.sector}
          </div>
          <p className="body-copy" style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.66rem' : '0.72rem') : isCompact ? '0.78rem' : '0.88rem', lineHeight: 1.45, margin: 0 }}>
            {hud.sectorHint}
          </p>
        </div>
      )}

      <SectorPanel activeSection={activeSection} mode={mode} mobileTouch={mobileTouch} isCompact={isCompact} isShort={isShort} />

      {phase === 'play' && showStatsPanel && (
        <div
          className="panel panel-main bottom-right"
          style={{
            position: 'absolute',
            left: mobileTouch ? 'auto' : 'auto',
            right: isMobile ? 12 : 24,
            top: boostTop,
            bottom: mobileTouch ? 'auto' : 24,
            padding: mobileTouch ? (isTinyMobile ? '6px 12px' : isNarrowMobile ? '7px 13px' : '8px 14px') : isCompact ? '9px 11px' : '10px 14px',
            fontSize: isCompact ? '0.74rem' : '0.85rem',
            zIndex: 12,
            width: statsPanelWidth,
            maxWidth: mobileTouch ? 'none' : isMobile ? 320 : undefined,
          }}
        >
          <div className="grid-stats" style={{ gap: mobileTouch ? (isTinyMobile ? '4px 12px' : '5px 14px') : undefined, paddingLeft: mobileTouch ? 2 : 0 }}>
            <div className="label" style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.5rem' : '0.56rem') : isCompact ? '0.62rem' : '0.7rem' }}>Boost</div>
            <div style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.68rem' : '0.74rem') : isCompact ? '0.76rem' : undefined }}>{hud.boost ? 'Active' : boostLevel > 0.1 ? 'Charging' : 'Standby'}</div>
            <div className="label" style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.5rem' : '0.56rem') : isCompact ? '0.62rem' : '0.7rem' }}>Position</div>
            <div style={{ fontSize: mobileTouch ? (isTinyMobile ? '0.66rem' : '0.72rem') : isCompact ? '0.72rem' : '0.8rem' }}>{hud.position}</div>
          </div>
        </div>
      )}

      {phase === 'play' && !hasInteracted && !isMobile && (
        <div className="panel panel-main bottom-left">
          <div className="tagline">Concept</div>
          <p className="body-copy">
            Draconis was not built merely to cross space, but to remember it. To pilot Draconis was to enter a pact with the unknown. Every sector it approached became part of its story, every turn through the void another chapter in a journey without final destination. In the endless expanse of space, Draconis was both wanderer and guardian.
          </p>
        </div>
      )}

      {phase === 'play' && (
        <div className={`crosshair ${boostLevel > 0.2 ? 'crosshair-boost' : ''}`}>
          <div className="crosshair-ring" style={{ opacity: 0.18 + boostLevel * 0.52 }} />
        </div>
      )}
    </div>
  )
}
