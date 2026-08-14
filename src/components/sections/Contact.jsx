import { useState } from 'react'
import emailjs from '@emailjs/browser'
import GlassPanel from '../ui/GlassPanel'
import DeployButton from '../ui/DeployButton'
import { IDENTITY } from '../../data/identity'

export default function Contact({ onDeployPulse }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (onDeployPulse) onDeployPulse()

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Smart Fallback if .env keys are not configured yet
    if (!serviceId || !templateId || !publicKey) {
      setStatus('loading')
      setStatusMsg('Opening direct email client fallback...')

      const mailSubject = encodeURIComponent(
        formData.subject.trim() || `Portfolio Contact from ${formData.name || 'Visitor'}`
      )
      const mailBody = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )

      setTimeout(() => {
        window.location.href = `mailto:${IDENTITY.email}?subject=${mailSubject}&body=${mailBody}`
        setStatus('idle')
        setStatusMsg('')
      }, 500)
      return
    }

    try {
      setStatus('loading')
      setStatusMsg('Transmitting message payload via EmailJS...')

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email,
        subject: formData.subject.trim() || `Portfolio Contact from ${formData.name}`,
        message: formData.message,
        to_name: IDENTITY.name || 'Sachin Rawal',
        to_email: IDENTITY.email,
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      setStatus('success')
      setStatusMsg("✓ Transmission successful! Message delivered directly to Sachin's inbox.")
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => {
        setStatus('idle')
        setStatusMsg('')
      }, 6000)
    } catch (err) {
      console.error('EmailJS Transmission Error:', err)
      setStatus('error')
      setStatusMsg('⚠️ Direct transmission failed. Opening mail client fallback...')

      setTimeout(() => {
        const mailSubject = encodeURIComponent(
          formData.subject.trim() || `Portfolio Contact from ${formData.name}`
        )
        const mailBody = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )
        window.location.href = `mailto:${IDENTITY.email}?subject=${mailSubject}&body=${mailBody}`
      }, 1000)
    }
  }

  return (
    <section id="contact" aria-label="Deployment — Contact" className="relative z-10 px-6 py-20 md:px-12 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <GlassPanel className="p-6 sm:p-10">
          {/* Section Telemetry Header */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3.5 py-1 font-mono text-xs text-signal mb-3">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>ONLINE — AVAILABLE FOR INTERNSHIPS &amp; CONTRACTS</span>
            </div>

            <p className="font-mono text-xs tracking-wide text-mist">$ deploy --target=production</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foam sm:text-4xl">
              Model Ready For Deployment.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foam/80">
              Looking for the next high-impact AI/ML engineering problem to solve. Transmit a direct message below or reach out via email.
            </p>
          </div>

          {/* Interactive Direct Message Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="contact-name" className="font-mono text-xs text-mist">
                  $ input.name <span className="text-signal">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Mercer"
                  className="rounded-lg border border-hairline/80 bg-void/80 px-4 py-2.5 font-mono text-xs text-foam placeholder:text-mist/50 transition-colors duration-200 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal select-text pointer-events-auto relative z-10"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="contact-email" className="font-mono text-xs text-mist">
                  $ input.email <span className="text-signal">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  className="rounded-lg border border-hairline/80 bg-void/80 px-4 py-2.5 font-mono text-xs text-foam placeholder:text-mist/50 transition-colors duration-200 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal select-text pointer-events-auto relative z-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="contact-subject" className="font-mono text-xs text-mist">
                $ input.subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Inquiry / Internship Opportunity"
                className="rounded-lg border border-hairline/80 bg-void/80 px-4 py-2.5 font-mono text-xs text-foam placeholder:text-mist/50 transition-colors duration-200 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal select-text pointer-events-auto relative z-10"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="contact-message" className="font-mono text-xs text-mist">
                $ input.message <span className="text-signal">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project, role, or technical challenge..."
                className="rounded-lg border border-hairline/80 bg-void/80 px-4 py-2.5 font-mono text-xs text-foam placeholder:text-mist/50 transition-colors duration-200 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal resize-y select-text pointer-events-auto relative z-10"
              />
            </div>

            {/* Form Submit CTA */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-3 font-mono text-xs sm:text-sm font-semibold transition-all duration-200 sm:w-auto ${
                  status === 'loading'
                    ? 'border-signal/40 bg-signal/20 text-foam cursor-wait'
                    : 'border-signal/60 bg-signal/15 text-foam shadow-[0_0_20px_rgba(242,145,75,0.2)] hover:border-signal hover:bg-signal/25 hover:shadow-[0_0_30px_rgba(242,145,75,0.35)] active:scale-[0.99]'
                }`}
              >
                {status === 'loading' ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-signal animate-ping" />
                    <span>[ TRANSMITTING... ]</span>
                  </>
                ) : (
                  <span>[ TRANSMIT MESSAGE → ]</span>
                )}
              </button>

              {statusMsg && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-3 font-mono text-xs animate-fadeIn ${
                    status === 'success'
                      ? 'text-emerald-400'
                      : status === 'error'
                      ? 'text-amber-400'
                      : 'text-signal'
                  }`}
                >
                  {statusMsg}
                </p>
              )}
            </div>
          </form>

          {/* Divider & Direct Links */}
          <div className="mt-10 border-t border-hairline/80 pt-8 text-center">
            <p className="font-mono text-xs text-mist">Or contact directly via email:</p>
            <a
              href={`mailto:${IDENTITY.email}`}
              className="mt-2 inline-block break-all font-mono text-xl sm:text-2xl font-medium text-signal underline decoration-signal/30 underline-offset-4 transition-colors duration-200 hover:decoration-signal"
            >
              {IDENTITY.email}
            </a>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <DeployButton href={`mailto:${IDENTITY.email}`} onPulse={onDeployPulse}>
                [ EMAIL DIRECT ]
              </DeployButton>
              <DeployButton href={IDENTITY.github} target="_blank" onPulse={onDeployPulse}>
                [ GITHUB ]
              </DeployButton>
              <DeployButton href={IDENTITY.linkedin} target="_blank" onPulse={onDeployPulse}>
                [ LINKEDIN ]
              </DeployButton>
              <DeployButton href={IDENTITY.resume} download onPulse={onDeployPulse}>
                [ DOWNLOAD RÉSUMÉ ]
              </DeployButton>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  )
}
