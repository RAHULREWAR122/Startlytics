export default function StartlyticsUserGuide() {
  return (
    <div className=" mx-auto p-12 bg-gray-200 w-full text-gray-900 font-sans">
      <div className="text-center mb-10 mt-20">
        <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
        Welcome to <span className="font-[500] underline">Startlytics</span> 
        </h1>
        <div className="text-lg mt-10 text-gray-600 font-light  tracking-wide">User Guide</div>
        <div className="w-24 h-0.5 bg-gray-900 mx-auto mt-1"></div>
      </div>

      <div className="text-center mb-16 text-gray-700 max-w-2xl mx-auto leading-relaxed">
        Startlytics helps you visualize your data from Google Sheets or CSV files with interactive dashboards and charts.
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          1. Get Started
        </h2>
        <div className="ml-6 space-y-3 text-gray-700">
          <p>Visit the Startlytics website.</p>
          <p>Choose how you want to upload your data:</p>
          <div className="ml-6 space-y-2">
            <p>• Google Sheet Link</p>
            <p>• CSV File Upload</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          2. Upload via Google Sheet
        </h2>
        <div className="ml-6 space-y-3 text-gray-700">
          <p>Click "Upload via Google Sheet".</p>
          <p>Paste your public Google Sheet link in the input field.</p>
          <p>Click "Submit".</p>
          <p>Startlytics will automatically fetch and analyze your data.</p>
        </div>
        <div className="ml-6 mt-6 p-4 bg-gray-50 border-l-2 border-gray-300">
          <p className="text-gray-600 text-sm italic">
            Note: Ensure your sheet is publicly accessible (View access enabled).
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          3. Upload via CSV File
        </h2>
        <div className="ml-6 space-y-3 text-gray-700">
          <p>Click "Upload CSV File".</p>
          <p>Select and upload your .csv file from your device.</p>
          <p>Data is processed and visualized instantly.</p>
        </div>
        <div className="ml-6 mt-6 p-4 bg-gray-50 border-l-2 border-gray-300">
          <p className="text-gray-600 text-sm italic">
            Note: Ensure your CSV has a proper header row (first row with column names).
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          4. Dashboard Overview
        </h2>
        <div className="ml-6 text-gray-700">
          <p className="mb-3">Once data is uploaded:</p>
          <div className="ml-6 space-y-2">
            <p>• View summary stats (totals, averages, etc.)</p>
            <p>• Explore interactive charts and data insights</p>
            <p>• Toggle between different visualizations for better clarity</p>
            <p>• Get Insights Button Available for Insights.</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          5. Features
        </h2>
        <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-3">
            <p>• Bar, Line, Pie, and Custom Charts</p>
            <p>• Easy Google Sheet or CSV Upload</p>
            <p>• Real-time Dashboard Generation</p>
          </div>
          <div className="space-y-3">
            <p>• Re-upload and Re-analyze anytime</p>
            <p>• Refresh Button Available to Re-Connect your Updated Google Sheet</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          6. Tips for Best Results
        </h2>
        <div className="ml-6 space-y-3 text-gray-700">
          <p>• Keep your data clean and structured</p>
          <p>• Avoid merged cells or mixed data types in columns</p>
          <p>• Use descriptive column headers</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b border-gray-200">
          7. Support
        </h2>
        <div className="ml-6 text-gray-700">
          <p className="mb-3">If you face any issues:</p>
          <div className="ml-6 space-y-2">
            <p>• Chat Support is Available for your Queries and support</p>
            <p>• Contact us at rrewar75@gmail.com</p>
            <p>• Send your feedback to improve this product rrewar75@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm font-light">© 2025 Startlytics</p>
      </div>
    </div>
  );
}