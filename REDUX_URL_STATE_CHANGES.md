# Зміни: Redux + URL params замість localStorage

## 1. Реєстрація

- **Форма**: тільки `username`, `email`, `password` (телефон прибрано).
- **Username**: тільки латиниця (літери, цифри, `_`), валідація на клієнті та сервері, зберігається в БД після реєстрації.
- **Після реєстрації**: редірект на `/role?step=role` (вибір ролі).
- **UI**: без смайликів, сучасні компоненти з `client/src/components/ui` (Input, Button, Section, PageLayout тощо).

**Файли**: `client/src/pages/RegisterPage.jsx`, `server/controllers/auth.js` (register без telephone).

---

## 2. Вхід

- **Логін**: за `username` та `password` (не email).
- **Стан**: зберігається тільки в Redux; токен не пишеться в localStorage.
- **Back/Forward/оновлення**: при навігації Back/Forward стан залишається в Redux; після повного оновлення сторінки стан скидається (немає збереження токена в localStorage).

**Файли**: `client/src/pages/LoginPage.jsx`, `client/src/redux/features/auth/authSlice.js` (loginUser з username/password), `server/controllers/auth.js` (login по username).

---

## 3. Вибір ролі

- **Ролі**: athlete, coach, beginner (відповідають enum на сервері).
- **UI**: картки без смайликів, вибір зберігається в URL (`?role=...`) і в Redux після сабміту.
- **Після вибору**: збереження в БД через `PUT /auth/role`, оновлення Redux, редірект на `/personal?step=personal&pstep=0`.

**Файли**: `client/src/pages/RolePage.jsx`, `server/controllers/auth.js` (updateRole), `server/routes/auth.js` (PUT /role).

---

## 4. Персональна інформація

- **Сторінка**: окрема `/personal`; дані про спортивні цілі та профіль (без номера телефону).
- **Кроки**: особиста інформація → спортивні цілі → згоди; крок синхронізується з URL (`?pstep=0|1|2`).
- **Збереження**: після відправки форми — виклик `updatePersonalInfo`, оновлення Redux та БД (`PUT /auth/personal-info`).
- **Анімації**: клас `animate-fade-in` для екрану «Реєстрацію завершено», плавні переходи в `styles.css`.

**Файли**: `client/src/pages/PersonalInformation.jsx`, `server/controllers/auth.js` (updatePersonalInfo), `server/models/User.js` (fullName, address, fitnessGoals, activityLevel).

---

## 5. Навігація та стан

- **Джерело правди**: Redux (user, token, role, personalInfo, registrationStep).
- **URL params**: використовуються для кроку та вибору, щоб при Back/Forward не губити контекст сторінки:
  - `/role?step=role&role=athlete`
  - `/personal?step=personal&pstep=1`
- **Без localStorage**: токен тільки в Redux; axios отримує його через `setAxiosTokenGetter(() => store.getState().auth.token)` у `client/src/index.js`.
- **Routing**: після логіну/реєстрації використовується `navigate(..., { replace: true })`, щоб кнопка «Назад» не повертала на форму логіну/реєстрації з уже заповненими даними в Redux.

---

## 6. Redux store і reducers

- **authSlice** (`client/src/redux/features/auth/authSlice.js`):
  - Видалено всі звернення до `localStorage` (token, logout).
  - `registerUser`: без telephone; після успіху в state: user, token, isAuthenticated, registrationStep = 'role'.
  - `loginUser`: приймає `{ username, password }`.
  - Додано `hydrateFromParams` для (майбутнього) відновлення стану з URL при потребі.
- **Один джерело правди**: стан авторизації та профілю тільки в Redux; читання токена для API — через getter з store.

---

## 7. Routing та URL params

- **Реєстрація** → `/role?step=role`.
- **Після вибору ролі** → `/personal?step=personal&pstep=0`.
- **RolePage**: `useSearchParams`; при зміні вибраної ролі оновлюється `?role=...` (replace), при сабміті — збереження в БД і перехід на personal.
- **PersonalInformation**: `?pstep=0|1|2` відповідає кроку форми; при зміні кроку оновлюється URL (replace). При завантаженні сторінки поточний крок береться з URL.

