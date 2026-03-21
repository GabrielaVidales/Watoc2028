<h1 align="center">
    <img alt="project" title="#About" src="./frontend/public/watoc2028logo.png" style="background-color: white; border-radius: 15px;" />
</h1>

<h1 align="center">
  <a href="#"> WATOC 2028 (Monorepo Backend + Frontend) <br/>
      Official Conference Website </a>
</h1>

<p align="center">
  <strong>World Association of Theoretical and Computational Chemists</strong><br/>
  Mérida, Yucatán, México · 2028
</p>

<p align="center">
  <a href="https://watoc2028.org"><img src="https://img.shields.io/badge/Live-watoc2028.org-1D9E75?style=flat&logo=googlechrome&logoColor=white"/></a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Django-4-092E20?style=flat&logo=django&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat"/>
</p>

---

## Overview

Full-stack monorepo for the official website of **WATOC 2028**, the triennial congress of the World Association of Theoretical and Computational Chemists, hosted in Mérida, Yucatán, Mexico. The platform handles attendee registration, abstract submission and review, payment processing, visa invitation letters, and general conference information.

🌐 **Live site:** [watoc2028.org](https://watoc2028.org)

---

## Features

- **Attendee registration & authentication** — JWT-based auth with participant profiles and role management
- **Abstract submission portal** — File upload, co-author entry, presentation type selection (Oral / Poster / Young WATOC), and real-time status tracking (Submitted → Under Review → Accepted / Rejected)
- **Payment processing** — Stripe integration for registration fees
- **Visa invitation letters** — Automated generation and request management for international attendees
- **Contact system** — Categorized inquiry routing (Posters, Talks, Visa Letters, Payments, Others) with email notifications via Django signals
- **Conference info pages** — Venue, hotel booking, transportation, restaurants, Young WATOC program, and visa requirements
- **Interactive maps** — Leaflet.js integration for venue and local area navigation
- **Newsletter subscription** — Email capture for conference updates
- **User dashboard** — Protected portal for registered participants to manage submissions and profile
- **Responsive UI** — Mobile-first design with TailwindCSS + MUI + shadcn/ui components

---

## Tech stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + TypeScript | Core UI framework |
| Vite | Build tool |
| React Router | Client-side routing |
| TailwindCSS | Utility-first styling |
| shadcn/ui + MUI | Component library |
| Axios | HTTP client |
| React Hook Form | Form handling |
| Stripe.js | Payment UI |
| Leaflet + React Leaflet | Interactive maps |
| Lottie React | Animations |
| hCaptcha | Bot protection |

### Backend
| Tech | Purpose |
|------|---------|
| Django 4 | Web framework |
| Django REST Framework | API layer |
| Simple JWT | Authentication |
| Stripe | Payment processing |
| ItsDangerous | Secure token signing |
| PostgreSQL | Database |

---

## Project structure

```
watoc2028/
├── backend/                     # Django REST API
│   ├── abstract/                # Abstract submission & review
│   ├── api/                     # Core API endpoints
│   ├── contact_requests/        # Contact form + email signals
│   ├── participants/            # Attendee profiles
│   ├── payment/                 # Stripe payment integration
│   ├── students/                # Student registration logic
│   ├── users/                   # Custom user model & auth
│   ├── visas/                   # Visa invitation letter requests
│   └── watoc2028D/              # Django project settings
│
└── frontend/                    # React + TypeScript SPA
    └── src/
        ├── pages/
        │   ├── home/            # Landing page
        │   ├── abstractSubmission/  # Submission portal
        │   ├── venue/           # Venue info + maps
        │   ├── hotelBooking/    # Hotel recommendations
        │   ├── transportation/  # Getting to Mérida
        │   ├── restaurants/     # Local dining guide
        │   ├── visa/            # Visa requirements
        │   ├── youngWATOC/      # Young researcher program
        │   ├── contact/         # Contact form
        │   └── protected/       # Authenticated user area
        ├── components/          # Shared UI components
        ├── hooks/               # Custom React hooks
        ├── services/            # API service layer
        └── utils/               # Helpers (country data, regex)
```

---

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
cp .env.example .env            # Fill in DB credentials, JWT secret, Stripe keys

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local      # Set VITE_API_URL and Stripe public key
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:8000`.

---

## API endpoints (summary)

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `/api/token/` | JWT obtain/refresh |
| Users | `/api/users/` | Registration, profile |
| Abstracts | `/api/abstracts/` | Submit, list, update status |
| Participants | `/api/participants/` | Attendee profiles |
| Contact | `/api/contact/` | Inquiry submission |
| Visas | `/api/visas/` | Invitation letter requests |
| Payments | `/api/payments/` | Stripe checkout sessions |

---

## Team

| Role | Name | GitHub |
|------|------|--------|
| Lead developer | Eduardo Escalante Pacheco | [@edescal](https://github.com/edescal) |
| Backend developer | Carlos Eduardo Bojórquez Ruiz | [@cebojorquez](https://github.com/cebojorquez) |
| Frontend developer | Brishel Acosta | [@br3shel](https://github.com/br3shel) |
| Webmaster lead | Gabriela Vidales Ayala | [@GabrielaVidales](https://github.com/GabrielaVidales) |

---

## About WATOC

The [World Association of Theoretical and Computational Chemists (WATOC)](https://www.watoc.net/) hosts a triennial world congress bringing together researchers in theoretical and computational chemistry from around the globe. WATOC 2028 will be held in **Mérida, Yucatán, México**, organized by CINVESTAV Mérida's TheoChemMérida Lab under Dr. Gabriel Merino.

---

## License

MIT © WATOC 2028 Webmaster Team
