'use client'

import { Button, Stack, Typography } from '@mui/joy'
import { FormInput } from '@/app/ui/form-input'
import { FormTextarea } from '@/app/ui/form-textarea'
import { FormProvider, useForm } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add'
import { useCallback } from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormImage } from '@/app/ui/form-image'
import styles from './quiz-form.module.scss'

const schema = z.object({
  title: z.string().nonempty('Please enter a title'),
  description: z.string().nonempty('Please enter a description'),
  image: z.string().nonempty('Please upload an image'),
})

type QuizData = z.infer<typeof schema>

interface QuizFormProps {
  /**
   * "existingQuiz" prop should be passed only if you want the form to behave
   * as an "Update" form for an existing quiz.
   *
   * Otherwise, if not passed it will behave as "Create" form
   */
  existingQuiz?: QuizData
}

export function QuizForm({ existingQuiz }: QuizFormProps) {
  const form = useForm<QuizData>({
    resolver: zodResolver(schema),
    defaultValues: existingQuiz,
  })

  const onSubmit = useCallback((data: QuizData) => {
    console.log('debugging quiz data', data)
  }, [])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <Typography level="h3">Create New Quiz</Typography>

          <div className={styles.overviewSection}>
            <Stack direction="column" spacing={3}>
              <FormInput name="title" label="Title" />
              <FormTextarea name="description" label="Description" minRows={4} maxRows={6} />
            </Stack>

            <FormImage name="image" label="Image" />
          </div>

          <div>
            <Button startDecorator={<AddIcon />} type="submit">
              Create
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
