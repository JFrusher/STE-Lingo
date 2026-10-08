import { Analytics } from '@vercel/analytics/react'
import Sidebar from './components/layout/Sidebar.jsx'
import TopNav from './components/layout/TopNav.jsx'
import Home from './pages/Home.jsx'
import QuizView from './pages/QuizView.jsx'
import SummaryView from './pages/SummaryView.jsx'
import { useGameStore } from './store/useGameStore.js'

export default function App() {
  const quiz = useGameStore((s) => s.activeQuiz)
  return (
    <div className="min-h-screen overflow-x-clip bg-gray-50">
      <TopNav />
      {quiz ? (
        <main className="mx-auto max-w-2xl px-4 py-8">{quiz.finished ? <SummaryView /> : <QuizView />}</main>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_18rem] lg:items-start">
          <main>
            <Home />
          </main>
          <Sidebar />
        </div>
      )}
      <Analytics />
    </div>
  )
}
