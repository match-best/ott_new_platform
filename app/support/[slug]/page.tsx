"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, HelpCircle, FileText, Shield, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/support-pages?slug=${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setPage(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading support page:", err);
          setLoading(false);
        });
    }
  }, [slug]);

  // Navigation items
  const navItems = [
    { slug: "help-center", title: "Help Center", icon: HelpCircle },
    { slug: "privacy-policy", title: "Privacy Policy", icon: Shield },
    { slug: "terms-of-service", title: "Terms of Service", icon: FileText },
    { slug: "contact-us", title: "Contact Us", icon: Mail },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl animate-pulse mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-white text-2xl font-bold mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (!page || page.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Page not found</div>
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">StreamPlay Binge</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 sticky top-24">
              <h3 className="text-white font-semibold text-lg mb-4">Support Pages</h3>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = slug === item.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/support/${item.slug}`}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 section-fade overflow-hidden">
              {/* Page Header */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 md:px-8 py-6 md:py-8 border-b border-slate-700/50">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{page.title}</h1>
                <p className="text-gray-400 text-sm">
                  Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Page Content */}
              <div className="px-6 md:px-8 py-6 md:py-8">
                <div 
                  className="prose prose-invert prose-sm md:prose-base max-w-none
                    prose-headings:text-white prose-headings:font-semibold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-purple-300
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-pink-300
                    prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                    prose-strong:text-white prose-strong:font-semibold
                    prose-ul:text-gray-300 prose-ul:space-y-2
                    prose-ol:text-gray-300 prose-ol:space-y-2
                    prose-li:text-gray-300
                    prose-code:text-purple-300 prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: page.content }} 
                />
              </div>

              {/* Footer Actions */}
              <div className="px-6 md:px-8 py-6 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-gray-400 text-sm">
                    Was this page helpful?
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors text-sm">
                      Yes
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors text-sm">
                      No
                    </button>
                    <Link 
                      href="/support/contact-us"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 