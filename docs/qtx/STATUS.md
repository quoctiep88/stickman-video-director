# QTx status

- Phase: **P01 — Upstream Full Parity; CLOSED PASS for requested local technical acceptance scope**. P02 not begun.
- Upstream/P00 baseline: `105b134f80fa11abe7a012f713712d39f20936f3`; P01 starting QTx SHA: `79e06cf8258b09458b51ac5dd8b6948ce4da8bb7`. Fix `bef33b1`, parity handoff `ee50749`; resolve final closure candidate with `git rev-parse HEAD`.
- Branch `main`; canonical checkout unchanged; origin `https://github.com/quoctiep88/stickman-video-director.git`; upstream history/license/assets preserved; `core.autocrlf=false`. No new upstream merge.
- Evidence/navigation: [PARITY](PARITY.md), [acceptance results](acceptance/P01-RESULTS.md), [approved Director prompts](acceptance/P01-DIRECTOR-PROMPTS.md). All eleven styles mapped; A1 approved prompt package, A6 reference/finish, B3/B4 focused runtime checks, B5 four-frame smoke complete.
- B1 explicitly user-approved technical acceptance: 33.333333s/400 frames, MP4/SRT/VTT/report in ignored `productions/p01/b1/output/`; decode passes. Changed reviewed input blocked; exact restoration allowed. Final-output reuse and 8/8 cached-shot reconstruction pass with identical MP4 SHA256. Not publication approval.
- Tests: Node 197/200 pass; Python 19/20 pass; root 11/13 pass; doctor 7/7; A6 references 3/3. Residual failures: symlink privilege and two stale upstream README assertions; no demonstrated QTx regression.
- Limits: external generation untested and isolated with local fixtures; synthetic timings/bed do not establish polished speech alignment or listening acceptance; B3 private original absent; B5 portrait pending upstream; A6 exact production typography needs prescribed fonts or explicit approved substitute. No paid calls/large models, accepted upstream asset changes or product extensions.
- Next only on user request: **P02 — QTx Series Production Workflow**.
