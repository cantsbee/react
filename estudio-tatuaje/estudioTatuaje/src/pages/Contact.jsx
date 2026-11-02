import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'

import { sendMessage } from '../api/client.js'
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

const contactSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'Escribe al menos 10 caracteres').max(2000),
})

export default function Contact() {
  const [status, setStatus] = useState({ error: null, success: false })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values) {
    setStatus({ error: null, success: false })
    try {
      await sendMessage(values)
      reset()
      setStatus({ error: null, success: true })
    } catch (err) {
      setStatus({ error: err.message, success: false })
    }
  }

  return (
    <Page
      as={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageTitle>Contacto</PageTitle>
      <PageIntro>¿Tienes dudas? Escríbenos y te responderemos pronto.</PageIntro>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field $full>
          Nombre *
          <Input placeholder="Tu nombre" $invalid={!!errors.name} {...register('name')} />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field $full>
          Email *
          <Input
            type="email"
            placeholder="tu@email.com"
            $invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field $full>
          Mensaje *
          <TextArea
            rows={5}
            placeholder="¿En qué podemos ayudarte?"
            $invalid={!!errors.message}
            {...register('message')}
          />
          {errors.message && <FieldError>{errors.message.message}</FieldError>}
        </Field>

        {status.error && <FormError>{status.error}</FormError>}
        {status.success && <FormSuccess>¡Mensaje enviado! Gracias por escribirnos.</FormSuccess>}

        <FullButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
        </FullButton>
      </Form>
    </Page>
  )
}
