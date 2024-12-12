import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | 1MomentGlobal",
  description: "Política de privacidad y manejo de datos personales de 1MomentGlobal",
};

const PrivacyPolicyPage = () => {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Política de Privacidad
          </h1>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recopilación y Uso de Información Personal
              </h2>
              <p>
                1MomentGlobal recopila información personal únicamente para los procesos de 
                registro y autenticación de usuarios. Esta información incluye:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Contraseña (almacenada de forma segura y encriptada)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Uso de la Información
              </h2>
              <p>
                La información recopilada se utiliza exclusivamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestionar tu cuenta y proporcionar acceso a la plataforma</li>
                <li>Autenticar tu identidad durante el inicio de sesión</li>
                <li>Enviar notificaciones importantes sobre tu cuenta</li>
                <li>Proporcionar soporte técnico cuando sea necesario</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Protección de Datos
              </h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger 
                tu información personal contra accesos no autorizados, modificación, 
                divulgación o destrucción no autorizada.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Compartir Información
              </h2>
              <p>
                No compartimos tu información personal con terceros. Tu información 
                se mantiene estrictamente confidencial y solo se utiliza para los 
                propósitos mencionados anteriormente.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tus Derechos
              </h2>
              <p>
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Solicitar la corrección de datos inexactos</li>
                <li>Solicitar la eliminación de tu cuenta y datos personales</li>
                <li>Oponerte al procesamiento de tu información</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contacto
              </h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad o sobre cómo 
                manejamos tu información personal, puedes contactarnos a través de:
              </p>
              <p className="font-medium">
                Email: privacy@1momentglobal.com
              </p>
            </section>

            <footer className="pt-8 text-sm text-gray-500">
              <p>
                Última actualización: {new Date().toLocaleDateString()}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage; 