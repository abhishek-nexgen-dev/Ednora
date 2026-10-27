# Ednora — Flathub & Flatpak Packaging Guide 📦

This directory contains the complete packaging assets for distributing **Ednora Desktop** as a Flatpak and submitting it to [Flathub](https://flathub.org).

- **Application ID**: `com.ednora.desktop`
- **Application Name**: Ednora
- **Runtime**: `org.gnome.Platform` (branch `47`)
- **SDK**: `org.gnome.Sdk` (branch `47`)
- **SDK Extensions**:
  - `org.freedesktop.Sdk.Extension.rust-stable` (`24.08`)
  - `org.freedesktop.Sdk.Extension.node22` (`24.08`)
- **Binary Target**: `/app/bin/ednora`

---

## 📂 Directory Layout

```
flatpak/
├── com.ednora.desktop.yml         # Main Flatpak manifest
├── com.ednora.desktop.metainfo.xml # AppStream metadata (releases, OARS, screenshots)
├── com.ednora.desktop.desktop     # FreeDesktop launcher entry
├── build-flatpak.sh               # Local build & bundle helper script
├── icons/                         # Standard FreeDesktop hicolor icon assets
│   ├── 32x32.png
│   ├── 64x64.png
│   ├── 128x128.png
│   ├── 256x256.png
│   └── 512x512.png
└── README.md                      # This guide
```

---

## 🔒 Permissions & Sandbox Architecture

Ednora adheres strictly to the principle of least privilege required by Flathub:

| Permission | Manifest Flag | Justification |
|---|---|---|
| **Display (Wayland/X11)** | `--socket=fallback-x11`, `--socket=wayland`, `--share=ipc` | Native graphical windowing rendering |
| **Graphics Acceleration** | `--device=dri` | WebKitGTK hardware acceleration for UI fluidity |
| **Network Access** | `--share=network` | Communicates with the remote university backend API & Cloudinary assets |
| **Desktop Notifications**| `--talk-name=org.freedesktop.Notifications` | Dispatches system toasts when admissions or jobs are updated |

> [!NOTE]
> File selection uses standard FreeDesktop XDG desktop portals (`org.freedesktop.portal.FileChooser`) via WebKitGTK and Tauri, so blanket filesystem permissions (`--filesystem=host` or `--filesystem=home`) are **not required**.

---

## 🧪 Validating Metadata Files

Before building or opening a Flathub Pull Request, ensure all metadata passes strict validation:

### 1. Validate FreeDesktop Entry
```bash
desktop-file-validate flatpak/com.ednora.desktop.desktop
```
*Expected output: Exit code 0 with no errors or hints.*

### 2. Validate AppStream Metainfo
```bash
appstreamcli validate --no-net flatpak/com.ednora.desktop.metainfo.xml
```
*Expected output: `✔ Validation was successful.` (0 errors, 0 warnings).*

---

## 🛠️ Building & Testing Locally

### 1. Install Build Dependencies (Parrot OS / Debian / Ubuntu)
```bash
sudo apt-get update
sudo apt-get install -y flatpak flatpak-builder
```

### 2. Run the Automated Build Helper
From the repository root:
```bash
./flatpak/build-flatpak.sh
```

This script automatically:
1. Validates `com.ednora.desktop.desktop` and `com.ednora.desktop.metainfo.xml`.
2. Downloads and installs the GNOME 47 Platform, SDK, and build extensions from Flathub if missing.
3. Builds the frontend (`npm run build`) and the Tauri native Rust binary (`cargo build --release`).
4. Generates an installable single-file bundle: `ednora-x86_64.flatpak`.

### 3. Install & Launch the Local Flatpak
```bash
# Install bundle to user installation
flatpak install --user --bundle ednora-x86_64.flatpak

# Run Ednora
flatpak run com.ednora.desktop
```

---

## 🚀 Publishing to Flathub

To submit Ednora to the official Flathub catalog:

1. **Fork the Flathub Repository**:
   Fork [github.com/flathub/flathub](https://github.com/flathub/flathub) to your personal or organization GitHub account.

2. **Create a Submission Branch**:
   ```bash
   git clone git@github.com:<YOUR_USER>/flathub.git
   cd flathub
   git checkout -b new-pr/com.ednora.desktop
   ```

3. **Add the Packaging Manifest**:
   - Create a directory or add `com.ednora.desktop.yml` pointing to your tagged release repository.
   - For reproducible builds on Flathub build bots (which run offline during compilation), generate the cargo vendor archive or commit hash using `flatpak-cargo-generator` and `flatpak-node-generator`.

4. **Open Pull Request**:
   Open a pull request from `new-pr/com.ednora.desktop` to `flathub/flathub:new-pr`. Flathub's automated build bot (`flathubbot`) will test the build on `x86_64` and `aarch64` architectures.

