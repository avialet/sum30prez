const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon imports
const { FaCloud, FaFlask, FaUsers, FaRocket, FaLightbulb, FaHandshake, FaCheckCircle, FaServer, FaCodeBranch, FaShieldAlt, FaArrowRight } = require("react-icons/fa");

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

async function main() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Aurélien Vialet";
  pres.title = "Le Cloud - PlanET";

  // Color palette - Deep tech with teal accent
  const DARK = "0F172A";
  const DARK_MID = "1E293B";
  const TEAL = "06B6D4";
  const TEAL_DARK = "0891B2";
  const LIGHT = "F0F9FF";
  const WHITE = "FFFFFF";
  const SLATE_300 = "CBD5E1";
  const SLATE_400 = "94A3B8";
  const SLATE_500 = "64748B";

  // Helper: fresh shadow
  const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25 });
  const makeCardShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

  // Pre-render all icons
  const [iconCloud, iconFlask, iconUsers, iconRocket, iconLightbulb, iconHandshake, iconCheck, iconServer, iconCodeBranch, iconShield, iconArrow] = await Promise.all([
    iconToBase64Png(FaCloud, "#06B6D4", 256),
    iconToBase64Png(FaFlask, "#06B6D4", 256),
    iconToBase64Png(FaUsers, "#06B6D4", 256),
    iconToBase64Png(FaRocket, "#06B6D4", 256),
    iconToBase64Png(FaLightbulb, "#F59E0B", 256),
    iconToBase64Png(FaHandshake, "#06B6D4", 256),
    iconToBase64Png(FaCheckCircle, "#10B981", 256),
    iconToBase64Png(FaServer, "#FFFFFF", 256),
    iconToBase64Png(FaCodeBranch, "#FFFFFF", 256),
    iconToBase64Png(FaShieldAlt, "#FFFFFF", 256),
    iconToBase64Png(FaArrowRight, "#94A3B8", 256),
  ]);

  // =============================================
  // SLIDE 1 - Le Cloud, votre nouveau super-pouvoir
  // =============================================
  let slide1 = pres.addSlide();
  slide1.background = { color: DARK };

  // Top accent bar
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: TEAL }
  });

  // Subtitle line
  slide1.addText("PLATEFORME PLANET", {
    x: 0.8, y: 0.5, w: 8, h: 0.35,
    fontSize: 11, fontFace: "Trebuchet MS", color: TEAL,
    charSpacing: 4, bold: true, margin: 0
  });

  // Main title
  slide1.addText("Le Cloud, votre nouveau\nsuper-pouvoir", {
    x: 0.8, y: 0.9, w: 8.4, h: 1.2,
    fontSize: 36, fontFace: "Trebuchet MS", color: WHITE,
    bold: true, margin: 0
  });

  // Thin separator line
  slide1.addShape(pres.shapes.LINE, {
    x: 0.8, y: 2.25, w: 1.5, h: 0, line: { color: TEAL, width: 2 }
  });

  // Tagline
  slide1.addText("L'innovation n'est plus réservée aux développeurs.", {
    x: 0.8, y: 2.45, w: 8, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: SLATE_400,
    italic: true, margin: 0
  });

  // Three cards: icon circles + text
  const cards1 = [
    { icon: iconCloud, title: "Accès ouvert", desc: "Cloud accessible\nà toute l'équipe" },
    { icon: iconFlask, title: "PoC simplifiée", desc: "Créer vos Proof of\nConcept facilement" },
    { icon: iconUsers, title: "Autonomie", desc: "Testez et prototypez\nvos idées" },
  ];

  const cardW = 2.6;
  const cardH = 2.0;
  const cardGap = 0.35;
  const totalCardsW = cards1.length * cardW + (cards1.length - 1) * cardGap;
  const cardsStartX = (10 - totalCardsW) / 2;
  const cardsY = 3.15;

  cards1.forEach((card, i) => {
    const cx = cardsStartX + i * (cardW + cardGap);

    // Card background
    slide1.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cardsY, w: cardW, h: cardH,
      fill: { color: DARK_MID },
      shadow: makeCardShadow()
    });

    // Icon circle
    const circleSize = 0.55;
    const circleX = cx + (cardW - circleSize) / 2;
    slide1.addShape(pres.shapes.OVAL, {
      x: circleX, y: cardsY + 0.2, w: circleSize, h: circleSize,
      fill: { color: DARK, transparency: 0 },
      line: { color: TEAL, width: 1.5 }
    });

    // Icon
    const iconSize = 0.3;
    slide1.addImage({
      data: card.icon,
      x: circleX + (circleSize - iconSize) / 2,
      y: cardsY + 0.2 + (circleSize - iconSize) / 2,
      w: iconSize, h: iconSize
    });

    // Card title
    slide1.addText(card.title, {
      x: cx, y: cardsY + 0.85, w: cardW, h: 0.35,
      fontSize: 13, fontFace: "Trebuchet MS", color: TEAL,
      bold: true, align: "center", margin: 0
    });

    // Card description
    slide1.addText(card.desc, {
      x: cx + 0.15, y: cardsY + 1.2, w: cardW - 0.3, h: 0.7,
      fontSize: 11, fontFace: "Calibri", color: SLATE_300,
      align: "center", margin: 0
    });
  });

  // Speaker notes
  slide1.addNotes("Insister sur le fait qu'il n'y a pas besoin d'être un expert technique pour se lancer. L'innovation est ouverte à tous dans l'équipe. Le Cloud est un outil accessible, pas réservé aux développeurs.");

  // =============================================
  // SLIDE 2 - De l'idée à la réalité : Le cas Tom
  // =============================================
  let slide2 = pres.addSlide();
  slide2.background = { color: LIGHT };

  // Top accent bar
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: TEAL }
  });

  // Section label
  slide2.addText("RETOUR D'EXPÉRIENCE", {
    x: 0.8, y: 0.45, w: 8, h: 0.3,
    fontSize: 11, fontFace: "Trebuchet MS", color: TEAL_DARK,
    charSpacing: 4, bold: true, margin: 0
  });

  // Title
  slide2.addText("De l'idée à la réalité : Le cas Tom", {
    x: 0.8, y: 0.85, w: 8, h: 0.7,
    fontSize: 32, fontFace: "Trebuchet MS", color: DARK,
    bold: true, margin: 0
  });

  // Left side: timeline / story
  const stepsData = [
    { icon: iconLightbulb, label: "Idée", desc: "Un projet pensé et déployé rapidement", color: "F59E0B" },
    { icon: iconHandshake, label: "Co-construction", desc: "Une collaboration efficace entre métier et tech", color: "06B6D4" },
    { icon: iconCheck, label: "Résultat", desc: "La preuve que la plateforme est prête pour vous", color: "10B981" },
  ];

  const stepStartY = 1.9;
  const stepH = 1.05;
  const stepGap = 0.15;

  stepsData.forEach((step, i) => {
    const sy = stepStartY + i * (stepH + stepGap);

    // Card
    slide2.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: sy, w: 8.4, h: stepH,
      fill: { color: WHITE },
      shadow: makeCardShadow()
    });

    // Left accent bar
    slide2.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: sy, w: 0.07, h: stepH,
      fill: { color: step.color }
    });

    // Icon
    slide2.addImage({
      data: step.icon,
      x: 1.2, y: sy + (stepH - 0.4) / 2, w: 0.4, h: 0.4
    });

    // Label
    slide2.addText(step.label, {
      x: 1.85, y: sy + 0.12, w: 3, h: 0.35,
      fontSize: 15, fontFace: "Trebuchet MS", color: DARK,
      bold: true, margin: 0
    });

    // Description
    slide2.addText(step.desc, {
      x: 1.85, y: sy + 0.48, w: 6.8, h: 0.4,
      fontSize: 12, fontFace: "Calibri", color: SLATE_500,
      margin: 0
    });

    // Connector line between cards
    if (i < stepsData.length - 1) {
      slide2.addShape(pres.shapes.LINE, {
        x: 1.4, y: sy + stepH, w: 0, h: stepGap,
        line: { color: SLATE_300, width: 1.5, dashType: "dash" }
      });
    }
  });

  // Speaker notes
  slide2.addNotes("C'est le moment de mettre Tom en valeur pour donner envie aux autres de faire pareil. Raconter comment Tom a eu une idée, comment il a pu la prototyper rapidement grâce à la plateforme, et montrer le résultat concret.");

  // =============================================
  // SLIDE 3 - Sous le capot : L'infrastructure PlanET
  // =============================================
  let slide3 = pres.addSlide();
  slide3.background = { color: DARK };

  // Top accent bar
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: TEAL }
  });

  // Section label
  slide3.addText("INFRASTRUCTURE", {
    x: 0.8, y: 0.45, w: 8, h: 0.3,
    fontSize: 11, fontFace: "Trebuchet MS", color: TEAL,
    charSpacing: 4, bold: true, margin: 0
  });

  // Title
  slide3.addText("Sous le capot : L'infrastructure PlanET", {
    x: 0.8, y: 0.85, w: 8.4, h: 0.7,
    fontSize: 32, fontFace: "Trebuchet MS", color: WHITE,
    bold: true, margin: 0
  });

  // Three-step flow: Tester → Sauvegarder → Déployer
  const flowSteps = [
    { icon: iconServer, label: "Tester", desc: "Espace Cloud\ndédié à chacun", bg: "0E4D64" },
    { icon: iconCodeBranch, label: "Sauvegarder", desc: "Dépôt centralisé\npour vos projets", bg: "0E4D64" },
    { icon: iconShield, label: "Déployer", desc: "Environnements\n100% sécurisés", bg: "0E4D64" },
  ];

  const flowCardW = 2.4;
  const flowCardH = 2.5;
  const flowGap = 0.6;
  const totalFlowW = flowSteps.length * flowCardW + (flowSteps.length - 1) * flowGap;
  const flowStartX = (10 - totalFlowW) / 2;
  const flowY = 1.8;

  flowSteps.forEach((step, i) => {
    const fx = flowStartX + i * (flowCardW + flowGap);

    // Card
    slide3.addShape(pres.shapes.RECTANGLE, {
      x: fx, y: flowY, w: flowCardW, h: flowCardH,
      fill: { color: step.bg },
      shadow: makeShadow()
    });

    // Top accent on card
    slide3.addShape(pres.shapes.RECTANGLE, {
      x: fx, y: flowY, w: flowCardW, h: 0.06,
      fill: { color: TEAL }
    });

    // Icon circle
    const circSize = 0.7;
    const circX = fx + (flowCardW - circSize) / 2;
    slide3.addShape(pres.shapes.OVAL, {
      x: circX, y: flowY + 0.35, w: circSize, h: circSize,
      fill: { color: TEAL_DARK }
    });

    // Icon
    const icoSize = 0.35;
    slide3.addImage({
      data: step.icon,
      x: circX + (circSize - icoSize) / 2,
      y: flowY + 0.35 + (circSize - icoSize) / 2,
      w: icoSize, h: icoSize
    });

    // Step number
    slide3.addText(String(i + 1), {
      x: fx + 0.1, y: flowY + 0.1, w: 0.35, h: 0.35,
      fontSize: 14, fontFace: "Trebuchet MS", color: TEAL,
      bold: true, margin: 0
    });

    // Label
    slide3.addText(step.label, {
      x: fx, y: flowY + 1.2, w: flowCardW, h: 0.4,
      fontSize: 16, fontFace: "Trebuchet MS", color: WHITE,
      bold: true, align: "center", margin: 0
    });

    // Description
    slide3.addText(step.desc, {
      x: fx + 0.15, y: flowY + 1.6, w: flowCardW - 0.3, h: 0.75,
      fontSize: 12, fontFace: "Calibri", color: SLATE_300,
      align: "center", margin: 0
    });

    // Arrow between cards
    if (i < flowSteps.length - 1) {
      const arrowX = fx + flowCardW + (flowGap - 0.3) / 2;
      const arrowY_pos = flowY + flowCardH / 2 - 0.15;
      slide3.addImage({
        data: iconArrow,
        x: arrowX, y: arrowY_pos, w: 0.3, h: 0.3
      });
    }
  });

  // Bottom transition indicator
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.05, w: 10, h: 0.575,
    fill: { color: DARK_MID }
  });

  slide3.addImage({
    data: iconArrow,
    x: 4.0, y: 5.17, w: 0.25, h: 0.25
  });

  slide3.addText("Suite de la réunion...", {
    x: 4.4, y: 5.1, w: 4, h: 0.45,
    fontSize: 13, fontFace: "Calibri", color: SLATE_400,
    italic: true, margin: 0
  });

  // Speaker notes
  slide3.addNotes("Ne pas rentrer dans le jargon technique de l'infrastructure. Montrer juste le flux logique : Test → Dépôt → Déploiement sécurisé pour les rassurer. Enchaîner rapidement sur le sujet suivant de la réunion.");

  // Write file
  await pres.writeFile({ fileName: "/Users/aurelienvialet/Documents/projetsIA/Ricochet/PlanET-Cloud-Presentation.pptx" });
  console.log("Presentation created: PlanET-Cloud-Presentation.pptx");
}

main().catch(err => { console.error(err); process.exit(1); });
