# Vitrina CMS - Εγχειρίδιο Χρήσης

> **Vitrina** είναι ένα CMS template για site-βιτρίνες (κοσμήματα, παπούτσια, ρούχα, κλπ.) χωρίς eshop.
> Ο πελάτης βλέπει προϊόντα, παίρνει τηλέφωνο βάσει κωδικού και παραγγέλνει.

---

## Πίνακας Περιεχομένων

1. [Δημιουργία Νέου Site](#1-δημιουργία-νέου-site-βήμα-προς-βήμα)
2. [Supabase Setup](#2-supabase-setup)
3. [Vercel Deploy](#3-vercel-deploy)
4. [Χρήση Admin Panel](#4-χρήση-admin-panel)
5. [Προσαρμογή (Customization)](#5-προσαρμογή-customization)
6. [Αντιμετώπιση Προβλημάτων](#6-αντιμετώπιση-προβλημάτων)

---

## 1. Δημιουργία Νέου Site (Βήμα προς Βήμα)

### Βήμα 1: Αντίγραψε τα αρχεία

```bash
# Πήγαινε στο φάκελο που θέλεις να δημιουργήσεις το νέο site
cd C:\Users\George\Desktop\html projects\webiste

# Αντίγραψε όλο το φάκελο Vitrina με νέο όνομα
xcopy /E /I Vitrina OnomaNeouSite
```

> **Παράδειγμα**: `xcopy /E /I Vitrina JewelleryShop`

### Βήμα 2: Άνοιξε το νέο project στον editor

```bash
code OnomaNeouSite
```

### Βήμα 3: Δημιούργησε GitHub repository

```bash
cd OnomaNeouSite

# Διέγραψε το παλιό git remote
git remote remove origin

# Δημιούργησε νέο repo στο GitHub (θα σου ζητήσει να συνδεθείς)
gh repo create OnomaNeouSite --public --source=. --remote=origin --push
```

> Αν δεν έχεις `gh` CLI, κάνε το manually:
> 1. Πήγαινε [github.com/new](https://github.com/new)
> 2. Δημιούργησε νέο repo (π.χ. `JewelleryShop`)
> 3. Τρέξε:
> ```bash
> git remote add origin https://github.com/hackerw32/JewelleryShop.git
> git push -u origin master
> ```

### Βήμα 4: Δημιούργησε Supabase project

1. Πήγαινε [supabase.com](https://supabase.com) → **New project**
2. **Name**: `onoma-neou-site` (π.χ. `jewellery-shop`)
3. **Database Password**: Βάλε ένα δυνατό κωδικό (αποθήκευσέ τον!)
4. **Region**: Επίλεξε το κοντινότερο (π.χ. Frankfurt)
5. **Pricing Plan**: Free
6. Περίμενε ~1-2 λεπτά να δημιουργηθεί

### Βήμα 5: Πάρε τα API keys

1. Στο Supabase dashboard → **Project Settings** (εικονίδιο γραναζιού)
2. **API** → Αντίγραψε:
   - **Project URL** (το `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (το `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Βήμα 6: Τρέξε το SQL Schema

1. Στο Supabase → **SQL Editor**
2. **New Query**
3. Άνοιξε το αρχείο `supabase-schema.sql` από το project σου
4. Copy-paste όλο το περιεχόμενο
5. Πάτα **Run** (▶️)

### Βήμα 7: Δημιούργησε Storage Bucket

1. Στο Supabase → **Storage**
2. **New bucket**
3. Όνομα: `images`
4. Επίλεξε **Public bucket**
5. **Create bucket**

### Βήμα 8: Ενεργοποίησε Authentication

1. Στο Supabase → **Authentication** → **Providers**
2. Βεβαιώσου ότι το **Email** είναι **Enabled**
3. (Προαιρετικά) Απενεργοποίησε το **"Confirm email"** για ευκολία

### Βήμα 9: Deploy στο Vercel

1. Πήγαινε [vercel.com](https://vercel.com)
2. **Add New** → **Project**
3. Επίλεξε το repo σου (π.χ. `hackerw32/JewelleryShop`)
4. **Import**
5. Πρόσθεσε τα **Environment Variables**:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Το Project URL από Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Το anon key από Supabase |
| `NEXT_PUBLIC_SITE_URL` | `https://onoma-neou-site.vercel.app` |

6. Πάτα **Deploy** 🚀

### Βήμα 10: Μπες στο Admin!

1. Περίμενε να τελειώσει το deploy (~1-2 λεπτά)
2. Πήγαινε στο: `https://onoma-neou-site.vercel.app/admin/login`
3. Κάνε **Sign Up** με email και password
4. Μπες στο dashboard και ξεκίνα να προσθέτεις προϊόντα!

---

## 2. Supabase Setup

### Δημιουργία Project

| Βήμα | Ενέργεια |
|------|----------|
| 1 | Πήγαινε [supabase.com](https://supabase.com) |
| 2 | Sign up με GitHub |
| 3 | **New project** |
| 4 | Όνομα: `onoma-neou-site` |
| 5 | Database Password: **ΑΠΟΘΗΚΕΥΣΕ ΤΟΝ** |
| 6 | Region: Frankfurt ή Stockholm |
| 7 | Free plan |

### SQL Schema

Το αρχείο `supabase-schema.sql` περιέχει:

- **categories** - Πίνακας κατηγοριών
- **products** - Πίνακας προϊόντων
- **settings** - Ρυθμίσεις site
- **Indexes** - Για γρήγορα queries
- **Triggers** - Auto-update `updated_at`
- **Default settings** - Προεπιλεγμένες ρυθμίσεις

### Storage

- Bucket: `images` (Public)
- Χρησιμοποιείται για: εικόνες προϊόντων, κατηγοριών, logo, hero

### Auth

- Provider: Email
- Το πρώτο account που θα κάνει sign up γίνεται αυτόματα admin

---

## 3. Vercel Deploy

### Αυτόματο Deploy (από GitHub)

Κάθε φορά που κάνεις `git push` στο master branch, το Vercel κάνει αυτόματα redeploy.

```bash
git add -A
git commit -m "Περιγραφή αλλαγών"
git push
```

### Manual Redeploy

1. Πήγαινε [vercel.com](https://vercel.com)
2. Επίλεξε το project σου
3. **Deployments**
4. Πάτα **Redeploy** στο τελευταίο deployment

### Environment Variables

Πρέπει πάντα να ορίζεις αυτά τα variables στο Vercel:

| Variable | Πού το βρίσκεις |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Το URL του site σου στο Vercel |

### Custom Domain (προαιρετικά)

1. Vercel → Project → **Settings** → **Domains**
2. Πρόσθεσε το domain σου (π.χ. `jewelleryshop.gr`)
3. Ακολούθησε τις οδηγίες DNS

---

## 4. Χρήση Admin Panel

### Σύνδεση

```
https://to-site-sou.vercel.app/admin/login
```

### Dashboard

Το dashboard δείχνει:
- Σύνολο προϊόντων
- Σύνολο κατηγοριών
- Τελευταίες προσθήκες

### Διαχείριση Κατηγοριών

`/admin/categories`

- **Προσθήκη**: Πάτα "Νέα Κατηγορία"
- **Επεξεργασία**: Πάτα το μολύβι (✏️)
- **Διαγραφή**: Πάτα τον σκουπιδοτενεκέ (🗑️)
- Κάθε κατηγορία έχει: όνομα, slug, περιγραφή, εικόνα

### Διαχείριση Προϊόντων

`/admin/products`

- **Προσθήκη**: Πάτα "Νέο Προϊόν"
- **Αναζήτηση**: Γράψε όνομα ή κωδικό
- Κάθε προϊόν έχει: όνομα, κωδικό, τιμή, περιγραφή, κατηγορία, εικόνες, χαρακτηριστικά

### Ρυθμίσεις Site

`/admin/settings`

- **Site name**: Το όνομα του καταστήματος
- **Layout**: Επιλογή από 3 layouts (Classic, Modern, Grid)
- **Χρώματα**: Primary και secondary χρώμα
- **Logo**: Εικόνα λογότυπου
- **Hero**: Εικόνα και κείμενο hero section
- **Στοιχεία επικοινωνίας**: Τηλέφωνο, email, διεύθυνση
- **Social media**: Facebook, Instagram URLs

---

## 5. Προσαρμογή (Customization)

### Αλλαγή Χρωμάτων

Στο admin panel → **Settings** → άλλαξε τα χρώματα:
- **Primary color**: Κύριο χρώμα (π.χ. `#1e40af` μπλε)
- **Secondary color**: Δευτερεύον χρώμα (π.χ. `#f59e0b` κίτρινο)

### Αλλαγή Layouts

Υπάρχουν 3 έτοιμα layouts:

| Layout | Περιγραφή |
|--------|-----------|
| **Classic** | Κλασικό grid με categories ως pills, products σε grid 1-4 cols |
| **Modern** | Μοντέρνο με hero section, category cards, products σε 3 cols |
| **Grid** | Masonry grid με varying heights, compact categories |

Επιλέγονται από το admin panel → **Settings** → **Layout**

### Αλλαγή Κειμένων

- **Hero title/subtitle**: Από Settings
- **Site description**: Από Settings
- **Όλα τα κείμενα είναι στα Ελληνικά**

### Προσθήκη / Αφαίρεση Σελίδων

Τα αρχεία των σελίδων βρίσκονται στο `src/app/`:

```
src/app/
├── page.js              # Αρχική σελίδα
├── products/[id]/page.js # Σελίδα προϊόντος
├── categories/[slug]/page.js # Σελίδα κατηγορίας
├── contact/page.js       # Σελίδα επικοινωνίας
├── admin/                # Admin panel
└── ...
```

### Αλλαγή Favicon

Αντικατέστησε το αρχείο `public/favicon.ico` με το favicon του πελάτη.

---

## 6. Αντιμετώπιση Προβλημάτων

### ❌ Λευκή σελίδα στο admin

**Αιτία**: Το AdminLayout τυλίγει όλες τις admin σελίδες και κάνει redirect αν δεν είσαι logged in.

**Λύση**: Βεβαιώσου ότι το `src/app/admin/layout.js` έχει τον έλεγχο για τη σελίδα login:

```javascript
const pathname = usePathname()
const isLoginPage = pathname === '/admin/login'
if (isLoginPage) {
  return <AuthProvider>{children}</AuthProvider>
}
```

### ❌ Build fails με "workStore invariant"

**Αιτία**: Τα admin pages χρησιμοποιούν client-side hooks αλλά το Next.js προσπαθεί να τα κάνει static.

**Λύση**: Πρόσθεσε `export const dynamic = 'force-dynamic'` σε όλες τις admin pages.

### ❌ "Supabase not configured" error

**Αιτία**: Δεν έχεις βάλει τα environment variables.

**Λύση**: Πρόσθεσε `NEXT_PUBLIC_SUPABASE_URL` και `NEXT_PUBLIC_SUPABASE_ANON_KEY` στο Vercel.

### ❌ Security vulnerability warning

**Αιτία**: Παλιά έκδοση Next.js.

**Λύση**: Αναβάθμισε:
```bash
npm install next@latest
```

### ❌ Git push fails

**Αιτία**: Το remote origin δείχνει σε λάθος repo.

**Λύση**:
```bash
git remote remove origin
git remote add origin https://github.com/hackerw32/NeoRepo.git
git push -u origin master
```

### ❌ Οι εικόνες δεν εμφανίζονται

**Αιτία**: Το storage bucket δεν είναι public ή τα env vars είναι λάθος.

**Λύση**:
1. Έλεγξε ότι το bucket `images` είναι **Public**
2. Έλεγξε ότι τα Supabase env vars είναι σωστά στο Vercel

---

## Checklist Γρήγορης Εκκίνησης

- [ ] Αντέγραψα τα αρχεία με νέο όνομα
- [ ] Δημιούργησα GitHub repo
- [ ] Δημιούργησα Supabase project
- [ ] Έτρεξα το SQL schema
- [ ] Δημιούργησα storage bucket `images`
- [ ] Ενεργοποίησα Email auth
- [ ] Έκανα deploy στο Vercel
- [ ] Πρόσθεσα τα environment variables
- [ ] Δοκίμασα το admin login
- [ ] Πρόσθεσα κατηγορίες και προϊόντα

---

> **Τελευταία ενημέρωση**: Μάιος 2026
> **Next.js version**: 15.5.18
> **Supabase**: Latest
