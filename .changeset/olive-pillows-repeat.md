---
"@hyperse/wizard": patch
---

fix: 🐛 break `g:build` self-recursion so the root build script delegates to `g:build-local` instead of calling itself
