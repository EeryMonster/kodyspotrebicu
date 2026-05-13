'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface Props {
  prefillBrand?: string
  prefillApplianceType?: string
  prefillErrorCode?: string
}

const BRANDS = ['Bosch', 'Siemens', 'AEG', 'Electrolux', 'Samsung', 'Beko', 'Miele', 'LG', 'Whirlpool']
const APPLIANCE_TYPES = [
  { value: 'pracka', label: 'Pračka' },
  { value: 'mycka', label: 'Myčka' },
  { value: 'susicka', label: 'Sušička' },
]

export default function ServiceLeadForm({ prefillBrand, prefillApplianceType, prefillErrorCode }: Props) {
  const [zipCode, setZipCode] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [brand, setBrand] = useState(prefillBrand ?? '')
  const [applianceType, setApplianceType] = useState(prefillApplianceType ?? '')
  const [errorCode, setErrorCode] = useState(prefillErrorCode ?? '')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('') // honeypot

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/servis/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode, phone, email, brand, applianceType, errorCode, description, website,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Něco se pokazilo. Zkuste to prosím znovu.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Síťová chyba. Zkuste to prosím znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">Poptávka byla odeslána</h3>
        <p className="text-green-800 leading-relaxed">
          Děkujeme. Ozveme se vám do 3 pracovních dnů s doporučením, jak ve vašem případě
          nejlépe postupovat (značkový servis, lokální partner, případně bezpečné kroky doma).
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
      {/* Honeypot — schované pole, lidé jím neproojdou */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-1.5">
            PSČ <span className="text-red-500">*</span>
          </label>
          <input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="11000"
            required
            maxLength={10}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+420 ..."
            required
            maxLength={30}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
          E-mail <span className="text-gray-400 font-normal">(volitelně)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vas.email@priklad.cz"
          maxLength={100}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Značka
          </label>
          <select
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          >
            <option value="">— vyberte —</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="applianceType" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Typ spotřebiče
          </label>
          <select
            id="applianceType"
            value={applianceType}
            onChange={(e) => setApplianceType(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          >
            <option value="">— vyberte —</option>
            {APPLIANCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="errorCode" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Chybový kód
          </label>
          <input
            id="errorCode"
            type="text"
            value={errorCode}
            onChange={(e) => setErrorCode(e.target.value)}
            placeholder="např. E22"
            maxLength={20}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Popis problému <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Co se děje? Kdy se chyba objevila? Co jste už zkusili?"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-y"
        />
        <p className="text-xs text-gray-500 mt-1">{description.length} / 2000 znaků</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-primary-dark hover:bg-brand-primary text-white font-semibold px-6 py-3.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Odesílám…
          </>
        ) : (
          'Odeslat poptávku'
        )}
      </button>

      <p className="text-xs text-gray-500 leading-relaxed">
        Odesláním souhlasíte se zpracováním osobních údajů (telefon, e-mail, PSČ, popis problému)
        za účelem zprostředkování servisu spotřebiče. Podrobnosti najdete v
        <a href="/zasady-ochrany-osobnich-udaju" className="text-blue-600 hover:underline ml-1">
          zásadách ochrany osobních údajů
        </a>.
      </p>
    </form>
  )
}
