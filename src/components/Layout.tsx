import Navbar from './Navbar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f5f7' }}>
      <Navbar />
      <main style={{ padding: '32px' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout