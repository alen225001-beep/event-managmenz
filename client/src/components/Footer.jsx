import React from 'react';
import { Shield, Phone, Mail, MapPin, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '3.5rem 0 2rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="container">
        <div
          className="grid grid-cols-1 md:grid-cols-4"
          style={{ gap: '2.5rem', marginBottom: '2.5rem' }}
        >
          {/* Column 1: College & Portal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={18} />
              </div>
              <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                Campus Lost & Found
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              A centralized digital lost property and verification system built specifically for Sahrdaya College campus community.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem' }}>
              <Award size={16} />
              <span>ICT Academy of Kerala (ICTAK) Project</span>
            </div>
          </div>

          {/* Column 2: Campus Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>
              Campus Address
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '3px' }} />
              <span>
                Sahrdaya College of Engineering & Technology<br />
                P.B. No. 10, Kodakara, Thrissur<br />
                Kerala, India - 680684
              </span>
            </div>
          </div>

          {/* Column 3: Security & Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>
              Security & Handover Desks
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Phone size={16} style={{ color: '#10b981', flexShrink: 0 }} />
              <span>Main Security Desk: +91 480 273 0333</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Mail size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <span>security@sahrdaya.ac.in</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              High-value items (laptops, jewelry, official IDs) are deposited directly at the Main Security Office.
            </p>
          </div>

          {/* Column 4: Student Developer Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>
              Student Information
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
              Alen
            </p>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Student ID: alen225001
            </p>
            <p style={{ fontSize: '0.825rem', color: '#38bdf8' }}>
              alen225001@sahrdaya.ac.in
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              MERN Stack Full Stack Development Project
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
          className="md:flex-row"
        >
          <div>
            &copy; {new Date().getFullYear()} Campus Lost and Found - Sahrdaya College. All rights reserved.
          </div>
          <div>
            Built with React, Node.js, Express & MongoDB according to ICTAK Guidelines.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
