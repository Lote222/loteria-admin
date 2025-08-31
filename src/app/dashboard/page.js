// src/app/dashboard/page.js
export default function DashboardIndexPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold text-gray-800">¡Bienvenido!</h1>
      <p className="mt-4 text-gray-600">
        Selecciona un sitio web del menú de la izquierda para comenzar a editar su información.
      </p>
    </div>
  );
}