export default function Info() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About MGNREGA</h1>

        <div className="prose max-w-none">
          <section className="mb-8">
            <div className="flex items-start space-x-4 mb-4">
              <span className="text-4xl">📋</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  What is MGNREGA?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Mahatma Gandhi National Rural Employment Guarantee Act
                  (MGNREGA) is an Indian labor law and social security measure
                  that aims to guarantee the 'right to work'. It provides at
                  least 100 days of wage employment in a financial year to every
                  household whose adult members volunteer to do unskilled manual
                  work.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-start space-x-4 mb-4">
              <span className="text-4xl">🎯</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Key Objectives
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide livelihood security to rural households</li>
                  <li>Create durable assets in rural areas</li>
                  <li>Strengthen grassroots democracy</li>
                  <li>Empower women and marginalized communities</li>
                  <li>Reduce rural-urban migration</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">❓</span>
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <FAQItem
                question="What is a Person-Day?"
                answer="A person-day is a unit of measurement. It means one person working for one full day. For example, if 50 people work for 10 days, that creates 500 person-days of employment."
                icon="👷"
              />

              <FAQItem
                question="How are wages calculated?"
                answer="Workers are paid based on the number of days they work. The wage rate is set by the government and varies by state. Payment is made directly to the worker's bank account within 15 days of work completion."
                icon="💰"
              />

              <FAQItem
                question="Who can get work under MGNREGA?"
                answer="Any adult member (18 years or older) of a rural household who is willing to do unskilled manual work can register and request employment. Priority is given to women, scheduled castes, and scheduled tribes."
                icon="👥"
              />

              <FAQItem
                question="What kind of work is done?"
                answer="MGNREGA projects include water conservation, drought proofing, land development, flood control, rural connectivity through roads, and construction of facilities for rural drinking water."
                icon="🏗️"
              />

              <FAQItem
                question="Why is women's participation important?"
                answer="MGNREGA mandates at least one-third participation by women. This helps in women's economic empowerment, financial independence, and reduces gender inequality in rural areas."
                icon="👩"
              />

              <FAQItem
                question="How can I check if my village is performing well?"
                answer="Look at the key metrics: total person-days generated, number of households worked, and timely wage payments. Higher numbers mean more employment opportunities are being created in your area."
                icon="📊"
              />
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-green-50 border-l-4 border-india-green p-6 rounded">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-3xl mr-3">💡</span>
                Your Rights Under MGNREGA
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Right to get work within 15 days of applying</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    Right to get unemployment allowance if work is not provided
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    Right to get wages within 15 days of work completion
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    Right to receive facilities like water, shade, and first aid
                    at worksite
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    Right to register complaints and get them resolved
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <div className="bg-orange-50 border-l-4 border-saffron p-6 rounded">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Data Source & Transparency
              </h2>
              <p className="text-gray-700 mb-2">
                All data shown on this platform is sourced from the Government
                of India's official Data.gov.in portal and MGNREGA public
                records. We believe in complete transparency and citizen
                empowerment through accessible information.
              </p>
              <p className="text-gray-700">
                This platform is built to help every citizen, especially those
                in rural areas, understand how government programs are working
                in their district.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  icon: string;
}

function FAQItem({ question, answer, icon }: FAQItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="flex items-start space-x-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
