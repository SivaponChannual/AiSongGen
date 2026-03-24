# AiSongGen — AI Song Generator Platform

A Django 4.2 + DRF backend for the AI Song Generator Platform, implementing the full Domain Layer.

---

## Stack
| Package | Version |
|---|---|
| Django | ≥ 4.2 |
| djangorestframework | ≥ 3.14 |
| django-cors-headers | ≥ 4.3 |
| python-decouple | ≥ 3.8 |
| django-extensions | ≥ 3.2 |

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd AiSongGen

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env       # or create manually:
echo "SECRET_KEY=your-secret-key-here" > .env
echo "DEBUG=True" >> .env

# 5. Apply migrations
python manage.py migrate

# 6. Create a superuser (for Admin panel)
python manage.py createsuperuser

# 7. Run the development server
python manage.py runserver
```

---

## Project Structure

```
AiSongGen/
├── aisonggen/               # Django project package
│   ├── settings.py          # python-decouple, CORS, installed apps
│   └── urls.py              # Routes /api/ to generator app
├── generator/               # Main application
│   ├── models/              # One-file-per-class domain layer
│   │   ├── enums.py         # Genre, Mood, Occasion, VocalType, GenerationStatus
│   │   ├── user.py          # User model (google_id, user_email, onboarding_status)
│   │   ├── library.py       # MediaLibrary (OneToOne User, song_count)
│   │   ├── song.py          # Song (UUID PK, DurationField, ±10s clean())
│   │   ├── profile.py       # SongProfile (OneToOne Song, requested_length)
│   │   ├── shared.py        # SharedLink (OneToOne Song, CASCADE)
│   │   └── __init__.py      # Re-exports all models
│   ├── serializers/         # DRF ModelSerializers
│   │   ├── user_serializer.py
│   │   ├── song_serializer.py
│   │   └── __init__.py
│   ├── api/                 # DRF Generic Views + URL routing
│   │   ├── views.py
│   │   └── urls.py
│   └── admin.py             # All models registered
├── .env                     # SECRET_KEY, DEBUG (git-ignored)
├── .gitignore
└── requirements.txt
```

---

## API Endpoints (CRUD)

### Users

| Method | URL | Action |
|--------|-----|--------|
| `GET` | `/api/users/` | List all users |
| `POST` | `/api/users/` | Create a new user |
| `GET` | `/api/users/<id>/` | Retrieve a user |
| `PUT` | `/api/users/<id>/` | Full update a user |
| `PATCH` | `/api/users/<id>/` | Partial update a user |
| `DELETE` | `/api/users/<id>/` | Delete a user |

**Example POST body:**
```json
{
  "google_id": "google-oauth2|12345",
  "user_email": "creator@example.com",
  "onboarding_status": false
}
```

### Songs

| Method | URL | Action |
|--------|-----|--------|
| `GET` | `/api/songs/` | List all songs |
| `POST` | `/api/songs/` | Create a new song |
| `GET` | `/api/songs/<uuid>/` | Retrieve a song |
| `PUT` | `/api/songs/<uuid>/` | Full update a song |
| `PATCH` | `/api/songs/<uuid>/` | Partial update a song |
| `DELETE` | `/api/songs/<uuid>/` | Delete song (cascades SharedLink) |

**Example POST body:**
```json
{
  "title": "Morning Drive JDM Mix",
  "status": "GENERATING",
  "is_favorited": false,
  "media_library": 1
}
```

---

## Admin Panel

Visit `http://127.0.0.1:8000/admin/` (after `createsuperuser`) to manage:
- **Users** — search by email/google_id, filter by onboarding status
- **Media Libraries**
- **Songs** — filter by status/favorited, search by title
- **Song Profiles** — filter by genre/mood/occasion/vocal type
- **Shared Links** — filter by allow_download flag

---

## Domain Model Summary

### Enumerations
| Enum | Values |
|---|---|
| `Genre` | POP, J_POP, JDM, ROCK, ELECTRONIC |
| `Mood` | ENERGETIC, CALMING, UPBEAT, SAD, DREAMY |
| `Occasion` | WORKOUT, STUDY, PARTY, COMMUTE |
| `VocalType` | MALE, FEMALE, INSTRUMENTAL |
| `GenerationStatus` | GENERATING, READY, FAILED |

### Business Rules
- **±10-second variance**: `Song.clean()` raises `ValidationError` if the actual duration deviates more than 10 seconds from `SongProfile.requested_length`.
- **Instant revocation**: Deleting a `Song` cascades to its `SharedLink` via `on_delete=CASCADE`.
- **Title constraint**: `Song.title` — max 256 chars, UTF-8.
- **Ownership isolation**: Every `Song` belongs to exactly one `MediaLibrary`, which belongs to exactly one `User`.