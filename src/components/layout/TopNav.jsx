import StatHeader from '../common/StatHeader.jsx'

export default function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <span className="text-xl font-extrabold text-primary">STE-Lingo</span>
        <StatHeader />
      </div>
    </header>
  )
}
