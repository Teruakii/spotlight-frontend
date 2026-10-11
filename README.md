# Spotlight Frontend

เว็บของ Spotlight แอปค้นหาและรีวิวสถานที่ท่องเที่ยวและร้านอาหาร หน้าตาทำตามดีไซน์จาก Figma และดึงข้อมูลจาก [spotlight-backend](https://github.com/Teruakii/spotlight-backend)

- **Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 3, lucide-react, Leaflet + react-leaflet (แผนที่, ใช้ tile ของ OpenStreetMap ไม่ต้องมี API key)

## เริ่มต้นใช้งาน

ต้องรัน backend ก่อน (ดูวิธีใน README ของ spotlight-backend)

```bash
npm install
cp .env.local.example .env.local   # ค่า default ชี้ไปที่ http://localhost:5000/api
npm run dev                        # http://localhost:3000
```

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รันแบบพัฒนา (hot reload) |
| `npm run build` | build สำหรับ production |
| `npm start` | รันตัวที่ build แล้ว |

| ตัวแปรใน `.env.local` | ตัวอย่าง |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` |

**ห้ามรัน `npm run dev` จากโฟลเดอร์เดียวกันสองตัวพร้อมกัน** (หรือรัน `npm run build` ระหว่างที่ dev รันอยู่) เพราะทุกตัวเขียนลงโฟลเดอร์ `.next` ร่วมกันแล้วจะทับกันจนหน้าเว็บพัง

## หน้าในเว็บ

| Path | ใครใช้ | มีอะไร |
|---|---|---|
| `/` | ทุกคน | หน้าแรก: ค้นหา, กรองหมวด, เรียง Popular / Nearby / Top rated / Newest, สลับ Grid ↔ Map, "Picked for you" (ต้องล็อกอิน) |
| `/places` | ทุกคน | รายการสถานที่ทั้งหมด + ปุ่มเพิ่มสถานที่ |
| `/places/[id]` | ทุกคน | รายละเอียด: รูป, ปุ่ม Bookmark, แท็บ About / Nearby Eats / Reviews |
| `/places/new`, `/places/[id]/edit` | ล็อกอิน | เพิ่ม/แก้สถานที่ (สถานที่ใหม่ต้องรอ admin อนุมัติ) |
| `/login`, `/register` | ทุกคน | เข้าสู่ระบบ / สมัคร |
| `/profile` | ล็อกอิน | Profile + แท็บ Trips & Collections, Saved Places, My Reviews, My Places, Settings |
| `/settings` | ล็อกอิน | เปลี่ยนรหัสผ่าน, ออกจากระบบ, ลบบัญชี |
| `/collections/[id]` | ทุกคน (ถ้าเป็น public) | หน้าแชร์ทริปแบบอ่านอย่างเดียว |
| `/dashboard` | admin | ภาพรวม: ตัวเลขสรุป, กราฟ, สัดส่วนหมวด, กิจกรรมล่าสุด |
| `/dashboard/pending` | admin | อนุมัติ/ปฏิเสธสถานที่ใหม่ |
| `/dashboard/reviews` | admin | รีวิวที่ถูกรายงาน (Keep / Remove) |
| `/dashboard/places`, `/dashboard/categories` | admin | จัดการสถานที่และหมวด |
| `/dashboard/users` | admin | ค้นหา, ระงับ, คืนสิทธิ์ผู้ใช้ |

## วิธีใช้ฟีเจอร์หลัก

**ค้นหาที่ใกล้ฉัน:** ที่หน้าแรกกด **Nearby** แล้วอนุญาตให้ browser ใช้ตำแหน่ง ระบบจะแสดงสถานที่ในรัศมี 25 กม. พร้อมระยะทาง แสดงเฉพาะสถานที่ที่มีพิกัด lat/lng (ใส่ได้ในหน้าแก้ไขสถานที่)

**แผนที่:** กด **Map** ทางขวา จะเห็นรายการด้านซ้ายและหมุดตัวเลขบนแผนที่ คลิกหมุดหรือรายการเพื่อเลือก แล้วกด "View details"

**Save และ Nearby Eats:** ในหน้า detail กดไอคอน Bookmark เพื่อ save ส่วนแท็บ **Nearby Eats** แสดงร้านอาหาร/คาเฟ่ในรัศมี 5 กม. โดยระบบนับหมวดที่ชื่อมีคำว่า dining / food / restaurant / café / อาหาร / ร้าน / คาเฟ่ เป็นร้านอาหาร

**รีวิว:** ให้ดาวและเขียนข้อความ ถ้ากด "Rate details & add photos" จะให้คะแนนย่อย (Experience / Value / Access / Atmosphere) และแนบรูปจาก URL ได้สูงสุด 4 รูป รีวิวของคนอื่นกด **Helpful** หรือ **Report** ได้

**วางแผนทริป (Collections):** ไปที่ Profile → Trips & Collections
1. ตั้งชื่อแล้วกด **+ New collection**
2. เลือกสถานที่จากที่ save ไว้แล้วกด **Add to day N** (กด **+ Add day** ถ้าต้องการเพิ่มวัน)
3. ใช้ปุ่ม ↑ ↓ เรียงลำดับ ใช้ช่อง Day ย้ายวัน ใช้ช่องเวลาตั้งเวลาเริ่ม ทุกอย่างบันทึกทันที
4. กด **Make public** แล้วกด **Share collection** เพื่อคัดลอกลิงก์ไปให้คนอื่นดู

**Admin dashboard:** เลือกช่วง 7D / 30D / 12M ที่มุมขวาบน ชี้เมาส์ที่กราฟเพื่อดูตัวเลข หรือกด "View as table" ส่วนกราฟ Visits จะนับจากการเปิดหน้ารายละเอียดสถานที่

## โครงสร้างโค้ด

```
src/
  app/                  หน้าเว็บตาม path (Next.js App Router)
  components/
    layout/             Navbar, เมนูผู้ใช้
    home/               หน้าแรก: hero, ตัวกรอง, grid, แผนที่ (PlaceMap / PlaceMapView), PickedForYou
    place/              การ์ดสถานที่
    place-detail/       รูป, แท็บ, รีวิว, SaveButton, NearbyEats, ReportReviewButton
    place-form/         ฟอร์มเพิ่ม/แก้สถานที่
    profile/            ProfileHeader, CollectionsPanel / CollectionEditor, SettingsPanel, รายการต่าง ๆ
    admin/              Sidebar, StatCard, ActivityChart, CategoryMix, ตารางจัดการ
    auth/, ui/          ฟอร์มล็อกอิน และ component พื้นฐาน (StarRating, Tabs, Avatar, ...)
  context/AuthContext.js  เก็บ token (localStorage) และข้อมูลผู้ใช้ที่ล็อกอินอยู่
  lib/
    api.js              ฟังก์ชันเรียก API ทุกตัว (ที่เดียวที่ใช้ fetch)
    usePlaceFeed.js     state ของหน้าแรก/หน้า places: หมวด, การค้นหา, การเรียง, Nearby
    itinerary.js        ฟังก์ชันจัดลำดับ/ย้ายวันใน collection
    reviews.js          รายการคะแนนย่อยและการหาค่าเฉลี่ย
    chartColors.js      สีของกราฟ (ผ่านการตรวจว่าคนตาบอดสีแยกได้)
    styles.js, utils.js class ที่ใช้ซ้ำ และฟังก์ชันช่วย (ชื่อ, วันที่, ระยะทาง, ...)
```

**แนวทางเวลาเพิ่มหน้าใหม่:** เพิ่มฟังก์ชันเรียก API ใน `lib/api.js` → สร้าง component ใน `components/<ส่วน>/` → สร้างหน้าใน `app/<path>/page.js` หน้าที่ต้องล็อกอินให้ใช้ `useAuth()` แล้ว redirect ไป `/login` ถ้ายังไม่มี user (ดูตัวอย่างใน `app/settings/page.js`)

## ข้อจำกัดที่รู้อยู่

- ยังไม่มี unit test ฝั่ง frontend ตอนนี้ตรวจด้วย `npm run build` และการเปิดหน้าจริง
- รูปทั้งหมดใส่เป็น URL ยังอัปโหลดไฟล์จากเครื่องไม่ได้

## License

MIT
