#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Ednora Flatpak Packaging Helper ==="
echo "Working directory: $ROOT_DIR"

# 1. Validate desktop and metainfo files
echo "[1/4] Validating FreeDesktop & AppStream metadata..."
desktop-file-validate "$SCRIPT_DIR/com.ednora.desktop.desktop"
appstreamcli validate --no-net "$SCRIPT_DIR/com.ednora.desktop.metainfo.xml"
echo "Metadata validation PASSED."

# 2. Check for flatpak-builder
if ! command -v flatpak-builder &>/dev/null; then
    echo "flatpak-builder is not installed. To install on Parrot OS / Debian:"
    echo "  sudo apt update && sudo apt install -y flatpak-builder"
    exit 1
fi

# 3. Ensure required GNOME runtime and SDK extensions are installed
echo "[2/4] Checking Flatpak runtimes..."
flatpak install -y --user flathub \
    org.gnome.Platform//47 \
    org.gnome.Sdk//47 \
    org.freedesktop.Sdk.Extension.rust-stable//24.08 \
    org.freedesktop.Sdk.Extension.node22//24.08 2>/dev/null || true

# 4. Build Flatpak
BUILD_DIR="$ROOT_DIR/.flatpak-build"
REPO_DIR="$ROOT_DIR/.flatpak-repo"

echo "[3/4] Building Flatpak package..."
flatpak-builder --force-clean --user --install-deps-from=flathub \
    --repo="$REPO_DIR" "$BUILD_DIR" "$SCRIPT_DIR/com.ednora.desktop.yml"

echo "[4/4] Creating single-bundle Flatpak file..."
flatpak build-bundle "$REPO_DIR" "$ROOT_DIR/ednora-x86_64.flatpak" com.ednora.desktop

echo "=== Successfully built ednora-x86_64.flatpak! ==="
echo "To test locally run:"
echo "  flatpak install --user --bundle $ROOT_DIR/ednora-x86_64.flatpak"
echo "  flatpak run com.ednora.desktop"

