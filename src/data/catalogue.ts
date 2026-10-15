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
  src.includes("/generated/") || src.includes("/vallis-rail-") || PHOTO_IMAGES.some((name) => src.includes(`/${name}.`));
/** AI-generated art-directed imagery (see scripts/image-generation). */
export const generated = (name: string) => `/images/generated/${name}.webp`;
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
    slug: "shaft-doors",
    name: "Shaft Doors",
    short: "Shaft Doors",
    number: "08",
    image: asset("fhc-200"),
    scene: generated("shaft-doors-scene"),
    intro:
      "Purposeful access for building services. Explore the VALLIS fire and electrical shaft-door range.",
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
    image: generated("upvc-casement"),
    scene: generated("upvc-windows-scene"),
    intro:
      "Quiet, light-filled spaces. Casement, sliding, tilt & turn, fixed, top-hung and French uPVC windows engineered for insulation, security and zero maintenance.",
    applications: ["Homes & villas", "Apartments", "Offices"],
    considerations:
      "Window type, opening size, glass specification and hardware are selected for each opening. Share drawings or site dimensions so our team can recommend the right configuration, then confirm acoustic and thermal values for the chosen system.",
    icon: "window",
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
  shaft = "shaft-doors",
  win = "upvc-windows";
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
const windowProduct = (
  type: string,
  name: string,
  description: string,
  specs: Record<string, string>,
  features: string[],
): Product => ({
  ...p(win, `uPVC ${type}`, name, "", 0, description, { ...specs, ...upvcSystem }, features, "VALLIS", windows),
  image: generated(`upvc-${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
  images: [generated(`upvc-${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)],
  page: undefined,
});
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
      "fhc-200",
      "Double Shaft Door with Vision Panels",
      "Red powder-coated finish",
      "Double leaf with two vision panels",
      "pvc-doors-5.jpeg",
    ],
    [
      "FHC 200D",
      "fhc-200d",
      "Heavy Duty Shaft Door",
      "Red finish",
      "Double leaf with vision panels",
      "pvc-doors-5.jpeg",
    ],
    [
      "FHC 100",
      "fhc-100",
      "Single Shaft Door with Vision Panel",
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
      "A shaft-access door from the VALLIS shaft-door range.",
      { "Finish shown": finish, Configuration: configuration },
      ["Project-specific size and fixing to be confirmed"],
      "VALLIS",
      `VALLIS shaft-door sheet: ${source}`,
    ),
    page: undefined,
    sourceFile: `/${source}`,
  })),
  windowProduct(
    "Casement",
    "Casement Window",
    "Classic side-hinged windows with excellent ventilation and unobstructed views.",
    { Operation: "Side-hinged sash, opens up to 90°", Locking: "Multi-point, 3–5 locking points" },
    [
      "Maximum ventilation — opens up to 90° for full airflow",
      "Compression seal against wind, rain and dust",
      "3–5 point locking for security",
      "Easy access for cleaning",
    ],
  ),
  windowProduct(
    "Sliding",
    "Sliding Window",
    "Space-saving horizontal sliding windows, ideal for modern apartments and balconies.",
    { Operation: "Horizontal sliding sashes on a track", Locking: "Multi-point locking" },
    [
      "Sashes glide sideways and never swing into the room",
      "Ideal for balconies and compact spaces",
      "Large glazed area for light and views",
      "Smooth, low-effort operation",
    ],
  ),
  windowProduct(
    "Tilt & Turn",
    "Tilt & Turn Window",
    "Versatile European-style windows with dual opening modes for ventilation and cleaning.",
    { Operation: "Dual mode — tilts inward at the top or turns inward like a casement", Locking: "Multi-point locking" },
    [
      "Tilt mode for secure, draught-free ventilation",
      "Turn mode for full opening and easy cleaning",
      "Single handle controls both modes",
      "Excellent sealing when closed",
    ],
  ),
  windowProduct(
    "Fixed",
    "Fixed Window",
    "Non-opening windows for maximum light and uninterrupted views.",
    { Operation: "Non-opening (fixed glazing)" },
    [
      "Maximum daylight and uninterrupted views",
      "Highest sealing and insulation performance",
      "Combines with opening sashes in larger compositions",
      "Ideal for compact spaces and picture windows",
    ],
  ),
  windowProduct(
    "Top Hung",
    "Top Hung / Ventilator Window",
    "Compact awning-style windows, perfect for ventilation in kitchens and bathrooms.",
    { Operation: "Top-hinged sash opens outward at the bottom" },
    [
      "Ventilation while keeping rain out",
      "Compact size for kitchens, bathrooms and utility areas",
      "Privacy-friendly positioning above counters",
      "Secure, weather-tight closing",
    ],
  ),
  windowProduct(
    "French",
    "French Window",
    "Floor-to-ceiling double windows creating seamless indoor-outdoor transitions.",
    { Operation: "Pair of side-hinged floor-to-ceiling sashes", Locking: "Multi-point locking" },
    [
      "Dramatic floor-to-ceiling openings to gardens and terraces",
      "Wide, unobstructed passage when both sashes open",
      "Abundant natural light",
      "Multi-point security locking",
    ],
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
  },
];
/** New VALLIS designer lever handle collection (photographed samples, models confirmed on enquiry). */
export const newHandles = [
  ["Polished gold lever with a sage-green inlay on a round rose", "Gold · Sage"],
  ["Gold lever with a sea-green inlay on a square rose", "Gold · Sea green"],
  ["Rose-gold lever with a slate-grey inlay on a square rose", "Rose gold · Slate"],
  ["Matte black lever with a slim slot detail on a square rose", "Matte black"],
  ["Polished gold lever with a sage inlay on a round rose", "Gold · Sage"],
  ["Four square-rose levers in gold, black, champagne and satin finishes", "Finish family"],
  ["Rose-gold round-rose lever with a fluted grey grip", "Rose gold · Fluted"],
  ["Round-rose levers in polished gold and antique brass", "Gold · Antique brass"],
  ["Slim levers in bronze, black, satin chrome and brass", "Finish family"],
  ["Slot-detail levers in matte black, champagne and satin chrome", "Finish family"],
  ["Gold round-rose lever with a teal inlay", "Gold · Teal"],
  ["Antique brass lever on a square rose", "Antique brass"],
  ["Gold round-rose lever with a teal inlay and slot detail", "Gold · Teal"],
].map(([alt, finish], i) => ({
  image: asset(`vallis-lever-${String(i + 1).padStart(2, "0")}`),
  alt: `VALLIS designer lever handle — ${alt}`,
  finish,
}));
/** Fire door hardware explorer: hotspot positions are percentages of the fire-door-hardware image. */
export const fireDoorHardware = [
  { name: "Door Closer", x: 32.5, y: 11, text: "Overhead hydraulic closer returns the leaf to the closed and latched position after every use." },
  { name: "Door Silencer", x: 72, y: 10.5, text: "Rubber buffers in the frame stop cushion closing and keep the leaf quiet and aligned." },
  { name: "Hinge", x: 28, y: 31.5, text: "Heavy-duty stainless-steel butt hinges carry the weight of the steel leaf." },
  { name: "Wire Glass", x: 56.5, y: 30, text: "Wired safety-glass vision panel keeps sight lines open while holding together under heat." },
  { name: "Panic Bar Exit Device", x: 37.5, y: 51, text: "Push-bar exit device releases the door with one push for fast evacuation." },
  { name: "Outside Lever Trim", x: 52.5, y: 50, text: "Lever trim gives controlled access from the outside face of the door." },
  { name: "Smoke Strip", x: 50.1, y: 66, text: "Smoke and intumescent seals along the meeting edges limit the passage of smoke." },
  { name: "Door Bottom Strip", x: 61, y: 79, text: "Automatic drop-down bottom seal closes the gap between the leaf and the floor." },
];
