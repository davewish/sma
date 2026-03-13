/**
 * Landing Page
 * Hero section, features, benefits, pricing, and CTA
 */

import { Button } from "@/components/common";
import "@/styles/landing.css";

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">📱</span>
            <span className="logo-text">SocialSync</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage All Your Social Media in One Place
          </h1>
          <p className="hero-subtitle">
            Schedule posts, track analytics, and grow your presence across
            Instagram, Facebook, and TikTok
          </p>
          <div className="hero-buttons">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button variant="secondary" size="lg">
              Watch Demo
            </Button>
          </div>
          <p className="hero-footnote">
            ✨ No credit card required • Free for 14 days
          </p>
        </div>
        <div className="hero-image">
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
            </div>
            <div className="mockup-content">
              <div className="mockup-item"></div>
              <div className="mockup-item"></div>
              <div className="mockup-item"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>
              Schedule posts for the perfect time. Our AI recommends optimal
              posting times based on your audience.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Analytics</h3>
            <p>
              Track performance across all platforms. Get insights on
              engagement, reach, and audience growth.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Content Calendar</h3>
            <p>
              Visualize your content strategy. Drag-and-drop calendar for easy
              post management and planning.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Multi-Platform Support</h3>
            <p>
              Instagram, Facebook, and TikTok. Manage all your accounts from a
              single dashboard.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Publishing</h3>
            <p>
              Publish immediately or schedule for later. Perfect timing, every
              single post.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>
              Work together with your team. Assign tasks, approve posts, and
              track contributions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Accounts</h3>
            <p>
              Link your Instagram, Facebook, and TikTok accounts securely with
              one click.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create Your Content</h3>
            <p>
              Write posts, upload images, and add captions using our intuitive
              editor.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Schedule & Publish</h3>
            <p>
              Pick the perfect time and let us handle the rest. Post
              automatically at your chosen time.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Performance</h3>
            <p>
              Monitor analytics in real-time and optimize your strategy based on
              what works.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms-section">
        <h2>Supported Platforms</h2>
        <div className="platforms-grid">
          <div className="platform-card">
            <div className="platform-logo">📘</div>
            <h3>Facebook</h3>
            <p>Reach your audience on the world's largest social network</p>
          </div>
          <div className="platform-card">
            <div className="platform-logo">📷</div>
            <h3>Instagram</h3>
            <p>Grow your visual presence with beautiful posts and stories</p>
          </div>
          <div className="platform-card">
            <div className="platform-logo">🎵</div>
            <h3>TikTok</h3>
            <p>Tap into the fastest-growing social platform globally</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <h2>Simple, Transparent Pricing</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">
              $0<span>/month</span>
            </div>
            <ul className="pricing-features">
              <li>✓ 3 posts/month</li>
              <li>✓ 1 social account</li>
              <li>✓ Basic analytics</li>
              <li>✗ Team collaboration</li>
              <li>✗ Advanced scheduling</li>
            </ul>
            <Button variant="secondary">Get Started</Button>
          </div>
          <div className="pricing-card featured">
            <div className="featured-badge">MOST POPULAR</div>
            <h3>Pro</h3>
            <div className="price">
              $9.99<span>/month</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Unlimited posts</li>
              <li>✓ 5 social accounts</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Team collaboration</li>
              <li>✓ Priority support</li>
            </ul>
            <Button variant="primary">Start Free Trial</Button>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">
              Custom<span>/month</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Unlimited everything</li>
              <li>✓ Unlimited accounts</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
              <li>✓ API access</li>
            </ul>
            <Button variant="secondary">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat">
          <h3>50K+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat">
          <h3>1M+</h3>
          <p>Posts Scheduled</p>
        </div>
        <div className="stat">
          <h3>98%</h3>
          <p>Uptime</p>
        </div>
        <div className="stat">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Social Media?</h2>
        <p>Join thousands of creators and businesses using SocialSync</p>
        <Button variant="primary" size="lg">
          Start Your Free Trial
        </Button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SocialSync</h4>
            <p>Manage all your social media in one place.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SocialSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
