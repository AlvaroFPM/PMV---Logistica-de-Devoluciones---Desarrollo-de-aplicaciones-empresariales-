MPN – LOGÍSTICA DE DEVOLUCIONES

Fase 1 – Semana 3: Validación y Refinamiento del Modelo

10/05/2026

PINILLA MARTÍNEZ ÁLVARO FELIPE
ALARCÓN MENDOZA AMARO ALEXANDER

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Índice

1. Casos Narrados

1.1. Caso 1 — El teléfono con daño por agua . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . .
1.2. Caso 2 — El cliente que nunca despacha el producto
1.3. Caso 3 — El paquete perdido por el courier
. . . . . . . . . . . . . . . . .
1.4. Caso 4 — El paquete sin identificación . . . . . . . . . . . . . . . . . . . .
1.5. Caso 5 — Los dos teléfonos con resultado mixto . . . . . . . . . . . . . . .
1.6. Caso 6 — El paquete incompleto . . . . . . . . . . . . . . . . . . . . . . .
1.7. Caso 7 — El artículo equivocado dentro del paquete . . . . . . . . . . . . .
1.8. Caso 8 — El fraude por sustitución de equipo . . . . . . . . . . . . . . . .
. .
1.9. Caso 9 — El bloqueo excesivo por solicitud cancelada voluntariamente
. . . . .
1.10. Caso 10 — El reembolso del costo de envío con devolución parcial

2
2
3
4
4
5
6
7
7
8
9

2. Prueba de Consistencia

10
2.1. ¿Qué pasa si el proceso falla?
. . . . . . . . . . . . . . . . . . . . . . . . . 10
2.2. ¿Quién decide en cada punto crítico? . . . . . . . . . . . . . . . . . . . . . 11
2.3. ¿Qué cambia de estado y qué lo gatilla? . . . . . . . . . . . . . . . . . . . . 11

3. Problemas Detectados

4. Ajustes Realizados

12

14

5. Versión Refinada del Modelo

16
5.1. Flujo Completo del Proceso . . . . . . . . . . . . . . . . . . . . . . . . . . 16
5.2. Actores . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
5.3. Entidades actualizadas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
5.4. Estados de la Solicitud de Devolución . . . . . . . . . . . . . . . . . . . . . 18
. . . . . . . . 19
5.5. Estados del Detalle de Ítem (con clasificación de inventario)
. . . . . . . . . . . . . . . . . . . . . . . 20
5.6. Decisiones del modelo (refinadas)
. . . . . . . . . . . . . . . . . . . . . . . . 20
5.7. Reglas de negocio incorporadas

Página 1

MPN – Logística de Devoluciones

Ingeniería Civil Informática

1. Casos Narrados

Decidimos añadir todos los casos de los que se sacaron los problemas, ya que de un caso
era imposible sacar todos los problemas e inconsistencias, por lo que para que de manera
más transparente se vea de dónde sacamos los problemas pusimos los casos.

1.1. Caso 1 — El teléfono con daño por agua

Un cliente adquirió un teléfono móvil hace dos semanas y solicitó su devolución indicando
que el equipo no encendía al momento de recibirlo. Adjuntó fotografías del empaque como
evidencia. La solicitud fue revisada, se verificó que el motivo era coherente con la evidencia
y que el producto se encontraba dentro del plazo de garantía, por lo que se autorizó el
despacho. Una vez recibido el paquete en bodega, se inició la revisión física del equipo.
Durante la inspección se detectó que el teléfono presentaba daños visibles por contacto
con agua, lo cual no coincidía con el motivo declarado. Se registró la anomalía y se notificó
al área correspondiente. El cliente fue contactado, se le explicó la situación con evidencia
fotográfica y se le informó que el equipo sería devuelto a su domicilio. El cliente se negó a
pagar el costo del reenvío y dejó de responder. Transcurridos 15 días hábiles sin respuesta,
el sistema cerró el caso automáticamente y el equipo quedó retenido en bodega para su
posterior descarte.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución indicando motivo: "el teléfono no encen-
día al recibirlo" y adjunta evidencia fotográfica del empaque. Estado de la solicitud:
Creada.

2. Servicio al Cliente evalúa la solicitud: verifica que el motivo es coherente con la
evidencia, que la garantía está vigente y que el producto fue adquirido hace dos
semanas. La solicitud cumple los requisitos. Decisión: Sí cumple → autorizar envío.
Estado: Aprobada para Envío.

3. El cliente despacha el teléfono. El courier confirma la recepción del paquete. El

contador de 30 días se pausa. Estado: En Tránsito.

4. El Inspector de Calidad recibe el paquete e inicia la revisión física del equipo. Estado:

En Inspección Física.

5. El Inspector detecta daños por contacto con agua no declarados en la solicitud.
El estado físico real no coincide con el motivo declarado. Registra la anomalía con
respaldo fotográfico. Decisión: estado físico inconsistente con el motivo → rechazar
inspección. Estado: Rechazada por Inconsistencia Física. Estado físico del producto:
Retenido en Bodega.

6. Servicio al Cliente recibe la alerta, contacta al cliente y le comunica el resultado con
evidencia física. Se inicia la gestión de devolución del producto. Estado: En Gestión
de Reenvío.

7. El sistema inicia el contador de 15 días hábiles. El cliente no responde ni coordina
el retiro. Al cumplirse el plazo, el sistema cierra el caso automáticamente. Estado
final: Cancelada/Cerrada. Estado físico del producto: Descartado/En Cuarentena.

Página 2

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Problemas detectados:

El modelo de la Entrega 2 declaraba Rechazada por Inconsistencia Física como
estado terminal, pero el producto físico quedaba en bodega sin destino definido
ni instrucción alguna. El sistema decía "caso cerrado" mientras el equipo ocupaba
espacio sin resolución logística.

No existía ninguna regla que definiera qué ocurría si el cliente se negaba a coordinar
el retiro o dejaba de responder, dejando el proceso abierto de forma indefinida.

Los dos escenarios posibles tras el rechazo terminaban en el mismo estado Cance-
lada/Cerrada, lo que impedía generar métricas diferenciadas sobre productos aban-
donados en bodega.

Soluciones aplicadas:

Se incorporó el estado intermedio En Gestión de Reenvío entre el rechazo físico y el
cierre del caso.

Se estableció una regla de negocio de 15 días hábiles: si el cliente no coordina el
retiro dentro de ese plazo, la solicitud pasa a Cancelada/Cerrada y el producto a
Descartado/En Cuarentena.

Se diferenciaron dos estados terminales: Cerrada — Reenviada al Cliente cuando
se concretó el envío de vuelta, y Cancelada/Cerrada cuando el plazo expiró sin
respuesta.

1.2. Caso 2 — El cliente que nunca despacha el producto

