export const business = {
  /** Customer-facing brand. */
  name: "VALLIS",
  /** Registered company that owns the VALLIS brand. */
  company: "Buildmart India",
  phone: "+91 9990069207",
  tel: "+919990069207",
  email: "info@vallisglobal.in",
  address: "A14/15, Golf Course Rd, DLF Phase 1, Gurugram, Haryana 122002",
  origin: "https://www.vallisglobal.in",
  maps: "https://www.google.com/maps/search/?api=1&query=A14%2F15%2C%20Golf%20Course%20Rd%2C%20DLF%20Phase%201%2C%20Gurugram%2C%20Haryana%20122002",
};
export const offices = [
  {
    city: "Gurugram",
    label: "India office",
    address: business.address,
    phone: business.phone,
    tel: business.tel,
    maps: business.maps,
  },
  {
    city: "Dubai",
    label: "UAE office",
    address: "Aspin Commercial Tower, Sheikh Zayed Road, Business Bay, Dubai, UAE",
    phone: "+971 551504568",
    tel: "+971551504568",
    maps: "https://www.google.com/maps/search/?api=1&query=Aspin%20Commercial%20Tower%2C%20Sheikh%20Zayed%20Road%2C%20Business%20Bay%2C%20Dubai",
  },
];
export const asset = (name: string) => `/images/catalogue/${name}.webp`;
/** Photographs (rather than transparent product cut-outs) should fill their frame. */
const PHOTO_IMAGES = ["vallis-legacy-p17-x1343", "vallis-legacy-p28-x2408", "vallis-legacy-p37-x3374", "vallis-legacy-p5-x134", "vallis-p13-x344", "vallis-p32-x1118", "vallis-p60-x2078", "vallis-p69-x2356", "vallis-p77-x2613"];
export const isPhoto = (src: string) =>
  src.includes("/generated/") || src.includes("/supplied/") || src.includes("/vallis-rail-") || PHOTO_IMAGES.some((name) => src.includes(`/${name}.`));
