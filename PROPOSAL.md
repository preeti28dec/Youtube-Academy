# Sohail YouTube Academy — cost, time aur video security

Yeh document client (Sohail) ke chaar sawaalon ka jawab hai: kitna kharcha, kitna time, kaunse
recurring charges, aur kya videos sach mein secure rahengi.

> **Note:** third-party prices (gateway, hosting, video host) October 2026 ke publicly listed
> plans par aadharit **estimates** hain aur badalte rehte hain — final quote dene se pehle
> aaj ke rates confirm kar lein. Development cost aapki apni rate ke hisaab se adjust karein.

---

## 1. Development cost

Yeh repo poore 12 features ka **working application** hai — design, frontend, backend, database,
auth, payment flow, secure video layer aur admin panel sab bane hue hain. Isliye baaki kaam
sirf **integration + content + launch** ka hai.

| Kaam | Scope |
| --- | --- |
| Razorpay live account + keys + webhook setup | 1 din |
| Video host (VdoCipher / Bunny) integrate karna | 2–3 din |
| Transactional email (Brevo / SES) jodna | 1 din |
| Password reset flow pura karna | 1 din |
| Branding, asli text, logo, Privacy/Terms/Refund pages | 1–2 din |
| Course content upload (6 modules, 20 lessons) | Sohail ke videos par depend |
| Postgres par migrate + deploy + domain + SSL | 1 din |
| Testing (asli payment, mobile par, refund case) | 1–2 din |

**Kul: 8–11 working days.** Market mein aise custom course-platform ka one-time charge aam
taur par **₹45,000 – ₹90,000** rehta hai (freelancer vs small agency, aur kitna branding/content
kaam shaamil hai uspar).

Zero se banwane par (bina is codebase ke) wahi cheez aam taur par **₹1,20,000 – ₹2,50,000**
aur **5–8 hafte** leti hai.

---

## 2. Hosting aur domain — alag charge

Yeh **development cost mein shaamil nahi** hain, kyunki yeh seedha Sohail ke naam par
recurring services hain.

| Item | Anumaanit kharcha | Note |
| --- | --- | --- |
| Domain (.com / .in) | ₹800 – ₹1,500 / saal | GoDaddy, Namecheap, Hostinger |
| App hosting | ₹0 – ₹1,700 / mahina | Vercel ka free tier shuruaat ke liye kaafi hai; VPS ₹400–₹1,700/mahina |
| Database (Postgres) | ₹0 – ₹1,700 / mahina | Neon / Supabase free tier shuruaat ke liye theek |
| SSL (https) | ₹0 | Let's Encrypt — free, auto-renew |
| Email (transactional) | ₹0 – ₹700 / mahina | Brevo free tier ~300 email/din |

**Shuruaat mein (first ~200 students): lagbhag ₹1,500/saal — sirf domain.** Baaki sab free
tier par chal jaata hai. Students badhne par Postgres + hosting paid tier par jaate hain,
tab lagbhag **₹1,500–₹3,500/mahina**.

### Video hosting (alag, aur sabse bada recurring kharcha)

| Option | Anumaanit | Kab chunein |
| --- | --- | --- |
| **Bunny Stream** | ~₹1–₹2 per GB bandwidth + thoda storage | Sasta. Token + domain lock. Zyadatar cases ke liye kaafi. |
| **VdoCipher** | Plans aam taur par ₹4,000+/mahina se | Jab asli Hollywood-grade DRM + built-in watermark chahiye. |

Ek 20-lesson course (~5 ghante) ek student ko dikhane mein motamoti **2–4 GB** bandwidth
lagti hai. Bunny par **100 students ≈ ₹300–₹800/mahina**. Yeh seedha students ki sankhya ke
saath badhta hai — isliye price mein factor karein.

---

## 3. Payment gateway charges

Yeh charges **gateway lete hain, hum nahi** — har transaction par Sohail ke payout se katte hain.

| Mad | Razorpay / Cashfree (standard) |
| --- | --- |
| Setup fee | ₹0 |
| Annual maintenance | ₹0 |
| **UPI** | Aam taur par **0%** (RBI ka zero-MDR rule) — apne plan par confirm karein |
| **Debit / Credit card, Net Banking, Wallet** | lagbhag **2%** + 18% GST us fee par |
| International cards | zyada (~3%) |

**₹1,499 ke course par:**
- UPI se: **₹0** fee → poore ₹1,499 mile
- Card/Net Banking se: ~₹30 fee + ~₹5 GST → lagbhag **₹1,464** mile

Zyadatar Indian students UPI use karte hain, isliye practical average fee bahut kam rehti hai.
Volume badhne par gateway se rate negotiate bhi ho jaata hai.

