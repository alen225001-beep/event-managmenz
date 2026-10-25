import React from 'react';
import { Calendar, Heart, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & College info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Sahrdaya <span className="text-indigo-400">EventHub</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-4">
              Official campus event discovery and digital ticket reservation portal for Sahrdaya College of Engineering & Technology (SCET), Kodakara. Connecting students, clubs, and academic departments through seamless registrations and automated digital entry passes.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>P.B. No. 12, Kodakara, Thrissur, Kerala - 680684</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>events@sahrdaya.ac.in | alen225001@sahrdaya.ac.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>+91 480 2726630 | Campus Reception Desk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Explore Campus Events
                </Link>
              </li>
              <li>
                <Link to="/my-passes" className="hover:text-white transition">
                  My Digital Passes
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="hover:text-white transition">
                  Host Club Event
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Viva Attribution */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">
              Academic Project
            </h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div className="font-semibold text-indigo-300">
                ICT Academy of Kerala (ICTAK)
              </div>
              <div className="text-slate-300">
                Full Stack MERN Development Project
              </div>
              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                Developed by: <span className="text-white font-medium">Alen</span>
                <br />
                ID: <span className="font-mono text-indigo-300">alen225001@sahrdaya.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} Sahrdaya College of Engineering & Technology. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with MongoDB, Express, React & Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
