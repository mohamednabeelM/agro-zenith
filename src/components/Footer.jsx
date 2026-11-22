// src/components/Footer.jsx
import React from 'react';
import { Camera, MessageCircle, Play, UsersRound } from 'lucide-react';
import '../Footer.css';

export default function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 1. Brand & Mission */}
        <div className="footer-section">
          <h1 className="text-2xl font-bold text-white mb-2 italic">🌿Agro Zenith</h1>
          <p className="text-green-100 text-sm">
            Empowering the future generation of farmers with AI. 
            Join the digital revolution in agriculture.
            "Save agriculture 🌱" "Save environment".
            Smart farming ecosystem.
          </p>
          <div className="mt-4 flex gap-3">
             <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-bold">10k+ Active Farmers</span>
          </div>
        </div>

        {/* 2. Resources */}
        <div className="footer-section">
          <h2 className="text-lg font-bold mb-3 border-b border-green-700 pb-1">Resources</h2>
          <ul className="space-y-2 text-sm text-green-200">
            <li className="hover:text-white cursor-pointer transition">Daily Market Price Alerts</li>
            <li className="hover:text-white cursor-pointer transition">Pest Outbreak Map</li>
            <li className="hover:text-white cursor-pointer transition">Government Subsidy News</li>
            <li className="flex items-center group cursor-pointer">
              <span className="bg-green-600 p-1 rounded mr-2 group-hover:bg-green-400 transition">🌱</span>
              <span className="group-hover:text-white transition">Soil Health Digital Guide</span>
            </li>
          </ul>
        </div>

        {/* 3. Social Media */}
        <div className="footer-section">
          <h3 className="text-lg font-bold mb-2">Let us Grow Together</h3>
          <p className="text-green-100 text-sm mb-3">
            Follow us for the latest in smart farming technology.
          </p>
          <div className="flex gap-2">
            <a href="https://whatsapp.com/channel/0029Vb8sbca60eBcYM8hOD1R" target="_blank" rel="noopener noreferrer" className="icon-link whatsapp" aria-label="WhatsApp"><MessageCircle size={20} /></a>
            <a href="#" className="icon-link facebook" aria-label="Facebook"><UsersRound size={20} /></a>
            <a href="#" className="icon-link instagram" aria-label="Instagram"><Camera size={20} /></a>
            <a href="#" className="icon-link youtube" aria-label="YouTube"><Play size={20} /></a>
          </div>
        </div>

        {/* 4. Contact Us */}
        <div className="footer-section">
          <h4 className="text-lg font-bold mb-3">Contact Us</h4>
          <p className="text-green-100 text-sm mb-2">Have questions? Reach out to our support team.</p>
          <p className="text-green-200 text-sm">📞 +91 98765 43210</p>
          <p className="text-green-200 text-sm">✉️ info@agrozenith.com</p>
          <p className="text-green-200 text-sm">Chinthamani Nedungulam Road, Pottapalayam, Sivaganga District,
Tamil Nadu, 630612.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Agro Zenith • Supporting Agriculture • Built for the Future</p>
      </div>
    </footer>
  );
}