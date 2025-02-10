import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | 1MovementGlobal",
  description: "Términos y condiciones de uso de la plataforma 1MovementGlobal",
};

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-2xl p-8 border border-white/20">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl" />
            <h1 className="relative text-4xl font-bold text-white mb-8 tracking-tight">
              Términos y Condiciones
              <span className="block h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mt-4 rounded-full" />
            </h1>
          </div>
          
          <div className="space-y-8 text-gray-100">
            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-red-400 mb-4">DESCARGO DE RESPONSABILIDAD DE TRADING</h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  OneMovementGlobal no garantiza la precisión, fiabilidad ni rentabilidad de los resultados generados por el servicio de Copy Trading. El trading es una actividad de renta variable, y los resultados pasados no garantizan rendimientos futuros.
                </p>
                <p className="leading-relaxed">
                  El usuario asume todos los riesgos asociados con el uso de este servicio y reconoce que OneMovementGlobal no será responsable de ninguna pérdida o daño, directo o indirecto, derivado de su uso.
                </p>
                <p className="leading-relaxed">
                  El servicio de Copy Trading no está exento de riesgos, y su uso puede generar pérdidas. OneMovementGlobal no ofrece asesoría financiera y no se hace responsable de cualquier reclamo, daño o perjuicio que resulte de su utilización.
                </p>
                <p className="leading-relaxed">
                  El usuario acepta indemnizar y eximir de responsabilidad a OneMovementGlobal, sus afiliados, directivos, empleados y agentes frente a cualquier reclamación o demanda derivada del uso del servicio.
                </p>
                <p className="leading-relaxed">
                  Este descargo de responsabilidad es parte integral de la relación entre el usuario y OneMovementGlobal, y su aceptación es obligatoria para el uso del servicio.
                </p>
              </div>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">1. Introducción</h2>
              <p className="mb-4 leading-relaxed">
                Bienvenido a 1MovementGlobal. Al acceder y utilizar nuestra plataforma, aceptas estos términos y condiciones en su totalidad.
              </p>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">2. Servicios de Streaming</h2>
              <p className="mb-4 leading-relaxed">
                Nuestra plataforma ofrece servicios de streaming en vivo y contenido educativo bajo demanda. El acceso a ciertos contenidos puede requerir una suscripción o pago.
              </p>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">3. Cursos y Contenido Educativo</h2>
              <p className="mb-4 leading-relaxed">
                Los cursos disponibles en nuestra plataforma están protegidos por derechos de autor. No está permitida su reproducción o distribución sin autorización.
              </p>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">4. Responsabilidades del Usuario</h2>
              <ul className="list-none space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="h-2 w-2 bg-blue-400 rounded-full" />
                  <span>Mantener la confidencialidad de las credenciales de acceso</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="h-2 w-2 bg-blue-400 rounded-full" />
                  <span>No compartir el acceso a la cuenta con terceros</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="h-2 w-2 bg-blue-400 rounded-full" />
                  <span>Utilizar el contenido únicamente para fines educativos personales</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="h-2 w-2 bg-blue-400 rounded-full" />
                  <span>Respetar los derechos de propiedad intelectual</span>
                </li>
              </ul>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">5. Privacidad y Datos Personales</h2>
              <p className="mb-4 leading-relaxed">
                Recopilamos y procesamos datos personales de acuerdo con nuestra política de privacidad y las leyes aplicables de protección de datos.
              </p>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">6. Modificaciones</h2>
              <p className="mb-4 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación.
              </p>
            </section>

            <section className="hover:bg-white/5 p-6 rounded-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">7. Contacto</h2>
              <p className="leading-relaxed">
                Para cualquier consulta sobre estos términos y condiciones, por favor contáctenos a través de nuestro formulario de contacto o envíe un correo electrónico a{' '}
                <a href="mailto:support@1movementglobal.com" className="text-blue-300 hover:text-blue-400 underline transition-colors">
                  support@1movementglobal.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-gray-300">
              Última actualización: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 