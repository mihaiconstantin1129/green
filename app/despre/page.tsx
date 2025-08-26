import ProseContent from '@/components/ProseContent'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Despre noi</h1>
      <ProseContent html="<p>Suntem un site de știri fictiv.</p>" />
    </div>
  )
}
