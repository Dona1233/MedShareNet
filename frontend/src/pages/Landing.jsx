import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="text-xl font-bold text-gray-900">MedShareNet</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wide">
          Sustainable Healthcare
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Connecting Medical
          <span className="text-primary-600"> Donors</span> with
          <span className="text-primary-600"> Those in Need</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          MedShareNet bridges the gap between surplus medical equipment and underserved communities.
          Donate unused medical resources and help someone recover faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition"
          >
            Start Donating →
          </Link>
          <Link
            to="/login"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-400 hover:text-primary-600 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center text-white">
          <div>
            <p className="text-4xl font-bold">500+</p>
            <p className="text-primary-100 mt-1">Resources Donated</p>
          </div>
          <div>
            <p className="text-4xl font-bold">200+</p>
            <p className="text-primary-100 mt-1">Families Helped</p>
          </div>
          <div>
            <p className="text-4xl font-bold">50+</p>
            <p className="text-primary-100 mt-1">NGOs Partnered</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How It Works</h2>
        <p className="text-gray-500 text-center mb-12">Simple 3-step process to donate or receive medical resources</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '📝',
              step: '01',
              title: 'Register',
              desc: 'Sign up as a Donor or Beneficiary. NGOs and hospitals can also register as beneficiaries.',
            },
            {
              icon: '📦',
              step: '02',
              title: 'Donate or Browse',
              desc: 'Donors list surplus medical equipment. Beneficiaries browse and request what they need.',
            },
            {
              icon: '✅',
              step: '03',
              title: 'Get Verified & Connected',
              desc: 'Our admin team verifies donations and requests, then connects donors with beneficiaries.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="text-5xl mb-4">{item.icon}</div>
              <span className="text-xs font-bold text-primary-600 tracking-widest">STEP {item.step}</span>
              <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Why MedShareNet?</h2>
          <p className="text-gray-500 text-center mb-12">Built to make medical resource sharing safe, transparent and efficient</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Secure & Verified', desc: 'All donations and requests are manually verified by our admin team before being processed.' },
              { icon: '🎯', title: 'Smart Matching', desc: 'Search and filter system connects beneficiaries with the exact resources they need.' },
              { icon: '📊', title: 'Real-time Tracking', desc: 'Track the status of your donations and requests in real time through your dashboard.' },
              { icon: '🏥', title: 'Medical Focus', desc: 'Purpose-built for medical equipment — wheelchairs, oxygen cylinders, hospital beds and more.' },
              { icon: '🤝', title: 'Community Driven', desc: 'Built for individuals, NGOs, hospitals and charitable organizations across India.' },
              { icon: '♻️', title: 'Zero Waste', desc: 'Reduce medical waste by giving unused equipment a second life with someone who truly needs it.' },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can donate */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">What Can Be Donated?</h2>
        <p className="text-gray-500 text-center mb-12">We accept a wide range of medical equipment and supplies</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🦽', label: 'Wheelchairs' },
            { icon: '🩼', label: 'Crutches' },
            { icon: '🫁', label: 'Oxygen Cylinders' },
            { icon: '🛏️', label: 'Hospital Beds' },
            { icon: '💊', label: 'Medicines' },
            { icon: '🔬', label: 'Diagnostic Equipment' },
            { icon: '🏥', label: 'Surgical Equipment' },
            { icon: '📦', label: 'Other Supplies' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-xl text-center">
              <span className="text-4xl mb-2">{item.icon}</span>
              <span className="text-sm font-medium text-primary-800">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-20 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
          Join MedShareNet today and help us build a community where no medical resource goes to waste.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition"
          >
            Join as Donor
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition"
          >
            Join as Beneficiary
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🏥</span>
          <span className="text-white font-bold text-lg">MedShareNet</span>
        </div>
        <p className="text-sm">Intelligent Redistribution of Surplus Medical Resources for Sustainable Healthcare</p>
        <p className="text-xs mt-4 text-gray-600">© 2026 MedShareNet. Built with MERN Stack.</p>
      </footer>

    </div>
  );
};

export default Landing;