Un cliente ingresó una solicitud de devolución por un producto defectuoso. La solicitud fue
revisada y aprobada, autorizándose el despacho. Sin embargo, el cliente nunca realizó el
envío: se arrepintió de la devolución y no volvió a interactuar con el sistema. La solicitud
quedó abierta en estado Aprobada para Envío sin que nadie pudiera cerrarla.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución indicando el motivo y adjuntando evi-

dencia. Estado: Creada.

2. Servicio al Cliente evalúa la solicitud y verifica que cumple los requisitos documen-
tales y de plazo. Decisión: Sí cumple → autorizar envío. Estado: Aprobada para
Envío.

3. El cliente no despacha el producto. No hay confirmación del courier. El sistema
espera. El contador de 30 días sigue corriendo sin que se registre ningún avance.

4. Al cumplirse los 30 días sin que se registre el estado En Tránsito, el flujo no tiene
ninguna regla definida para actuar. La solicitud permanece abierta indefinidamente.
El modelo no sabe qué hacer. El flujo se rompe aquí.

Problemas detectados:

Una solicitud en estado Aprobada para Envío podía quedar abierta para siempre si
el cliente no despachaba el producto. El modelo no contaba con ningún mecanismo
de caducidad para este escenario, generando registros abiertos de forma permanente.

Página 3

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Soluciones aplicadas:

Se incorporó una regla de caducidad: si una solicitud permanece en estado Aprobada
para Envío por más de 30 días sin que se registre el estado En Tránsito, el sistema
la cierra automáticamente con el estado terminal Cancelada — Plazo de Envío
Expirado.

1.3. Caso 3 — El paquete perdido por el courier

Un cliente aprobó el envío de su producto y lo entregó ese mismo día en la sucursal de la
empresa de transporte. Sin embargo, el paquete se perdió en el centro de distribución del
courier y nunca llegó a bodega. Al cumplirse los 30 días desde la aprobación, el sistema
canceló automáticamente la solicitud por plazo de envío expirado, penalizando al cliente
a pesar de haber cumplido con su parte del proceso.

Ejecución paso a paso:

1. El cliente genera la solicitud indicando el motivo y adjuntando evidencia. Estado:

Creada.

2. Servicio al Cliente evalúa y aprueba la solicitud. Estado: Aprobada para Envío.

3. El cliente entrega el paquete en la sucursal del courier. Sin embargo, el sistema no
tiene forma de registrar este hecho porque no existe ningún estado intermedio entre
Aprobada para Envío y En Inspección Física. El contador de 30 días sigue corriendo.
El flujo se rompe aquí.

4. Al cumplirse los 30 días, la regla de caducidad cierra la solicitud como Cancelada

— Plazo de Envío Expirado, penalizando al cliente que sí cumplió.

Problemas detectados:

La regla de caducidad de 30 días no distinguía entre un cliente que nunca despachó
el producto y uno que sí lo hizo pero cuyo paquete se extravió en tránsito. El sistema
penalizaba injustamente al cliente, cerrando su caso cuando la responsabilidad era
del courier.

Soluciones aplicadas:

Se incorporó el estado En Tránsito, que se activa cuando el courier confirma la
recepción del paquete. Mientras la solicitud esté en este estado, el contador de 30
días se pausa. Si el paquete se pierde en tránsito, el sistema reconoce que el cliente
cumplió y la responsabilidad recae sobre la empresa de transporte.

1.4. Caso 4 — El paquete sin identificación

Un cliente despachó el producto a devolver, pero lo hizo sin incluir el código de solicitud
ni ningún tipo de identificación dentro o fuera de la caja. Al llegar el paquete a bodega,
no fue posible vincularlo a ninguna solicitud registrada en el sistema. El Inspector de
Calidad tenía el producto físico en sus manos pero no tenía a qué caso digital asociarlo.

Página 4

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Ejecución paso a paso:

1. El cliente genera la solicitud y esta es aprobada por Servicio al Cliente. Estado:

Aprobada para Envío.

2. El cliente despacha el producto sin incluir código de solicitud ni identificación. El

courier confirma la recepción. Estado: En Tránsito.

3. El paquete llega a bodega. El Inspector de Calidad lo recibe e intenta buscarlo
en el sistema para registrar el ingreso. No encuentra ninguna solicitud asociada al
paquete. No puede avanzar al estado En Inspección Física porque no sabe a qué
caso pertenece el producto. El flujo se rompe aquí.

Problemas detectados:

El modelo no contemplaba qué hacer cuando un paquete llegaba sin identificación
que permitiera vincularlo a una solicitud. El Inspector quedaba bloqueado sin acción
posible en el sistema, y la solicitud del cliente permanecía en estado En Tránsito sin
poder avanzar.

Soluciones aplicadas:

Se estableció la regla de negocio de que todo envío debe incluir obligatoriamente
un código de solicitud. Si llega un paquete sin identificación, no ingresa al flujo de
evaluación sino que se registra físicamente como Bulto Huérfano/Desconocido hasta
que un cliente reclame la demora de su envío.

1.5. Caso 5 — Los dos teléfonos con resultado mixto

Un cliente adquirió dos teléfonos idénticos en la misma orden de compra y generó una única
solicitud de devolución por ambos, alegando que no eran lo que esperaba. La solicitud fue
aprobada y el paquete llegó a bodega. Al realizar la inspección, el primer teléfono estaba
en perfecto estado y superó la revisión, pero el segundo presentaba la pantalla trizada, lo
que no coincidía con el motivo declarado.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución por dos teléfonos con motivo de retracto.

Estado: Creada.

2. Servicio al Cliente evalúa y aprueba la solicitud. Estado: Aprobada para Envío.

3. El cliente despacha ambos teléfonos. El courier confirma la recepción. Estado: En

Tránsito.

4. El Inspector de Calidad recibe el paquete e inicia la revisión. Estado: En Inspección

Física.

5. El Inspector revisa el Teléfono A: estado físico conforme con el motivo declarado. Lo
marca como aprobado. Revisa el Teléfono B: presenta pantalla trizada, inconsistente
con el motivo de retracto. Lo marca como rechazado. El modelo no tiene forma de
registrar dos resultados distintos dentro de una misma solicitud. Decisión imposi-
ble: aprobar toda la solicitud genera pérdida para la empresa; rechazarla completa
perjudica al cliente por el Teléfono A. El flujo se rompe aquí.

Página 5

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Problemas detectados:

El modelo trataba la solicitud como un bloque indivisible. No existía forma de
registrar resultados independientes por ítem dentro de una misma solicitud, lo que
generaba una situación sin salida cuando los productos tenían resultados distintos
en la inspección.

Soluciones aplicadas:

