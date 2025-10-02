import { useAppSelector } from '../app/store'

export default function HomePage() {
  const email = useAppSelector((s) => s.auth.user.email) ?? 'user@example.com'
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Home</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-800">
          Welcome back, <span className="font-medium">{email}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Use the sidebar to navigate. Your recent items will appear here later.
        </p>
      </div>
    </div>
  )
}