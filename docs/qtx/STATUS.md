# QTx status

- Phase: **P00 — Fork, Baseline & Project Contract; closure checks complete, commit/push pending**. P01 has not begun.
- Baseline: `105b134f80fa11abe7a012f713712d39f20936f3`; retry starting SHA: `34d8dca69cafe1ec9dfc2bd6adbc3660c88b91e5`. Resolve final handoff SHA with `git rev-parse HEAD`.
- Canonical checkout: `D:\Programing\vibecode2026\qtx-video-director`; branch `main`; upstream ancestry preserved; `core.autocrlf=false`.
- Remotes: `origin=https://github.com/quoctiep88/stickman-video-director.git` (fetched); `upstream=https://github.com/kaomei/stickman-video-director.git`. Push pending post-closure commit.
- Environment: Node 22.14.0, npm 10.9.2, Python 3.12.3; FFmpeg/FFprobe 9.0.2 installed by winget and resolved using persisted PATH in fresh test processes. Doctor's seven local checks pass. Symlink privilege absent; external services unverified.
- Baseline: Node **192/200 pass, 8 fail, 0 skip**; Python **19/20 pass, 1 error**; root Python verification **10/13 pass, 3 fail**; three A6 references pass. All remaining failures classified as UPSTREAM_WINDOWS, ENVIRONMENT or STALE_UPSTREAM_TEST_OR_DOC; none introduced by QTx. See [BASELINE](BASELINE.md).
- QTx delta remains documentation/project-contract plus productions ignore rule only. No runtime, test, reference or approved asset changes; no full production parity claim.
- Style inventory and entry points: [UPSTREAM](UPSTREAM.md). Next phase only on request: **P01 — Upstream Full Parity**.
