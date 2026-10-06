// English is the source language: every translation key is defined here, and
// other locales are type-checked against this object so a missing key fails
// the build instead of silently falling back.
export const en = {
  // Common
  "common.retry": "Retry",
  "common.reset": "Reset",

  // Top bar
  "topbar.home": "Home",
  "topbar.homeDescription": "Explore all apps and miniapps",
  "topbar.myLibrary": "My Library",
  "topbar.settings": "Settings",
  "topbar.navigation": "navigation",
  "topbar.loginSignUp": "Login / Sign Up",
  "topbar.myProfile": "My Profile",
  "topbar.logout": "Logout",
  "topbar.creditBalance": "Your credit balance",
  "topbar.buyCredits": "Buy credits",
  "topbar.costCalculator": "Cost calculator",
  "topbar.seeDetails": "See details",
  "topbar.support": "Support",
  "topbar.upgrade": "Upgrade",
  "topbar.credits.failed": "Couldn't refresh your balance.",
  "topbar.credits.recovered": "Balance up to date.",
  "topbar.credits.slow":
    "Refreshing your balance — current amount may not be up to date.",

  // Top bar page breadcrumbs
  "crumb.studio": "Studio",
  "crumb.create": "Create",
  "crumb.canvas": "Canvas",
  "crumb.3dEditor": "3D Editor",
  "crumb.image": "Image",
  "crumb.video": "Video",
  "crumb.audio": "Audio",
  "crumb.editImage": "Edit Image",
  "crumb.frameExtractor": "Frame Extractor",
  "crumb.videoWatermarkRemover": "Video Watermark Remover",
  "crumb.imageWatermarkRemover": "Image Watermark Remover",
  "crumb.3dObject": "3D Object",
  "crumb.3dWorld": "3D World",
  "crumb.removeBackground": "Remove Background",
  "crumb.angles": "Angles",
  "crumb.storyboard": "Storyboard",
  "crumb.backgroundChange": "Background Change",
  "crumb.editVideo": "Edit Video",
  "crumb.moodboard": "Moodboard",
  "crumb.home": "Home",
  "crumb.editScene": "Edit Scene",

  // Apps home page and quick menu
  "apps.eyebrow": "Your creative workspace",
  "apps.headingBefore": "What will you ",
  "apps.headingCraft": "craft",
  "apps.headingAfter": " today?",
  "apps.subheading": "Start with an idea. Choose a tool to bring it to life.",
  "apps.category.create": "Create",
  "apps.category.edit": "Edit",
  "apps.badge.NEW": "NEW",
  "apps.badge.BEST": "BEST",
  "apps.badge.SOON": "SOON",
  "apps.badge.BETA": "BETA",

  "apps.text-to-image.label": "Create Image",
  "apps.text-to-image.description": "Generate AI images",
  "apps.image-to-video.label": "Create Video",
  "apps.image-to-video.description": "Create video from images",
  "apps.create-audio.label": "Create Audio",
  "apps.create-audio.description": "Generate music and sound effects",
  "apps.image-to-3d-object.label": "Image to 3D Object",
  "apps.image-to-3d-object.description":
    "Convert references into textured assets",
  "apps.image-to-3d-world.label": "Image to 3D World",
  "apps.image-to-3d-world.description":
    "Turn mood boards into explorable worlds",
  "apps.edit-image.label": "Edit Image",
  "apps.edit-image.description": "Change with inpainting",
  "apps.video-frame-extractor.label": "Video Frame Extractor",
  "apps.video-frame-extractor.description": "Extract frames from video",
  "apps.video-watermark-removal.label": "Video Watermark Remover",
  "apps.video-watermark-removal.description": "Remove watermarks from videos",
  "apps.image-watermark-removal.label": "Image Watermark Remover",
  "apps.image-watermark-removal.description": "Remove watermarks from images",
  "apps.remove-background.label": "Remove Background",
  "apps.remove-background.description": "Remove backgrounds from images",
  "apps.angles.label": "Angles",
  "apps.angles.description": "Generate new camera angles from a single photo",
  "apps.storyboard.label": "Storyboard",
  "apps.storyboard.description": "Plan your shots with a visual storyboard",
  "apps.moodboard.label": "Moodboard",
  "apps.moodboard.description":
    "Collect references and steer generations from a board",
  "apps.background-change.label": "Background Change",
  "apps.background-change.description":
    "Swap the backdrop of a video using a reference image",
  "apps.video-editor.label": "Video Editor",
  "apps.video-editor.description": "Edit and assemble videos on a timeline",
  "apps.2d-canvas.label": "Image Editor",
  "apps.2d-canvas.description": "Easy edits. Great for graphic design.",
  "apps.3d-editor.label": "3D Stage",
  "apps.3d-editor.description": "Precision control. Great for AI film.",

  // Top bar app switcher (keyed by AppId)
  "appTabs.IMAGE.label": "Create Image",
  "appTabs.VIDEO.label": "Create Video",
  "appTabs.AUDIO.label": "Create Audio",
  "appTabs.2D.label": "Image Editor",
  "appTabs.2D.description": "Easy edits. Great for graphic design.",
  "appTabs.3D.label": "3D Stage",
  "appTabs.3D.description": "Precision control. Great for AI film.",

  // Settings modal
  "settings.title": "Settings",
  "settings.section.general": "General",
  "settings.section.downloads": "Downloads",
  "settings.section.accounts": "Accounts",
  "settings.section.billing": "Plan & Credits",
  "settings.section.appearance": "Appearance",
  "settings.section.keybinds": "Keybinds",
  "settings.section.alerts": "Alerts",
  "settings.section.about": "About",
  "settings.section.experimental": "Experimental",
  "settings.experimental.enabled": "Experimental features enabled",
  "settings.experimental.resetTitle": "Reset experimental settings?",
  "settings.experimental.resetText":
    "This will hide the Experimental section and clear any experimental settings. You can unlock it again from the About page.",

  "settings.language.label": "Language",
  "settings.language.description":
    "Choose the language of the app interface. Applies instantly.",

  "settings.general.enterToGenerate": "Enter to generate",
  "settings.general.enterToGenerateDescription":
    "When on, pressing Enter submits the prompt and Shift+Enter adds a new line. When off (default), both Enter and Shift+Enter add a new line - use only the button to submit.",
  "settings.general.groupModels": "Group models by family",
  "settings.general.groupModelsDescription":
    "When on (default), the model picker groups models into submenus by family, like Seedance or Veo. When off, every model shows in one flat list.",
  "settings.general.cheatsheetSticky": "Keep shortcut cheatsheet open",
  "settings.general.cheatsheetStickyDescription":
    "In the editors, holding Ctrl (⌘ on Mac) alone for a few seconds shows a cheatsheet of the keyboard shortcuts. When on, it stays on screen after you release the key until you press Esc or click outside it. When off (default), it disappears as soon as you let go.",

  "settings.appearance.themes": "Themes",
  "settings.appearance.themesDescription":
    "Choose your preferred look. Applies instantly.",
  "settings.appearance.theme.gray": "Default",
  "settings.appearance.theme.light": "Light",
  "settings.appearance.theme.black": "Black",
  "settings.appearance.theme.aurora": "Aurora",
  "settings.appearance.theme.sunset": "Sunset",

  // Login modal
  "login.unableToCheck": "Unable to check your account. Please sign in again.",
  "login.unexpectedError": "An unexpected error occurred. Please try again.",
  "login.thankYou": "Thank you for signing in!",
  "login.allSet": "You're all set to start creating amazing content.",
  "login.getStarted": "Get Started",
  "login.joinOur": "Join our ",
  "login.community": "community.",
  "login.communityDescription":
    "Connect with other creators, share your work, and get the latest updates in our Discord community.",
  "login.skipForNow": "Skip for now",
  "login.joinDiscord": "Join Discord",
  "login.createAccount": "Create your account",
  "login.welcome": "Welcome ",
  "login.back": "back.",
  "login.signUpSubtitle": "Sign up to start creating with ArtCraft",
  "login.logInSubtitle": "Log in to your creative workspace.",
  "login.or": "or",
  "login.copyright": "{year} ArtCraft. All rights reserved.",
  "login.showcase.eyebrow": "One of the cheapest",
  "login.showcase.title": "Seedance 2.0 Video Generation",
  "login.showcase.description":
    "Generate jaw-dropping AI videos with Seedance 2.0.",
  "login.loggedInAs": "Logged in as ",
  "login.readyToCreate": "You're ready to create.",

  "login.form.username": "Username",
  "login.form.email": "Email",
  "login.form.emailPlaceholder": "you@example.com",
  "login.form.emailOrUsername": "Email or Username",
  "login.form.emailOrUsernamePlaceholder": "you@example.com or username",
  "login.form.password": "Password",
  "login.form.passwordPlaceholder": "Min. 8 characters",
  "login.form.confirmPassword": "Confirm Password",
  "login.form.confirmPasswordPlaceholder": "Re-enter password",
  "login.form.passwordsDoNotMatch": "Passwords do not match.",
  "login.form.signUp": "Sign up",
  "login.form.logIn": "Log in",
  "login.form.haveAccount": "Already have an account?",
  "login.form.noAccount": "Don't have an account?",
} as const;

export type TranslationKey = keyof typeof en;

export type TranslationDictionary = Record<TranslationKey, string>;
