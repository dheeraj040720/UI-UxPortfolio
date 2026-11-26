export const siteConfig = {
  name: 'Dheeraj',
  fullName: 'Dheeraj Kumar',
  role: 'Product Designer & UI/UX Engineer',
  eyebrow: 'Full-Stack Developer → UI/UX Designer',
  headline: 'Designing calm, clear interfaces grounded in how software is actually built.',
  intro:
    'Previously building production web systems with React, TypeScript, and Java/Spring Boot. Now focused on user research, interaction design, and accessible design systems.',
  email: 'hello@yourdomain.com',
  location: 'Available for Product & UI/UX Design roles',
  resumeUrl: '/resume.pdf',
  links: {
    linkedin: 'https://linkedin.com/in/your-profile',
    github: 'https://github.com/dheeraj040720',
  },
  categories: ['All', 'Web', 'Mobile', 'Dashboard', 'Design System'] as const,
  capabilities: [
    {
      title: 'Product & UX Design',
      description:
        'Turning ambiguous user problems into clear flows through user interviews, information architecture, wireframing, and usability testing.',
      items: ['User Research & Synthesis', 'Information Architecture', 'Wireframing & Flows', 'Usability Testing'],
    },
    {
      title: 'UI & Design Systems',
      description:
        'Crafting accessible, consistent component libraries with clean typography, responsive grids, and interactive Figma prototypes.',
      items: ['Figma & Auto-Layout', 'Design Tokens', 'WCAG AA Accessibility', 'Interactive Prototyping'],
    },
    {
      title: 'Engineering Foundation',
      description:
        'Fluent in the technical constraints of shipping software, enabling seamless collaboration and realistic handoffs with engineering teams.',
      items: ['React & TypeScript', 'HTML / CSS / Tailwind', 'Java & Spring Boot', 'REST APIs & SQL'],
    },
  ],
  experience: [
    {
      period: '2024 — Present',
      role: 'UI/UX & Product Design (Transition)',
      org: 'Independent Case Studies & Freelance',
      detail: 'Designed end-to-end web, mobile, and dashboard case studies with user research, Figma systems, and interactive prototypes.',
    },
    {
      period: '2022 — 2024',
      role: 'Full-Stack Software Developer',
      org: 'Enterprise Web Applications',
      detail: 'Built customer-facing React/TypeScript interfaces and Java/Spring Boot microservices, partnering closely with product designers.',
    },
  ],
};
