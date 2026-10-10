/* ÉBÈNE IMMOBILIER — interactions */
const LISTINGS = [
  { id:"villa-emeraude", nom:"Villa Émeraude", lieu:"Louis, Libreville", transaction:"vente",
    type:"villa", prix:85000000, prixTxt:"85 000 000 FCFA", img:"images/villa-emeraude.jpg",
    chambres:5, sdb:4, surface:"450 m²", desc:"Villa standing avec piscine, jardin tropical et double garage." },
  { id:"appart-manguiers", nom:"Appartement Les Manguiers", lieu:"Glass, Libreville", transaction:"location",
    type:"appartement", prix:450000, prixTxt:"450 000 FCFA", parMois:true, img:"images/appart-manguiers.jpg",
    chambres:3, sdb:2, surface:"120 m²", desc:"Bel appartement lumineux, résidence sécurisée avec gardiennage." },
  { id:"studio-palmier", nom:"Studio Le Palmier", lieu:"Centre-ville, Libreville", transaction:"location",
    type:"studio", prix:180000, prixTxt:"180 000 FCFA", parMois:true, img:"images/studio-palmier.jpg",
    chambres:1, sdb:1, surface:"45 m²", desc:"Studio meublé idéal jeune actif, proche de toutes commodités." },
  { id:"villa-hibiscus", nom:"Villa Hibiscus", lieu:"Angondjé, Libreville", transaction:"location",
    type:"villa", prix:1200000, prixTxt:"1 200 000 FCFA", parMois:true, img:"images/villa-hibiscus.jpg",
    chambres:4, sdb:3, surface:"380 m²", desc:"Villa d'exception avec piscine à débordement, quartier prisé." },
  { id:"duplex-cocotiers", nom:"Duplex Les Cocotiers", lieu:"Alibandeng, Libreville", transaction:"vente",
    type:"duplex", prix:62000000, prixTxt:"62 000 000 FCFA", img:"images/duplex-cocotiers.jpg",
    chambres:4, sdb:3, surface:"210 m²", desc:"Duplex moderne avec terrasse, finitions haut standing." },
];

const fmt = n => n.toLocaleString("fr-FR");

function carteBien(b){
  const badge = b.transaction === "vente" ? "Vente" : "Location";
  const cls = b.transaction === "vente" ? "" : " badge--location";
  const lien = b.id === "villa-emeraude" ? "bien.html" : "contact.html";
  return `<article class="carte-bien reveal">
    <a href="${lien}"><div class="carte-img">
      <img src="${b.img}" alt="${b.nom}" loading="lazy">
      <span class="badge${cls}">${badge}</span>
    </div></a>
    <div class="carte-corps">
      <h3><a href="${lien}">${b.nom}</a></h3>
      <p class="carte-lieu">${b.lieu}</p>
      <p class="carte-prix">${b.prixTxt}${b.parMois ? " <small>/ mois</small>" : ""}</p>
      <div class="carte-specs">
        <span><b>${b.chambres}</b> ch.</span>
        <span><b>${b.sdb}</b> sdb</span>
        <span><b>${b.surface}</b></span>
      </div>
    </div>
  </article>`;
}

/* Catalogue + filtres */
function initCatalogue(){
  const grille = document.getElementById("grille-catalogue");
  if(!grille) return;
  const fT = document.getElementById("f-transaction"),
        fTy = document.getElementById("f-type"),
        fQ = document.getElementById("f-quartier"),
        fB = document.getElementById("f-budget"),
        compte = document.getElementById("compte");
  // Pré-remplissage depuis la recherche d'accueil
  const p = new URLSearchParams(location.search);
  if(p.get("transaction")) fT.value = p.get("transaction");
  if(p.get("type")) fTy.value = p.get("type");
  if(p.get("quartier")) fQ.value = p.get("quartier");

  function filtrer(){
    let res = LISTINGS.filter(b =>
      (!fT.value || b.transaction === fT.value) &&
      (!fTy.value || b.type === fTy.value) &&
      (!fQ.value || b.lieu.toLowerCase().includes(fQ.value.toLowerCase())) &&
      (!fB.value || b.prix <= +fB.value)
    );
    compte.textContent = res.length + (res.length > 1 ? " biens trouvés" : " bien trouvé");
    grille.innerHTML = res.length ? res.map(carteBien).join("")
      : `<p class="vide">Aucun bien ne correspond à ces critères.<br>Contactez-nous : nous cherchons pour vous.</p>`;
    observerReveals();
  }
  [fT,fTy,fQ,fB].forEach(el => el.addEventListener("change", filtrer));
  document.getElementById("f-reset").addEventListener("click", () => {
    [fT,fTy,fQ,fB].forEach(el => el.value = ""); filtrer();
  });
  filtrer();
}

/* Menu mobile */
function initMenu(){
  const burger = document.getElementById("burger"), nav = document.getElementById("nav");
  if(!burger) return;
  burger.addEventListener("click", () => {
    nav.classList.toggle("ouvert"); burger.classList.toggle("ouvert");
  });
}

/* Header au scroll */
function initHeader(){
  const h = document.getElementById("header");
  const onScroll = () => h.classList.toggle("header--scrolled", scrollY > 40);
  addEventListener("scroll", onScroll); onScroll();
}

/* Apparition au scroll */
let observer;
function observerReveals(){
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
}
function initReveals(){
  observer = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }
  }), {threshold:.12});
  observerReveals();
}

/* Formulaires (démo : confirmation immédiate) */
function initFormulaires(){
  document.querySelectorAll("form[data-demo]").forEach(f => {
    f.addEventListener("submit", e => {
      e.preventDefault();
      f.querySelector(".form-ok").style.display = "block";
      f.querySelectorAll("input,textarea,select").forEach(i => i.value = "");
      f.scrollIntoView({behavior:"smooth", block:"center"});
    });
  });
}

/* Divers */
function initDivers(){
  const y = document.getElementById("annee"); if(y) y.textContent = new Date().getFullYear();
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    if(a.getAttribute("href") === page) a.classList.add("actif");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu(); initHeader(); initReveals(); initCatalogue(); initFormulaires(); initDivers();
});