Se refactorizó la entidad central al patrón Maestro-Detalle. La Solicitud de Devolu-
ción pasó a ser un encabezado administrativo vinculado a una nueva entidad Detalle
de Ítem. Cada ítem gestiona de forma independiente su estado de validación y dispo-
sición final, permitiendo procesar reembolsos parciales. Se incorporó el estado padre
En Resolución Parcial para cuando los ítems de una misma solicitud se encuentran
en estados distintos. La solicitud padre solo puede cerrarse cuando todos sus ítems
hayan alcanzado un estado terminal.

1.6. Caso 6 — El paquete incompleto

Un cliente debía devolver dos productos incluidos en una misma solicitud. Al llegar el
paquete a bodega, solo contenía uno de los dos artículos. El Inspector pudo revisar y
aprobar el producto que sí llegó, pero no tenía ningún estado disponible en el sistema
para el producto faltante.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución por dos productos. Estado: Creada.

2. Servicio al Cliente evalúa y aprueba la solicitud. Estado: Aprobada para Envío.

3. El cliente despacha el paquete con solo uno de los dos productos. El courier confirma

la recepción. Estado: En Tránsito.

4. El Inspector de Calidad recibe el paquete e inicia la revisión. Estado: En Inspección

Física.

5. El Inspector revisa el Producto A y lo aprueba. Busca el Producto B en la caja: no
está. Intenta registrar su resultado en el sistema. No puede marcarlo como Recha-
zado por Inconsistencia Física porque nunca fue inspeccionado. No puede aprobarlo
porque no llegó. Sin un estado para este ítem, la solicitud padre no puede cerrarse.
El flujo se rompe aquí.

Problemas detectados:

El modelo no contaba con un estado específico para ítems declarados en la soli-
citud que no llegaron físicamente a bodega. Esta situación bloqueaba el cierre de
la solicitud padre y la ejecución del reembolso para los ítems que sí habían sido
aprobados.

Soluciones aplicadas:

Se incorporó el estado de ítem No Recibido, que el Inspector puede asignar al pro-
ducto faltante. Con este estado, la solicitud padre puede avanzar y cerrarse, y el
Ejecutivo de Pagos reembolsa únicamente los ítems con estado Aprobado, sin blo-
quear el proceso por un producto que nunca llegó a bodega.

Página 6

MPN – Logística de Devoluciones

Ingeniería Civil Informática

1.7. Caso 7 — El artículo equivocado dentro del paquete

Un cliente envió el producto que debía devolver, pero por error incluyó dentro de la misma
caja sus audífonos personales. Al abrir el paquete en bodega, el Inspector encontró un
objeto que no correspondía a ningún ítem declarado en la solicitud. No había forma de
registrarlo en el sistema.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución por un producto. Estado: Creada.

2. Servicio al Cliente evalúa y aprueba la solicitud. Estado: Aprobada para Envío.

3. El cliente despacha el paquete incluyendo por error sus audífonos personales. El

courier confirma la recepción. Estado: En Tránsito.

4. El Inspector de Calidad recibe el paquete e inicia la revisión. Estado: En Inspección

Física.

5. El Inspector abre la caja y encuentra el producto declarado junto a unos audífonos
que no pertenecen a la solicitud. Busca los audífonos en el sistema: no existen en
ningún Detalle de Ítem. No puede aprobarlos, rechazarlos ni derivarlos a Finanzas
porque digitalmente no pertenecen a ninguna orden. El objeto físico queda sin acción
posible en el sistema. El flujo se rompe aquí.

Problemas detectados:

El modelo no contemplaba la llegada de objetos físicos que no tuvieran correspon-
dencia con ningún ítem registrado en la solicitud. El Inspector quedaba bloqueado
sin poder registrar el objeto ni avanzar con normalidad.

Soluciones aplicadas:

Se incorporó el estado físico Objeto Equivocado Retenido para registrar en bodega
cualquier objeto recibido que no correspondda a ítems declarados. El ítem esperado
que no llegó se marca como No Recibido. El sistema notifica automáticamente al
cliente del error y le otorga un plazo de 15 dias para coordinar la recuperación
del objeto, lo que puede implicar el pago de un envío. Si no responde en el plazo
definido, el objeto pasa a Descartado/En Cuarentena. Este flujo es paralelo a la
solicitud original y no la contamina.

1.8. Caso 8 — El fraude por sustitución de equipo

Un cliente adquirió un teléfono nuevo y solicitó su devolución. Envió un paquete a bodega
que, al abrirse, contenía un teléfono físicamente idéntico al comprado, sin daños visibles.
Sin embargo, al verificar el número de serie, el Inspector detectó que no coincidía con el
registrado en la orden de compra. El cliente había enviado su teléfono viejo intentando
quedarse con el nuevo.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución. Estado: Creada.

2. Servicio al Cliente evalúa y aprueba la solicitud. Estado: Aprobada para Envío.

Página 7

MPN – Logística de Devoluciones

Ingeniería Civil Informática

3. El cliente despacha el paquete con el teléfono sustituto. El courier confirma la re-

cepción. Estado: En Tránsito.

4. El Inspector de Calidad recibe el paquete e inicia la revisión. Estado: En Inspección

Física.

5. El Inspector revisa el teléfono: físicamente parece correcto, no hay daños visibles.
Verifica el número de serie y detecta que no coincide con el registrado en la Orden
de Compra. El modelo no tiene un estado específico para esta situación. La única
salida disponible es tratarlo como inconsistencia física estándar y derivarlo a En
Gestión de Reenvío, lo que implicaría devolver amablemente evidencia de fraude al
estafador. El flujo se rompe aquí.

Problemas detectados:

El modelo trataba la sustitución intencional de equipo como una inconsistencia física
estándar, enviándola al flujo de gestión de reenvío sin ninguna alerta al área legal ni
bloqueo del reembolso. La empresa gastaría recursos logísticos en devolver evidencia
de fraude a un estafador.

Soluciones aplicadas:

Se incorporó el estado de ítem Rechazado por Fraude, que se activa cuando el
número de serie del equipo recibido no coincide con el registrado en la Orden de
Compra. El sistema bloquea automáticamente el reembolso, retiene el equipo como
evidencia, elimina la opción de devolver el paquete al cliente y deriva el caso al área
de Prevención de Fraudes o Legal, sacando la solicitud del flujo logístico estándar.

1.9. Caso 9 — El bloqueo excesivo por solicitud cancelada volun-

tariamente

Un cliente inició una solicitud de devolución pero a los pocos minutos se dio cuenta de
que había cometido un error en el formulario. Canceló la solicitud por su cuenta antes
de despachar el producto. Días después intentó crear una nueva solicitud correcta para el
mismo producto. El sistema le bloqueó el intento.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución con datos incorrectos. Estado: Creada.

2. El cliente detecta el error y cancela la solicitud voluntariamente antes de que sea

evaluada. Estado: Cancelada por el Cliente.

