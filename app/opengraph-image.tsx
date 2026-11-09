import { ImageResponse } from 'next/og'

export const alt = 'Jasdeep Garcha — building at Vercel; co-founder of Schematic and Matcha'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      width: '100%', height: '100%', padding: 80,
      background: '#f5f5f5', color: '#111', fontFamily: 'serif',
    }}>
      <div style={{ display: 'flex', fontSize: 76, marginBottom: 28 }}>Jasdeep Garcha</div>
      <div style={{ display: 'flex', fontSize: 34 }}>Building at Vercel.</div>
      <div style={{ display: 'flex', fontSize: 34 }}>Co-founder of Schematic and Matcha.</div>
      <div style={{ display: 'flex', fontSize: 26, marginTop: 56, color: '#555' }}>jasgarcha.com</div>
    </div>,
    size,
  )
}
