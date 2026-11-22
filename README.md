# GTA VI Companion Map — Antigravity Project Pack

Dokumen ini adalah paket spesifikasi dan instruksi untuk membangun **GTA VI Companion Map** melalui Antigravity, lalu menyimpan source code di GitHub dan melakukan deployment ke Vercel.

## Isi paket

| File | Fungsi |
|---|---|
| `00_MASTER_ORCHESTRATOR.md` | Prompt utama untuk Antigravity dan pengaturan multi-agent |
| `01_PRODUCT_REQUIREMENTS.md` | Visi produk, ruang lingkup, user journey, dan acceptance criteria |
| `02_UI_UX_DESIGN.md` | Design system, layout desktop/mobile, dan interaksi |
| `03_MAP_GIS_ENGINE.md` | Map engine, koordinat, marker, layer, dan basemap |
| `04_VEHICLE_INTELLIGENCE.md` | Vehicle Finder, tracker/non-tracker, acquisition, storage, dan selling |
| `05_MONEY_FINDER.md` | Money Finder, profit ranking, dan money farming route |
| `06_MISSIONS_COMPLETION_XBOX.md` | Mission guide, completion tracker, cheat, dan Xbox quick guide |
| `07_ROUTE_PLANNER_PERSONAL_DATA.md` | Route optimizer, personal marker, notes, backup, dan restore |
| `08_DATA_SCHEMA_AND_GOVERNANCE.md` | Struktur data, sumber, lisensi, dan verifikasi |
| `09_QA_SECURITY_DEPLOYMENT.md` | Testing, security, GitHub, Vercel, dan release gate |
| `10_MULTI_AGENT_EXECUTION.md` | Pembagian agent/sub-agent, dependency, kontrak kerja, dan integrasi |

## Cara menggunakan

1. Buat project baru di Antigravity.
2. Masukkan seluruh file Markdown ini ke folder dokumentasi project, misalnya `/docs/antigravity-spec/`.
3. Buka `00_MASTER_ORCHESTRATOR.md` dan kirim instruksi di bagian **Initial execution prompt** kepada Antigravity.
4. Pastikan Antigravity benar-benar mengaktifkan multi-agent dan sub-agent. Jangan menerima simulasi pembagian tugas yang hanya berupa teks.
5. Minta agent membuat execution plan, daftar agent aktif, file ownership, dependency graph, dan integration gates sebelum implementasi.
6. Jalankan Phase 1 terlebih dahulu. Jangan lanjut ke fase berikutnya sebelum acceptance criteria fase tersebut lulus.
7. Commit perubahan secara bertahap ke GitHub dan deploy ke Vercel setelah production build dan smoke tests lulus.

## Prinsip penting

- Dokumen ini adalah spesifikasi produk dan instruksi engineering, bukan database fakta GTA VI.
- Jangan mengarang lokasi, harga jual kendaraan, status tracker, kode cheat, reward, respawn, atau mekanisme game.
- Status yang belum didukung bukti harus `UNKNOWN` atau `UNVERIFIED`.
- Data peta, gambar, dan dataset eksternal wajib memiliki sumber serta lisensi yang sesuai.
- Jangan menyalin source code, branding, database proprietary, atau aset IGN tanpa izin.
- Jika fitur multi-agent/sub-agent tidak tersedia di lingkungan Antigravity yang digunakan, agent harus menyatakan keterbatasan tersebut dan meminta keputusan. Jangan mengklaim multi-agent telah berjalan jika tidak ada agent terpisah yang benar-benar dieksekusi.
