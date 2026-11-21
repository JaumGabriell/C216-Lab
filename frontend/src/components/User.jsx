import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from './Icon'
import { listSpaces } from '../services/space'
import { listReservations, createReservation, cancelReservation } from '../services/reservation'
import { logout } from '../services/user'

const today = () => new Date().toISOString().slice(0, 10)
const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`))

export default function User({ session }) {
  const [spaces, setSpaces] = useState([])
  const [reservations, setReservations] = useState([])
  const [activeView, setActiveView] = useState('spaces')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [spaceData, reservationData] = await Promise.all([listSpaces(), listReservations()])
      setSpaces(spaceData.filter((space) => space.is_active))
      setReservations(reservationData.filter((item) => item.requester_email.toLowerCase() === session.user.email.toLowerCase()))
    } catch (error) {
      setNotice(error.message)
    } finally {
      setLoading(false)
    }
  }, [session.user.email])

  useEffect(() => {
    Promise.resolve().then(loadData)
  }, [loadData])

  const filteredSpaces = useMemo(() => spaces.filter((space) =>
    `${space.name} ${space.location}`.toLowerCase().includes(search.toLowerCase())
  ), [spaces, search])

  async function handleLogout() {
    await logout().catch(() => {})
    localStorage.removeItem('roomly_session')
    window.location.replace('/login')
  }

  async function handleCancel(id) {
    try {
      await cancelReservation(id)
      setNotice('Reserva cancelada com sucesso.')
      await loadData()
    } catch (error) {
      setNotice(error.message)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Icon name="door" size={22}/></div><span>Roomly</span></div>
        <nav className="nav">
          <button className={activeView === 'spaces' ? 'active' : ''} onClick={() => setActiveView('spaces')}><Icon name="door"/>Espaços</button>
          <button className={activeView === 'reservations' ? 'active' : ''} onClick={() => setActiveView('reservations')}><Icon name="calendar"/>Minhas reservas</button>
        </nav>
        <div className="sidebar-footer"><div className="avatar">{session.user.name.slice(0,2).toUpperCase()}</div><div><strong>{session.user.name}</strong><span>Usuário</span></div><button className="logout-button" onClick={handleLogout}>Sair</button></div>
      </aside>
      <main className="main">
        <header className="topbar"><div className="search-box"><Icon name="search" size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activeView === 'spaces' ? 'Buscar espaços' : 'Buscar minhas reservas'}/></div><button className="primary" onClick={() => setModal(true)}><Icon name="plus" size={18}/>Nova reserva</button></header>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')}><Icon name="close" size={16}/></button></div>}
        <div className="content">
          {loading ? <div className="loading">Carregando...</div> : <>
            <div className="page-heading"><div><span className="eyebrow">Reservas</span><h1>Olá, {session.user.name}</h1></div></div>
            {activeView === 'spaces' && (
              <section className="section"><div className="section-heading"><div><span className="eyebrow">Disponibilidade</span><h2>Encontre um espaço</h2></div></div>
                {filteredSpaces.length ? <div className="space-grid">{filteredSpaces.map((space) => <article className="space-card" key={space.id}><div className="space-art"><div className="room-lines"><span/><span/><span/></div><div className="status-dot" data-active="true">Disponível</div></div><div className="space-body"><h3>{space.name}</h3><p>{space.description || 'Espaço preparado para reuniões e atividades.'}</p><div className="space-meta"><span><Icon name="pin" size={16}/>{space.location}</span><span><Icon name="users" size={16}/>{space.capacity} pessoas</span></div><button className="secondary" onClick={() => setModal(true)}>Reservar</button></div></article>)}</div> : <div className="empty"><Icon name="door" size={28}/><h3>Nenhum espaço disponível</h3></div>}
              </section>
            )}
            {activeView === 'reservations' && (
              <section className="section"><div className="section-heading"><div><span className="eyebrow">Agenda</span><h2>Minhas reservas</h2></div></div>
                <div className="table-wrap"><table><thead><tr><th>Espaço</th><th>Data</th><th>Horário</th><th>Status</th><th></th></tr></thead><tbody>
                  {reservations
                    .filter((item) => {
                      const space = spaces.find((candidate) => candidate.id === item.space_id)
                      return `${space?.name || ''} ${item.reservation_date} ${item.status}`.toLowerCase().includes(search.toLowerCase())
                    })
                    .map((item) => {
                      const space = spaces.find((candidate) => candidate.id === item.space_id)
                      return <tr key={item.id}><td>{space?.name || `Espaço #${item.space_id}`}</td><td>{formatDate(item.reservation_date)}</td><td>{item.start_time.slice(0,5)} - {item.end_time.slice(0,5)}</td><td><span className={`badge ${item.status}`}>{item.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</span></td><td>{item.status === 'confirmed' && <button className="cancel-button" onClick={() => handleCancel(item.id)}>Cancelar</button>}</td></tr>
                    })}
                </tbody></table>
                  {!reservations.length && <div className="empty table-empty"><Icon name="calendar" size={28}/><h3>Você ainda não fez reservas</h3></div>}
                </div>
              </section>
            )}
          </>}
        </div>
      </main>
      {modal && <ReservationModal session={session} spaces={spaces} onClose={() => setModal(false)} onSuccess={async (message) => { setModal(false); setNotice(message); await loadData() }}/>}
    </div>
  )
}

function ReservationModal({ session, spaces, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await createReservation({ space_id: Number(form.get('space_id')), requester_name: session.user.name, requester_email: session.user.email, reservation_date: form.get('reservation_date'), start_time: form.get('start_time'), end_time: form.get('end_time') })
      onSuccess('Reserva criada com sucesso.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }
  return <div className="modal-backdrop"><div className="modal" role="dialog"><div className="modal-heading"><div><span className="eyebrow">Agenda</span><h2>Nova reserva</h2></div><button className="icon-button" onClick={onClose}><Icon name="close"/></button></div><form onSubmit={submit}><label>Espaço<select name="space_id" required defaultValue=""><option value="" disabled>Selecione um espaço</option>{spaces.map((space) => <option value={space.id} key={space.id}>{space.name} — {space.location}</option>)}</select></label><label>Data<input name="reservation_date" type="date" min={today()} required/></label><div className="form-row"><label>Início<input name="start_time" type="time" required/></label><label>Término<input name="end_time" type="time" required/></label></div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary" disabled={submitting}>{submitting ? 'Salvando...' : 'Reservar'}</button></div></form></div></div>
}