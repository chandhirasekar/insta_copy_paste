import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Download, Camera, Link as LinkIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

type ExtractData = {
  mediaUrl: string;
  thumbnail?: string;
  type: 'video' | 'image';
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);

    if (!url) {
      setError('Please enter an Instagram URL.');
      return;
    }

    if (!url.includes('instagram.com')) {
      setError('Please enter a valid Instagram URL.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to extract media.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>InstaFetch - Premium Instagram Downloader</title>
        <meta name="description" content="Download Instagram videos and photos easily." />
      </Head>

      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-2xl mb-4 shadow-lg shadow-pink-500/20">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Download Anything.
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Paste your Instagram link below to save high-quality photos and videos directly to your device.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:border-slate-600/50 hover:shadow-purple-500/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-slate-400 group-focus-within:text-pink-400 transition-colors" />
                </div>
                <input
                  type="url"
                  placeholder="Paste Instagram URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-slate-100 placeholder:text-slate-500 text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all shadow-lg hover:shadow-pink-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                    Get Download Link
                  </>
                )}
              </button>
            </form>

            {/* Error State */}
            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {/* Success State */}
            {data && (
              <div className="mt-8 pt-8 border-t border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-semibold text-slate-100">Ready to Download</h3>
                </div>

                <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/50 flex flex-col md:flex-row items-center gap-6">
                  {data.thumbnail ? (
                    <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700">
                      {data.type === 'video' && data.thumbnail === data.mediaUrl ? (
                        <video src={data.thumbnail} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                      ) : (
                        <img src={data.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full md:w-32 h-32 rounded-xl flex-shrink-0 bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-600" />
                    </div>
                  )}

                  <div className="flex-grow w-full flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                        {data.type}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/api/proxy?url=${encodeURIComponent(data.mediaUrl)}`}
                        className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors"
                        download
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download {data.type === 'video' ? 'Video' : 'Image'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(data.mediaUrl);
                          alert('Link copied to clipboard!');
                        }}
                        className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm relative z-10 border-t border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <p>Built for the beautiful web. Paste a link and magic happens.</p>
      </footer>
    </div>
  );
}
