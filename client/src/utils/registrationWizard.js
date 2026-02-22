/**
 * Збереження кроків реєстрації (роль, персональні дані) у localStorage.
 * Після успішної реєстрації дані синхронізуються в Redux (setRole, setPersonalInfo) і wizard очищається.
 */
const WIZARD_KEY = 'sportconnect_registration_wizard'

export const getWizard = () => {
  try {
    const raw = localStorage.getItem(WIZARD_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setWizardRole = (role) => {
  const current = getWizard() || {}
  const next = { ...current, role }
  localStorage.setItem(WIZARD_KEY, JSON.stringify(next))
}

export const setWizardPersonal = (personalInfo) => {
  const current = getWizard() || {}
  const next = { ...current, personalInfo }
  localStorage.setItem(WIZARD_KEY, JSON.stringify(next))
}

export const getWizardRole = () => getWizard()?.role ?? null
export const getWizardPersonal = () => getWizard()?.personalInfo ?? null

export const clearWizard = () => {
  localStorage.removeItem(WIZARD_KEY)
}

export const hasWizardCompleteForRegister = () => {
  const w = getWizard()
  return w?.role && w?.personalInfo
}
