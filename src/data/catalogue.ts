export const business = {
  name: "BUILDMART INDIA",
  phone: "+91 9990069207",
  tel: "+919990069207",
  email: "info@vallisglobal.in",
  address: "A14/15, Golf Course Rd, DLF Phase 1, Gurugram, Haryana 122002",
  origin: "https://www.vallisglobal.in",
  whatsapp: "https://wa.me/919990069207",
  maps: "https://www.google.com/maps/search/?api=1&query=A14%2F15%2C%20Golf%20Course%20Rd%2C%20DLF%20Phase%201%2C%20Gurugram%2C%20Haryana%20122002",
};
export const asset = (name: string) => `/images/catalogue/${name}.webp`;
/** Photographs (rather than transparent product cut-outs) should fill their frame. */
const PHOTO_IMAGES = ["nimkro-p17-x1343", "nimkro-p28-x2408", "nimkro-p37-x3374", "nimkro-p5-x134", "vallis-p13-x344", "vallis-p32-x1118", "vallis-p60-x2078", "vallis-p69-x2356", "vallis-p77-x2613"];
export const isPhoto = (src: string) =>
  src.includes("/generated/") || src.includes("/mrw-") || PHOTO_IMAGES.some((name) => src.includes(`/${name}.`));
/** AI-generated art-directed imagery (see scripts/image-generation). */
export const generated = (name: string) => `/images/generated/${name}.webp`;
export const catalogues = [
  {
    name: "VALLIS Architectural Hardware",
    file: "/vallisglobal products pdf.pdf",
    note: "Locks, door hardware, glass fittings and railing components",
    size: "14.9 MB",
  },
  {
    name: "NIMKRO Legacy Series",
    file: "/door handle pdf.pdf",
    note: "Cabinet handles, concealed handles and knobs",
    size: "40.1 MB",
  },
  {
    name: "MRW Glass Railing Systems",
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
    image: asset("mrw-p24-x180"),
    scene: asset("mrw-p10-x82"),
    intro:
      "Open views, elegant lines. Explore railing applications from the MRW catalogue and genuine VALLIS spigot components.",
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
    image: asset("nimkro-p17-x1395"),
    scene: generated("furniture-hardware-scene"),
    intro:
      "Small details. Lasting character. NIMKRO cabinet handles, concealed handles and knobs for carefully finished interiors.",
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
      "Purposeful access for building services. Explore the supplied BUILDMART INDIA fire and electrical shaft-door range.",
    applications: ["Electrical shafts", "Service risers", "Utility access"],
    considerations:
      "Confirm opening sizes, leaf configuration, ventilation and required compliance documentation. No fire rating is stated without model-specific test evidence.",
    icon: "door",
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
  page?: number;
  applications: string[];
}
const v = "VALLIS Architectural Hardware catalogue";
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
  shaft = "shaft-doors";
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
    "nimkro-p5-x134",
    5,
    "A contrasting cabinet-handle design from the NIMKRO Legacy Series.",
    {
      Sizes: "4 / 8 / 10 / 12 inches",
      "Catalogue finishes":
        "Satin + CP / Black + Antique / Rosegold + Black / Black + Rosegold / Black + Gold",
    },
    [],
    "NIMKRO",
    "NIMKRO Legacy Series catalogue",
  ),
  p(
    furniture,
    "H 2102",
    "Fluted Cabinet Handle",
    "nimkro-p17-x1343",
    17,
    "A fluted cabinet handle in a choice of metal-inspired finishes.",
    {
      Sizes: "4 / 8 / 10 / 12 inches",
      Finishes: "Olive Green / Satin / Antique / Gold / Black",
    },
    [],
    "NIMKRO",
    "NIMKRO Legacy Series catalogue",
  ),
  p(
    furniture,
    "C 2202",
    "Concealed Cabinet Handle",
    "nimkro-p28-x2408",
    28,
    "A concealed cabinet handle with a contrasting recessed profile.",
    {
      Sizes: "4 / 8 / 10 inches",
      "Catalogue finishes":
        "Rosegold + Black / Satin + CP / Black + Antique / Black + Gold / Black + Rosegold",
    },
    [],
    "NIMKRO",
    "NIMKRO Legacy Series catalogue",
  ),
  p(
    furniture,
    "N 2313",
    "Cabinet Knob",
    "nimkro-p37-x3374",
    37,
    "A cabinet knob from the NIMKRO Legacy Series.",
    { Finishes: "Satin / Antique / Gold / Rosegold / Black" },
    [],
    "NIMKRO",
    "NIMKRO Legacy Series catalogue",
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
      "A shaft-access door shown in the supplied BUILDMART INDIA product sheet.",
      { "Finish shown": finish, Configuration: configuration },
      ["Project-specific size and fixing to be confirmed"],
      "BUILDMART INDIA",
      `Supplied shaft-door sheet: ${source}`,
    ),
    page: undefined,
  })),
];
products
  .find((p) => p.model === "VACS 12")!
  .images.push(asset("vallis-p14-x403"));
products
  .find((p) => p.model === "VACS 13")!
  .images.push(asset("vallis-p16-x469"));
products
  .find((p) => p.model === "H 2102")!
  .images.push(asset("nimkro-p17-x1395"));
products
  .find((p) => p.model === "C 2202")!
  .images.push(asset("nimkro-p28-x2467"));
export const productUrl = (p: Product) => `/products/${p.category}/${p.slug}/`;
export const enquiryUrl = (p?: Product, c?: Category) =>
  `/contact/?${new URLSearchParams({ ...(p ? { product: `${p.brand} ${p.model} — ${p.name}` } : {}), ...(p ? { category: p.category } : c ? { category: c.slug } : {}) }).toString()}#enquiry`;
export const gallery = [
  {
    image: asset("mrw-p10-x82"),
    title: "Light, lines & open views",
    group: "Residential",
    alt: "MRW catalogue interior with a glass-railed staircase",
  },
  {
    image: asset("mrw-p22-x166"),
    title: "An open commercial perspective",
    group: "Commercial",
    alt: "MRW catalogue glass balustrade overlooking a commercial atrium",
  },
  {
    image: asset("vallis-p13-x344"),
    title: "A considered arrival",
    group: "Hospitality",
    alt: "VALLIS catalogue hospitality interior",
  },
  {
    image: asset("mrw-p20-x152"),
    title: "Uninterrupted horizons",
    group: "Glass Railings",
    alt: "MRW catalogue glass railing on a sunlit terrace",
  },
  {
    image: asset("mrw-p16-x124"),
    title: "Sculptural stairways",
    group: "Residential",
    alt: "MRW catalogue modern staircase with glass balustrade",
  },
  {
    image: asset("mrw-p35-x257"),
    title: "Architecture in the details",
    group: "Commercial",
    alt: "MRW catalogue architectural glass railing application",
  },
  {
    image: asset("vallis-p60-x2078"),
    title: "The clarity of glass",
    group: "Glass Fittings",
    alt: "VALLIS catalogue spider fittings supporting an interior glass wall",
  },
  {
    image: asset("mrw-p45-x326"),
    title: "Clean balcony lines",
    group: "Glass Railings",
    alt: "MRW catalogue balcony glass balustrade",
  },
];
