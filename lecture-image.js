/*
 * Lecture du texte d'une capture d'écran, sur l'appareil.
 * Utilise Tesseract.js (licence Apache 2.0), hébergé avec la page dans
 * vendor/tesseract/ : l'image ne quitte jamais l'appareil et aucun
 * service extérieur n'est contacté. Rien n'est mis en cache.
 * Le moteur (environ 4 Mo) n'est chargé qu'au premier ajout d'image.
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
  function preparer(fichier) {
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
        URL.revokeObjectURL(url);
        ok(c);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ok(fichier); };
      img.src = url;
    });
  }

  function lire(fichier, progression) {
    suivi = progression || function () {};
    if (!chargement) {
      chargement = (window.Tesseract ? Promise.resolve() : chargerScript(base + "tesseract.min.js")).then(function () {
        return Tesseract.createWorker("fra", 1, {
          workerPath: base + "worker.min.js",
          corePath: base + "core/",
          langPath: base + "lang/",
          cacheMethod: "none",
          logger: function (m) { if (m.status === "recognizing text") suivi(m.progress); }
        });
      });
      chargement.catch(function () { chargement = null; });
    }
    return Promise.all([chargement, preparer(fichier)]).then(function (r) {
      return r[0].recognize(r[1]);
    }).then(function (res) {
      // Recolle les lignes coupées par la lecture
      return res.data.text.replace(/-\n(?=\S)/g, "-").replace(/[ \t]*\n[ \t]*/g, "\n").replace(/([^\n])\n(?!\n)/g, "$1 ").replace(/\n{3,}/g, "\n\n");
    });
  }

  return { lire: lire };
})();
