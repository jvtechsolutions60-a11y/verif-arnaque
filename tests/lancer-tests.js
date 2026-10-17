// Lance les messages de test et écrit resultats.md
// Usage : node tests/lancer-tests.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const dossier = path.join(__dirname, "..");
const ctx = { module: undefined }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dossier, "regles.js"), "utf8") + "\nthis.REGLES = REGLES;", ctx);
const html = fs.readFileSync(path.join(dossier, "index.html"), "utf8");
const moteur = html.match(/<script id="moteur">([\s\S]*?)<\/script>/)[1];
vm.runInContext(moteur + "\nthis.Detecteur = Detecteur;", ctx);
const messages = JSON.parse(fs.readFileSync(path.join(__dirname, "messages.json"), "utf8"));
const noms = { faible: "Faible", moyen: "Moyen", eleve: "Élevé" };
let ok = 0, lignes = [];
for (const m of messages) {
  const r = ctx.Detecteur.analyser(m.texte, ctx.REGLES);
  const bon = r.niveau === m.attendu; if (bon) ok++;
  lignes.push(`| ${m.id} | ${m.titre} | ${noms[m.attendu]} | ${noms[r.niveau]} | ${r.score} | ${r.signaux.map(s => s.id).join(", ") || "aucun"} | ${bon ? "oui" : "**non**"} |`);
  console.log(`${bon ? "OK " : "KO "} ${m.id} attendu=${m.attendu} obtenu=${r.niveau} score=${r.score} :: ${r.signaux.map(s => s.id + "(" + s.extrait + ")").join(" ; ")}`);
}
const md = `# Résultats des tests\n\nRègles version ${ctx.REGLES.version}. ${ok} messages sur ${messages.length} ont le verdict attendu.\n\n` +
  `Relancer : \`node tests/lancer-tests.js\` depuis le dossier du projet. Les messages sont dans \`tests/messages.json\` (A = arnaque, L = légitime).\n\n` +
  `| N° | Message | Attendu | Obtenu | Points | Signaux repérés | Conforme |\n|---|---|---|---|---|---|---|\n` + lignes.join("\n") + "\n";
fs.writeFileSync(path.join(__dirname, "resultats.md"), md);
console.log(`\n${ok}/${messages.length} conformes`);
