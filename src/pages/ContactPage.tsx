import { useState, type FormEvent } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { siteConfig } from '../config/site';
import { FadeUp } from '../components/MotionPrimitives';

export function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name || 'Visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="mx-auto max-w-container px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <FadeUp className="space-y-6 lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Contact</p>
          <h1 className="type-page-title text-ink">Get in touch</h1>
          <p className="text-base leading-relaxed text-slate">
            I&apos;m actively looking for UI/UX Designer and Product Designer roles. Feel free to
            reach out about opportunities, case studies, or design systems.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy email address"
                className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-slate hover:text-ink"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.08} className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-line bg-surface p-6 sm:p-8"
          >
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-ink">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink"
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
            >
              Open in Email App
            </button>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
