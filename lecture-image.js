/*
 * Lecture du texte d'une capture d'écran, sur l'appareil.
 * Utilise Tesseract.js (licence Apache 2.0), hébergé avec la page dans
 * vendor/tesseract/ : l'image ne quitte jamais l'appareil et aucun
 * service extérieur n'est contacté. Ni l'image ni son texte ne sont gardés.
 * Le moteur (environ 4 Mo) n'est chargé qu'au premier ajout d'image.
 * Les QR codes sont décodés aussi sur l'appareil : par le navigateur
 * quand il sait le faire, sinon par jsQR (licence Apache 2.0, dans
 * vendor/jsqr/). Le lien du QR code n'est jamais ouvert.
 */
var LectureImage = (function () {
  var base = new URL("vendor/tesseract/", document.baseURI).href;
  var chargement = null;
  var suivi = function () {};

  function chargerScript(src) {
    return new Promise(function (ok, ko) {
      var s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = ko;
      document.head.appendChild(s);
    });
  }

  // Agrandit les petites captures pour une meilleure lecture
  // zones : parties à masquer en blanc (QR codes), en fractions de l'image
  function preparer(fichier, zones) {
    return new Promise(function (ok) {
      var img = new Image();
      var url = URL.createObjectURL(fichier);
      img.onload = function () {
        var f = img.naturalWidth < 1200 ? 2 : 1;
        var c = document.createElement("canvas");
        c.width = img.naturalWidth * f; c.height = img.naturalHeight * f;
        var ctx = c.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, c.width, c.height);
        ctx.fillStyle = "#ffffff";
        (zones || []).forEach(function (z) { ctx.fillRect(z.x * c.width, z.y * c.height, z.l * c.width, z.h * c.height); });
        URL.revokeObjectURL(url);
        ok(c);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ok(fichier); };
      img.src = url;
    });
  }

  function lireTexte(fichier, progression, zones) {
    suivi = progression || function () {};
    if (!chargement) {
      chargement = (window.Tesseract ? Promise.resolve() : chargerScript(base + "tesseract.min.js")).then(function () {
        return Tesseract.createWorker("fra", 1, {
          workerPath: base + "worker.min.js",
          corePath: base + "core/",
          langPath: window.LECTURE_IMAGE_LANGUES || base + "lang/",
          cacheMethod: "none",
          logger: function (m) { if (m.status === "recognizing text") suivi(m.progress); }
        });
      });
      chargement.catch(function () { chargement = null; });
    }
    return Promise.all([chargement, preparer(fichier, zones)]).then(function (r) {
      return r[0].recognize(r[1]);
    }).then(function (res) {
      // Recolle les lignes coupées par la lecture
      return res.data.text.replace(/-\n(?=\S)/g, "-").replace(/[ \t]*\n[ \t]*/g, "\n").replace(/([^\n])\n(?!\n)/g, "$1 ").replace(/\n{3,}/g, "\n\n");
    });
  }

  // QR codes de l'image : renvoie la liste des contenus trouvés (souvent un lien)
  var chargementQR = null;
  function pixels(fichier) {
    return new Promise(function (ok, ko) {
      var img = new Image();
      var url = URL.createObjectURL(fichier);
      img.onload = function () {
        // Limite la taille pour rester rapide sur téléphone
        var f = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * f); c.height = Math.round(img.naturalHeight * f);
        var ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok({ image: img, donnees: ctx.getImageData(0, 0, c.width, c.height) });
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error("image illisible")); };
      img.src = url;
    });
  }
  // Rectangle englobant, agrandi d'un peu, en fractions de l'image
  function zone(points, larg, haut) {
    var xs = points.map(function (p) { return p.x; }), ys = points.map(function (p) { return p.y; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var m = 0.12 * Math.max(x1 - x0, y1 - y0);
    x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(larg, x1 + m); y1 = Math.min(haut, y1 + m);
    return { x: x0 / larg, y: y0 / haut, l: (x1 - x0) / larg, h: (y1 - y0) / haut };
  }
  function avecJsQR(d) {
    if (!chargementQR) {
      chargementQR = window.jsQR ? Promise.resolve() : chargerScript(new URL("vendor/jsqr/jsQR.min.js", document.baseURI).href);
      chargementQR.catch(function () { chargementQR = null; });
    }
    return chargementQR.then(function () {
      var r = jsQR(d.data, d.width, d.height, { inversionAttempts: "attemptBoth" });
      if (!r || !r.data) return { codes: [], zones: [] };
      var l = r.location;
      return { codes: [r.data], zones: [zone([l.topLeftCorner, l.topRightCorner, l.bottomLeftCorner, l.bottomRightCorner], d.width, d.height)] };
    });
  }
  function lireQR(fichier) {
    return pixels(fichier).then(function (p) {
      if (!("BarcodeDetector" in window)) return avecJsQR(p.donnees);
      return new BarcodeDetector({ formats: ["qr_code"] }).detect(p.image).then(function (trouves) {
        trouves = trouves.filter(function (c) { return c.rawValue; });
        if (!trouves.length) return avecJsQR(p.donnees);
        return {
          codes: trouves.map(function (c) { return c.rawValue; }),
          zones: trouves.map(function (c) { return zone(c.cornerPoints, p.image.naturalWidth, p.image.naturalHeight); })
        };
      }, function () { return avecJsQR(p.donnees); });
    }).catch(function () { return { codes: [], zones: [] }; });
  }

  // Lit d'abord les QR codes (rapide), puis le texte en masquant les QR codes,
  // qui sinon donnent des caractères sans suite. texte vaut null si la lecture a échoué.
  function lire(fichier, progression) {
    return lireQR(fichier).then(function (qr) {
      return lireTexte(fichier, progression, qr.zones).catch(function () { return null; }).then(function (texte) {
        return { texte: texte, codes: qr.codes };
      });
    });
  }

  return { lire: lire };
})();
