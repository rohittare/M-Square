const Footer = () => {
  return (
    <footer className="bg-[#1f1f1f] text-gray-300 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-swiggy-orange rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs sm:text-sm">D</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-primary-foreground">dineout</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">© 2024 Bundl Technologies Pvt. Ltd</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">About</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Swiggy One</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Help & Support</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Partner with us</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Ride with us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-swiggy-orange transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-primary-foreground mb-3 sm:mb-4 text-sm sm:text-base">Social Links</h4>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-swiggy-orange transition-colors">
                <span className="text-xs sm:text-sm">f</span>
              </a>
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-swiggy-orange transition-colors">
                <span className="text-xs sm:text-sm">in</span>
              </a>
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-swiggy-orange transition-colors">
                <span className="text-xs sm:text-sm">ig</span>
              </a>
              <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-swiggy-orange transition-colors">
                <span className="text-xs sm:text-sm">X</span>
              </a>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div className="pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-center sm:text-left">For better experience, download the Swiggy app now</p>
            <div className="flex gap-2 sm:gap-3">
              <img 
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png" 
                alt="Play Store"
                className="h-8 sm:h-10 cursor-pointer"
              />
              <img 
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png" 
                alt="App Store"
                className="h-8 sm:h-10 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

