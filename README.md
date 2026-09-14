# RCScoring — project page

Anonymous supplementary page for the RCScoring (ride-comfort) submission. No
author name, no affiliation, no lab name appears anywhere in this folder.

The sibling page ("Driving on Radar Alone") lives at `../../RadarAD/web/`. The two
share `css/style.css` and `js/app.js` verbatim; that page sets
`<html data-paper="radarad">` to swap its accent to cyan, while this page keeps
the amber of a painted centre line.

**The clips are not here yet.** `videos/` and `posters/` are empty and the
Recordings section says so. The 22 quad-view clips that were produced first
belong to RadarAD and now live under `../../RadarAD/web/`.

```
web/
  index.html            structure only — you rarely need to touch this
  css/style.css
  js/app.js             builds the table and the grid from the data file
  data/recordings.js    <- THE ONLY FILE YOU NORMALLY EDIT
  figures/test_site.jpg
  posters/*.jpg         one poster frame per recording (empty for now)
  videos/*.mp4          720p web copies of the quad-view clips (empty for now)
  .nojekyll             tells GitHub Pages to serve files starting with _
```

## Preview it locally

```bash
cd web && python3 -m http.server 8000
# then open http://localhost:8000
```

## Add the recordings

Produce the quad-view clips and their web copies with the two scripts under
`../../RadarAD/` — both take their paths from the environment:

```bash
cd ../../RadarAD
SRC=/path/to/rcscoring/Video      OUT=/path/to/rcscoring/Video_quad ./make_quad.sh
SRC=/path/to/rcscoring/Video_quad WEB=../RCScoring/web              ./make_web_assets.sh
```

Then list them in `data/recordings.js`. Every clip is one line:

```js
{ id: "MAN_20260911_112010", clock: "11:20:10", seconds: 60,
  scenario: "S1", run: "baseline", speed: 30, side: "left",
  note: "", hidden: false },
```

| field | what to put |
|---|---|
| `scenario` | `"S1"`–`"S5"`, `"A1"`–`"A3"`, or `""` while undecided |
| `run` | `"baseline"` (w_comfort = 0), `"comfort"`, or `""` |
| `speed` | target speed in km/h, as a number |
| `side` | `"left"` / `"right"` / `""` |
| `note` | one line shown under the clip — failure reasons go here |
| `hidden` | `true` removes the clip from the page |

The scenario table's "Clips" column, the filter chips and their counts, and the
"N of N recordings" line all recompute from this file. Clips you have not
tagged yet show up under the **Unassigned** filter, so nothing goes missing.

The scenario list itself (`SCENARIOS`, at the top of the same file) carries the
code, title, one-line description and target speeds. Edit the wording there.

## Fill in before you publish

- `index.html` — the paragraph under **What this page holds** is a placeholder;
  replace it with the abstract.
- `index.html` — the BibTeX block under **Citation**.
- The page has `<meta name="robots" content="noindex">` so search engines skip
  it. Remove that line after the paper is accepted and de-anonymised.

## Publish on GitHub Pages

Use an account that is not tied to your name or the lab — the account name ends
up in the URL, and this page and the RadarAD one should not sit under the same
account if you would rather reviewers not connect the two submissions.

```bash
cd web
git init -b main
git add -A
git commit -m "RCScoring project page"
git remote add origin https://github.com/<anon-account>/<anon-account>.github.io.git
git push -u origin main
```

In the repository, **Settings → Pages → Source: Deploy from a branch → main /
(root)**. The page appears at `https://<anon-account>.github.io/` within a
minute or two.

A user-site repo (`<account>.github.io`) gives the shortest URL. A project repo
works too and lands at `https://<anon-account>.github.io/<repo>/`; all paths in
this folder are relative, so both work unchanged.

## Size

720p H.264 at CRF 28 comes out around 5 MB per minute, so a campaign the size of
RadarAD's (22 clips, 21 minutes) lands near 120 MB — comfortably inside GitHub's
1 GB soft limit on repository size. To re-encode at a different quality:

```bash
cd ../../RadarAD
SRC=/path/to/rcscoring/Video_quad WEB=../RCScoring/web CRF=25 FORCE=1 ./make_web_assets.sh
```

## Anonymity checklist

- [ ] No author, affiliation or lab name in any file — including commit author
      (`git config user.name` / `user.email` in this repo)
- [ ] The GitHub account name does not identify you
- [ ] If the RCScoring clips also show faces in the cabin views, decide the same
      question again before publishing — for RadarAD you chose to keep them.
- [ ] `noindex` stays until the paper is de-anonymised
