import { useEffect, useState, type FormEvent } from 'react'

export interface ServiceCatalogItem {
  service: string
  grossEUR: number
  marginEUR: number
  totalEUR: number
}

export interface Client {
  id: string
  name: string
  email: string
  services: string[]
  createdAt: string
}

interface Props {
  catalog: ServiceCatalogItem[]
}

const STORAGE_KEY = '42c-lab-clients'

function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n)
}

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Client[]) : []
  } catch {
    return []
  }
}

function saveClients(clients: Client[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  } catch {
    // stockage indisponible (mode privé, quota…) : on ignore silencieusement
  }
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function AdminPanel({ catalog }: Props) {
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    setClients(loadClients())
  }, [])

  function toggleService(service: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(service)) next.delete(service)
      else next.add(service)
      return next
    })
  }

  function resetForm() {
    setName('')
    setEmail('')
    setSelected(new Set())
    setFormError(null)
  }

  function handleAddClient(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setFormError('Le nom du client est requis.')
      return
    }
    if (selected.size === 0) {
      setFormError('Sélectionne au moins un service AWS.')
      return
    }
    const newClient: Client = {
      id: makeId(),
      name: name.trim(),
      email: email.trim(),
      services: Array.from(selected),
      createdAt: new Date().toISOString(),
    }
    const next = [...clients, newClient]
    setClients(next)
    saveClients(next)
    resetForm()
  }

  function handleDelete(id: string) {
    const next = clients.filter((c) => c.id !== id)
    setClients(next)
    saveClients(next)
  }

  function totalsFor(services: string[]) {
    return services.reduce(
      (acc, s) => {
        const item = catalog.find((c) => c.service === s)
        if (item) {
          acc.gross += item.grossEUR
          acc.margin += item.marginEUR
          acc.total += item.totalEUR
        }
        return acc
      },
      { gross: 0, margin: 0, total: 0 },
    )
  }

  if (catalog.length === 0) {
    return (
      <div className='card'>
        <h3>Administration clients</h3>
        <div className='empty-state'>
          Aucune donnée de coût sur la période sélectionnée pour composer le catalogue de services.
        </div>
      </div>
    )
  }

  return (
    <div className='admin-panel'>
      <div className='admin-grid'>
        <div className='card'>
          <h3>Ajouter un client</h3>
          <div className='sub'>Sélectionne les services AWS facturés à ce client</div>
          <form onSubmit={handleAddClient} className='client-form'>
            <div className='form-row'>
              <label>Nom du client</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Editions Galaxie'
              />
            </div>
            <div className='form-row'>
              <label>Email de contact</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='contact@editions-galaxie.fr'
              />
            </div>
            <div className='form-row'>
              <label>
                Services AWS ({selected.size} sélectionné{selected.size > 1 ? 's' : ''})
              </label>
              <div className='service-checklist'>
                {catalog.map((item) => (
                  <label key={item.service} className='service-check-item'>
                    <input
                      type='checkbox'
                      checked={selected.has(item.service)}
                      onChange={() => toggleService(item.service)}
                    />
                    <span className='service-check-name'>{item.service}</span>
                    <span className='service-check-price'>
                      {formatEUR(item.grossEUR)} <span className='arrow'>→</span>{' '}
                      {formatEUR(item.totalEUR)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {formError && <div className='form-error'>{formError}</div>}
            <button type='submit' className='btn btn-primary'>
              ➕ Ajouter le client
            </button>
          </form>
        </div>

        <div className='card'>
          <h3>Catalogue des services AWS</h3>
          <div className='sub'>Prix avant / après facturation, sur la période sélectionnée</div>
          <div className='table-scroll'>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th className='num'>Avant facture (brut)</th>
                  <th className='num'>Après facture (+ marge)</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((item) => (
                  <tr key={item.service}>
                    <td>
                      <span className='pill pill-aws'>{item.service}</span>
                    </td>
                    <td className='num'>{formatEUR(item.grossEUR)}</td>
                    <td className='num'>{formatEUR(item.totalEUR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='card'>
        <h3>Clients ({clients.length})</h3>
        <div className='sub'>
          Services assignés et facturation associée sur la période sélectionnée
        </div>
        {clients.length === 0 ? (
          <div className='empty-state'>Aucun client pour l'instant. Ajoute-en un ci-dessus.</div>
        ) : (
          <div className='table-scroll'>
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Services</th>
                  <th className='num'>Avant facture</th>
                  <th className='num'>Après facture</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const totals = totalsFor(c.services)
                  return (
                    <tr key={c.id}>
                      <td>
                        <b>{c.name}</b>
                        {c.email && <div className='client-email'>{c.email}</div>}
                      </td>
                      <td>
                        <div className='client-services'>
                          {c.services.map((s) => (
                            <span key={s} className='pill pill-aws'>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className='num'>{formatEUR(totals.gross)}</td>
                      <td className='num'>{formatEUR(totals.total)}</td>
                      <td>
                        <button className='btn btn-danger' onClick={() => handleDelete(c.id)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
