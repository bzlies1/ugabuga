#!/usr/bin/env bash
set -euo pipefail

# Installs (or refreshes) a Walker/XDG launcher entry for the latest
# T3 Code AppImage built into ./release. Re-run after every new release
# to point the launcher at the newest version.
#
# Listed in Walker as "ugabuga" so it doesn't collide with the AUR
# t3code-bin package's "T3 Code" entry.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="$REPO_ROOT/release"
ICON_SRC="$REPO_ROOT/assets/prod/black-universal-1024.png"

APPS_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/512x512/apps"
DESKTOP_FILE="$APPS_DIR/ugabuga.desktop"
ICON_DEST="$ICON_DIR/ugabuga.png"

shopt -s nullglob
candidates=("$RELEASE_DIR"/T3-Code-*-x86_64.AppImage)
shopt -u nullglob

if [[ ${#candidates[@]} -eq 0 ]]; then
  echo "error: no T3-Code-*-x86_64.AppImage found in $RELEASE_DIR" >&2
  exit 1
fi

appimage="$(printf '%s\n' "${candidates[@]}" | sort -V | tail -n1)"

if [[ ! -f "$ICON_SRC" ]]; then
  echo "error: icon source missing: $ICON_SRC" >&2
  exit 1
fi

chmod +x "$appimage"
mkdir -p "$APPS_DIR" "$ICON_DIR"
cp -f "$ICON_SRC" "$ICON_DEST"

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Type=Application
Name=ugabuga
GenericName=AI Coding Agent GUI
Comment=Local T3 Code dev build (./release AppImage)
Exec=$appimage %U
Icon=ugabuga
Terminal=false
Categories=Development;IDE;
StartupWMClass=T3 Code
EOF

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APPS_DIR" >/dev/null 2>&1 || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" >/dev/null 2>&1 || true
fi

echo "installed: $DESKTOP_FILE"
echo "  exec:    $appimage"
echo "  icon:    $ICON_DEST"
