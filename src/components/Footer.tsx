// src/components/Footer.tsx
import { colors as c } from "../lib/theme";

function Footer() {
  return (
    <footer
      className="py-10"
      style={{ background: c.bg, borderTop: `1px solid ${c.border}` }}
    >
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
            style={{ background: c.primarySoft, color: c.primary }}
          >
            ◈
          </span>
          <span className="text-sm font-medium" style={{ color: c.text }}>
            Simpan
          </span>
        </div>
        <p className="text-xs" style={{ color: c.textFaint }}>
          © {new Date().getFullYear()} Simpan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export { Footer };
