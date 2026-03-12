// src/pages/LandingPage.jsx
import * as styles from '../styles/landingPageStyles';
import '../styles/landingPage.css';

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: '💼',
      title: 'You can Post Business',
      desc: 'List your youth-owned business and reach customers across the platform',
    },
    {
      icon: '🤝',
      title: 'You can Contact Clients',
      desc: 'Connect directly with potential customers through phone, email, and social media',
    },
    {
      icon: '📰',
      title: 'You can get Latest News',
      desc: 'Stay updated with the latest business news and opportunities for young entrepreneurs',
    },
  ];

  const examples = [
    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', label: 'Tech Startups' },
    { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80', label: 'Retail Shops' },
    { image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', label: 'Creative Services' },
  ];

  return (
    <main style={{ background: '#f4f5f7' }}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 style={styles.heroTitle}>PCEA KASA-WEST</h1>
          <p style={styles.heroDescription}>
            Description of Website — Empowering youth entrepreneurs to showcase their businesses 
            and connect with customers
          </p>
          <button onClick={onGetStarted} className="hero-button">
            Get Started →
          </button>
        </div>
      </section>

      {/* Description Section */}
      <section style={styles.descriptionSection}>
        <div style={styles.descriptionContainer}>
          <h2 style={styles.descriptionTitle}>More Description</h2>
          <p style={styles.descriptionText}>
            Youth Market Place is a platform designed specifically for young entrepreneurs 
            to showcase their businesses, connect with potential customers, and grow their ventures. 
            Whether you're selling handmade crafts, offering tech services, or running a small café, 
            our platform provides the tools you need to succeed. Join a community of ambitious 
            youth entrepreneurs and take your business to the next level.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresContainer}>
          <div style={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Pictures Section */}
      <section style={styles.examplesSection}>
        <div style={styles.examplesContainer}>
          <h2 style={styles.examplesTitle}>Picture of Example</h2>
          <div style={styles.examplesGrid}>
            {examples.map((example, idx) => (
              <div key={idx} className="example-card">
                <img
                  src={example.image}
                  alt={example.label}
                  onError={e => e.target.src = 'https://placehold.co/400x240/e5e7eb/6b7280?text=Business+Example'}
                />
                <div style={styles.exampleOverlay}>
                  <div style={styles.exampleLabel}>{example.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
