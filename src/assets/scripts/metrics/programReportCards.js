REPORT_CARD_GED = {
  "title": "Program A",
  "description": "This program is a group of educational exams which, when passed, provide certification that the test taker has high-school level academic skills. It is an accredited alternative to a high-school diploma, taught by accredited teachers. A GED certificate can significantly increase opportunity for employment and higher education.",
  "type": "Educational",
  "method": "Class instruction",
  "dosage": "20-22 weeks",
  "completionRate": "71%",
  "cost": "$1,500",
  "firstYearEmployment": "42%",
  "thirdYearEmployment": "61%",
  "firstYearReincarceration": "17.5%",
  "thirdYearReincarceration": "22.1%",
  "firstYearRevocation": "9.4%",
  "thirdYearRevocation": "17.2%",
}

REPORT_CARD_GOOD_THOUGHTS = {
  "title": "Program B",
  "description": "This program provides group-based therapy targeted at the mitigation of thinking errors and ambient negativity through careful examination of each student's personal history. Providing students with a safe space to be vulnerable promotes self-awareness and self-worth.",
  "type": "Treatment",
  "method": "Group therapy",
  "dosage": "16 weeks",
  "completionRate": "63%",
  "cost": "$1,350",
  "firstYearEmployment": "46%",
  "thirdYearEmployment": "55%",
  "firstYearReincarceration": "13.1%",
  "thirdYearReincarceration": "14.4%",
  "firstYearRevocation": "12.9%",
  "thirdYearRevocation": "15.2%",
}

REPORT_CARD_PRISON_ENTREPRENEURSHIP = {
  "title": "Program C",
  "description": "This program brings in local business owners to provide guidance on founding a successful venture. Instruction focuses on building the self-confidence and focus necessary to succeed in high-pressure situations. Capstone projects, sponsored by local organizations, provide students the chance to showcase their ideas and skills.",
  "type": "Vocational",
  "method": "Class instruction",
  "dosage": "24 weeks",
  "completionRate": "78%",
  "cost": "$1,800",
  "firstYearEmployment": "52%",
  "thirdYearEmployment": "60%",
  "firstYearReincarceration": "14.4%",
  "thirdYearReincarceration": "16.1%",
  "firstYearRevocation": "17.3%",
  "thirdYearRevocation": "21.0%",
}

REPORT_CARD_ROUGH_RIDERS = {
  "title": "Program D",
  "description": "This program employs incarcerated individuals to produce quality products for commercial and industrial clients. Using high quality machinery in a secure workshop on site, students prepare for careers in a variety of useful trades, and nurture their creativity and relationship building skills.",
  "type": "Vocational",
  "method": "Class instruction",
  "dosage": "Open entry/exit",
  "completionRate": "68%",
  "cost": "$2,100",
  "firstYearEmployment": "65%",
  "thirdYearEmployment": "71%",
  "firstYearReincarceration": "13.7%",
  "thirdYearReincarceration": "18.1%",
  "firstYearRevocation": "12.3%",
  "thirdYearRevocation": "17.1%",
}

REPORT_CARD_WORK_PLACEMENT = {
  "title": "Program E",
  "description": "This program leverages a network of local business partners hoping to hire newly released individuals looking to ensure a stable reentry into their community. A series of converations and exercises help match individuals soon to be released with prospective employers to secure gainful employment.",
  "type": "Vocational",
  "method": "One-on-one",
  "dosage": "Open entry/exit",
  "completionRate": "N/A",
  "cost": "$1,750",
  "firstYearEmployment": "68%",
  "thirdYearEmployment": "73%",
  "firstYearReincarceration": "18.3%",
  "thirdYearReincarceration": "21.8%",
  "firstYearRevocation": "16.2%",
  "thirdYearRevocation": "17.7%",
}

REPORT_CARD_ZERO_TOLERANCE = {
  "title": "Program F",
  "description": "This is a treatment program geared towards the emphasis of both positive and negative feedback to curb the abuse and distribution of hard drugs. Targeted treatment is provided by medical professionals with support from correctional officers to identify and report on counterproductive behaviors.",
  "type": "Treatment",
  "method": "One-on-one",
  "dosage": "Open entry/exit",
  "completionRate": "N/A",
  "cost": "$1,600",
  "firstYearEmployment": "40%",
  "thirdYearEmployment": "47%",
  "firstYearReincarceration": "19.9%",
  "thirdYearReincarceration": "25.5%",
  "firstYearRevocation": "17.2%",
  "thirdYearRevocation": "21.5%",
}

CARDS = {
  "report-card-program-ged": REPORT_CARD_GED,
  "report-card-program-good-thoughts": REPORT_CARD_GOOD_THOUGHTS,
  "report-card-program-prison-entrepreneurship": REPORT_CARD_PRISON_ENTREPRENEURSHIP,
  "report-card-program-rough-rider": REPORT_CARD_ROUGH_RIDERS,
  "report-card-program-work-placement": REPORT_CARD_WORK_PLACEMENT,
  "report-card-program-zero-tolerance": REPORT_CARD_ZERO_TOLERANCE,
}

function ReplaceContentInContainer(id, content) {
  var container = document.getElementById(id);
  container.innerHTML = content;
}

function LoadReportCard(programId) {
  card = CARDS[programId];
  ReplaceContentInContainer("report-card-title", card.title);
  ReplaceContentInContainer("report-card-description", card.description);
  ReplaceContentInContainer("report-card-type", card.type);
  ReplaceContentInContainer("report-card-method", card.method);
  ReplaceContentInContainer("report-card-dosage", card.dosage);
  ReplaceContentInContainer("report-card-completion-rate", card.completionRate);
  ReplaceContentInContainer("report-card-cost", card.cost);
  ReplaceContentInContainer("report-card-employment-1", card.firstYearEmployment);
  ReplaceContentInContainer("report-card-employment-3", card.thirdYearEmployment);
  ReplaceContentInContainer("report-card-reincarceration-1", card.firstYearReincarceration);
  ReplaceContentInContainer("report-card-reincarceration-3", card.thirdYearReincarceration);
  ReplaceContentInContainer("report-card-revocation-1", card.firstYearRevocation);
  ReplaceContentInContainer("report-card-revocation-3", card.thirdYearRevocation);
}
