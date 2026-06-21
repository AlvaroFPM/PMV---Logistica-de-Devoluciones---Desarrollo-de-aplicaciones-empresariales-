export function formatearRUT(rut: string): string {
  // Remove anything that is not a number or k/K
  let valor = rut.replace(/[^0-9kK]+/g, '').toUpperCase();
  
  // Limitar a máximo 9 caracteres (8 para cuerpo + 1 para DV)
  valor = valor.slice(0, 9);

  if (valor.length === 0) return '';
  if (valor.length === 1) return valor;

  // Extract body and verifier digit
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);

  // Add dots as thousands separators
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${cuerpoFormateado}-${dv}`;
}
