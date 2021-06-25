import React, { useState } from 'react'
import TextInput from './TextInput'
import CheckConfirm from './CheckConfirm'
import { FanartInterface } from '../../interfaces/fanart'
import { createFanart } from '../../api/fanart'
import SubmitButton from './SubmitButton'
import { formDataToObject } from '../../utils/formData'
import styles from './Form.module.scss'

interface propsInterface {
  hidden: boolean
  captchaToken: string
  onSubmit?: () => void
}

interface errorType {
  submission?: string
  creator?: string
  imageUrl?: string
  confirmation?: string
}

export default function FormFanart(props: propsInterface) {
  const { hidden, captchaToken, onSubmit } = props
  const [errors, setErrors] = useState<errorType>({})

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    const formData = new FormData(evt.currentTarget)

    const confirmation = !!formData.get('confirmation')
    formData.delete('confirmation')

    const data = formDataToObject(formData) as FanartInterface

    data.creator = data.creator.trim()
    if (!data.creator) {
      return setErrors({ creator: "This field can't be empty" })
    }

    if (!data.imageUrl) {
      return setErrors({ imageUrl: "This field can't be empty" })
    }

    if (!confirmation) {
      return setErrors({ confirmation: 'You must confirm this' })
    }

    setErrors({})

    onSubmit()

    try {
      await createFanart(data)

      // ToDo : Do something if success
      console.log('success')
    } catch (err) {
      const message = err.response.data.message
      setErrors({ submission: message })
    }
  }

  return (
    <form
      className={`${styles.form} ${hidden ? styles.hide : ''}`}
      onSubmit={handleSubmit}
    >
      <TextInput
        name="creator"
        label="The artist’s name is ..."
        error={errors.creator}
      />

      <TextInput
        name="imageUrl"
        label="The link to the image is ..."
        error={errors.imageUrl}
      />

      <h2>Preview</h2>

      {/*ToDo remove when preview component done*/}
      <div style={{ color: 'white', textAlign: 'center', margin: 40 }}>
        ---- Preview goes here ----
      </div>

      <CheckConfirm name="confirmation" error={errors.confirmation} />

      <SubmitButton error={errors.submission} />
    </form>
  )
}
