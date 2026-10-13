/**
 * Landing page ka woh text jo Sohail ko badalna pad sakta hai — ek hi jagah.
 *
 * Yahan koi number ya daava aisa nahi rakha gaya jo abhi sach na ho
 * (jaise "1,200+ students" ya "4.9 rating"). Jab asli aankde aa jaayein,
 * tab unke liye alag section jod denge — jhoota social proof ulta nuksaan
 * karta hai aur consumer rules ka issue bhi ban sakta hai.
 */

export const MENTOR = {
  eyebrow: "Aapke mentor",
  heading: "Seekhiye us creator se jo khud isi raaste se guzra hai",
  intro:
    "Main Sohail hoon. Maine bhi zero subscribers, camera ke saamne ghabrahat aur “kya banayein” wali confusion se shuruaat ki thi. Saalon tak try karne ke baad jo system kaam aaya, yeh course usi par bana hai.",
  quote:
    "Mera maksad sirf video banana sikhana nahi hai. Maksad yeh hai ki aap YouTube se ek tikaau career bana sakein.",
  points: [
    "Har lesson practical hai — dekhte hi apne channel par apply kar sakte hain",
    "Sab kuch Hindi mein, bina technical jargon ke",
    "Mobile se shoot aur edit — mehenga setup zaroori nahi",
    "Sawaal ho to seedha WhatsApp par jawab",
  ],
};

/** Jawab wahi likhe hain jo website sach mein karti hai. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "Kya yeh course bilkul beginners ke liye hai?",
    a: "Haan. Course step-by-step un logon ke liye bana hai jinhone pehle kabhi video nahi banayi. Editing ya camera ka koi purana gyaan zaroori nahi hai.",
  },
  {
    q: "Payment ke baad course kab milega?",
    a: "Turant. Payment confirm hote hi aapka account apne aap bann jaata hai, course unlock ho jaata hai, aur login details email par chali jaati hain. Kisi ke approve karne ka intezaar nahi karna padta.",
  },
  {
    q: "Kya mobile par dekh sakte hain?",
    a: "Haan. Poori website mobile ke liye hi pehle design ki gayi hai, aur videos mobile par full-width chalti hain. Laptop par bhi utni hi aaram se chalti hain.",
  },
  {
    q: "Course videos kitni secure hain? Koi link share karke dekh sakta hai?",
    a: "Nahi. Player ko kabhi video ki asli file ka pata nahi milta — har baar server se sirf 2 minute ka signed link banta hai, jisme lesson aur student dono ki pehchaan hoti hai. Woh link kisi aur ko bhejne par chalta hi nahi. Upar se har video par student ka email halka sa dikhta rehta hai, taaki leak hone par pata chal sake.",
  },
  {
    q: "Kya ek baar ka payment hai ya monthly?",
    a: "Ek baar ka. Koi monthly fee nahi, aur access lifetime rehta hai — apni speed se jab chahein dekhein.",
  },
  {
    q: "Kuch samajh na aaye to help milegi?",
    a: "Har page par neeche-right mein WhatsApp button hai. Dabate hi seedha chat khul jaati hai — course se juda koi bhi sawaal pooch sakte hain.",
  },
];

/** Hero ke neeche wali patti. Values DB se aati hain, labels yahan se. */
export const STAT_LABELS = {
  lessons: "Video lessons",
  duration: "Hindi content",
  access: "Course access",
  support: "WhatsApp support",
};