/** AI-generated art-directed imagery (see scripts/image-generation). */
export const generated = (name: string) => `/images/generated/${name}.webp`;
/** Client-supplied photographs, upscaled and optimised by scripts/optimize-supplied-photos.py. */
export const supplied = (name: string) => `/images/supplied/${name}.webp`;
// The Legacy Series handle PDF is withheld until a VALLIS-branded edition is supplied.
export const catalogues = [
  {
    name: "VALLIS Architectural Hardware",
    file: "/vallisglobal products pdf.pdf",
    note: "Locks, door hardware, glass fittings and railing components",
    size: "14.9 MB",
  },
  {
    name: "VALLIS Glass Railing Systems",
    file: "/railings pdf.pdf",
    note: "Glass railing systems, spigots and architectural applications",
    size: "23.7 MB",
  },
];
export const categories = [
  {
    slug: "hotel-digital-locks",
    name: "Hotel & Digital Locks",
    short: "Hotel & Digital Locks",
    number: "01",
    image: asset("vallis-p13-x372"),
    scene: asset("vallis-p13-x344"),
    intro:
      "A considered welcome. Explore hotel access and residential digital locking solutions from the VALLIS catalogue.",
    applications: [
      "Hotel guest rooms",
      "Residential entrances",
      "Apartment doors",
    ],
    considerations:
      "Choose access methods, door thickness and mortise compatibility for the specific model. Confirm the installation requirements before ordering.",
    icon: "lock",
  },
  {
    slug: "door-hardware",
    name: "Door Hardware",
    short: "Door Hardware",
    number: "02",
    image: asset("vallis-p32-x1133"),
    scene: generated("door-hardware-scene"),
    intro:
      "The detail you touch every day. Discover stainless-steel lever handles and architectural pull handles in a choice of documented finishes.",
    applications: [
      "Residential interiors",
      "Commercial doors",
      "Glass entrances",
    ],
    considerations:
      "Match handle dimensions, centres, door material and finish to your door schedule.",
    icon: "handle",
  },
  {
    slug: "door-closers",
    name: "Door Closers",
    short: "Door Closers",
    number: "03",
    image: asset("vallis-p70-x2408"),
    scene: asset("vallis-p69-x2356"),
    intro:
      "Controlled movement, considered design. Overhead and concealed door closers for a range of door requirements.",
    applications: [
      "Office entrances",
      "Hospitality corridors",
      "Interior doors",
    ],
    considerations:
      "Select the closer against door weight, width and mounting conditions. Listed weight parameters apply to each model individually.",
    icon: "closer",
  },
  {
    slug: "spider-fittings",
    name: "Spider Fittings",
    short: "Spider Fittings",
    number: "04",
    image: asset("vallis-p61-x2131"),
    scene: asset("vallis-p60-x2078"),
    intro:
      "Let the glass take centre stage. Stainless-steel fin-type spider fittings for point-supported architectural glass.",
    applications: ["Glass façades", "Glazed entrances", "Glass partitions"],
    considerations:
      "Glass preparation, bolt selection and structural design need project-specific confirmation by the responsible designer.",
    icon: "spider",
  },
  {
    slug: "glass-fittings",
    name: "Glass Fittings",
    short: "Glass Fittings",
    number: "05",
    image: asset("vallis-p85-x2907"),
    scene: generated("glass-fittings-scene"),
    intro:
      "Quietly engineered for clarity. Patch fittings, shower hinges and canopy connectors for refined glass installations.",
    applications: ["Glass doors", "Shower enclosures", "Glass canopies"],
    considerations:
      "Confirm glass thickness, fixing details, opening angles and component compatibility for the selected fitting.",
    icon: "glass",
  },
  {
    slug: "glass-railings",
    name: "Glass Railings",
    short: "Glass Railings",
    number: "06",
    image: asset("vallis-rail-p24-x180"),
    scene: asset("vallis-rail-p10-x82"),
    intro:
      "Open views, elegant lines. Explore VALLIS glass railing applications and spigot components.",
    applications: ["Staircases", "Balconies", "Terraces"],
    considerations:
      "Railing systems require project-specific structural and fixing design. Discuss glass selection, substrate and local requirements with your project team.",
    icon: "railing",
  },
  {
    slug: "furniture-hardware",
    name: "Furniture Hardware",
    short: "Furniture Hardware",
    number: "07",
    image: asset("vallis-legacy-p17-x1395"),
    scene: generated("furniture-hardware-scene"),
    intro:
      "Small details. Lasting character. VALLIS Legacy Series cabinet handles, concealed handles and knobs for carefully finished interiors.",
    applications: ["Cabinetry", "Wardrobes", "Furniture"],
    considerations:
      "Select the model, finish and size together. Verify fixing centres and suitability for the cabinet before ordering.",
    icon: "furniture",
  },
  {
    slug: "fhc-doors",
    name: "FHC Doors",
    short: "FHC Doors",
    number: "08",
    image: asset("fhc-200"),
    scene: generated("shaft-doors-scene"),
    intro:
      "Purposeful access for building services. Explore the VALLIS range of FHC and electrical shaft doors.",
    applications: ["Electrical shafts", "Service risers", "Utility access"],
    considerations:
      "Confirm opening sizes, leaf configuration, ventilation and required compliance documentation. No fire rating is stated without model-specific test evidence.",
    icon: "door",
  },
  {
    slug: "upvc-windows",
    name: "uPVC Windows",
    short: "uPVC Windows",
    number: "09",
    image: supplied("upvc-casement-door"),
    scene: generated("upvc-windows-scene"),
    intro:
      "Quiet, light-filled spaces. uPVC casement and sliding windows and doors, French doors and slide & fold doors, engineered for insulation, security and zero maintenance.",
    applications: ["Homes & villas", "Apartments", "Offices"],
    considerations:
      "Window type, opening size, glass specification and hardware are selected for each opening. Share drawings or site dimensions so our team can recommend the right configuration, then confirm acoustic and thermal values for the chosen system.",
    icon: "window",
  },
  {
    slug: "shower-cubicles",
    name: "Shower Cubicles",
    short: "Shower Cubicles",
    number: "10",
    image: supplied("shower-cubicle-4"),
    scene: supplied("shower-cubicle-1"),
    intro:
      "Calm, frameless enclosures. Hinged, corner and sliding shower cubicles assembled with VALLIS shower hinges, glass connectors and shower handles.",
    applications: ["Residential bathrooms", "Hotel bathrooms", "Spa & wellness"],
    considerations:
      "Confirm the opening size, glass thickness, wall and floor conditions and door swing before fabrication. Hinges and rollers are selected for the weight of each glass panel.",
    icon: "glass",
  },
];
export type Category = (typeof categories)[number];
export interface Product {
  slug: string;
  category: string;
  name: string;
  model: string;
  brand: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  source: string;
  /** PDF the specifications come from, when one is published on the site. */
  sourceFile?: string;
  page?: number;
  applications: string[];
}
const v = "VALLIS Architectural Hardware catalogue";
const legacy = "VALLIS Legacy Series catalogue";
const windows = "VALLIS uPVC window systems";
const designer = "VALLIS designer lever handle collection";
const SOURCE_FILES: Record<string, string> = {
  [v]: "/vallisglobal products pdf.pdf",
};
const p = (
  category: string,
  model: string,
  name: string,
  img: string,
  page: number,
  description: string,
  specs: Record<string, string>,
  features: string[] = [],
  brand = "VALLIS",
  source = v,
): Product => ({
  slug: model.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  category,
  model,
  name,
  brand,
  image: asset(img),
  images: [asset(img)],
  description,
  specs,
  features,
  source,
  sourceFile: SOURCE_FILES[source],
  page,
  applications: categories.find((c) => c.slug === category)?.applications || [],
});
const lock = "hotel-digital-locks",
  door = "door-hardware",
  closer = "door-closers",
  spider = "spider-fittings",
  glass = "glass-fittings",
  rail = "glass-railings",
  furniture = "furniture-hardware",
  shaft = "fhc-doors",
  win = "upvc-windows";
