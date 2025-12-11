export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-stone-200 bg-white py-6 text-center text-sm text-stone-500">
      {"\u00A9"} {new Date().getFullYear()} PubFinder. All rights reserved.
    </footer>
  );
};
