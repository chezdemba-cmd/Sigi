/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        // Bleu nuit — sidebar, boutons secondaires, texte fort.
        ink: { DEFAULT: '#14213D', hover: '#1E3157' },
        // Vert principal — envoi, succès, identité WhatsApp.
        brand: { DEFAULT: '#18A875', hover: '#149063', dark: '#0F7A55' },
        // Violet secondaire — catégories, IA, liens d'accent.
        violet: { DEFAULT: '#7357D9', dark: '#5B3FC4' },
        // Fond d'application et cartes.
        app: '#F6F7FB',
        // Texte.
        ink2: '#172033', // texte principal
        muted: '#667085', // texte secondaire
        faint: '#98A2B3', // texte tertiaire / placeholder
        cell: '#475467', // cellule de tableau intermédiaire
        cellDark: '#344054', // cellule de tableau foncée
        // Attention / erreur.
        amber: { DEFAULT: '#F59E0B', text: '#8A5A04', icon: '#B45309' },
        red: { DEFAULT: '#DC3545', text: '#B02A37' },
        // Paires fond/texte/bordure de statut.
        status: {
          successBg: '#EAF7F1', successText: '#0F7A55', successBorder: '#BFE6D5',
          warnBg: '#FEF6E7', warnText: '#8A5A04', warnBorder: '#F7E2B8',
          errorBg: '#FDEBEC', errorText: '#DC3545', errorBorder: '#F4C7CB',
          neutralBg: '#F1F3F9', neutralText: '#475467',
          violetBg: '#F1EEFC', violetText: '#5B3FC4',
          blueBg: '#E7F0FF', blueText: '#14213D',
          orangeBg: '#FFF1E6', orangeText: '#C2410C',
        },
        // Bordures et séparateurs.
        edge: { card: '#E8EAF2', field: '#E1E5F0', block: '#EDEFF6', row: '#F1F3F9', hover: '#D6DCEC' },
        surface: { header: '#FBFCFE' },
      },
      borderRadius: { badge: '6px', sm: '9px', md: '10px', lg: '13px', xl: '16px', phone: '22px' },
      boxShadow: {
        card: '0 1px 2px rgba(20,33,61,.05)',
        'card-hover': '0 6px 18px rgba(20,33,61,.08)',
        'btn-brand': '0 1px 2px rgba(24,168,117,.4)',
        'btn-ink': '0 1px 2px rgba(20,33,61,.18)',
        tab: '0 1px 2px rgba(20,33,61,.08)',
        modal: '0 24px 60px rgba(20,33,61,.3)',
      },
      keyframes: {
        sigiIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        sigiPulse: { '0%,100%': { opacity: 1 }, '50%': { opacity: .45 } },
      },
      animation: {
        sigiIn: 'sigiIn 250ms ease both',
        sigiInModal: 'sigiIn 200ms ease both',
        sigiPulse: 'sigiPulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
