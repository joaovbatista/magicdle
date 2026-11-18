// Picks today's and tomorrow's card (if missing) and stores image + answer in Firestore.
import admin from 'firebase-admin';

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = admin.firestore();
const POOL = 'game:paper lang:en -is:oversized (layout:normal OR layout:transform OR layout:modal_dfc OR layout:saga OR layout:adventure OR layout:split OR layout:flip OR layout:class OR layout:mutate OR layout:prototype OR layout:leveler)';
const EPOCH = Date.UTC(2026, 0, 1);
const day = off => new Date(Date.now() + off * 864e5).toISOString().slice(0, 10);

for (const off of [0, 1]) {
  const date = day(off);
  if ((await db.doc(`daily/${date}`).get()).exists) continue;
  let pick = null;
  for (let i = 0; i < 8 && !pick; i++) {
    const r = await fetch('https://api.scryfall.com/cards/random?q=' + encodeURIComponent(POOL), { headers: { 'User-Agent': 'Magicdle/1.0', Accept: 'application/json' } });
    const c = await r.json();
    const face = c.image_uris ? c : (c.card_faces || []).find(x => x.image_uris);
    if (face) pick = { c, face };
    await new Promise(ok => setTimeout(ok, 150));
  }
  if (!pick) throw new Error('No usable card found');
  const names = [...new Set([pick.c.name, pick.c.name.split(' // ')[0]].map(n => n.toLowerCase()))];
  await db.doc(`secret/${date}`).set({ title: pick.c.name, names });   // answer first
  await db.doc(`daily/${date}`).set({ date, number: Math.floor((Date.parse(date) - EPOCH) / 864e5) + 1, image: pick.face.image_uris.normal });
  console.log('Created', date);
}
