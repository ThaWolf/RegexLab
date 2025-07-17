export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-garden-light dark:bg-garden-dark border border-earth-light dark:border-garden-dark rounded-2xl shadow-soft transition-colors mt-8">
      <h1 className="text-3xl font-bold text-garden-dark dark:text-earth-light mb-6">
        Regular Expression Documentation
      </h1>

      <h2 className="text-xl font-semibold text-garden-dark dark:text-earth-light mb-4">
        What is a regular expression?
      </h2>
      <p className="mb-6 text-garden-dark dark:text-earth-light">
        A regular expression is a pattern that allows you to search and manipulate text flexibly. 
        They are used to validate data or find matches within strings.
      </p>

      <h2 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-4">
        Basic symbols
      </h2>
      <ul className="space-y-2 text-garden-dark dark:text-earth-light">
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">.</code> any character</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">*</code> zero or more repetitions</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">+</code> one or more repetitions</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">?</code> optional</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">[abc]</code> character set</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">\d</code> digit</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">\w</code> alphanumeric character</li>
        <li><code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">( )</code> group</li>
      </ul>

      <h2 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-4">
        Examples
      </h2>
      <ul className="space-y-2 text-garden-dark dark:text-earth-light">
        <li>
          Validate a simple email: <code className="bg-sky-light dark:bg-sky-dark px-2 py-1 rounded">/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/</code>
        </li>
        <li>
          Extract numbers: <code className="bg-sky-light dark:bg-sky-dark px-2 py-1 rounded">/\d+/g</code>
        </li>
        <li>
          Check date format <code className="bg-earth-light dark:bg-garden-dark px-2 py-1 rounded">dd/mm/yyyy</code>: <code className="bg-sky-light dark:bg-sky-dark px-2 py-1 rounded">/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/</code>
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-4">
        Quick test
      </h2>
      <p>Interactive regex tester will be added here.</p>
    </div>
  );
} 