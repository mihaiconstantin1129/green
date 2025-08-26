import ProseContent from '@/components/ProseContent'

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <ProseContent html="<p>Ne poți scrie la <a href='mailto:contact@example.com'>contact@example.com</a>.</p>" />
    </div>
  )
}