3. El cliente intenta crear una nueva solicitud correcta para el mismo producto. El
sistema detecta que ese producto ya tuvo una solicitud previa y activa el bloqueo
de concurrencia. No distingue que la solicitud anterior fue cancelada por el propio
cliente. La nueva solicitud no puede crearse. El flujo se rompe aquí.

Problemas detectados:

La regla de concurrencia bloqueaba cualquier solicitud nueva para un producto
que hubiera tenido una solicitud previa, sin distinguir si esa solicitud había sido
cancelada voluntariamente por el cliente antes del despacho. Un cliente que corregía
un error quedaba bloqueado de forma permanente para ese producto.

Página 8

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Soluciones aplicadas:

Se redefinió la regla de bloqueo: el sistema impide crear una nueva solicitud solo
si el ítem tiene una solicitud en estado activo (Creada, En Revisión, Aprobada
para Envío, En Tránsito, En Inspección Física). Si la solicitud anterior terminó en
Cancelada por el Cliente, el bloqueo se libera y el cliente puede iniciar una nueva
solicitud para el mismo producto, siempre que este siga en su poder.

1.10. Caso 10 — El reembolso del costo de envío con devolución

parcial

Un cliente adquirió un televisor y un cable HDMI en la misma orden. El costo de envío
original había sido alto dado el volumen del televisor. Decidió devolver únicamente el
cable por arrepentimiento. La inspección lo aprobó. El sistema, al detectar al menos un
ítem válido para reembolso, sumó automáticamente el costo de envío completo al monto a
reintegrar, haciendo que la empresa asumiera el costo de envío del televisor que el cliente
se quedó.

Ejecución paso a paso:

1. El cliente genera la solicitud de devolución solo por el cable HDMI, con motivo de

retracto. Estado: Creada.

2. Servicio al Cliente evalúa y aprueba la solicitud. Estado: Aprobada para Envío.

3. El cliente despacha el cable. El courier confirma la recepción. Estado: En Tránsito.

4. El Inspector de Calidad recibe el paquete e inicia la revisión. Estado: En Inspección

Física.

5. El Inspector revisa el cable: estado físico conforme, sin daños. Decisión: ítem apro-
bado. Estado del ítem: Aprobado. Estado de la solicitud: Pendiente de Reembolso.

6. El Ejecutivo de Pagos recibe la solicitud. El sistema calcula el monto a reembolsar:
valor del cable más el costo de envío original completo, porque la regla activa el
reembolso del envío ante cualquier ítem válido. El Ejecutivo ejecuta el pago. La
empresa reembolsa el envío del televisor que el cliente se quedó. El modelo produce
un resultado incorrecto aquí, aunque el flujo no se detiene.

Problemas detectados:

La regla de reembolso del costo de envío basada en "al menos un ítem válido"
generaba un vacío legal que permitía a un cliente devolver un artículo de bajo valor
para recuperar el costo de envío de un producto caro que se quedó. El modelo no
consideraba el motivo de la devolución ni el porcentaje de la orden efectivamente
devuelta.

Soluciones aplicadas:

Se incorporó la siguiente condición: si el motivo es Garantía o Falla de fábrica / Error
de la empresa, se reembolsa el costo de envío original de forma total o proporcional
según los ítems aprobados. Si el motivo es Retracto o insatisfacción del cliente, el
costo de envío no se reembolsa bajo ninguna circunstancia. El envío original solo

Página 9

MPN – Logística de Devoluciones

Ingeniería Civil Informática

se reembolsa en su totalidad si se aprueba la devolución del 100 % de la orden por
motivo de garantía.

2. Prueba de Consistencia

2.1.

¿Qué pasa si el proceso falla?

Si el cliente no envía el producto en 30 días desde que la solicitud fue Aprobada
para Envío, y no se ha registrado el estado En Tránsito previamente, el sistema
cancela automáticamente la solicitud con estado Cancelada — Plazo de Envío
Expirado. Si el cliente sí entregó el paquete al courier pero este se perdió en tránsito,
el estado En Tránsito habrá sido registrado al momento de la confirmación del
despacho, por lo que el contador de 30 días se mantiene pausado y la solicitud no
es cancelada injustamente.

Si el Inspector detecta daños no declarados o un estado físico inconsistente con
el motivo, el flujo se bifurca hacia Rechazada por Inconsistencia Física y se abre
automáticamente el estado En Gestión de Reenvío, sin pasar por Finanzas. Si el
cliente no coordina el retiro del producto dentro de los 15 días hábiles siguientes, el
sistema cierra el caso automáticamente en Cerrada — Producto Abandonado y
el producto pasa a Descartado/En Cuarentena. Si el cliente coordina el retiro dentro
del plazo, el caso cierra en Cerrada — Reenviada al Cliente.

Si el Inspector detecta que el número de serie del equipo recibido no coincide con el
registrado en la Orden de Compra, el ítem pasa a Rechazado por Fraude. El sistema
bloquea el reembolso, retiene el equipo como evidencia y deriva el caso al área de
Prevención de Fraudes o Legal, sin pasar por el flujo de gestión de reenvío.

Si el paquete llega a bodega sin identificación que permita vincularlo a una solicitud,
no ingresa al flujo de evaluación. Se registra como Bulto Huérfano/Desconocido
hasta que un cliente reclame la demora de su envío.

Si el paquete llega incompleto y falta uno o más ítems declarados en la solicitud,
el Inspector marca los ítems faltantes como No Recibido. La solicitud padre puede
avanzar y el Ejecutivo de Pagos reembolsa únicamente los ítems con estado Apro-
bado.

Si el paquete contiene objetos no declarados en la solicitud, el Inspector los regis-
tra bajo el estado Objeto Equivocado Retenido. El ítem esperado que no llegó se
marca como No Recibido y el flujo paralelo notifica al cliente para que coordine la
recuperación del objeto ajeno, sin contaminar la solicitud original.

Si la solicitud contiene varios ítems y estos tienen resultados distintos tras la ins-
pección, la solicitud padre pasa a En Resolución Parcial hasta que todos los ítems
alcancen un estado terminal. El Ejecutivo de Pagos puede ejecutar reembolsos par-
ciales sobre los ítems en estado Aprobado sin esperar el cierre total de la solicitud.

Si el Ejecutivo de Pagos no puede ejecutar la transferencia por datos bancarios
inválidos, Servicio al Cliente es notificado para coordinar con el cliente una cuenta
alternativa. La solicitud permanece en Pendiente de Reembolso durante un plazo

Página 10

MPN – Logística de Devoluciones

Ingeniería Civil Informática

máximo de 30 días. Si el cliente no entrega datos válidos dentro de ese plazo, la
solicitud pasa a Cancelada — Plazo Bancario Expirado.

2.2.

¿Quién decide en cada punto crítico?

Servicio al Cliente decide si la solicitud cumple los criterios documentales y de
garantía para ser aprobada (Paso 2). Es el primer filtro del proceso: verifica el
motivo, la vigencia del plazo y la coherencia de la evidencia adjunta, sin haber visto
el producto físicamente.

