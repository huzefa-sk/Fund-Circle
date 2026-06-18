const Footer = () => {
  return (
    <footer className="text-white px-6 py-2 flex flex-col items-center gap-2 bg-transparent ">
      
      <div className="text-sm text-gray-400 flex gap-5">
        <span className="cursor-pointer hover:text-white transition">Privacy</span>
        <span className="cursor-pointer hover:text-white transition">Terms</span>
        <span className="cursor-pointer hover:text-white transition">Contact</span>
      </div>

      <div className="text-xs text-gray-500">
        © 2026 Fund-Circle. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;