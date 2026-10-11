# Spotlight Frontend

Web app for Spotlight, for finding and reviewing travel attractions and restaurants. The UI follows the Figma design, and data comes from [spotlight-backend](https://github.com/Teruakii/spotlight-backend).

- **Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 3, lucide-react, Leaflet + react-leaflet (maps with OpenStreetMap tiles; no API key needed)

## Getting started

Start the backend first (see the spotlight-backend README).

```bash
npm install
cp .env.local.example .env.local   # defaults to http://localhost:5000/api
npm run dev                        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Run the production build |

| Variable in `.env.local` | Example |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` |

**Don't run two `npm run dev` processes from the same folder** (or `npm run build` while dev is running). They all write to the same `.next` folder and overwrite each other, which breaks the site.

## Pages

| Path | Who | What's there |
|---|---|---|
| `/` | Everyone | Home: search, category filter, sort by Popular / Nearby / Top rated / Newest, Grid ↔ Map toggle, "Picked for you" (logged in) |
| `/places` | Everyone | All places, plus an "Add place" button |
| `/places/[id]` | Everyone | Place details: photos, Bookmark button, About / Nearby Eats / Reviews tabs |
| `/places/new`, `/places/[id]/edit` | Logged in | Add or edit a place (new places wait for admin approval) |
| `/login`, `/register` | Everyone | Log in / sign up |
| `/profile` | Logged in | Profile with tabs: Trips & Collections, Saved Places, My Reviews, My Places, Settings |
| `/settings` | Logged in | Change password, sign out, delete account |
| `/collections/[id]` | Everyone (if public) | Read-only shared trip page |
| `/dashboard` | Admin | Overview: key numbers, chart, category mix, recent activity |
| `/dashboard/pending` | Admin | Approve or reject new places |
| `/dashboard/reviews` | Admin | Reported reviews (Keep / Remove) |
| `/dashboard/places`, `/dashboard/categories` | Admin | Manage places and categories |
| `/dashboard/users` | Admin | Search, suspend and reinstate users |

## Using the main features

**Find places near you:** On the home page, choose **Nearby** and allow the browser to share your location. You'll see places within 25 km, with distances. Only places with lat/lng coordinates appear; add them on the place's edit page.

**Map:** Choose **Map** on the right. The list is on the left and numbered pins are on the map. Click a pin or a list item to select it, then "View details".

**Save and Nearby Eats:** On a place's page, click the bookmark icon to save it. The **Nearby Eats** tab lists restaurants and cafés within 5 km. A category counts as food when its name contains dining / food / restaurant / café / อาหาร / ร้าน / คาเฟ่.

**Reviews:** Give a star rating and write a comment. Open "Rate details & add photos" to add per-aspect ratings (Experience / Value / Access / Atmosphere) and up to 4 photo URLs. On other people's reviews you can click **Helpful** or **Report**.

**Plan a trip (Collections):** Go to Profile → Trips & Collections.
1. Type a name and click **+ New collection**.
2. Pick one of your saved places and click **Add to day N** (use **+ Add day** for more days).
3. Use ↑ ↓ to reorder, the Day selector to move a place to another day, and the time field to set a start time. Changes save immediately.
4. Click **Make public**, then **Share collection** to copy a link you can send to others.

**Admin dashboard:** Pick 7D / 30D / 12M in the top-right corner. Hover the chart to see values, or click "View as table". Visits are counted when someone opens a place's detail page.

## Code structure

```
src/
  app/                  Pages, one folder per path (Next.js App Router)
  components/
    layout/             Navbar, user menu
    home/               Home page: hero, filters, grid, map (PlaceMap / PlaceMapView), PickedForYou
    place/              Place card
    place-detail/       Gallery, tabs, reviews, SaveButton, NearbyEats, ReportReviewButton
    place-form/         Add/edit place form
    profile/            ProfileHeader, CollectionsPanel / CollectionEditor, SettingsPanel, lists
    admin/              Sidebar, StatCard, ActivityChart, CategoryMix, management tables
    auth/, ui/          Login forms and basic components (StarRating, Tabs, Avatar, ...)
  context/AuthContext.js  Token (in localStorage) and the logged-in user
  lib/
    api.js              Every API call (the only place that uses fetch)
    usePlaceFeed.js     State for the home and places pages: category, search, sort, Nearby
    itinerary.js        Reorder / move-between-days helpers for collections
    reviews.js          Sub-rating definitions and averages
    chartColors.js      Chart colours (checked for colour-blind separation)
    styles.js, utils.js Shared classes and helpers (names, dates, distances, ...)
```

**Adding a page:** add the API call to `lib/api.js` → create components in `components/<area>/` → create the page in `app/<path>/page.js`. For pages that need a login, use `useAuth()` and redirect to `/login` when there is no user (see `app/settings/page.js`).

## Known limitations

- There are no frontend unit tests yet. Changes are checked with `npm run build` and by opening the pages.
- Photos are added by URL; uploading files from your computer isn't supported yet.

## License

MIT
