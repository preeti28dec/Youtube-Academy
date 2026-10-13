/**
 * English — the source of truth for all user-facing copy.
 *
 * Every other language file must match this shape exactly; the `Dictionary`
 * type is derived from this file, so a missing key is a build error rather
 * than a blank spot on the page.
 */
export const en = {
  meta: {
    tagline: "Learn. Create. Grow.",
    siteName: "Sohail YouTube Academy",
  },

  nav: {
    home: "Home",
    course: "Course",
    courseDetails: "Course Details",
    curriculum: "Curriculum",
    mentor: "Mentor",
    faqs: "FAQs",
    login: "Login",
    myCourse: "My Course",
    admin: "Admin",
    enrollNow: "Enroll Now",
    menu: "Menu",
    logout: "Logout",
  },

  footer: {
    privacy: "Privacy Policy",
    terms: "Terms",
    refund: "Refund Policy",
    contact: "Contact",
    rights: "Sohail YouTube Academy",
  },

  whatsapp: {
    label: "WhatsApp Support",
    message: "Hi Sohail, I need some help with the course",
    askMessage: "Hi Sohail, I have a question about the course",
  },

  home: {
    heroBadge: "In Hindi · Mobile-friendly · Lifetime access",
    heroLead:
      "Start your YouTube channel from zero and grow it. Channel setup, content planning, mobile editing, thumbnails, SEO and monetization — all step by step, in one course.",
    enrollWithPrice: "Enroll Now · ₹{price}",
    seeSyllabus: "See the syllabus",
    modules: "Modules",
    videoLessons: "Video lessons",
    totalContent: "Total content",
    trailerCaption: "Course intro video (free preview)",
    trailerMeta: "trailer · 2:30",

    benefitsHeading: "What you get in this course",
    benefitsLead:
      "Simple, practical and in Hindi — everything you learn can be applied to your channel right away.",
    benefits: [
      {
        t: "Right from the start",
        d: "From creating a channel to publishing your first video — every step in plain language.",
      },
      {
        t: "Just your phone",
        d: "No expensive camera or laptop needed. Shooting and editing are taught on mobile.",
      },
      {
        t: "Thumbnails and SEO",
        d: "Titles, thumbnails and descriptions that actually show up in search and suggested videos.",
      },
      {
        t: "Growth strategy",
        d: "Reading your analytics, building an upload schedule, and connecting with your audience.",
      },
      {
        t: "Monetization",
        d: "YouTube Partner Program, sponsorships and affiliate income.",
      },
      {
        t: "WhatsApp support",
        d: "Any question at all — just message directly on WhatsApp.",
      },
    ],

    stats: {
      lessons: "Video lessons",
      duration: "Hindi content",
      access: "Course access",
      support: "WhatsApp support",
      lifetime: "Lifetime",
      direct: "Direct",
    },

    curriculumBadge: "Full curriculum",
    curriculumHeading: "{count} lessons.\nOne clear path.",
    curriculumLead:
      "Each module builds on the last, so you make steady progress without feeling lost.",
    curriculumModules: "Modules",
    curriculumDuration: "Total duration",
    curriculumCta: "See full details →",

    priceEyebrow: "Course fee",
    priceOneTime: "one-time payment",
    priceLead:
      "Pay once, keep access for life. No monthly fee. Your account is created the moment payment goes through, and the course opens right away.",
    buyNow: "Buy Now",
    securePayment: "Secure payment · UPI, Card, Net Banking",
    includes: [
      "{count} HD video lessons",
      "Lifetime access",
      "Works on phone and laptop",
      "Learn at your own pace",
      "Direct WhatsApp support",
    ],

    ctaHeading: "Ready to get started?",
    ctaLead: "Pay once, keep access for life. Start your channel today.",
  },

  mentor: {
    eyebrow: "Your mentor",
    heading: "Learn from a creator who has walked the same path",
    intro:
      "I'm Sohail. I also started with zero subscribers, camera anxiety and no idea what to make. After years of testing, I built this course around the system that actually works.",
    quote:
      "My goal is not just to teach you how to make videos. It is to help you build a sustainable career on YouTube.",
    points: [
      "Every lesson is practical — apply it to your channel the same day",
      "All in Hindi, with no technical jargon",
      "Shoot and edit on your phone — no expensive setup needed",
      "Questions get answered directly on WhatsApp",
    ],
    photoPlaceholder: "Sohail's photo goes here",
  },

  faq: {
    badge: "Questions?",
    heading: "You ask.\nWe answer.",
    lead: "Have another question? Just ask on WhatsApp — you'll get an answer right there.",
    cta: "Ask on WhatsApp",
    items: [
      {
        q: "Is this course suitable for complete beginners?",
        a: "Yes. The course is built step by step for people who have never made a video before. No prior editing or camera knowledge is needed.",
      },
      {
        q: "When do I get access after paying?",
        a: "Immediately. As soon as the payment is confirmed your account is created automatically, the course unlocks, and your login details are emailed to you. Nothing waits for manual approval.",
      },
      {
        q: "Can I watch it on my phone?",
        a: "Yes. The whole site was designed for mobile first, and videos play full-width on a phone. It works just as well on a laptop.",
      },
      {
        q: "How secure are the course videos? Can someone share a link?",
        a: "No. The player never receives the real video file address — the server issues a signed link valid for only two minutes, tied to both the lesson and the student. That link simply does not work for anyone else. On top of that, each video carries a faint watermark with the student's email, so any leak can be traced.",
      },
      {
        q: "Is it a one-time payment or monthly?",
        a: "One-time. There is no monthly fee and access is for life — watch at your own pace, whenever you like.",
      },
      {
        q: "What if I get stuck somewhere?",
        a: "There is a WhatsApp button at the bottom right of every page. One tap opens a chat where you can ask anything about the course.",
      },
    ],
  },

  course: {
    eyebrow: "Course details",
    learnHeading: "What you will learn",
    learnPoints: [
      "Choosing the right niche",
      "Professional channel setup",
      "Video ideas and keyword research",
      "Shooting and editing on mobile",
      "Thumbnails, titles and SEO",
      "Monetizing your channel",
    ],
    syllabus: "Syllabus",
    syllabusMeta: "{modules} modules · {lessons} lessons · {duration}",
    oneTime: "one-time",
    enrollNow: "Enroll Now",
    freePreview: "Free preview",
    lessonsCount: "{count} lessons",
    emptyModule: "No lessons in this module yet.",
  },

  checkout: {
    title: "Checkout",
    lead: "Fill in your details. Your student account will be created with this email and mobile.",
    fullName: "Full name",
    namePlaceholder: "e.g. Rahul Sharma",
    mobile: "Mobile number",
    mobilePlaceholder: "98XXXXXXXX",
    email: "Email",
    emailPlaceholder: "you@gmail.com",
    paymentMethod: "Payment method",
    methods: {
      upi: { label: "UPI", sub: "GPay, PhonePe, Paytm" },
      card: { label: "Card", sub: "Debit / Credit card" },
      netbanking: { label: "Net Banking", sub: "All major banks" },
    },
    upiNote:
      "Tapping Pay will open GPay / PhonePe / Paytm, or show you a QR code.",
    upiPlaceholder: "UPI ID (optional) — e.g. rahul@okaxis",
    cardNumber: "Card number",
    cardExpiry: "MM / YY",
    cardCvv: "CVV",
    chooseBank: "Choose your bank",
    payButton: "Pay ₹{price} securely",
    processing: "Processing...",
    secureNote:
      "Payment is handled by Razorpay/Cashfree's secure gateway. Card details are never stored on our server.",
    orderSummary: "Order summary",
    lessonsLifetime: "{count} lessons · Lifetime access",
    courseFee: "Course fee",
    total: "Total",
    errors: {
      generic: "Something went wrong. Please try again.",
      orderFailed: "Could not create the order.",
      verifyFailed: "Payment could not be verified.",
      gatewayLoad: "The payment gateway did not load. Please check your connection.",
    },
  },

  success: {
    title: "Payment successful!",
    welcome: "Welcome {name}. Your student account is ready and the course is unlocked.",
    loginId: "Login ID",
    mobile: "Mobile",
    orderId: "Order ID",
    passwordTitle: "Your first password — save it now",
    passwordNote:
      "This password has also been sent to your email and WhatsApp. Log in and change it.",
    emailedNote: "A link to set your password has been sent to your email and WhatsApp.",
    startCourse: "Start the course",
  },

  login: {
    title: "Student login",
    lead: "Log in to reach your course.",
    idLabel: "Email or mobile number",
    idPlaceholder: "you@gmail.com / 98XXXXXXXX",
    password: "Password",
    forgot: "Forgot password?",
    submit: "Login",
    submitting: "Logging in...",
    noCourse: "Haven't bought the course yet?",
    enrollLink: "Enroll now",
    failed: "Login failed.",
  },

  dashboard: {
    greeting: "Hello, {name}",
    title: "My course",
    progress: "{done} / {total} lessons complete",
    continue: "Continue learning",
    moduleProgress: "{done} / {total} complete · {duration}",
    emptyModule: "No lessons in this module yet.",
  },

  learn: {
    backToDashboard: "Dashboard",
    backToCourse: "Course details",
    moduleLabel: "Module {num} · {title}",
    markComplete: "Mark as complete",
    completed: "✓ Completed",
    previous: "← Previous",
    next: "Next →",
    unlockCta: "Unlock the full course",
    courseProgress: "Course progress",
    secureStream: "Secure stream",
    loading: "Loading secure video...",
    loadFailed: "The video could not play. Refresh the page or message us on WhatsApp.",
    freePreview: "Free preview",
  },

  admin: {
    eyebrow: "Admin panel",
    title: "Course management",
    tabs: { content: "Course content", students: "Students" },
    stats: {
      totalStudents: "Total students",
      thisMonth: "This month",
      modules: "Modules",
      lessons: "Lessons",
    },
    lessonsCount: "{count} lessons",
    deleteModule: "Delete module",
    deleteModuleConfirm: 'Delete "{title}" and all of its lessons?',
    deleteLessonConfirm: 'Delete "{title}"?',
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    free: "Free",
    emptyModule: "No lessons in this module yet.",
    addLesson: "Add a new lesson",
    lessonTitle: "Lesson title",
    duration: "Duration (mm:ss)",
    videoField: "Video URL or file name",
    uploadVideo: "Upload a video",
    uploading: "Uploading...",
    uploadHint: "MP4 / WebM / MOV · max 500 MB",
    urlHint: "Or paste the video URL in the field above",
    freePreviewLesson: "Free preview lesson",
    addLessonBtn: "+ Add lesson",
    newModule: "New module",
    moduleTitle: "Module title",
    addModuleBtn: "+ Add module",
    students: "Students",
    searchPlaceholder: "Search by name, email or mobile",
    search: "Search",
    table: {
      name: "Name",
      mobile: "Mobile",
      email: "Email",
      enrolled: "Enrolled",
      progress: "Progress",
    },
    noStudentsSearch: 'No student found for "{q}".',
    noStudents: "No students enrolled yet.",
    saveFailed: "Could not save.",
    uploadFailed: "Upload failed.",
  },

  notFound: {
    title: "This page doesn't exist",
    lead: "The link may be old, or the page may have been removed. Head back below.",
    home: "Home",
    seeCourse: "See the course",
  },
} as const;

export type Dictionary = typeof en;