El Inspector de Calidad decide si el estado físico real del producto es consistente
con el motivo declarado, si el número de serie coincide con el registrado en la Orden
de Compra, si hay ítems faltantes en el paquete y si existen objetos ajenos a la
solicitud. Su rol es exclusivamente físico: registra la realidad del producto en el
sistema y no toma decisiones administrativas ni se comunica directamente con el
cliente.

El Ejecutivo de Pagos decide si los datos bancarios del cliente son válidos para
ejecutar la transferencia y calcula el monto a reembolsar según los ítems aprobados
y el motivo de la devolución. No interviene en casos donde el reembolso ha sido
bloqueado por fraude.

El Sistema decide de forma automática el cierre por expiración de plazos: cancela
solicitudes en Aprobada para Envío tras 30 días sin registro de En Tránsito, cierra
casos en En Gestión de Reenvío tras 15 días hábiles sin respuesta del cliente, y cierra
solicitudes en Pendiente de Reembolso tras 30 días sin datos bancarios válidos. Estas
transiciones ocurren sin intervención humana.

2.3.

¿Qué cambia de estado y qué lo gatilla?

La solicitud cambia de Creada a En Revisión cuando Servicio al Cliente inicia la
evaluación documental.

La solicitud cambia de En Revisión a Aprobada para Envío cuando Servicio al
Cliente confirma que la solicitud cumple todos los requisitos documentales y de
plazo.

La solicitud cambia de En Revisión a Cancelada — Rechazo Documental cuan-
do Servicio al Cliente detecta que el plazo está vencido, la evidencia es insuficiente
o el motivo es inválido.

La solicitud cambia de Aprobada para Envío a En Tránsito cuando el courier con-
firma la recepción del paquete del cliente.

La solicitud cambia de Aprobada para Envío a Cancelada — Plazo de Envío
Expirado cuando el sistema detecta que han transcurrido 30 días sin que se registre
el estado En Tránsito.

La solicitud cambia de En Tránsito a En Inspección Física cuando el Inspector de
Calidad registra el ingreso del paquete a bodega e inicia la revisión.

La solicitud cambia de En Inspección Física a Pendiente de Reembolso cuando todos
los ítems de la solicitud han sido inspeccionados y al menos uno ha sido aprobado.

Página 11

MPN – Logística de Devoluciones

Ingeniería Civil Informática

La solicitud cambia de En Inspección Física a En Resolución Parcial cuando los
ítems de la solicitud tienen resultados distintos tras la inspección y aún no todos
han alcanzado un estado terminal.

La solicitud cambia de En Inspección Física a Rechazada por Inconsistencia Físi-
ca cuando el Inspector detecta que el estado físico real no coincide con el motivo
declarado.

La solicitud cambia de Rechazada por Inconsistencia Física a En Gestión de Reenvío
cuando Servicio al Cliente confirma el contacto con el cliente para gestionar el destino
del producto rechazado.

La solicitud cambia de En Gestión de Reenvío a Cerrada — Reenviada al Clien-
te cuando se concreta el envío del producto de vuelta al domicilio del cliente dentro
del plazo de 15 días hábiles.

La solicitud cambia de En Gestión de Reenvío a Cerrada — Producto Abando-
nado cuando el sistema detecta que han transcurrido 15 días hábiles sin respuesta
del cliente. El producto físico pasa simultáneamente a Descartado/En Cuarentena.

La solicitud cambia de Pendiente de Reembolso a Finalizada con Éxito cuando el
Ejecutivo de Pagos ejecuta la transferencia correctamente.

La solicitud cambia de Pendiente de Reembolso a Cancelada — Plazo Bancario
Expirado cuando el sistema detecta que han transcurrido 30 días sin que el cliente
entregue datos bancarios válidos.

El ítem cambia a Rechazado por Fraude cuando el Inspector detecta que el número
de serie del equipo recibido no coincide con el registrado en la Orden de Compra.
Este cambio bloquea automáticamente el reembolso y deriva el caso al área legal.

El ítem cambia a No Recibido cuando el Inspector constata que un producto decla-
rado en la solicitud no llegó físicamente a bodega.

El objeto físico no declarado cambia a Objeto Equivocado Retenido cuando el Ins-
pector registra su presencia en bodega sin correspondencia con ningún ítem de la
solicitud.

3. Problemas Detectados

Al ejecutar el modelo sobre diferentes casos, se identificaron los siguientes problemas que
no estaban contemplados en la Entrega 2:

1. Cierre administrativo prematuro sin resolución logística. El modelo de la
Entrega 2 declaraba el estado Rechazada por Inconsistencia Física como terminal,
dando el proceso por cerrado. Sin embargo, el producto físico continuaba en bodega
sin destino definido, generando un limbo logístico: el sistema decía "caso cerrado"
mientras en bodega había un equipo ocupando espacio sin ninguna instrucción.

2. Ausencia de un plazo para la gestión post-rechazo. El modelo no definía qué
ocurría si el cliente se negaba a coordinar el retiro o simplemente no respondía. Esto
dejaba el proceso abierto indefinidamente sin estado de cierre posible.

Página 12

MPN – Logística de Devoluciones

Ingeniería Civil Informática

3. Estados terminales no diferenciados tras el rechazo. El modelo usaba un
único estado Cancelada/Cerrada para dos situaciones operativamente distintas: el
cliente que coordinó el retiro del producto y el cliente que nunca respondió. Esta
ambigüedad impedía generar métricas de negocio precisas sobre productos abando-
nados en bodega.

4. Solicitud congelada si el cliente no envía el producto. Una solicitud en estado
Aprobada para Envío podía quedar abierta para siempre si el cliente se arrepentía,
perdía el paquete o simplemente lo olvidaba. El modelo no tenía ningún mecanismo
de caducidad para este caso.

5. Penalización injusta al cliente cuando el courier pierde el paquete. La
regla de caducidad de 30 días no distinguía entre un cliente que nunca despachó el
producto y uno que sí lo hizo pero cuyo paquete se extravió en tránsito. Al cumplirse
el plazo, el sistema cancelaba la solicitud penalizando al cliente a pesar de haber
cumplido con su parte del proceso.

6. Paquete sin identificación. Si un cliente enviaba el producto sin incluir un código
de solicitud, número de orden ni identificación, el Inspector de Calidad recibía una
caja que el sistema no podía vincular a ninguna solicitud. El flujo quedaba bloqueado
porque no había a qué caso digital asociar el producto físico.

7. Paquete incompleto (Recepción Parcial). Si el cliente debía devolver dos pro-
ductos y solo enviaba uno, el Detalle de Ítem del producto faltante no tenía un
estado asignable. No era correcto marcarlo como Rechazado porque nunca llegó a
ser inspeccionado. Esto bloqueaba el cierre de la solicitud padre indefinidamente.

