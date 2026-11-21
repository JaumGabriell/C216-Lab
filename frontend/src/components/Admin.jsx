import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from './Icon'
import { listSpaces, createSpace, updateSpace } from '../services/space'
import { listReservations, cancelReservation } from '../services/reservation'
import { logout } from '../services/user'

const today = () => new Date().toISOString().slice(0, 10)
const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`))

export default function Admin({ session }) {
  const [spaces, setSpaces] = useState([])
  const [reservations, setReservations] = useState([])
  const [view, setView] = useState('overview')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [spaceData, reservationData] = await Promise.all([listSpaces(), listReservations()])
      setSpaces(spaceData)
      setReservations(reservationData)
    } catch (error) {
      setNotice(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadData)
  }, [loadData])

  const confirmed = reservations.filter((item) => item.status === 'confirmed')
  const filteredSpaces = useMemo(() => spaces.filter((space) =>
    `${space.name} ${space.location}`.toLowerCase().includes(search.toLowerCase())
  ), [spaces, search])
  const filteredReservations = useMemo(() => reservations.filter((item) =>
    `${item.requester_name} ${item.requester_email}`.toLowerCase().includes(search.toLowerCase())
  ), [reservations, search])

  async function handleLogout() {
    await logout().catch(() => {})
    localStorage.removeItem('roomly_session')
    window.location.replace('/login')
  }

  async function toggleSpace(space) {
    try {
      await updateSpace(space.id, { is_active: !space.is_active })
      setNotice(space.is_active ? 'Espaço desativado.' : 'Espaço ativado.')
      await loadData()
    } catch (error) {
      setNotice(error.message)
    }
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
          <button className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')}><Icon name="grid"/>Visão geral</button>
          <button className={view === 'spaces' ? 'active' : ''} onClick={() => setView('spaces')}><Icon name="door"/>Espaços</button>
          <button className={view === 'reservations' ? 'active' : ''} onClick={() => setView('reservations')}><Icon name="calendar"/>Reservas</button>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">{session.user.name.slice(0, 2).toUpperCase()}</div>
          <div><strong>{session.user.name}</strong><span>Administrador</span></div>
          <button className="logout-button" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="search-box"><Icon name="search" size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar espaços ou reservas"/></div>
          <button className="primary" onClick={() => setModal(true)}><Icon name="plus" size={18}/>Novo espaço</button>
        </header>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')}><Icon name="close" size={16}/></button></div>}
        <div className="content">
          {loading ? <div className="loading">Carregando...</div> : <>
            {view !== 'reservations' && <>
              <div className="page-heading"><div><span className="eyebrow">Painel administrativo</span><h1>{view === 'spaces' ? 'Espaços' : 'Boa tarde'}</h1></div></div>
              <section className="stats">
                <article><div className="stat-icon purple"><Icon name="door"/></div><div><span>Total de espaços</span><strong>{spaces.length}</strong></div></article>
                <article><div className="stat-icon green"><Icon name="calendar"/></div><div><span>Reservas confirmadas</span><strong>{confirmed.length}</strong></div></article>
                <article><div className="stat-icon blue"><Icon name="clock"/></div><div><span>Reservas hoje</span><strong>{reservations.filter((item) => item.status === 'confirmed' && item.reservation_date === today()).length}</strong></div></article>
              </section>
            </>}
            {(view === 'overview' || view === 'spaces') && <SpaceSection spaces={filteredSpaces} onToggle={toggleSpace}/>}
            {(view === 'overview' || view === 'reservations') && <ReservationSection reservations={filteredReservations} spaces={spaces} onCancel={handleCancel}/>}
          </>}
        </div>
      </main>
      {modal && <SpaceModal onClose={() => setModal(false)} onSuccess={async (message) => { setModal(false); setNotice(message); await loadData() }}/>}
    </div>
  )
}

function SpaceSection({ spaces, onToggle }) {
  return <section className="section">
    <div className="section-heading"><div><span className="eyebrow">Infraestrutura</span><h2>Espaços disponíveis</h2></div></div>
    {spaces.length ? <div className="space-grid">{spaces.map((space) =>
      <article className="space-card" key={space.id}>
        <div className="space-art"><div className="room-lines"><span/><span/><span/></div><div className="status-dot" data-active={space.is_active}>{space.is_active ? 'Disponível' : 'Inativo'}</div></div>
        <div className="space-body"><h3>{space.name}</h3><p>{space.description || 'Espaço preparado para reuniões e atividades.'}</p>
          <div className="space-meta"><span><Icon name="pin" size={16}/>{space.location}</span><span><Icon name="users" size={16}/>{space.capacity} pessoas</span></div>
          <button className="secondary" onClick={() => onToggle(space)}>{space.is_active ? 'Desativar espaço' : 'Ativar espaço'}</button>
        </div>
      </article>
    )}</div> : <div className="empty"><Icon name="door" size={28}/><h3>Nenhum espaço encontrado</h3></div>}
  </section>
}

function ReservationSection({ reservations, spaces, onCancel }) {
  return <section className="section">
    <div className="section-heading"><div><span className="eyebrow">Agenda</span><h2>Reservas</h2></div></div>
    <div className="table-wrap"><table><thead><tr><th>Solicitante</th><th>Espaço</th><th>Data</th><th>Horário</th><th>Status</th><th></th></tr></thead><tbody>
      {reservations.map((item) => {
        const space = spaces.find((candidate) => candidate.id === item.space_id)
        return <tr key={item.id}><td><strong>{item.requester_name}</strong><span>{item.requester_email}</span></td><td>{space?.name || `Espaço #${item.space_id}`}</td><td>{formatDate(item.reservation_date)}</td><td>{item.start_time.slice(0,5)} - {item.end_time.slice(0,5)}</td><td><span className={`badge ${item.status}`}>{item.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</span></td><td>{item.status === 'confirmed' && <button className="cancel-button" onClick={() => onCancel(item.id)}>Cancelar</button>}</td></tr>
      })}
    </tbody></table>{!reservations.length && <div className="empty table-empty"><Icon name="calendar" size={28}/><h3>Nenhuma reserva encontrada</h3></div>}</div>
  </section>
}

function SpaceModal({ onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await createSpace({ name: form.get('name'), description: form.get('description'), capacity: Number(form.get('capacity')), location: form.get('location'), is_active: true })
      onSuccess('Espaço criado com sucesso.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }
  return <div className="modal-backdrop"><div className="modal" role="dialog"><div className="modal-heading"><div><span className="eyebrow">Cadastro</span><h2>Novo espaço</h2></div><button className="icon-button" onClick={onClose}><Icon name="close"/></button></div>
    <form onSubmit={submit}><label>Nome do espaço<input name="name" required maxLength="100"/></label><label>Localização<input name="location" required maxLength="150"/></label><label>Capacidade<input name="capacity" type="number" min="1" required/></label><label>Descrição<textarea name="description" rows="3"/></label>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar cadastro'}</button></div></form>
  </div></div>
}