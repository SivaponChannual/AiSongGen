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
git clone https://github.com/SivaponChannual/AiSongGen.git
cd AiSongGen

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env       # or create manually:
echo SECRET_KEY=your-secret-key-here > .env
echo DEBUG=True >> .env

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

---

## Evidence of CRUD Functionality

All operations were tested against the live local server (`http://127.0.0.1:8000`) using `curl` and the DRF Browsable API.

---

### CREATE — `POST /api/users/`

```bash
curl -X POST http://127.0.0.1:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{"google_id":"g-demo-001","user_email":"creator@aisonggen.com","onboarding_status":false}'
```

**Response — HTTP 201 Created**
```json
{
    "id": 4,
    "google_id": "g-demo-001",
    "user_email": "creator@aisonggen.com",
    "onboarding_status": false
}
```

---

### READ — `GET /api/users/`

```bash
curl http://127.0.0.1:8000/api/users/
```

**Response — HTTP 200 OK**
```json
[
    {
        "id": 2,
        "google_id": "gg",
        "user_email": "asd@gmail.com",
        "onboarding_status": false
    },
    {
        "id": 3,
        "google_id": "test-g-001",
        "user_email": "testuser@aisonggen.com",
        "onboarding_status": false
    },
    {
        "id": 4,
        "google_id": "g-demo-001",
        "user_email": "creator@aisonggen.com",
        "onboarding_status": false
    }
]
```

---

### UPDATE — `PATCH /api/users/4/`

```bash
curl -X PATCH http://127.0.0.1:8000/api/users/4/ \
  -H "Content-Type: application/json" \
  -d '{"onboarding_status":true}'
```

**Response — HTTP 200 OK**
```json
{
    "id": 4,
    "google_id": "g-demo-001",
    "user_email": "creator@aisonggen.com",
    "onboarding_status": true
}
```

> `onboarding_status` changed from `false` → `true` ✅

---

### DELETE — `DELETE /api/users/4/`

```bash
curl -X DELETE http://127.0.0.1:8000/api/users/4/
```

**Response — HTTP 204 No Content**

Confirmed deletion — a subsequent `GET /api/users/` no longer includes `id: 4`.

---

### Songs endpoint also available

```bash
curl http://127.0.0.1:8000/api/songs/
```

**Response — HTTP 200 OK**
```json
[]
```

> Songs are linked to a `MediaLibrary`, which requires a `User` first. Full song creation flow works via Django Admin at `/admin/`.

---

### Django Admin CRUD (Alternative)

All 5 domain models are also fully manageable via the Django Admin panel at `http://127.0.0.1:8000/admin/`:

| Model | Admin URL |
|---|---|
| Users | `/admin/generator/user/` |
| Media Libraries | `/admin/generator/medialibrary/` |
| Songs | `/admin/generator/song/` |
| Song Profiles | `/admin/generator/songprofile/` |
| Shared Links | `/admin/generator/sharedlink/` |