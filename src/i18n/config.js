import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          // App name
          appName: "Your App Name",
          // Common
          or: "Or",
          and: "and",
          dashboard: "Dashboard",
          login: "Log in",
          signup: "Sign up",
          openMenu: "Open main menu",
          backToHome: "← Back to home",
          // Home page
          heroTitle: "Your Modern Web",
          heroSubtitle: "Application Starter",
          heroDescription:
            "A complete starter template with React, Tailwind CSS, and Python backend. Includes authentication, dashboard, and everything you need to get started quickly.",
          getStarted: "Get started",
          goToDashboard: "Go to Dashboard",
          // Login page
          signInTitle: "Sign in to your account",
          createAccount: "Create a new account",
          emailPlaceholder: "Email address",
          passwordPlaceholder: "Password",
          rememberMe: "Remember me",
          forgotPassword: "Forgot your password?",
          signIn: "Sign in",
          signingIn: "Signing in...",
          loginError: "Failed to login. Please check your credentials.",
          // Register page
          createAccountTitle: "Create your account",
          signInToExisting: "sign in to your existing account",
          fullNamePlaceholder: "Full name",
          confirmPasswordPlaceholder: "Confirm password",
          creatingAccount: "Creating account...",
          passwordsDoNotMatch: "Passwords do not match",
          registrationSuccessful: "Registration successful! Please log in.",
          registrationError: "Registration failed. Please try again.",
          termsAgreement: "By signing up, you agree to our",
          termsOfService: "Terms of Service",
          privacyPolicy: "Privacy Policy",
        },
      },
      ru: {
        translation: {
          // App name
          appName: "Ваше приложение",
          // Common
          or: "Или",
          and: "и",
          dashboard: "Панель управления",
          login: "Войти",
          signup: "Регистрация",
          openMenu: "Открыть меню",
          backToHome: "← На главную",
          // Home page
          heroTitle: "Ваше современное",
          heroSubtitle: "веб-приложение",
          heroDescription:
            "Полный стартовый шаблон с React, Tailwind CSS и Python бэкендом. Включает аутентификацию, панель управления и все необходимое для быстрого старта.",
          getStarted: "Начать",
          goToDashboard: "Перейти в панель",
          // Login page
          signInTitle: "Войти в аккаунт",
          createAccount: "Создать новый аккаунт",
          emailPlaceholder: "Электронная почта",
          passwordPlaceholder: "Пароль",
          rememberMe: "Запомнить меня",
          forgotPassword: "Забыли пароль?",
          signIn: "Войти",
          signingIn: "Вход...",
          loginError: "Ошибка входа. Проверьте ваши данные.",
          // Register page
          createAccountTitle: "Создать аккаунт",
          signInToExisting: "войти в существующий аккаунт",
          fullNamePlaceholder: "Полное имя",
          confirmPasswordPlaceholder: "Подтвердите пароль",
          creatingAccount: "Создание аккаунта...",
          passwordsDoNotMatch: "Пароли не совпадают",
          registrationSuccessful: "Регистрация успешна! Пожалуйста, войдите.",
          registrationError: "Ошибка регистрации. Попробуйте еще раз.",
          termsAgreement: "Регистрируясь, вы соглашаетесь с",
          termsOfService: "Условиями использования",
          privacyPolicy: "Политикой конфиденциальности",
        },
      },
      kk: {
        translation: {
          // App name
          appName: "Сіздің қолданбаңыз",
          // Common
          or: "Немесе",
          and: "және",
          dashboard: "Басқару тақтасы",
          login: "Кіру",
          signup: "Тіркелу",
          openMenu: "Мәзірді ашу",
          backToHome: "← Басты бетке",
          // Home page
          heroTitle: "Сіздің заманауи",
          heroSubtitle: "веб-қолданбаңыз",
          heroDescription:
            "React, Tailwind CSS және Python backend-пен толық стартер үлгісі. Аутентификация, басқару тақтасы және жылдам бастау үшін қажетті барлық нәрсе бар.",
          getStarted: "Бастау",
          goToDashboard: "Басқару тақтасына өту",
          // Login page
          signInTitle: "Аккаунтқа кіру",
          createAccount: "Жаңа аккаунт жасау",
          emailPlaceholder: "Электрондық пошта",
          passwordPlaceholder: "Құпия сөз",
          rememberMe: "Мені есте сақтау",
          forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
          signIn: "Кіру",
          signingIn: "Кіру...",
          loginError: "Кіру қатесі. Деректеріңізді тексеріңіз.",
          // Register page
          createAccountTitle: "Аккаунт жасау",
          signInToExisting: "бар аккаунтқа кіру",
          fullNamePlaceholder: "Толық аты-жөні",
          confirmPasswordPlaceholder: "Құпия сөзді растау",
          creatingAccount: "Аккаунт жасалуда...",
          passwordsDoNotMatch: "Құпия сөздер сәйкес келмейді",
          registrationSuccessful:
            "Тіркелу сәтті аяқталды! Кіруіңізді сұраймыз.",
          registrationError: "Тіркелу қатесі. Қайталап көріңіз.",
          termsAgreement: "Тіркелу арқылы сіз",
          termsOfService: "Қолдану шарттарымен",
          privacyPolicy: "Құпиялылық саясатымен",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
