export function Home() {
  const apiDocs = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/docs`
    : '/api/docs'
  return (
    <div className="page">
      <h1>Mini App</h1>
      <p>API docs: <a href={apiDocs} target="_blank" rel="noreferrer">Swagger</a></p>
      <p>Перейдіть до Users або Items для роботи з даними.</p>
    </div>
  )
}
