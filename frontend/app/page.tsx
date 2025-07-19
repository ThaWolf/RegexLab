import EnhancedRegexTester from '../components/EnhancedRegexTester'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent animate-fade-in">
            RegexLab
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Master regular expressions with our interactive playground. Test patterns, get explanations, and learn step by step.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <div className="flex items-center space-x-2 text-text-muted-light dark:text-text-muted-dark">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-sm font-medium">Interactive Learning</span>
          </div>
          <div className="flex items-center space-x-2 text-text-muted-light dark:text-text-muted-dark">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-sm font-medium">Real-time Testing</span>
          </div>
          <div className="flex items-center space-x-2 text-text-muted-light dark:text-text-muted-dark">
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-sm font-medium">Step-by-step Guidance</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="animate-scale-in">
        <EnhancedRegexTester />
      </section>
    </div>
  )
}