8. El modelo trataba la solicitud como bloque indivisible. Si una solicitud con-
tenía varios productos y uno de ellos no superaba la inspección, el modelo no podía
registrar resultados independientes por ítem. Aprobar toda la solicitud generaba
pérdidas para la empresa; rechazarla completa perjudicaba injustamente al cliente
por los ítems que sí cumplían las condiciones.

9. Artículo no declarado dentro del paquete. Si el cliente incluía por error un
objeto ajeno a la solicitud dentro de la caja, el Inspector de Calidad recibía un
objeto físico que no existía en ningún Detalle de Ítem del sistema. No había forma
de aprobarlo, rechazarlo ni derivarlo a Finanzas, dejando al inspector sin acción
posible en el sistema.

10. Fraude por sustitución de equipo. Si el cliente enviaba un teléfono físicamente
idéntico al comprado pero con número de serie distinto, el modelo lo trataba como
una inconsistencia física estándar y lo enviaba al flujo de gestión de reenvío. Es-
to significaba que la empresa gastaría recursos logísticos en devolver amablemente
evidencia de fraude a un estafador, sin ninguna alerta al área legal.

11. Bloqueo excesivo por solicitud cancelada voluntariamente. La regla de con-
currencia impedía crear una nueva solicitud para cualquier producto que hubiera
tenido una solicitud previa, sin distinguir si esa solicitud había sido cancelada por el
propio cliente antes del despacho. Un cliente que corregía un error en el formulario
quedaba bloqueado de forma permanente para ese producto.

12. Regla de reembolso del costo de envío con vacío legal. La regla que activaba
el reembolso del costo de envío ante cualquier ítem válido permitía que un cliente

Página 13

MPN – Logística de Devoluciones

Ingeniería Civil Informática

devolviera un artículo de bajo valor para recuperar el costo de envío de un producto
caro que se quedaba. El modelo no consideraba el motivo de la devolución ni el
porcentaje de la orden efectivamente devuelta.

4. Ajustes Realizados

A continuación se describen los cambios incorporados al modelo para resolver cada pro-
blema detectado:

1. Nuevo estado: En Gestión de Reenvío. Se incorporó este estado intermedio
entre Rechazada por Inconsistencia Física y el cierre del caso. Cubre todo el período
de negociación entre Servicio al Cliente y el cliente respecto al destino del producto
rechazado.

2. Regla de negocio: plazo de 15 días hábiles post-rechazo. Cuando una solici-
tud entra en estado En Gestión de Reenvío, el sistema inicia automáticamente un
contador de 15 días hábiles. Si el cliente no coordina el retiro ni el reenvío dentro
de ese plazo, la solicitud pasa a estado terminal Cerrada — Producto Abando-
nado y el producto físico a Descartado/En Cuarentena. La empresa queda liberada
de responsabilidad sobre el artículo, el cual queda disponible para reciclaje o des-
trucción.

3. Estados terminales atómicos y diferenciados. Se reemplazó el estado comodín
Cancelada/Cerrada por estados terminales distintos para los casos de rechazo: Ce-
rrada — Reenviada al Cliente, cuando se concretó el envío de vuelta al domicilio,
y Cerrada — Producto Abandonado, cuando el plazo expiró sin respuesta del
cliente. Esta distinción permite generar métricas de negocio precisas, por ejemplo
cuántos productos fueron abandonados en bodega por mes.

4. Nuevo estado: En Tránsito con pausa del contador de caducidad. Se incor-
poró este estado para registrar el momento en que el courier confirma la recepción
del paquete. Mientras la solicitud esté en estado En Tránsito, el contador de 30 días
se pausa, evitando cancelar injustamente el caso de un cliente que sí cumplió con el
envío pero cuyo paquete se perdió en el proceso de transporte.

5. Regla de negocio: caducidad por plazo de envío. Si una solicitud permanece
en estado Aprobada para Envío por más de 30 días sin que se registre el estado En
Tránsito, el sistema la cierra automáticamente con el estado terminal Cancelada
— Plazo de Envío Expirado.

6. Regla de negocio: identificación obligatoria del envío. Todo envío debe incluir
un código de solicitud que permita vincularlo a un caso digital. Si llega un paquete
sin identificación, no ingresa al flujo de evaluación sino que se registra físicamente
como Bulto Huérfano/Desconocido hasta que un cliente reclame la demora de su
envío.

7. Nuevo estado de ítem: No Recibido. Para el caso de recepción parcial, el
Inspector puede marcar el producto faltante con este estado. Esto permite que la
solicitud padre avance y se cierre, y que el Ejecutivo de Pagos reembolse únicamente
los ítems con estado Aprobado, sin bloquear el proceso por un producto que nunca
llegó a bodega.

Página 14

MPN – Logística de Devoluciones

Ingeniería Civil Informática

8. Refactorización de entidades: patrón Maestro-Detalle. La entidad Solicitud
de Devolución se redefinió como un encabezado administrativo vinculado a una
nueva entidad Detalle de Ítem. Cada ítem gestiona de forma independiente su propio
motivo, estado de validación y disposición final, lo que permite procesar reembolsos
parciales, marcar productos individuales como No Recibido o Rechazado por Fraude,
y cerrar la solicitud padre solo cuando todos sus ítems hayan alcanzado un estado
terminal. Se incorporó además el estado padre En Resolución Parcial para cuando
los ítems de una misma solicitud se encuentran en estados distintos.

9. Nuevo estado físico: Objeto Equivocado Retenido. Si el Inspector recibe un
objeto que no corresponde a ningún ítem declarado en la solicitud, ese objeto se
registra en bodega bajo este estado. El ítem esperado que no llegó se marca como
No Recibido. El sistema notifica automáticamente al cliente del error y le otorga un
plazo de 15 dias para coordinar la recuperación del objeto, lo que puede implicar
el pago de un envío. Si el cliente no responde en el plazo definido, el objeto pasa
a Descartado/En Cuarentena. Este flujo es paralelo a la solicitud original y no la
contamina.

10. Nuevo estado de ítem: Rechazado por Fraude y derivación a área legal.
Si el Inspector detecta que el número de serie del equipo recibido no coincide con el
registrado en la Orden de Compra, el ítem pasa a este estado. El sistema bloquea
automáticamente el reembolso, retiene el equipo como evidencia y deriva el caso al
área de Prevención de Fraudes o Legal, eliminando la opción de devolver el paquete
al cliente y sacando la solicitud del flujo logístico estándar.

11. Control de concurrencia: bloqueo condicionado al estado. Se redefinió la
regla de bloqueo de solicitudes duplicadas. El sistema impide crear una nueva so-
licitud de devolución para un ítem que ya tiene una solicitud activa (Creada, En
Revisión, Aprobada para Envío, En Tránsito, En Inspección Física). Sin embargo,
si la solicitud anterior terminó en estado Cancelada por el Cliente, el bloqueo se
libera y el cliente puede iniciar una nueva solicitud para el mismo producto, siempre
que este siga en su poder.

