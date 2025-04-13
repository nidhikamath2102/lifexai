import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
            Welcome to LifexAI
          </h1>
          <p className="text-xl text-gray-600">
            Your AI detective for health, finance, and digital safety
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">About LifexAI</h2>
            <p className="text-gray-600 mb-6">
              LifexAI is your personal &quot;holistic detective,&quot; analyzing clues from your life – health habits, financial transactions, and digital footprints – to give you actionable insights. It features a beautiful, playful UI and leverages cutting-edge AI/ML to provide you with valuable information about your daily life.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>
                <strong>Financial Analysis:</strong> Track your spending, detect anomalies, and get personalized financial advice
              </li>
              <li>
                <strong>Health Monitoring:</strong> Analyze your health data and receive recommendations for improvement
              </li>
              <li>
                <strong>Digital Safety:</strong> Protect your digital footprint and stay safe online
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Financial Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Our financial dashboard helps you track your spending, detect unusual transactions, and manage your subscriptions.
            </p>
            <Link 
              href="/finance" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Finance Features
            </Link>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-green-700">Coming Soon</h2>
            <p className="text-gray-600 mb-4">
              We&apos;re working on adding health monitoring and digital safety features. Stay tuned for updates!
            </p>
            <button 
              disabled
              className="inline-block bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Created for Bitcamp 2025 Hackathon
          </p>
        </div>
      </div>
    </div>
  );
}
