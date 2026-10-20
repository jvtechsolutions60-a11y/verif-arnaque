/*
 * Vérif'Arnaque : service de la page, pour l'appli installée.
 * - Garde une copie des fichiers du site : la page marche sans internet.
 * - Reçoit un message ou une capture partagés depuis une autre appli et
 *   les garde sur l'appareil le temps de les afficher. Rien n'est envoyé.
 * Changer VERSION à chaque version du site pour renouveler la copie.
 */
var VERSION = "1.3.0";
var CACHE = "verif-arnaque-" + VERSION;
var FICHIERS = [
  "./", "index.html", "style.css", "regles.js", "lecture-image.js", "arnaques.html",
  "manifest.webmanifest", "logo/logo-icone.svg", "logo/icone-192.png", "logo/icone-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k.indexOf("verif-arnaque-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function recevoirPartage(requete) {
  return requete.formData().then(function (f) {
    var texte = [f.get("titre"), f.get("texte"), f.get("lien")].filter(function (x) { return typeof x === "string" && x.trim(); }).join("\n");
    var image = f.get("image");
    return caches.open("verif-partage").then(function (c) {
      var t = [c.put("texte", new Response(texte))];
      if (image && image.size) t.push(c.put("image", new Response(image, { headers: { "Content-Type": image.type } })));
      return Promise.all(t);
    });
  }).catch(function () {}).then(function () {
    return Response.redirect(new URL("./?partage=1", self.registration.scope).href, 303);
  });
}

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (e.request.method === "POST" && url.pathname.slice(-8) === "/partage") {
    e.respondWith(recevoirPartage(e.request));
    return;
  }
  if (e.request.method !== "GET") return;

  // La page est toujours servie depuis la copie, sans ce qui suit le « ? » :
  // rien de ce qui est dans l'adresse ne part vers le serveur.
  var cle = e.request.mode === "navigate" ? new Request(url.origin + url.pathname) : e.request;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(cle, { ignoreSearch: e.request.mode === "navigate" }).then(function (copie) {
      var frais = fetch(cle).then(function (r) {
        if (r && r.ok && r.type === "basic") c.put(cle, r.clone());
        return r;
      });
      if (copie) { e.waitUntil(frais.catch(function () {})); return copie; }
      return frais.catch(function (err) {
        if (e.request.mode === "navigate") return c.match("index.html");
        throw err;
      });
    });
  }));
});