12. Regla de negocio: reembolso del costo de envío según motivo. Se incorporó
la siguiente condición al cálculo del reembolso: si el motivo de la devolución es
Garantía o Falla de fábrica / Error de la empresa, se reembolsa el costo de envío
original de forma total o proporcional según los ítems aprobados. Si el motivo es
Retracto o insatisfacción del cliente, el costo de envío no se reembolsa bajo ninguna
circunstancia. El envío original solo se reembolsa en su totalidad si se aprueba la
devolución del 100 % de la orden por motivo de garantía.

Página 15

MPN – Logística de Devoluciones

Ingeniería Civil Informática

5. Versión Refinada del Modelo

Esta sección consolida el modelo final tras aplicar todos los ajustes detectados durante la
validación. Los elementos que no sufrieron cambios respecto a la Entrega 2 se mantienen
tal como fueron definidos.

5.1. Flujo Completo del Proceso

A continuación se describe el flujo completo del proceso de devolución, integrando el
patrón Maestro-Detalle y las reglas de caducidad refinadas:

1. El Cliente genera la solicitud de devolución a través del sistema, indicando el
motivo y adjuntando evidencia fotográfica. La entidad Solicitud de Devolución
(Maestro) se vincula a cada Detalle de Ítem de forma independiente. El sistema
verifica que no exista una solicitud activa para los mismos productos; de lo contrario,
bloquea la creación a menos que la solicitud previa esté en estado Cancelada por
el Cliente. La solicitud pasa al estado Creada.

2. Servicio al Cliente realiza la validación documental y de políticas, verificando si
la solicitud se encuentra dentro del plazo vigente y si la evidencia es coherente con
el motivo declarado. La solicitud pasa al estado En Revisión.

2.a — Decisión positiva: La solicitud cumple los requisitos. Estado: Apro-
bada para Envío. Se autoriza al cliente a despachar el producto y se inicia
un contador de 30 días naturales para el despacho.

2.b — Decisión negativa: La solicitud no cumple los requisitos (plazo venci-
do, evidencia insuficiente, motivo inválido). Estado: Cancelada — Rechazo
Documental. Se notifica al cliente y se cierra el caso administrativamente.

3. El Cliente despacha el producto. Al momento en que el Courier confirma la re-
cepción del paquete, la solicitud cambia al estado En Tránsito. En este punto, el
contador de caducidad de 30 días se pausa para evitar que el caso se cierre injusta-
mente por retrasos logísticos del transporte. Si el sistema detecta que han transcu-
rrido los 30 días sin confirmación de despacho, la solicitud pasa automáticamente a
Cancelada — Plazo de Envío Expirado.

4. El Inspector de Calidad recibe el paquete en bodega e identifica el bulto mediante
el código de solicitud obligatorio. Si un paquete llega sin identificación, se registra
como Bulto Huérfano/Desconocido fuera del flujo digital hasta que un cliente
reclame su demora. Al registrar el ingreso correcto, la solicitud pasa al estado En
Inspección Física. El Inspector verifica cada ítem de la solicitud:

4.a — Inspección conforme: El producto es correcto y su estado coincide con
lo declarado. Estado del ítem: Aprobado. Se notifica al Ejecutivo de Pagos.
Adicionalmente, el Inspector clasifica el artículo según su destino físico:

• Apto para Reacondicionamiento: El producto se restaura para su re-

ingreso al inventario.

• Descarte Técnico: El producto presenta fallas irreversibles que justifican

el reembolso, pero debe ser enviado a reciclaje o destrucción.

Página 16

MPN – Logística de Devoluciones

Ingeniería Civil Informática

4.b — Excepción: contenido incorrecto (Fraude): El número de serie
del equipo no coincide con el registrado en la Orden de Compra. Estado del
ítem: Rechazado por Fraude. El sistema bloquea el reembolso, retiene el
equipo como evidencia y deriva el caso al Área Legal.

4.c — Excepción: inconsistencia física: El producto llega con daños no
declarados (ej: contacto con agua). Estado del ítem: Rechazado por Incon-
sistencia Física.

4.d — Excepción: recepción parcial u objetos ajenos: Si un ítem de-
clarado no llega, se marca como No Recibido. Si se encuentra un objeto
personal del cliente, se registra como Objeto Equivocado Retenido, otor-
gando al cliente un plazo de 15 días hábiles para coordinar su recuperación
antes de su descarte definitivo.

5. Gestión Post-Rechazo: Para los ítems con rechazo físico, Servicio al Cliente
gestiona la comunicación. La solicitud (o los ítems afectados) pasa al estado En
Gestión de Reenvío. Se inicia un contador automático de 15 días hábiles:

5.a — El cliente coordina el reenvío: Acepta las condiciones y se concreta
la devolución al domicilio. Estado: Cerrada — Reenviada al Cliente.

5.b — El cliente no responde: Transcurrido el plazo sin respuesta efec-
tiva, la solicitud finaliza. Estado: Cerrada — Producto Abandonado. El
producto físico pasa a Descartado/En Cuarentena.

6. El Ejecutivo de Pagos procesa el reembolso de los ítems en estado Aprobado.
Si hay ítems en distintos estados, la solicitud padre permanece En Resolución
Parcial para permitir pagos parciales desacoplados.

6.a — Reembolso exitoso: La transferencia se realiza correctamente tras
verificar datos bancarios y calcular el reembolso proporcional del costo de envío
según la regla de negocio. Estado: Finalizada con Éxito.

6.b — Reembolso fallido: Los datos bancarios son inválidos. La solicitud
queda en estado Pendiente de Reembolso mientras se solicita una cuenta al-
ternativa. Se otorga un plazo máximo de 30 días; si transcurrido este tiempo no
hay datos válidos, la solicitud pasa al estado Cancelada — Plazo Bancario
Expirado.

5.2. Actores

Los actores se mantienen sin cambios: Cliente, Servicio al Cliente, Inspector de Ca-
lidad y Ejecutivo de Pagos. Se incorpora como actor externo el Courier / Empresa
de Transporte, cuya confirmación de recepción del paquete gatilla el cambio de estado a
En Tránsito. Se añade también el Área Legal / Prevención de Fraudes como destino
de derivación en casos de fraude confirmado.

5.3. Entidades actualizadas

La entidad Solicitud de Devolución se refactorizó al patrón Maestro-Detalle:

Página 17

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Solicitud de Devolución (Maestro): Encabezado administrativo del proceso.
Gestiona el estado global del caso y solo puede cerrarse cuando todos sus ítems
hayan alcanzado un estado terminal. Su estado global es derivado del estado de
sus ítems: si hay ítems en distintos estados, la solicitud padre se encuentra en En
Resolución Parcial.

