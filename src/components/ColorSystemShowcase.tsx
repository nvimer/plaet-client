

/**
 * Color System Showcase Component
 * 
 * Demonstrates the expanded color system with semantic naming,
 * accessibility compliance, and modern design patterns.
 */

export function ColorSystemShowcase() {
  return (
    <div className="p-8 bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Enhanced Color System
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Complete design system with semantic colors, accessibility, and modern patterns
          </p>
        </div>

        {/* Semantic Colors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Semantic Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Primary */}
            <div className="space-y-2">
              <div className="h-20 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Primary</span>
              </div>
              <p className="text-sm text-secondary text-center">Primary Action</p>
            </div>

            {/* Success */}
            <div className="space-y-2">
              <div className="h-20 bg-success-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Success</span>
              </div>
              <p className="text-sm text-secondary text-center">Success State</p>
            </div>

            {/* Warning */}
            <div className="space-y-2">
              <div className="h-20 bg-warning-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Warning</span>
              </div>
              <p className="text-sm text-secondary text-center">Warning State</p>
            </div>

            {/* Error */}
            <div className="space-y-2">
              <div className="h-20 bg-error-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Error</span>
              </div>
              <p className="text-sm text-secondary text-center">Error State</p>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="h-20 bg-info-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Info</span>
              </div>
              <p className="text-sm text-secondary text-center">Info State</p>
            </div>
          </div>
        </section>

        {/* Color Scales */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Color Scales</h2>
          
          {/* Primary Scale */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">Primary (Sage Green)</h3>
            <div className="grid grid-cols-5 gap-3">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="space-y-2">
                  <div 
                    className={`h-16 bg-primary-${shade} rounded border border-primary`} 
                    title={`primary-${shade}`}
                  />
                  <p className="text-xs text-secondary text-center font-mono">
                    {shade}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Success Scale */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">Success</h3>
            <div className="grid grid-cols-5 gap-3">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="space-y-2">
                  <div 
                    className={`h-16 bg-success-${shade} rounded border border-success`} 
                    title={`success-${shade}`}
                  />
                  <p className="text-xs text-secondary text-center font-mono">
                    {shade}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UI Components Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">UI Components</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Buttons</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                  Primary Action
                </button>
                <button className="w-full px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg transition-colors">
                  Success Action
                </button>
                <button className="w-full px-4 py-2 border-2 border-error-500 text-error-500 hover:bg-error-50 rounded-lg transition-all">
                  Cancel Action
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Alerts</h3>
              <div className="space-y-3">
                <div className="px-4 py-3 bg-success-50 border border-success-200 text-success-800 rounded-lg">
                  <strong>Success:</strong> Operation completed successfully
                </div>
                <div className="px-4 py-3 bg-warning-50 border border-warning-200 text-warning-800 rounded-lg">
                  <strong>Warning:</strong> Please review your input
                </div>
                <div className="px-4 py-3 bg-error-50 border border-error-200 text-error-800 rounded-lg">
                  <strong>Error:</strong> Something went wrong
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Typography</h2>
          
          <div className="space-y-4 bg-secondary p-6 rounded-lg">
            <h1 className="text-4xl font-bold text-primary">Heading 1 - Primary Text</h1>
            <h2 className="text-3xl font-bold text-primary">Heading 2 - Primary Text</h2>
            <h3 className="text-2xl font-semibold text-primary">Heading 3 - Primary Text</h3>
            <p className="text-lg text-secondary">Paragraph - Secondary Text</p>
            <p className="text-base text-secondary">Body text - Secondary Text</p>
            <p className="text-sm text-muted">Small text - Muted Text</p>
          </div>
        </section>

        {/* Surfaces */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Surfaces & Backgrounds</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-primary border border-primary rounded-lg flex items-center justify-center">
                <span className="text-primary">Primary</span>
              </div>
              <p className="text-sm text-secondary text-center">Main Background</p>
            </div>

            <div className="space-y-2">
              <div className="h-24 bg-secondary border border-secondary rounded-lg flex items-center justify-center">
                <span className="text-primary">Secondary</span>
              </div>
              <p className="text-sm text-secondary text-center">Card Surface</p>
            </div>

            <div className="space-y-2">
              <div className="h-24 bg-tertiary border border-tertiary rounded-lg flex items-center justify-center">
                <span className="text-primary">Tertiary</span>
              </div>
              <p className="text-sm text-secondary text-center">Alternative Surface</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}