import TopNav from './components/layout/TopNav.jsx'
import Home from './pages/Home.jsx'
import QuizView from './pages/QuizView.jsx'
import SummaryView from './pages/SummaryView.jsx'
import { useGameStore } from './store/useGameStore.js'

export default function App() {
  const quiz = useGameStore((s) => s.activeQuiz)
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="mx-auto max-w-2xl px-4 py-8">
        {!quiz ? <Home /> : quiz.finished ? <SummaryView /> : <QuizView />}
      </main>
    </div>
  )
}
