import { useTranslation } from 'react-i18next'

function LanguageSwitch() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string | undefined) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div>
      <div>
        <button type="button" onClick={() => changeLanguage('en')}>
          en
        </button>
        <button type="button" onClick={() => changeLanguage('si')}>
          si
        </button>
      </div>
    </div>
  )
}

export default LanguageSwitch
