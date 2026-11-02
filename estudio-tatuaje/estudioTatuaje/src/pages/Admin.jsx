import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuth } from '../context/useAuth.js'
import {
  getMessages,
  markMessageRead,
  deleteMessage,
  getGallery,
  uploadGalleryImage,
  deleteGalleryItem,
  getClients,
  getSales,
  getSalesSummary,
} from '../api/client.js'
import { Page, PageTitle, PageIntro, Field, Input, FormError, FormSuccess } from '../styles/formComponents.js'

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`
const Tab = styled.button`
  background: ${({ $active, theme }) => ($active ? theme.colors.green : theme.colors.card)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: none;
  font-size: 0.9rem;
`
const Panel = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
`
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin-bottom: 0.6rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;

  small {
    color: ${({ theme }) => theme.colors.muted};
  }
`
const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
`
const SmallButton = styled.button`
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  box-shadow: none;

  ${({ $danger }) =>
    $danger &&
    `background: rgba(180,50,50,0.12); color: #B33333;`}
`
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`
const Stat = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 1rem;
  text-align: center;

  strong {
    display: block;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.green};
  }
  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 0.5rem 0.6rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }
  th {
    color: ${({ theme }) => theme.colors.green};
    font-size: 0.8rem;
    text-transform: uppercase;
  }
`
const UploadForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  align-items: end;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
`
const GalleryItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }
  div {
    padding: 0.4rem;
    font-size: 0.8rem;
    background: ${({ theme }) => theme.colors.card};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.3rem;
  }
`
const Unread = styled.span`
  background: ${({ theme }) => theme.colors.warningBg};
  color: ${({ theme }) => theme.colors.warningText};
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-weight: 700;
`
const SectionSub = styled.h3`
  color: ${({ theme }) => theme.colors.green};
  margin: 1.5rem 0 0.75rem;
`
const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e5e4e7;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.card};
  font-size: 0.85rem;
`

