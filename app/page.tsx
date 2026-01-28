import Link from 'next/link';
import { Package, Zap, Code, Settings, ArrowRight, Github, BookOpen } from 'lucide-react';



export default function DefaultPage() {

  return (
    <main className="min-h-screen bg-gradient-home">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Modern API Testing Tool
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Test APIs with
            <span className="text-primary animate-pulse font-bold"> Pack Tester </span>
            Encoding Dcoding
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            A powerful, modular API testing client with built-in Pack Tester support.
            Encode, decode, and test your APIs with ease.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/client">
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg hover:shadow-xl">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/env">
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all active:scale-95 shadow-lg border border-gray-200">
                <Code className="w-4 h-4" />
                Convator
              </button>
            </Link>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-600 text-sm font-mono ml-4">pack-tester</span>
            </div>
            <div className="p-8 bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Fast Encoding</span>
                  </div>
                  <p className="text-xs text-gray-600">Binary Pack Tester encoding for efficient data transfer</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">API Testing</span>
                  </div>
                  <p className="text-xs text-gray-600">Test REST APIs with custom headers and variables</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Variables</span>
                  </div>
                  <p className="text-xs text-gray-600">Manage environment variables like Postman</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to test and debug Pack Tester-based APIs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pack Tester Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Native Pack Tester encoding and decoding. Serialize your data efficiently for faster API communication.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 w-fit mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Key-Based Encryption</h3>
            <p className="text-gray-600 leading-relaxed">
              Build complex API requests with custom headers, query parameters, and request bodies with ease.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Environment Variables</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage variables across requests with support for default and secret values, just like Postman.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 w-fit mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Lightweight</h3>
            <p className="text-gray-600 leading-relaxed">
              Built with modern web technologies for lightning-fast performance and minimal resource usage.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 w-fit mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Clean Interface</h3>
            <p className="text-gray-600 leading-relaxed">
              Intuitive, modern UI that makes API testing simple and enjoyable. No learning curve required.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 w-fit mb-4">
              <Github className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Open Source</h3>
            <p className="text-gray-600 leading-relaxed">
              Free and open source. Customize it to fit your workflow and contribute back to the community.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Pack Tester?</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Pack Tester is an efficient binary serialization format that&apos;s faster and smaller than JSON.
                  But testing Pack Tester APIs can be challenging without the right tools.
                </p>
                <p>
                  Pack Tester bridges this gap by providing a modern, user-friendly interface for encoding,
                  decoding, and testing Pack Tester-based APIs. Whether you&apos;re debugging production issues or
                  developing new endpoints, our tool makes the process seamless.
                </p>
                <p>
                  Built with Next.js and modern web technologies, it runs entirely in your browser with no
                  server-side dependencies. Your data stays private and secure.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/client">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg">
                    Start Testing Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="font-mono text-sm">
          
                <div className="text-green-400 mb-4">{'// Example: Encode data to Pack Tester'}</div>
                <div className="text-blue-400">const <span className="text-yellow-300">data</span> = {'{'}</div>
                <div className="text-gray-600 ml-4">name: <span className="text-green-600">&quot;John Doe&quot;</span>,</div>
                <div className="text-gray-600 ml-4">age: <span className="text-purple-600">30</span>,</div>
                <div className="text-gray-600 ml-4">active: <span className="text-purple-600">true</span></div>
                <div className="text-blue-400">{'}'}</div>
                <div className="mt-4 text-blue-400">const <span className="text-yellow-300">encoded</span> = msgpack.<span className="text-pink-400">encode</span>(data)</div>
                <div className="mt-2 text-green-400">{'//  Binary data ready for API request'}</div>
                <div className="mt-2 text-gray-600">83 a4 6e 61 6d 65 a8 4a 6f 68 6e 20 44 6f 65 a3 61 67 65 1e a6 61 63 74 69 76 65 c3</div>
              </div>
            </div>
          </div>
        </div>
      </section>




    </main>
  );
}