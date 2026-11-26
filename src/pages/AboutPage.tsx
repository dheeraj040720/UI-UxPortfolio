import { Download } from 'lucide-react';
import { siteConfig } from '../config/site';
import { FadeUp } from '../components/MotionPrimitives';

export function AboutPage() {
  return (
    <section className="mx-auto max-w-container px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <FadeUp className="lg:col-span-4">
          <div className="flex aspect-[4/5] items-center justify-center rounded-xl border border-line bg-subtle">
            <span className="font-serif text-6xl text-muted">
              {siteConfig.name.charAt(0)}
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.08} className="space-y-8 lg:col-span-8">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">About</p>
            <h1 className="type-page-title text-ink">
              From shipping full-stack code to designing the experiences behind it.
            </h1>
            <p className="text-base leading-relaxed text-slate">
              I spent my early career building web applications with React, TypeScript, and
              Java/Spring Boot. Working directly on production interfaces taught me that the hardest
              problems are rarely technical—they are about clarity, hierarchy, and understanding
              what users actually need.
            </p>
            <p className="text-base leading-relaxed text-slate">
              Today, I bring systems thinking and engineering empathy into UI/UX design—bridging
              research, Figma design systems, and real-world feasibility.
            </p>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-ink">Curriculum Vitae / Resume</h2>
              <p className="text-sm text-slate">PDF format • Updated 2026</p>
            </div>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </div>

          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold text-ink">Experience</h2>
            <div className="space-y-6 border-l border-line pl-6">
              {siteConfig.experience.map((item) => (
                <div key={item.role} className="space-y-1">
                  <span className="font-mono text-xs text-muted">{item.period}</span>
                  <h3 className="text-base font-semibold text-ink">{item.role}</h3>
                  <p className="text-sm font-medium text-accent">{item.org}</p>
                  <p className="text-sm leading-relaxed text-slate">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
