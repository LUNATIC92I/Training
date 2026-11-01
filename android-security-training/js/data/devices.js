/* ==========================================================================
   devices.js : appareils pris en charge par GrapheneOS.
   Données relevées sur la page officielle https://grapheneos.org/faq
   (sections « Which devices are supported? », « Which devices are
   recommended? » et « How long will GrapheneOS support my device? »).
   IMPORTANT : cette liste doit être revérifiée à chaque mise à jour du site.
   Ne jamais ajouter un appareil qui ne figure pas sur la page officielle.
   endDate (AAAA-MM) = fin du support minimal garanti par Google, utilisée
   pour signaler les appareils en fin de vie.
   ========================================================================== */
window.ASG = window.ASG || {};
ASG.devices = {
  checked: "1er novembre 2026",
  source: "grapheneos.org/faq",
  supported: [
    { name: "Pixel 10a", code: "stallion", gen: "10e", end: "mars 2033", endDate: "2033-03", recommended: true },
    { name: "Pixel 10 Pro Fold", code: "rango", gen: "10e", end: "octobre 2032", endDate: "2032-10", recommended: true },
    { name: "Pixel 10 Pro XL", code: "mustang", gen: "10e", end: "août 2032", endDate: "2032-08", recommended: true },
    { name: "Pixel 10 Pro", code: "blazer", gen: "10e", end: "août 2032", endDate: "2032-08", recommended: true },
    { name: "Pixel 10", code: "frankel", gen: "10e", end: "août 2032", endDate: "2032-08", recommended: true },
    { name: "Pixel 9a", code: "tegu", gen: "9e", end: "avril 2032", endDate: "2032-04", recommended: true },
    { name: "Pixel 9 Pro Fold", code: "comet", gen: "9e", end: "août 2031", endDate: "2031-08", recommended: true },
    { name: "Pixel 9 Pro XL", code: "komodo", gen: "9e", end: "août 2031", endDate: "2031-08", recommended: true },
    { name: "Pixel 9 Pro", code: "caiman", gen: "9e", end: "août 2031", endDate: "2031-08", recommended: true },
    { name: "Pixel 9", code: "tokay", gen: "9e", end: "août 2031", endDate: "2031-08", recommended: true },
    { name: "Pixel 8a", code: "akita", gen: "8e", end: "mai 2031", endDate: "2031-05", recommended: true },
    { name: "Pixel 8 Pro", code: "husky", gen: "8e", end: "octobre 2030", endDate: "2030-10", recommended: true },
    { name: "Pixel 8", code: "shiba", gen: "8e", end: "octobre 2030", endDate: "2030-10", recommended: true },
    { name: "Pixel Fold", code: "felix", gen: "7e (Tensor G2)", end: "juin 2028", endDate: "2028-06" },
    { name: "Pixel Tablet", code: "tangorpro", gen: "7e (Tensor G2)", end: "juin 2028", endDate: "2028-06" },
    { name: "Pixel 7a", code: "lynx", gen: "7e", end: "mai 2028", endDate: "2028-05" },
    { name: "Pixel 7 Pro", code: "cheetah", gen: "7e", end: "octobre 2027", endDate: "2027-10" },
    { name: "Pixel 7", code: "panther", gen: "7e", end: "octobre 2027", endDate: "2027-10" },
    { name: "Pixel 6a", code: "bluejay", gen: "6e", end: "juillet 2027", endDate: "2027-07" },
    { name: "Pixel 6 Pro", code: "raven", gen: "6e", end: "octobre 2026", endDate: "2026-10" },
    { name: "Pixel 6", code: "oriole", gen: "6e", end: "octobre 2026", endDate: "2026-10" }
  ],
  unsupported: [
    { name: "Pixel 5a", code: "barbet", gen: "5e" }, { name: "Pixel 5", code: "redfin", gen: "5e" },
    { name: "Pixel 4a (5G)", code: "bramble", gen: "5e" }, { name: "Pixel 4a", code: "sunfish", gen: "4e" },
    { name: "Pixel 4 XL", code: "coral", gen: "4e" }, { name: "Pixel 4", code: "flame", gen: "4e" },
    { name: "Pixel 3a XL", code: "bonito", gen: "3e" }, { name: "Pixel 3a", code: "sargo", gen: "3e" },
    { name: "Pixel 3 XL", code: "crosshatch", gen: "3e" }, { name: "Pixel 3", code: "blueline", gen: "3e" },
    { name: "Pixel 2 XL", code: "taimen", gen: "2e" }, { name: "Pixel 2", code: "walleye", gen: "2e" },
    { name: "Pixel XL", code: "marlin", gen: "1re" }, { name: "Pixel", code: "sailfish", gen: "1re" }
  ]
};
