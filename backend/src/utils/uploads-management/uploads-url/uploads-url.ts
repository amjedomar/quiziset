/**
 * parses a relative "/uploads/{bucketName}/{fileName}" url into its parts
 *
 * returns null for anything that isn't an "/uploads" url (e.g. "/public" sample
 * images or external urls or null/undefined values)
 */
export function parseUploadedFileUrl(url: string | null | undefined): { bucketName: string; fileName: string } | null {
  if (!url || !url.startsWith('/uploads/')) {
    return null
  }

  // the url schema is /uploads/{bucketName}/{fileName}
  const [bucketName, fileName] = url.split('/').slice(2)

  if (!bucketName || !fileName) {
    return null
  }

  return { bucketName, fileName }
}
