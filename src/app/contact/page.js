import { getSettings, getCategories } from '@/lib/store'
import SiteLayout from '@/components/SiteLayout'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: "Επικοινωνία",
  description: "Επικοινωνήστε μαζί μας για οποιαδήποτε απορία ή παραγγελία. Καλέστε μας για να παραγγείλετε προϊόντα με τον κωδικό τους.",
}

export default async function ContactPage() {
  let settings, categories

  try {
    settings = await getSettings()
    categories = await getCategories()
  } catch (error) {
    console.error('Error loading data:', error)
  }

  return (
    <SiteLayout settings={settings} categories={categories}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Επικοινωνία</h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Επικοινωνήστε μαζί μας για οποιαδήποτε απορία ή παραγγελία
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Τηλέφωνο</p>
                  <p className="font-semibold text-gray-900">{settings.phone}</p>
                </div>
              </a>
            )}

            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{settings.email}</p>
                </div>
              </a>
            )}

            {settings?.address && (
              <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Διεύθυνση</p>
                  <p className="font-semibold text-gray-900">{settings.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ωράριο</p>
                <p className="font-semibold text-gray-900">Δευ-Παρ: 9:00-17:00</p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          {settings?.phone && (
            <div className="text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Καλέστε μας τώρα!</h2>
              <p className="text-blue-100 mb-6">
                Δώστε τον κωδικό του προϊόντος που σας ενδιαφέρει και θα το παραγγείλετε άμεσα
              </p>
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-xl hover:bg-blue-50 transition-colors"
              >
                <Phone size={24} />
                {settings.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