Detalle de Ítem (Detalle): Entidad hija vinculada a la solicitud. Cada ítem tiene
su propio motivo declarado, estado de validación física y disposición final. Permite
procesar reembolsos parciales y registrar resultados independientes por producto.

Cliente: Sin cambios. Incluye datos personales y bancarios.

Orden de Compra: Sin cambios. Permite verificar qué productos fueron adquiridos
y bajo qué condiciones.

Courier / Registro de Tránsito: Nueva entidad que registra la confirmación de
despacho por parte de la empresa de transporte, vinculada a la solicitud para pausar
el contador de caducidad.

5.4. Estados de la Solicitud de Devolución

Estados del flujo principal:

1. Creada — La solicitud fue generada por el cliente.

2. En Revisión — Servicio al Cliente está evaluando la documentación.

3. Aprobada para Envío — La solicitud superó la validación documental. Regla: si
no se registra ingreso a bodega en 30 días, pasa automáticamente a Cancelada —
Plazo de Envío Expirado.

4. En Tránsito — El courier confirmó la recepción del paquete. El contador de 30

días se pausa.

5. En Inspección Física — El producto fue recibido y el Inspector lo está revisando.

6. Pendiente de Reembolso — La inspección fue aprobada. El Ejecutivo de Pagos

debe ejecutar el pago.

7. Reembolso en Proceso — El Ejecutivo autorizó el pago y se espera confirmación

del banco.

8. En Resolución Parcial — La solicitud tiene ítems en distintos estados (ej. uno
aprobado y otro rechazado). El caso permanece abierto hasta que todos los ítems se
resuelvan.

9. En Gestión de Reenvío — El producto fue rechazado físicamente y se negocia su
devolución al cliente. Regla: si no hay respuesta en 15 días hábiles, la solicitud pasa
a Cerrada — Producto Abandonado y el producto a Descartado/En Cuarentena.

Estados terminales (Atómicos):

Finalizada con Éxito — El reembolso fue confirmado por el banco.

Cerrada — Reenviada al Cliente — El producto rechazado fue devuelto al
domicilio del cliente.

Página 18

MPN – Logística de Devoluciones

Ingeniería Civil Informática

Cerrada — Producto Abandonado — El plazo de gestión de reenvío (15 días
hábiles) se cumplió sin respuesta del cliente.

Cancelada — Rechazo Documental — La solicitud no superó el primer filtro
(plazo vencido, evidencia insuficiente o motivo inválido).

Cancelada — Plazo de Envío Expirado — El cliente no despachó el producto
en los 30 días posteriores a la aprobación.

Cancelada — Plazo Bancario Expirado — El cliente no proporcionó datos
bancarios válidos en el plazo de 30 días tras ser notificado de un error en el pago.

Cancelada por el Cliente — El cliente canceló voluntariamente la solicitud antes
del despacho. Libera el bloqueo de concurrencia para el ítem.

5.5. Estados del Detalle de Ítem (con clasificación de inventario)

Aprobado — Apto para Reacondicionamiento — El ítem superó la inspección
física y está en óptimas condiciones para ser restaurado y reingresado al inventario
comercial.

Aprobado — Descarte Técnico — El ítem superó la inspección (ej. una falla de
fábrica real y comprobada), por lo que corresponde el reembolso al cliente, pero el
producto físico presenta daños irreversibles y debe pasar a destrucción o reciclaje.

Rechazado por Inconsistencia Física — El estado real no coincide con el motivo
declarado.

Rechazado por Fraude — El número de serie no coincide con el registrado en la
Orden de Compra. Deriva inmediatamente al área legal.

No Recibido — El ítem fue declarado en la solicitud pero no llegó físicamente a
bodega (recepción parcial).

Objeto Equivocado Retenido — Se recibió un objeto ajeno a la orden. Se notifica
al cliente y se le otorga un plazo de 15 días hábiles para coordinar su recuperación.
Vencido este plazo sin respuesta, el objeto pasa físicamente a Descartado/En Cua-
rentena.

Página 19

MPN – Logística de Devoluciones

Ingeniería Civil Informática

5.6. Decisiones del modelo (refinadas)

D1 — Validación documental (Servicio al Cliente): ¿La solicitud está dentro
del plazo vigente y la evidencia es coherente con el motivo declarado? Si NO →
Cancelada — Rechazo Documental. Si SÍ → Aprobada para Envío.

D2 — Validación física (Inspector de Calidad): ¿El contenido y estado real del
paquete coinciden con lo declarado? Si NO → Rechazada por Inconsistencia Física
o Rechazado por Fraude (si el N° de serie no coincide). Si SÍ → Se clasifica el
destino físico (Apto para Reacondicionamiento o Descarte Técnico) y el ítem pasa
a Pendiente de Reembolso.

D3 — Ejecución del reembolso (Ejecutivo de Pagos): ¿Los datos bancarios son
válidos? Si NO → notificar a Servicio al Cliente; la solicitud permanece en Pendiente
de Reembolso por un plazo máximo de 30 días. Si se cumple este plazo sin datos
válidos, pasa a Cancelada — Plazo Bancario Expirado. Si SÍ → Reembolso en Proceso
hasta confirmación bancaria.

D4 — Reembolso del costo de envío: ¿El motivo es garantía o falla de la
empresa Y se aprueba el 100 % de la orden? Si SÍ → se reembolsa el costo de envío
original. En cualquier otro caso (retracto o devolución parcial) → no se reembolsa
el costo de envío.

D5 — Gestión post-rechazo (Servicio al Cliente / Sistema): ¿El cliente coordinó
el retiro o reenvío dentro de 15 días hábiles tras un rechazo físico? Si NO → la
solicitud pasa a Cerrada — Producto Abandonado y el producto a Descartado/En
Cuarentena. Si SÍ → la solicitud pasa a Cerrada — Reenviada al Cliente.

5.7. Reglas de negocio incorporadas

Identificación Obligatoria: Todo envío debe incluir un código de solicitud. Si
llega un paquete sin identificación, no ingresa al flujo logístico, sino que se registra
en bodega como Bulto Huérfano/Desconocido hasta que un cliente reclame su
demora.

Cierre Condicionado: La solicitud padre solo puede cerrarse cuando todos sus
ítems hijos hayan alcanzado un estado terminal independiente.

Bloqueo de Concurrencia: El sistema impide crear una nueva solicitud para
un ítem que ya tiene una solicitud activa. Este bloqueo se libera únicamente si la
solicitud anterior terminó en estado Cancelada por el Cliente.

Reembolso Parcial Desacoplado: El Ejecutivo de Pagos puede ejecutar reembol-
sos parciales de los ítems en estado Aprobado, sin necesidad de esperar la resolución
de otros ítems problemáticos de la misma solicitud padre.

Página 20

