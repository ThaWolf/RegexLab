import EnhancedRegexTester from '../components/EnhancedRegexTester'

export default function Home() {
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-garden-dark dark:text-earth-light">RegexLab</h1>
        <p className="mt-2 text-garden-dark dark:text-earth-light">
          Master regular expressions with our interactive playground. Test patterns, get explanations, and learn step by step.
        </p>
      </div>
      
      <EnhancedRegexTester />
    </main>
  )
}
