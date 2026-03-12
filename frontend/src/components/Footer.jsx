// src/components/Footer.jsx
import { CONTACT_INFO } from '../constants';
import * as styles from '../styles/footerStyles';

export default function Footer() {
  const socialLinks = [
    { icon: '📘', href: CONTACT_INFO.social.facebook, label: 'Facebook' },
    { icon: '📸', href: CONTACT_INFO.social.instagram, label: 'Instagram' },
    { icon: '🐦', href: CONTACT_INFO.social.twitter, label: 'Twitter' },
    { icon: '💼', href: CONTACT_INFO.social.linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.footerContent}>
        {/* About section */}
        <div>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🏢</span>
            <div>
              <div style={styles.logoText}>Youth Market Place</div>
              <div style={styles.logoTagline}>Empowering Young Entrepreneurs</div>
            </div>
          </div>
          <p style={styles.description}>
            A platform connecting youth-owned businesses with customers. 
            Start your entrepreneurial journey today!
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h3 style={styles.sectionTitle}>Talk to Us</h3>
          <div style={styles.contactList}>
            <a 
              href={`mailto:${CONTACT_INFO.email}`} 
              style={styles.contactLink}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = .9}
            >
              <span style={{ fontSize: 20 }}>✉️</span>
              <span>{CONTACT_INFO.email}</span>
            </a>
            <a 
              href={`tel:${CONTACT_INFO.phone}`} 
              style={styles.contactLink}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = .9}
            >
              <span style={{ fontSize: 20 }}>📞</span>
              <span>{CONTACT_INFO.phone}</span>
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 style={styles.sectionTitle}>Follow Us</h3>
          <div style={styles.socialContainer}>
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                style={styles.socialButton}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        <p>© {new Date().getFullYear()} Youth Market Place. All rights reserved.</p>
      </div>
    </footer>
  );
}