---

## 4. Monthly / yearly maintenance

**Software ka koi compulsory maintenance charge nahi hai.** Site ek baar bann ke chalti rehti
hai; naye videos, modules aur lessons Sohail khud `/admin` se add/edit/delete kar sakte hain —
uske liye developer ki zaroorat nahi.

Recurring sirf woh services hain jo upar point 2 aur 3 mein hain (domain, hosting, video host,
gateway fee).

Agar chaahein to optional support plan rakha ja sakta hai:

| Plan | Anumaanit | Kya milta hai |
| --- | --- | --- |
| Koi plan nahi | ₹0 | Sab khud manage. Kaam pade to per-hour charge. |
| Basic support | ₹1,500 – ₹3,000 / mahina | Uptime dekhna, backup check, security updates, chhote fixes |
| Support + changes | ₹5,000 – ₹8,000 / mahina | Upar wala + har mahine kuch ghante naye features/changes ke |

Shuruaat mein **koi plan na lein** — site chalne dein, zaroorat padne par baad mein le lein.

---

## 5. Kitna time lagega

| Phase | Time |
| --- | --- |
| Setup (gateway, video host, email, domain) | 2–3 din |
| Branding + asli content + policy pages | 2–3 din |
| Course videos upload (Sohail ke videos ready hone par) | 1–2 din |
| Testing + launch | 1–2 din |

**Kul: lagbhag 8–11 working days (2 hafte)** — bashart ki videos, logo aur text time par mil jaayein.

Sabse bada delay hamesha **content** se aata hai, code se nahi. Videos jitni jaldi milengi,
site utni jaldi live hogi.

---

## 6. Sabse important sawaal — kya koi doosra vyakti direct link se videos dekh paayega?

**Nahi.** Neeche diya setup lagne par, bina payment wala koi vyakti link copy karke video nahi
chala payega. Yeh application mein **pehle se bana hua hai** (live demo `/guide` page par bhi hai):

1. **Video ka link kabhi page mein hota hi nahi.** `<video>` tag mein file ka path nahi hota.
   Har baar player server se ek naya link maangta hai.
2. **Server pehle check karta hai ki payment hua hai.** Enrollment record hi access ka
   single source of truth hai — browser ki baat par bharosa nahi kiya jaata.
3. **Link sirf 2 minute chalta hai, aur sirf usi student ke liye.** Link mein lesson id,
   student id aur expiry — teeno cryptographically signed hain. Kisi aur ko bhejne par
   server saaf mana kar deta hai. *(Yeh test kiya gaya hai: dusre account se wahi link 403 deta hai.)*
4. **Video files website folder ke bahar rakhi gayi hain**, isliye seedha URL guess karke
   bhi nahi khulti.
5. **Production mein DRM + domain lock:** VdoCipher/Bunny par video encrypted tukdon (HLS/DRM)
   mein stream hoti hai, aur player sirf aapke domain par chalta hai. Download manager ya
   "inspect element" se poori file nahi milti.
6. **Har student ka watermark:** video par uska email/mobile halka sa dikhta rehta hai.
   Koi recording leak kare to pata chal jaata hai kisne ki.
7. **Login limit:** ek account ek time par 1–2 device par — password share karke kai log
   ek account nahi chala payenge.

### Imaandari se ek baat

Duniya ka **koi bhi** system mobile se screen recording ko 100% nahi rok sakta — Netflix aur
Udemy bhi nahi. Lekin:

- DRM kai devices par recording ko **black screen** kar deta hai,
- aur watermark se leak karne wala student **pehchana ja sakta hai**.

Isliye leak ka risk practically bahut kam ho jaata hai. Jo bhi aapse "100% impossible" ka
vaada kare, woh sach nahi bol raha.

---

## Summary

| Sawaal | Jawab |
| --- | --- |
| Development cost | ₹45,000 – ₹90,000 one-time (is codebase ke base par, 8–11 din) |
| Hosting + domain | Alag. Shuruaat mein ~₹1,500/saal; grow karne par ₹1,500–₹3,500/mahina |
| Video hosting | Alag. Students ke hisaab se — 100 students par ~₹300–₹800/mahina (Bunny) |
| Payment gateway | UPI aam taur par 0%; card/netbanking ~2% + GST. Setup aur annual fee ₹0 |
| Maintenance | **Compulsory koi nahi.** Optional support ₹1,500–₹8,000/mahina |
| Time | ~2 hafte, videos aur content time par milne par |
| Videos secure? | **Haan** — signed 2-minute links + DRM + watermark + domain lock |
