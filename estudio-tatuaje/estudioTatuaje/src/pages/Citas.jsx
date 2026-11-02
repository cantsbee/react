import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { useAuth } from '../context/useAuth.js'
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '../api/client.js'
import {
  Page,
  PageTitle,
  PageIntro,
  Form,
  Field,
  Input,
  TextArea,
  FormError,
  FormSuccess,
  FullButton,
  FieldError,
} from '../styles/formComponents.js'

const appointmentSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().max(30, 'Máximo 30 caracteres').optional().or(z.literal('')),
  date: z.string().min(1, 'Elige una fecha'),
  bodyPart: z.string().max(80, 'Máximo 80 caracteres').optional().or(z.literal('')),
  idea: z.string().min(10, 'Describe tu idea (mínimo 10 caracteres)').max(1000),
})

const List = styled.ul`
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 720px;
`
const Item = styled(motion.li)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0.85rem 1rem;
  text-align: left;

  small {
    color: ${({ theme }) => theme.colors.muted};
  }
`
const Badge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;

  ${({ $status, theme }) =>
    $status === 'pendiente' &&
    `background: ${theme.colors.warningBg}; color: ${theme.colors.warningText};`}
  ${({ $status, theme }) =>
    $status === 'confirmada' &&
    `background: ${theme.colors.successBg}; color: ${theme.colors.green};`}
  ${({ $status, theme }) =>
    $status === 'cancelada' &&
    `background: ${theme.colors.dangerBg}; color: ${theme.colors.danger};`}
`
const AdminActions = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
`
const SmallButton = styled.button`
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  box-shadow: none;
  font-weight: 600;

  ${({ $variant }) =>
    $variant === 'cancel' &&
    `background: rgba(180,50,50,0.12); color: #B33333;`}
  ${({ $variant }) =>
    $variant === 'confirm' &&
    `background: rgba(47,107,47,0.15); color: #2F6B2F;`}
`
const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.green};
  text-align: center;
`
const Empty = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`

export default function Citas() {
  const { user, isAdmin } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [status, setStatus] = useState({ error: null, success: false })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(appointmentSchema) })

  const loadAppointments = useCallback(async () => {
    // Solo los usuarios logueados pueden ver el listado (la API lo exige)
    if (!user) return
    try {
      const data = await getAppointments()
      setAppointments(data)
    } catch (err) {
      setStatus((s) => ({ ...s, error: err.message }))
    }
  }, [user])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  async function onSubmit(values) {
    setStatus({ error: null, success: false })
    try {
      await createAppointment(values)
      reset()
      setStatus({ error: null, success: true })
      loadAppointments()
    } catch (err) {
      setStatus({ error: err.message, success: false })
    }
  }

  async function handleChangeStatus(id, newStatus) {
    try {
      await updateAppointmentStatus(id, newStatus)
      loadAppointments()
    } catch (err) {
      setStatus((s) => ({ ...s, error: err.message }))
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAppointment(id)
      loadAppointments()
    } catch (err) {
      setStatus((s) => ({ ...s, error: err.message }))
    }
  }

  return (
    <Page
      as={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageTitle>Reserva tu cita</PageTitle>
      <PageIntro>Completa el formulario y te contactaremos para confirmar tu cita.</PageIntro>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field>
          Nombre *
          <Input
            placeholder="Tu nombre"
            defaultValue={user?.name || ''}
            $invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          Email *
          <Input
            type="email"
            placeholder="tu@email.com"
            defaultValue={user?.email || ''}
            $invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          Teléfono
          <Input placeholder="600 000 000" $invalid={!!errors.phone} {...register('phone')} />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </Field>

        <Field>
          Fecha deseada *
          <Input type="date" $invalid={!!errors.date} {...register('date')} />
          {errors.date && <FieldError>{errors.date.message}</FieldError>}
        </Field>

        <Field $full>
          Zona del cuerpo
          <Input
            placeholder="antebrazo, hombro…"
            $invalid={!!errors.bodyPart}
            {...register('bodyPart')}
          />
          {errors.bodyPart && <FieldError>{errors.bodyPart.message}</FieldError>}
        </Field>

        <Field $full>
          Idea de tatuaje *
          <TextArea
            rows={4}
            placeholder="Describe tu idea: estilo, tamaño, referencias..."
            $invalid={!!errors.idea}
            {...register('idea')}
          />
          {errors.idea && <FieldError>{errors.idea.message}</FieldError>}
        </Field>

        {status.error && <FormError>{status.error}</FormError>}
        {status.success && (
          <FormSuccess>¡Solicitud enviada! Te contactaremos para confirmar.</FormSuccess>
        )}

        <FullButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Solicitar cita'}
        </FullButton>
      </Form>

      {user ? (
        <>
          <SectionTitle>
            {isAdmin ? 'Todas las citas' : 'Mis citas'} ({appointments.length})
          </SectionTitle>
          {appointments.length === 0 ? (
            <Empty>Aún no hay citas registradas.</Empty>
          ) : (
            <List>
              {appointments.map((a) => (
                <Item
                  key={a._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <strong>{a.client?.name || 'Cliente'}</strong> — {a.client?.email}
                    <br />
                    <span>{new Date(a.date).toLocaleDateString()}</span>
                    {a.bodyPart ? <span> · {a.bodyPart}</span> : null}
                    <br />
                    <small>{a.idea}</small>
                    {isAdmin && (
                      <AdminActions>
                        <SmallButton
                          $variant="confirm"
                          type="button"
                          onClick={() => handleChangeStatus(a._id, 'confirmada')}
                        >
                          Confirmar
                        </SmallButton>
                        <SmallButton
                          $variant="cancel"
                          type="button"
                          onClick={() => handleChangeStatus(a._id, 'cancelada')}
                        >
                          Cancelar
                        </SmallButton>
                        <SmallButton type="button" onClick={() => handleDelete(a._id)}>
                          Eliminar
                        </SmallButton>
                      </AdminActions>
                    )}
                  </div>
                  <Badge $status={a.status}>{a.status}</Badge>
                </Item>
              ))}
            </List>
          )}
        </>
      ) : (
        <Empty>Inicia sesión para ver tus citas.</Empty>
      )}
    </Page>
  )
}