const TABS = ['resumen', 'citas', 'mensajes', 'galería', 'clientes']

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('resumen')
  const [messages, setMessages] = useState([])
  const [gallery, setGallery] = useState([])
  const [clients, setClients] = useState([])
  const [sales, setSales] = useState([])
  const [summary, setSummary] = useState(null)
  const [feedback, setFeedback] = useState({ error: null, success: null })

  const [upload, setUpload] = useState({ title: '', category: '' })
  const [file, setFile] = useState(null)

  // Limpia el feedback al cambiar de pestaña (en el handler, no en el effect)
  function switchTab(nextTab) {
    setFeedback({ error: null, success: null })
    setTab(nextTab)
  }

  function showError(err) {
    setFeedback((f) => ({ ...f, error: err.message }))
  }

  // Carga los datos de la pestaña activa
  useEffect(() => {
    let cancelled = false
    const guard = (fn) => (value) => {
      if (!cancelled) fn(value)
    }
    const onErr = guard(showError)

    if (tab === 'mensajes') getMessages().then(guard(setMessages)).catch(onErr)
    if (tab === 'galería') getGallery().then(guard(setGallery)).catch(onErr)
    if (tab === 'clientes') {
      getClients().then(guard(setClients)).catch(onErr)
      getSales().then(guard(setSales)).catch(onErr)
    }
    if (tab === 'resumen') {
      getSalesSummary().then(guard(setSummary)).catch(onErr)
      getSales().then(guard(setSales)).catch(onErr)
    }

    return () => {
      cancelled = true
    }
  }, [tab])

  async function handleRead(id) {
    try {
      await markMessageRead(id)
      setMessages((msgs) => msgs.map((m) => (m._id === id ? { ...m, read: true } : m)))
    } catch (err) {
      showError(err)
    }
  }

  async function handleDeleteMessage(id) {
    try {
      await deleteMessage(id)
      setMessages((msgs) => msgs.filter((m) => m._id !== id))
    } catch (err) {
      showError(err)
    }
  }

  async function handleDeleteImage(id) {
    try {
      await deleteGalleryItem(id)
      setGallery((items) => items.filter((i) => i._id !== id))
    } catch (err) {
      showError(err)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    setFeedback({ error: null, success: null })
    if (!file) {
      setFeedback({ error: 'Selecciona una imagen', success: null })
      return
    }
    try {
      const item = await uploadGalleryImage({
        file,
        title: upload.title || file.name,
        category: upload.category || 'general',
      })
      setGallery((items) => [...items, item])
      setUpload({ title: '', category: '' })
      setFile(null)
      e.target.reset()
      setFeedback({ error: null, success: 'Imagen subida a Cloudinary ✓' })
    } catch (err) {
      setFeedback({ error: err.message, success: null })
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <Page
      as={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageTitle>Panel de administración</PageTitle>
      <PageIntro>
        Hola {user.name} · aquí gestionas el estudio.
      </PageIntro>

      <Tabs>
        {TABS.map((t) => (
          <Tab key={t} $active={tab === t} onClick={() => switchTab(t)} type="button">
            {t}
            {t === 'mensajes' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </Tab>
        ))}
      </Tabs>

      {feedback.error && <FormError>{feedback.error}</FormError>}
      {feedback.success && <FormSuccess>{feedback.success}</FormSuccess>}

      <AnimatePresence mode="wait">
        <Panel
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'resumen' && summary && (
            <>
              <StatsGrid>
                <Stat>
                  <strong>€{summary.totalRevenue}</strong>
                  <span>Ingresos totales</span>
                </Stat>
                {summary.byMethod.map((m) => (
                  <Stat key={m._id}>
                    <strong>€{m.total}</strong>
                    <span>
                      {m._id} ({m.count})
                    </span>
                  </Stat>
                ))}
              </StatsGrid>
              <SectionSub>Últimas ventas</SectionSub>
              <Table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Concepto</th>
                    <th>Importe</th>
                    <th>Fecha</th>
                    <th>Método</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 10).map((s) => (
                    <tr key={s._id}>
                      <td>{s.client?.name}</td>
                      <td>{s.concept}</td>
                      <td>€{s.amount}</td>
                      <td>{new Date(s.date).toLocaleDateString()}</td>
                      <td>{s.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {tab === 'citas' && (
            <>
              <SectionSub>Usa la página de Citas para gestionar estados y borrar.</SectionSub>
              <p style={{ color: '#7A6F4F' }}>
                En la pestaña <strong>Citas</strong> del menú superior verás todas las solicitudes
                con botones de confirmar/cancelar/eliminar.
              </p>
            </>
          )}

          {tab === 'mensajes' && (
            <>
              <SectionSub>Mensajes de contacto ({messages.length})</SectionSub>
              {messages.length === 0 && <p style={{ color: '#7A6F4F' }}>No hay mensajes.</p>}
              {messages.map((m) => (
                <Card key={m._id}>
                  <div>
                    <strong>{m.name}</strong> · <small>{m.email}</small>
                    {!m.read && <Unread> nuevo</Unread>}
                    <br />
                    <small>{m.message}</small>
                    <br />
                    <small>{new Date(m.createdAt).toLocaleString()}</small>
                  </div>
                  <Actions>
                    {!m.read && (
                      <SmallButton type="button" onClick={() => handleRead(m._id)}>
                        Marcar leído
                      </SmallButton>
                    )}
                    <SmallButton $danger type="button" onClick={() => handleDeleteMessage(m._id)}>
                      Borrar
                    </SmallButton>
                  </Actions>
                </Card>
              ))}
            </>
          )}

          {tab === 'galería' && (
            <>
              <SectionSub>Subir imagen (Cloudinary)</SectionSub>
              <UploadForm onSubmit={handleUpload}>
                <Field>
                  Título
                  <Input
                    value={upload.title}
                    onChange={(e) => setUpload((u) => ({ ...u, title: e.target.value }))}
                    placeholder="Nombre de la pieza"
                  />
                </Field>
                <Field>
                  Categoría
                  <Input
                    value={upload.category}
                    onChange={(e) => setUpload((u) => ({ ...u, category: e.target.value }))}
                    placeholder="grabado, color…"
                  />
                </Field>
                <Field>
                  Imagen *
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </Field>
                <SmallButton type="submit">Subir</SmallButton>
              </UploadForm>

              <GalleryGrid>
                {gallery.map((item) => (
                  <GalleryItem key={item._id}>
                    <img src={item.url} alt={item.title} />
                    <div>
                      <span>{item.title}</span>
                      <SmallButton $danger type="button" onClick={() => handleDeleteImage(item._id)}>
                        ✕
                      </SmallButton>
                    </div>
                  </GalleryItem>
                ))}
              </GalleryGrid>
            </>
          )}

          {tab === 'clientes' && (
            <>
              <SectionSub>Clientes ({clients.length})</SectionSub>
              <Table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Ciudad</th>
                    <th>Alta</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.city}</td>
                      <td>{c.since ? new Date(c.since).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Panel>
      </AnimatePresence>
    </Page>
  )
}
