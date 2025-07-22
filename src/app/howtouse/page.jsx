'use client'
import { useThemeColor } from "@/hooks/themeColors";

export default function StartlyticsUserGuide() {
  const { background, text } = useThemeColor();

  return (
    <div 
      className="min-h-screen w-full font-sans"
      style={{ backgroundColor: background.primary, color: text.primary }}
    >
      <div className="mx-auto max-w-4xl p-8 md:p-12">
        <div className="text-center mb-16 pt-12">
          <h1 
            className="text-4xl md:text-5xl font-light mb-4 tracking-wide"
            style={{ color: text.primary }}
          >
            Welcome to{" "}
            <span className="font-medium underline decoration-2 underline-offset-4">
              Startlytics
            </span>
          </h1>
          <div 
            className="text-lg mt-8 font-light tracking-wide"
            style={{ color: text.secondary }}
          >
            User Guide
          </div>
          <div 
            className="w-24 h-0.5 mx-auto mt-4"
            style={{ backgroundColor: text.primary }}
          ></div>
        </div>

        <div 
          className="text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed"
          style={{ color: text.secondary }}
        >
          Startlytics helps you visualize your data from Google Sheets or CSV files with interactive dashboards and charts.
        </div>

        <div className="space-y-12">
          <section className="group">
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b transition-colors"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              1. Get Started
            </h2>
            <div className="ml-6 space-y-4" style={{ color: text.secondary }}>
              <p className="text-base leading-relaxed">Visit the Startlytics website.</p>
              <p className="text-base leading-relaxed">Choose how you want to upload your data:</p>
              <div className="ml-8 space-y-3 mt-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: text.primary }}
                  ></div>
                  <p>Google Sheet Link</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: text.primary }}
                  ></div>
                  <p>CSV File Upload</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              2. Upload via Google Sheet
            </h2>
            <div className="ml-6 space-y-4" style={{ color: text.secondary }}>
              <p>Click "Upload via Google Sheet".</p>
              <p>Paste your public Google Sheet link in the input field.</p>
              <p>Click "Submit".</p>
              <p>Startlytics will automatically fetch and analyze your data.</p>
            </div>
            <div 
              className="ml-6 mt-6 p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: background.secondary || 'rgba(128, 128, 128, 0.1)',
                borderColor: text.primary
              }}
            >
              <p 
                className="text-sm italic"
                style={{ color: text.secondary }}
              >
                <strong>Note:</strong> Ensure your sheet is publicly accessible (View access enabled).
              </p>
            </div>
          </section>

          <section>
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              3. Upload via CSV File
            </h2>
            <div className="ml-6 space-y-4" style={{ color: text.secondary }}>
              <p>Click "Upload CSV File".</p>
              <p>Select and upload your .csv file from your device.</p>
              <p>Data is processed and visualized instantly.</p>
            </div>
            <div 
              className="ml-6 mt-6 p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: background.secondary || 'rgba(128, 128, 128, 0.1)',
                borderColor: text.primary
              }}
            >
              <p 
                className="text-sm italic"
                style={{ color: text.secondary }}
              >
                <strong>Note:</strong> Ensure your CSV has a proper header row (first row with column names).
              </p>
            </div>
          </section>

          <section>
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              4. Dashboard Overview
            </h2>
            <div className="ml-6" style={{ color: text.secondary }}>
              <p className="mb-4">Once data is uploaded:</p>
              <div className="grid gap-3 ml-8">
                {[
                  'View summary stats (totals, averages, etc.)',
                  'Explore interactive charts and data insights',
                  'Toggle between different visualizations for better clarity',
                  'Get Insights Button Available for Insights'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: text.primary }}
                    ></div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              5. Features
            </h2>
            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-8" style={{ color: text.secondary }}>
              <div className="space-y-3">
                {[
                  'Bar, Line, Pie, and Custom Charts',
                  'Easy Google Sheet or CSV Upload',
                  'Real-time Dashboard Generation'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: text.primary }}
                    ></div>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  'Re-upload and Re-analyze anytime',
                  'Refresh Button Available to Re-Connect your Updated Google Sheet'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: text.primary }}
                    ></div>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              6. Tips for Best Results
            </h2>
            <div className="ml-6 space-y-3" style={{ color: text.secondary }}>
              {[
                'Keep your data clean and structured',
                'Avoid merged cells or mixed data types in columns',
                'Use descriptive column headers'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: text.primary }}
                  ></div>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 
              className="text-2xl md:text-3xl font-light mb-6 pb-3 border-b"
              style={{ 
                color: text.primary,
                borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)'
              }}
            >
              7. Support
            </h2>
            <div className="ml-6" style={{ color: text.secondary }}>
              <p className="mb-4">If you face any issues:</p>
              <div className="ml-8 space-y-3">
                {[
                  'Chat Support is Available for your Queries and support',
                  'Contact us at rrewar75@gmail.com',
                  'Send your feedback to improve this product rrewar75@gmail.com'
                ].map((support, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: text.primary }}
                    ></div>
                    <p>{support}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div 
          className="mt-20 pt-8 border-t text-center"
          style={{ borderColor: background.secondary || 'rgba(128, 128, 128, 0.2)' }}
        >
          <p 
            className="text-sm font-light"
            style={{ color: text.secondary }}
          >
            © 2025 Startlytics
          </p>
        </div>
      </div>
    </div>
  );
}