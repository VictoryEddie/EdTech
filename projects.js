/**
 * ─────────────────────────────────────────────────────────────
 *  EDTECH — PORTFOLIO CMS
 *  Edit this file to add, remove, or update portfolio projects.
 *  Save and refresh — cards render automatically. No HTML edits needed.
 *
 *  FIELDS
 *  ──────
 *  title      (string)  — project display name
 *  tag        (string)  — label shown in orange above the title
 *                         e.g. "Web Design", "Web Development", "Web Application"
 *  category   (string)  — filter bucket. Must be one of:
 *                         "landing-page" | "business-site"
 *  url        (string)  — live project link (opens in new tab)
 *  image      (string)  — path relative to project root, e.g. "./images/myproject.png"
 *  alt        (string)  — image alt text (for accessibility & SEO)
 *
 *  ORDER: Projects render top-left → right, row by row. Re-order
 *  the array to change the display order.
 * ─────────────────────────────────────────────────────────────
 */

const PROJECTS = [
  {
    title:    'Edu Results',
    tag:      'Web Application',
    category: 'business-site',
    url:      'https://edu-results.vercel.app/',
    image:    './images/eduResults.png',
    alt:      'Edu Results Portal',
  },
  {
    title:    'Flavour Index',
    tag:      'Web Development',
    category: 'business-site',
    url:      'https://flavour-index.vercel.app/',
    image:    './images/flavour-index.png',
    alt:      'Flavour Index Platform',
  },
  {
    title:    'Olive Extraordinaire',
    tag:      'Web Design',
    category: 'business-site',
    url:      'https://olive-extraordinaire.vercel.app/',
    image:    './images/extraordinaire.png',
    alt:      'Olive Extraordinaire',
  },
  {
    title:    'Mood. Cafe',
    tag:      'Web Design',
    category: 'landing-page',
    url:      'https://mood-cafe-eight.vercel.app/',
    image:    './images/MoodScreenGrab.png',
    alt:      'Mood. Cafe Experience',
  },
  {
    title:    'Cafe Noir.',
    tag:      'Web Design',
    category: 'landing-page',
    url:      'https://cafe-noir-sigma.vercel.app/',
    image:    './images/NoirScreenGrab.png',
    alt:      'Cafe Noir Website',
  },
  {
    title:    'Terms of Service',
    tag:      'Web Development',
    category: 'business-site',
    url:      'https://term-of-services.vercel.app/',
    image:    './images/TermsOfService.png',
    alt:      'Terms of Service Web App',
  },
];