---

## 8. Збереження даних у базу

- **Реєстрація**: `POST /auth/register` (username, email, password) — користувач створюється в БД.
- **Роль**: `PUT /auth/role` (checkAuth), body `{ role }` — оновлення поля `role` у User.
- **Персональні дані**: `PUT /auth/personal-info` (checkAuth), body: fullName, email, birthdate, gender, city, address, height, weight, fitnessGoals, activityLevel, experience, achievements тощо — оновлення полів User у БД.
- **getMe**: `GET /auth/me` повертає user, token, role, personalInfo (похідний об’єкт з полів User) для синхронізації клієнта після завантаження (якщо є токен у Redux).

---

## 9. Виправлення useEffect / setState / Maximum update depth

- **Реєстрація/Логін**: редірект при `isAuthenticated` виконується в одному `useEffect` з залежностями `[isAuthenticated, navigate]`; немає оновлення стану у відповідь на редірект, тому циклів немає.
- **RolePage**: ініціалізація `selectedRole` з URL/Redux винесена в `useEffect` з `initialSync.current`, щоб один раз підставити значення з URL/Redux і не перезаписувати його без потреби.
- **PersonalInformation**: гідрація форми з Redux `personalInfo` виконується один раз за допомогою `hydrated.current`; подальші зміни `personalInfo` не перезаписують локальний `formData` безконтрольно. Крок форми синхронізується з URL через `setSearchParams(..., { replace: true })` без зайвих повторних рендерів.
- **App**: `getMe()` викликається тільки за наявності `token` у Redux (`useEffect` з `[dispatch, token]`), щоб не робити зайвий запит і не змінювати стан при відсутності токена.

---

## 10. UI та стилі

- Використовуються компоненти з `client/src/components/ui` (ThemeProvider, PageLayout, WelcomeSection, Section, Input, Button, Card, Select, RadioGroup, Textarea, ProgressBar тощо).
- Смайлики прибрані з WelcomePage, MainPage, RolePage, PersonalInformation, Navbar.
- Анімації: `animate-fade-in` та переходи для кроків форми в `client/src/components/ui/styles.css`.

---

## Файли, які змінені або створені

| Файл | Зміни |
|------|--------|
| `client/src/utils/axios.js` | Токен з Redux через `setAxiosTokenGetter`, без localStorage |
| `client/src/index.js` | Виклик `setAxiosTokenGetter(store)` |
| `client/src/redux/features/auth/authSlice.js` | Без localStorage, login по username, register без telephone, hydrateFromParams |
| `client/src/App.js` | getMe тільки при наявному token |
| `client/src/pages/RegisterPage.jsx` | Тільки username/email/password, валідація username, редірект на /role |
| `client/src/pages/LoginPage.jsx` | Вхід за username + password |
| `client/src/pages/RolePage.jsx` | Ролі athlete/coach/beginner, URL ?role=, без смайликів |
| `client/src/pages/PersonalInformation.jsx` | Без телефону, URL ?pstep=, гідрація з Redux, анімації |
| `client/src/pages/WelcomePage.jsx` | Без смайликів, кнопка «Почати» → /register |
| `client/src/pages/MainPage.jsx` | Без смайликів, ролі athlete/coach/beginner |
| `client/src/components/Navbar.jsx` | Ролі athlete, coach, beginner; без зайвих посилань |
| `client/src/components/ui/styles.css` | Анімації fade-in, переходи для форми |
| `client/src/hooks/useUrlParams.js` | Хук для синхронізації параметрів з URL (опційно) |
| `server/controllers/auth.js` | register без telephone, login по username, getMe з role/personalInfo, updateRole, updatePersonalInfo |
| `server/routes/auth.js` | PUT /role, PUT /personal-info |
| `server/models/User.js` | fullName, address, fitnessGoals, activityLevel |
