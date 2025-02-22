import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

const languageNames: { [key: string]: string } = {
  en: 'English',
  hi: 'हिंदी',
  bn: 'বাংলা'
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { locales, locale: activeLocale } = router

  return (
    <div className="language-switcher">
      <p className="language-label">{t('select_language')}:</p>
      <div className="language-buttons">
        {locales?.map((locale) => (
          <Link
            key={locale}
            href={router.asPath}
            locale={locale}
            className={`locale-link ${locale === activeLocale ? 'active' : ''}`}
          >
            {languageNames[locale]}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .language-switcher {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .language-label {
          margin: 0;
          font-size: 0.9rem;
        }
        .language-buttons {
          display: flex;
          gap: 1rem;
        }
        .locale-link {
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-decoration: none;
          color: #333;
          transition: all 0.2s ease;
        }
        .locale-link:hover {
          background-color: #f0f0f0;
        }
        .active {
          background-color: #333;
          color: white;
        }
        .active:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  )
}
