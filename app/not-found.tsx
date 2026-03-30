export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      gap: '1rem',
    }}>
      <span style={{ fontSize: '3rem' }}>🎂</span>
      <h1 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, fontSize: '1.5rem' }}>
        This wish has expired or doesn't exist
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
        Birthday wishes are kept for 30 days.
      </p>
      <a
        href="/"
        style={{
          marginTop: '0.5rem',
          background: 'linear-gradient(135deg,#f0c040,#e8547a)',
          borderRadius: '10px',
          padding: '0.65rem 1.5rem',
          color: '#0d0d14',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: '0.9rem',
        }}
      >
        Create a new wish →
      </a>
    </div>
  )
}
