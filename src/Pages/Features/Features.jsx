import React from 'react'
import {
  TrendingUp,
  Upload,
  BarChart3,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Menu,
  X,
  ArrowRight,
  Play,
  Users,
  Database,
  Target,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
const Features = () => {

  return ( <section id="features" className="py-20 bg-gray-800/50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Powerful Features for
          <span className="text-gradient"> Smart Founders</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Everything you need to turn raw data into actionable business insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Easy Data Upload</h3>
          <p className="text-gray-300 leading-relaxed">
            Upload CSV files, connect Google Sheets, or integrate APIs with just a few clicks. Support for multiple data sources.
          </p>
        </div>

        <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">AI-Powered Insights</h3>
          <p className="text-gray-300 leading-relaxed">
            Get instant summaries, ask questions about your data, and receive personalized growth recommendations powered by OpenAI.
          </p>
        </div>

        <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Beautiful Dashboards</h3>
          <p className="text-gray-300 leading-relaxed">
            Visualize your data with stunning charts and graphs. Export to PDF, share with your team, and track progress over time.
          </p>
        </div>

        <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Database className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Multi-Dataset Management</h3>
          <p className="text-gray-300 leading-relaxed">
            Manage multiple datasets, rename, delete, and organize your data sources. Compare datasets and track changes over time.
          </p>
        </div>

        <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
          <p className="text-gray-300 leading-relaxed">
            JWT authentication, CORS protection, rate limiting, and data ownership checks ensure your data stays secure.
          </p>
        </div>

        <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Real-time Sync</h3>
          <p className="text-gray-300 leading-relaxed">
            Auto-sync with Google Sheets, webhook integrations with Stripe and Shopify, and scheduled data refresh.
          </p>
        </div>
      </div>
    </div>
  </section>

  )
}

export default Features