const lever = (n: number) => asset(`vallis-lever-${String(n).padStart(2, "0")}`);
/** Designer lever handles: product photographs, numbered as supplied (vallis-lever-01 … 13). */
const designerHandle = (
  model: string,
  name: string,
  shots: number[],
  description: string,
  specs: Record<string, string>,
  features: string[],
): Product => ({
  ...p(door, model, name, "", 0, description, specs, features, "VALLIS", designer),
  image: lever(shots[0]),
  images: shots.map(lever),
  page: undefined,
});
/** Shared performance specification of the multi-chamber uPVC profile system. */
const upvcSystem = {
  Profile: "60 mm multi-chamber uPVC (up to 6 chambers)",
  Reinforcement: "Galvanised steel",
  Sealing: "Twin EPDM gaskets for air and water tightness",
  Glazing: "Double-glazed unit (other glass options on request)",
  "Noise reduction": "Up to 47 dB, depending on glazing",
  "Thermal insulation": "U-value as low as 1.0 W/m²K, depending on glazing",
  Formulation: "Lead-free calcium-zinc stabilisers, TiO₂ UV protection",
};
/** Products illustrated by photographs rather than a catalogue page. */
const photoProduct = (
  category: string,
  model: string,
  name: string,
  images: string[],
  description: string,
  specs: Record<string, string>,
  features: string[],
  source: string,
): Product => ({
  ...p(category, model, name, "", 0, description, specs, features, "VALLIS", source),
  image: images[0],
  images,
  page: undefined,
});
const windowProduct = (
  type: string,
  name: string,
  description: string,
  specs: Record<string, string>,
  features: string[],
  images = [generated(`upvc-${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)],
): Product => photoProduct(win, `uPVC ${type}`, name, images, description, { ...specs, ...upvcSystem }, features, windows);
const showers = "VALLIS shower cubicle systems";
/** Shower cubicle hardware shared by the hinged and corner enclosures. */
const showerHardware = {
  Glass: "Clear toughened glass — thickness confirmed per project",
  Hardware: "VALLIS shower hinges, glass-to-glass connectors and shower handles",
  Finishes: "Chrome / satin — confirm per project",
};
export const products: Product[] = [
  p(
    lock,
    "VACS 07",
    "RFID Hotel Lock",
    "vallis-p5-x101",
    6,
    "A hotel locking solution with contactless RFID access and a mechanical override.",
    {
      Mechanism: "Electro-mechanical mortise locking",
      "Door thickness": "40–50 mm",
      Finishes: "Silver / Black / Gold",
      RFID: "13.56 MHz",
      Power: "4 × AA batteries",
    },
    [
      "Offline installation",
      "Mechanical emergency opening",
      "LED access indication",
    ],
  ),
  p(
    lock,
    "VACS 09",
    "Hotel Access Lock",
    "vallis-p7-x168",
    8,
    "An aluminium-alloy hotel handle and panel with contactless card access.",
    {
      "Door thickness": "40–50 mm",
      Finishes: "Black / Coffee Gold",
      RFID: "13.56 MHz",
      Power: "4 × AA batteries",
    },
    [
      "Contactless RFID access",
      "Mechanical override",
      "Access-event audit capability",
    ],
  ),
  p(
    lock,
    "VACS 12",
    "Fingerprint Digital Lock",
    "vallis-p13-x372",
    14,
    "A black digital entrance lock with fingerprint, password, card, app and key access.",
    {
      Material: "Aluminium alloy",
      "Product size": "260 × 60 × 130 mm",
      "Door thickness": "30–65 mm",
      Mortise: "5050",
      Finish: "Black",
      Power: "4 × AA (1.5 V) alkaline batteries",
    },
    [
      "Fingerprint, password and Mifare card access",
      "Tuya Wi-Fi / Bluetooth versions listed",
      "Type-C emergency charging",
      "Mechanical backup key",
    ],
  ),
  p(
    lock,
    "VACS 13",
    "Camera Digital Lock",
    "vallis-p15-x438",
    16,
    "A digital lock combining a glass screen with fingerprint and camera access features.",
    {
      Material: "Aluminium alloy",
      "Product size": "370 × 73 mm",
      "Door thickness": "30–55 mm",
      Mortise: "6068 lock body",
      Power: "4 × AA (1.5 V) alkaline batteries",
    },
    [
      "Fingerprint, password, card and key access",
      "Tuya app and camera listed",
      "Type-C emergency charging",
      "Mechanical backup key",
    ],
  ),
  p(
    door,
    "VHLH 01",
    "Curved Lever Handle",
    "vallis-p25-x904",
    25,
    "A softly curved stainless-steel lever handle on a round rose.",
    { Grade: "SS 304", Finish: "SS / Matt" },
  ),
  p(
    door,
    "VHLH 02",
    "Straight Lever Handle",
    "vallis-p25-x906",
    25,
    "A restrained straight-profile stainless-steel lever handle.",
    { Grade: "SS 304", Finish: "SS / Matt" },
  ),
  p(
    door,
    "VBL 255",
    "Architectural Lever Handle",
    "vallis-p33-x1192",
    33,
    "A geometric lever profile for contemporary architectural doors.",
    {
      Grade: "SS 304",
      "Catalogue finishes": "Matt / Black / Antique / PVC Gold / PVC Rose Gold",
    },
  ),
  p(
    door,
    "VOSH 405",
    "Glass Door Pull Handle",
    "vallis-p54-x1915",
    54,
    "An architectural pull handle with a rounded profile for glass doors.",
    {
      Grade: "SS 202 & SS 304",
      Diameter: "25 mm",
      "Centres (CTC)": "300 / 450 / 600 mm",
      Finishes: "Matt / Combi / Black",
    },
  ),
  designerHandle(
    "VDH 01",
    "Round-Rose Inlay Lever Handle",
    [1, 5, 11, 8],
    "A softly rounded lever on a round rose, finished with a coloured inlay and a circular detail.",
    {
      Rose: "Round",
      "Finishes shown": "Polished gold with sage inlay / Polished gold with teal inlay / Antique brass",
      Type: "Lever handle on rose",
    },
    ["Coloured inlay set into the lever", "Circular detail at the pivot", "Matching round rose"],
  ),
  designerHandle(
    "VDH 02",
    "Square-Rose Inlay Lever Handle",
    [2, 6],
    "A straight, squared lever with a sea-green inlay framed by polished metal end caps.",
    { Rose: "Square", "Finish shown": "Polished gold with sea-green inlay", Type: "Lever handle on rose" },
    ["Coloured inlay with metal end caps", "Crisp square rose", "Part of a coordinated finish family"],
  ),
  designerHandle(
    "VDH 03",
    "Two-Tone Square-Rose Lever Handle",
    [3, 6],
    "A squared lever pairing a slate-grey grip with rose-gold end caps and rose.",
    { Rose: "Square", "Finish shown": "Rose gold with slate-grey grip", Type: "Lever handle on rose" },
    ["Two-tone metal and grip finish", "Crisp square rose"],
  ),
  designerHandle(
    "VDH 04",
    "Slot-Detail Lever Handle",
    [4, 10, 9],
    "A tapered lever with a slim inset slot detail, available in a family of contemporary finishes.",
    {
      Rose: "Square",
      "Finishes shown": "Matte black / Champagne / Satin chrome / Bronze / Brass",
      Type: "Lever handle on rose",
    },
    ["Slim inset slot detail", "Contemporary tapered profile", "Wide choice of finishes"],
  ),
  designerHandle(
    "VDH 05",
    "Fluted Grip Lever Handle",
    [7],
    "A rounded lever with a fluted grey grip on a rose-gold round rose.",
    { Rose: "Round", "Finish shown": "Rose gold with fluted grey grip", Type: "Lever handle on rose" },
    ["Tactile fluted grip", "Rose-gold metal accents"],
  ),
  designerHandle(
    "VDH 06",
    "Round-Rose Slot Lever Handle",
    [13],
    "A teal-inlay lever with a slim slot detail on a polished gold round rose.",
    { Rose: "Round", "Finish shown": "Polished gold with teal inlay", Type: "Lever handle on rose" },
    ["Coloured inlay with slot detail", "Matching round rose"],
  ),
  designerHandle(
    "VDH 07",
    "Slim Square-Rose Lever Handle",
    [12, 9],
    "A slim, flat lever with an engraved edge detail on a square rose.",
    { Rose: "Square", "Finish shown": "Antique brass", Type: "Lever handle on rose" },
    ["Slim flat profile", "Fine edge detail", "Warm antique-brass finish"],
  ),
  ...[
    ["1101", "2408", "40"],
    ["1102", "2410", "60"],
    ["1103", "2415", "80"],
  ].map(([m, x, weight]) =>
    p(
      closer,
      `VSDC ${m}`,
      "Overhead Door Closer",
      `vallis-p70-x${x}`,
      70,
      "An overhead aluminium-alloy closer in a silver finish.",
      {
        Material: "Aluminium alloy",
        Finish: "Silver",
        "Catalogue door weight": `${weight} kg`,
      },
    ),
  ),
  p(
    closer,
    "VSDC 1104",
    "Concealed Door Closer",
    "vallis-p71-x2445",
    71,
    "A concealed closer for a discreet architectural installation.",
    {
      Material: "Aluminium alloy",
      Finish: "Silver",
      "Catalogue door weight": "80 kg",
    },
  ),
  ...[
    ["91", "61", "2131", "4-arm fin-type spider"],
    ["92", "61", "2132", "2-arm 90° fin-type spider"],
    ["93", "62", "2160", "2-arm 180° fin-type spider"],
    ["94", "62", "2161", "1-arm fin-type spider"],
  ].map(([m, page, x, title]) =>
    p(
      spider,
      `VSF ${m}`,
      title,
      `vallis-p${page}-x${x}`,
      Number(page),
      "A stainless-steel fin-type fitting for point-supported glass.",
      { Material: "Stainless steel", Grade: "SS 316", Finishes: "SSS / PSS" },
    ),
  ),
  ...[
    ["201", "2667", "Connecting Patch with Pivot"],
    ["202", "2668", "Top Patch"],
    ["203", "2669", "Bottom Patch"],
  ].map(([m, x, title]) =>
    p(
      glass,
      `VPF ${m}`,
      title,
      `vallis-p78-x${x}`,
      78,
      "A patch fitting with an aluminium-alloy body and stainless-steel cover plate.",
      {
        "Glass thickness": "10 / 12 mm",
        Body: "Aluminium alloy",
        Cover: "Stainless steel",
        Finish: "SSS",
      },
    ),
  ),
  p(
    glass,
    "VSH 704",
    "180° Glass-to-Glass Hinge",
    "vallis-p85-x2907",
    85,
    "A shower hinge connecting a glass door to fixed glass at 180 degrees.",
    {
      "Glass thickness": "8–10 mm",
      "Maximum door width": "750 mm",
      "Maximum door weight": "45 kg",
      Material: "Brass / SS",
      Finishes: "Satin Nickel / Chrome Plated",
    },
    ["Hold-open at 90°", "Maximum opening angle 95°"],
  ),
  p(
    glass,
    "VGCF 3001",
    "Wall-to-Glass Canopy Connector",
    "vallis-p123-x4791",
    123,
    "A wall-to-glass connector from the VALLIS glass canopy range.",
    { Finish: "Matt" },
  ),
  p(
    glass,
    "VGCF 3002",
    "Rod-to-Glass Canopy Connector",
    "vallis-p123-x4792",
    123,
    "A rod-to-glass connector for the documented canopy hardware range.",
    { Finish: "Matt" },
  ),
  p(
    rail,
    "VRS 101",
    "Round-Profile Glass Spigot",
    "vallis-p110-x4371",
    110,
    "A spigot component for architectural glass railing installations.",
    { Finish: "SS" },
  ),
  p(
    rail,
    "VRS 102",
    "Square-Profile Glass Spigot",
    "vallis-p110-x4373",
    110,
    "A square-profile spigot for contemporary glass railing designs.",
    { Finish: "SS" },
  ),
  p(
    rail,
    "VL 2101",
    "Glass Railing Spigot",
    "vallis-p97-x3488",
    97,
    "A compact railing spigot shown in the supplied architectural hardware catalogue.",
    { Model: "VL 2101" },
  ),
  p(
    furniture,
    "H 2001",
    "Dual Cabinet Handle",
    "vallis-legacy-p5-x134",
    5,
    "A contrasting cabinet-handle design from the VALLIS Legacy Series.",
    {
      Sizes: "4 / 8 / 10 / 12 inches",
      "Catalogue finishes":
        "Satin + CP / Black + Antique / Rosegold + Black / Black + Rosegold / Black + Gold",
    },
    [],
    "VALLIS",
    legacy,
  ),
  p(
    furniture,
    "H 2102",
    "Fluted Cabinet Handle",
    "vallis-legacy-p17-x1343",
    17,
    "A fluted cabinet handle in a choice of metal-inspired finishes.",
    {
      Sizes: "4 / 8 / 10 / 12 inches",
      Finishes: "Olive Green / Satin / Antique / Gold / Black",
    },
    [],
    "VALLIS",
    legacy,
  ),
  p(
    furniture,
    "C 2202",
    "Concealed Cabinet Handle",
    "vallis-legacy-p28-x2408",
    28,
    "A concealed cabinet handle with a contrasting recessed profile.",
    {
      Sizes: "4 / 8 / 10 inches",
      "Catalogue finishes":
        "Rosegold + Black / Satin + CP / Black + Antique / Black + Gold / Black + Rosegold",
    },
    [],
    "VALLIS",
    legacy,
  ),
  p(
    furniture,
    "N 2313",
    "Cabinet Knob",
    "vallis-legacy-p37-x3374",
    37,
    "A cabinet knob from the VALLIS Legacy Series.",
    { Finishes: "Satin / Antique / Gold / Rosegold / Black" },
    [],
    "VALLIS",
    legacy,
  ),
  ...[
    [
      "FHC 200",
      "fhc-200-clear",
      "FHC Double Door with Vision Panels",
      "Red powder-coated finish",
      "Double leaf with two vision panels",
      "pvc-doors-5.jpeg",
    ],
    [
      "FHC 200D",
      "fhc-200d-clear",
      "FHC Heavy Duty Double Door",
      "Red finish",
      "Double leaf with vision panels",
      "pvc-doors-5.jpeg",
    ],
    [
      "FHC 100",
      "fhc-100-clear",
      "FHC Single Door with Vision Panel",
      "Red finish",
      "Single leaf with vision panel",
      "pvc-doors-5.jpeg",
    ],
    [
      "LV 200",
      "lv-200",
      "Louvered Electrical Shaft Door",
      "Light grey powder-coated finish",
      "Double leaf with louvers",
      "pvc-doors-4.jpeg",
    ],
  ].map(([model, img, name, finish, configuration, source]) => ({
    ...p(
      shaft,
      model,
      name,
      img,
      1,
      "An FHC door from the VALLIS FHC door range.",
      { "Finish shown": finish, Configuration: configuration },
      ["Project-specific size and fixing to be confirmed"],
      "VALLIS",
      `VALLIS FHC door sheet: ${source}`,
    ),
    // FHC doors use re-rendered photographs with clear, reflection-free vision glass.
    ...(img.endsWith("-clear") ? { image: generated(img), images: [generated(img)] } : {}),
    page: undefined,
    sourceFile: `/${source}`,
  })),
  windowProduct(
    "Casement",
    "Casement Window & Door",
    "Classic side-hinged windows and matching doors with excellent ventilation and unobstructed views.",
    { Operation: "Side-hinged sash, opens up to 90°", Locking: "Multi-point, 3–5 locking points" },
    [
      "Maximum ventilation — opens up to 90° for full airflow",
      "Compression seal against wind, rain and dust",
      "3–5 point locking for security",
      "Easy access for cleaning",
    ],
    [supplied("upvc-casement-door")],
  ),
  windowProduct(
    "Sliding",
    "Sliding Window & Door",
    "Space-saving horizontal sliding windows and large sliding doors, ideal for modern apartments, balconies and garden openings.",
    { Operation: "Horizontal sliding sashes on a track", Locking: "Multi-point locking" },
    [
      "Sashes glide sideways and never swing into the room",
      "Ideal for balconies, terraces and compact spaces",
      "Large glazed area for light and views",
      "Smooth, low-effort operation",
    ],
    [supplied("upvc-sliding-door-1"), supplied("upvc-sliding-door-2")],
  ),
  windowProduct(
    "French",
    "French Door",
    "Floor-to-ceiling double doors with Georgian bars, creating seamless indoor-outdoor transitions.",
    { Operation: "Pair of side-hinged floor-to-ceiling leaves", Locking: "Multi-point locking" },
    [
      "Dramatic floor-to-ceiling openings to gardens and terraces",
      "Wide, unobstructed passage when both leaves open",
      "Georgian bar detailing for a classic look",
      "Multi-point security locking",
    ],
    [supplied("upvc-french-door")],
  ),
  windowProduct(
    "Slide & Fold",
    "Slide & Fold Door",
    "Folding panels that stack neatly to one side, opening an entire wall to a terrace, garden or pool.",
    { Operation: "Hinged panels fold and slide along a top and bottom track", Locking: "Multi-point locking" },
    [
      "Opens almost the full width of the opening",
      "Panels stack compactly to one side",
      "Ideal for terraces, poolsides and garden rooms",
      "Weather-tight when closed",
    ],
    [supplied("upvc-slide-fold")],
  ),
  photoProduct(
    "shower-cubicles",
    "Shower Hinged",
    "Hinged Shower Cubicle",
    [supplied("shower-cubicle-3"), supplied("shower-cubicle-2")],
    "A frameless in-line shower enclosure with a hinged glass door, fixed panels and a full-height shower handle.",
    { Configuration: "In-line — hinged door between fixed panels", ...showerHardware },
    ["Frameless clear-glass look", "Glass-to-glass hinged door", "Full-height shower handle", "Made to the size of the opening"],
    showers,
  ),
  photoProduct(
    "shower-cubicles",
    "Shower Corner",
    "Corner Shower Cubicle",
    [supplied("shower-cubicle-1"), supplied("shower-cubicle-4")],
    "A three-sided corner shower enclosure with a hinged door, a top stabiliser rail and glass-to-glass connectors.",
    { Configuration: "Corner / three-sided with hinged door", ...showerHardware },
    ["Corner or freestanding layouts", "Top stabiliser rail for rigidity", "Towel-bar style shower handle", "Made to the size of the opening"],
    showers,
  ),
  photoProduct(
    "shower-cubicles",
    "Shower Sliding",
    "Sliding Shower Enclosure",
    [supplied("shower-sliding")],
    "A frameless sliding shower door running on an exposed stainless-steel roller track — no swing space needed.",
    {
      Configuration: "Sliding door beside a fixed panel",
      Glass: "Clear toughened glass — thickness confirmed per project",
      Hardware: "Stainless-steel top track, sliding rollers and pull handle",
      Finishes: "Chrome / satin — confirm per project",
    },
    ["Saves space — the door does not swing out", "Exposed stainless roller track", "Full-height pull handle", "Made to the size of the opening"],
    showers,
  ),
];
products
  .find((p) => p.model === "VACS 12")!
  .images.push(asset("vallis-p14-x403"));
products
  .find((p) => p.model === "VACS 13")!
  .images.push(asset("vallis-p16-x469"));
products
  .find((p) => p.model === "H 2102")!
  .images.push(asset("vallis-legacy-p17-x1395"));
products
  .find((p) => p.model === "C 2202")!
  .images.push(asset("vallis-legacy-p28-x2467"));
export const productUrl = (p: Product) => `/products/${p.category}/${p.slug}/`;
export const enquiryUrl = (p?: Product, c?: Category) =>
  `/contact/?${new URLSearchParams({ ...(p ? { product: `${p.brand} ${p.model} — ${p.name}` } : {}), ...(p ? { category: p.category } : c ? { category: c.slug } : {}) }).toString()}#enquiry`;
export const gallery = [
  {
    image: asset("vallis-rail-p10-x82"),
    title: "Light, lines & open views",
    group: "Residential",
    alt: "VALLIS catalogue interior with a glass-railed staircase",
  },
  {
    image: asset("vallis-rail-p22-x166"),
    title: "An open commercial perspective",
    group: "Commercial",
    alt: "VALLIS catalogue glass balustrade overlooking a commercial atrium",
  },
  {
    image: asset("vallis-p13-x344"),
    title: "A considered arrival",
    group: "Hospitality",
    alt: "VALLIS catalogue hospitality interior",
  },
  {
    image: asset("vallis-rail-p20-x152"),
    title: "Uninterrupted horizons",
    group: "Glass Railings",
    alt: "VALLIS catalogue glass railing on a sunlit terrace",
  },
  {
    image: asset("vallis-rail-p16-x124"),
    title: "Sculptural stairways",
    group: "Residential",
    alt: "VALLIS catalogue modern staircase with glass balustrade",
  },
  {
    image: asset("vallis-rail-p35-x257"),
    title: "Architecture in the details",
    group: "Commercial",
    alt: "VALLIS catalogue architectural glass railing application",
  },
  {
    image: asset("vallis-p60-x2078"),
    title: "The clarity of glass",
    group: "Glass Fittings",
    alt: "VALLIS catalogue spider fittings supporting an interior glass wall",
  },
  {
    image: asset("vallis-rail-p45-x326"),
    title: "Clean balcony lines",
    group: "Glass Railings",
    alt: "VALLIS catalogue balcony glass balustrade",
  },  {
    image: supplied("patch-door-3"),
    title: "Frameless glass entrances",
    group: "Glass Fittings",
    alt: "Office glass partition with a frameless door on patch fittings and a long pull handle",
  },
  {
    image: supplied("shower-cubicle-2"),
    title: "A frameless shower enclosure",
    group: "Shower Cubicles",
    alt: "Corner shower cubicle in clear glass with hinges and a shower handle against marble walls",
  },
  {
    image: supplied("upvc-sliding-door-2"),
    title: "Slim sliding doors",
    group: "uPVC Windows & Doors",
    alt: "Dark-framed uPVC sliding doors opening a kitchen onto a garden",
  },
  {
    image: supplied("shower-sliding"),
    title: "Sliding into calm",
    group: "Shower Cubicles",
    alt: "Frameless sliding shower door on a stainless-steel roller track",
  },
];
/** Fire door hardware explorer: hotspot positions are percentages of the fire-door-hardware image. */
export const fireDoorHardware = [
  { name: "Door Closer", x: 32.5, y: 11, text: "Overhead hydraulic closer returns the leaf to the closed and latched position after every use." },
  { name: "Door Silencer", x: 72, y: 10.5, text: "Rubber buffers in the frame stop cushion closing and keep the leaf quiet and aligned." },
  { name: "Hinge", x: 28, y: 31.5, text: "Heavy-duty stainless-steel butt hinges carry the weight of the steel leaf." },
  { name: "Panic Bar Exit Device", x: 37.5, y: 51, text: "Push-bar exit device releases the door with one push for fast evacuation." },
  { name: "Outside Lever Trim", x: 52.5, y: 50, text: "Lever trim gives controlled access from the outside face of the door." },
  { name: "Smoke Strip", x: 50.1, y: 66, text: "Smoke and intumescent seals along the meeting edges limit the passage of smoke." },
  { name: "Door Bottom Strip", x: 61, y: 79, text: "Automatic drop-down bottom seal closes the gap between the leaf and the floor." },
];
