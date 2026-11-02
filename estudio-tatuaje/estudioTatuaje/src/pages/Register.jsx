import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { useAuth } from '../context/useAuth.js'
import {
  Page,
  PageTitle,
  PageIntro,
  Form,
  Field,
  Input,
  FormError,
  FullButton,
  FieldError,
} from '../styles/formComponents.js'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  })

const Hint = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;

  a {
    color: ${({ theme }) => theme.colors.green};
    font-weight: 600;
  }
`

export default function Register() {
  const { register: signUp } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values) {
    setServerError(null)
    try {
      await signUp(values.name, values.email, values.password)
      navigate('/citas')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <Page
      as={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageTitle>Crear cuenta</PageTitle>
      <PageIntro>Regístrate para solicitar y seguir tus citas.</PageIntro>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field $full>
          Nombre
          <Input
            placeholder="Tu nombre"
            $invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field $full>
          Email
          <Input
            type="email"
            placeholder="tu@email.com"
            $invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          Contraseña
          <Input
            type="password"
            placeholder="••••••••"
            $invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        <Field>
          Repetir contraseña
          <Input
            type="password"
            placeholder="••••••••"
            $invalid={!!errors.confirm}
            {...register('confirm')}
          />
          {errors.confirm && <FieldError>{errors.confirm.message}</FieldError>}
        </Field>

        {serverError && <FormError>{serverError}</FormError>}

        <FullButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
        </FullButton>
      </Form>

      <Hint>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </Hint>
    </Page>
  )
}
