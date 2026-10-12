/**
 * Ícones exatamente como em `design/hero.pen` (guarita), gerados a partir das geometrias do arquivo.
 * Herdam a cor do texto (`currentColor`); o tamanho padrão é 16px, como no design.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function IconSair(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M15.75 9v-3.75a2.25 2.25 0 0 0-2.25-2.25h-6a2.25 2.25 0 0 0-2.25 2.25v13.5a2.25 2.25 0 0 0 2.25 2.25h6a2.25 2.25 0 0 0 2.25-2.25v-3.75m3 0l3-3m0 0l-3-3m3 3h-12.75" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChecklist(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M9 12h3.75m-3.75 3h3.75m-3.75 3h3.75m3 0.75h2.25a2.25 2.25 0 0 0 2.25-2.25v-10.392c0-1.135-0.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-0.08m-5.801 0c-0.065 0.21-0.1 0.433-0.1 0.664 0 0.414 0.336 0.75 0.75 0.75h4.5a0.75 0.75 0 0 0 0.75-0.75 2.25 2.25 0 0 0-0.1-0.664m-5.8 0a2.251 2.251 0 0 1 2.15-1.586h1.5c1.012 0 1.867 0.668 2.15 1.586m-5.8 0c-0.376 0.023-0.75 0.05-1.124 0.08-1.131 0.094-1.976 1.057-1.976 2.192v2.142m0 0h-3.375c-0.621 0-1.125 0.504-1.125 1.125v11.25c0 0.621 0.504 1.125 1.125 1.125h9.75c0.621 0 1.125-0.504 1.125-1.125v-11.25c0-0.621-0.504-1.125-1.125-1.125h-6.375z m-1.5 3.75h0.008v0.008h-0.008v-0.008z m0 3h0.008v0.008h-0.008v-0.008z m0 3h0.008v0.008h-0.008v-0.008z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCadastrarMilitar(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M8 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1 1.225a0.71 0.71 0 0 0-0.679-0.72 11 11 0 0 0-0.321-0.005c-3.85 0-7 2-7 4a2.5 2.5 0 0 0 2.5 2.5h8.75a0.75 0.75 0 0 0 0-1.5h-8.75a1 1 0 0 1-1-1c0-0.204 0.22-0.809 1.32-1.459 1.018-0.601 2.5-1.041 4.18-1.041q0.088 0 0.175 0.002c0.442 0.008 0.825-0.335 0.825-0.777m4.75-1.225a0.75 0.75 0 0 0-1.5 0v1.25h-1.25a0.75 0.75 0 0 0 0 1.5h1.25v1.25a0.75 0.75 0 0 0 1.5 0v-1.25h1.25a0.75 0.75 0 0 0 0-1.5h-1.25z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconRegistrarSaida(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M14.78 7.47a0.75 0.75 0 0 1 0 1.06l-2.5 2.5a0.75 0.75 0 1 1-1.06-1.06l1.22-1.22h-7.69a0.75 0.75 0 0 1 0-1.5h7.69l-1.22-1.22a0.75 0.75 0 0 1 1.06-1.06z m-5.28-3.22a0.75 0.75 0 0 1-1.5 0v-0.25a1.5 1.5 0 0 0-1.5-1.5h-2.5a1.5 1.5 0 0 0-1.5 1.5v8a1.5 1.5 0 0 0 1.5 1.5h2.5a1.5 1.5 0 0 0 1.5-1.5v-0.25a0.75 0.75 0 0 1 1.5 0v0.25a3 3 0 0 1-3 3h-2.5a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h2.5a3 3 0 0 1 3 3z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconRegistrarChegada(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M11.78 7.47a0.75 0.75 0 0 1 0 1.06l-2.5 2.5a0.75 0.75 0 1 1-1.06-1.06l1.22-1.22h-7.69a0.75 0.75 0 0 1 0-1.5h7.69l-1.22-1.22a0.75 0.75 0 0 1 1.06-1.06z m-7.78 4.28a0.75 0.75 0 0 1 1.5 0v0.25a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5h-5a1.5 1.5 0 0 0-1.5 1.5v0.25a0.75 0.75 0 0 1-1.5 0v-0.25a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconRelatorio(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M5 13.5h6a1.5 1.5 0 0 0 1.5-1.5v-4.757a1.5 1.5 0 0 0-0.44-1.061l-3.241-3.243a1.5 1.5 0 0 0-1.06-0.439h-2.759a1.5 1.5 0 0 0-1.5 1.5v8a1.5 1.5 0 0 0 1.5 1.5m9-6.257a3 3 0 0 0-0.879-2.122l-3.241-3.241a3 3 0 0 0-2.123-0.88h-2.757a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3z m-9 1.007a0.75 0.75 0 0 1 0.75-0.75h4.5a0.75 0.75 0 0 1 0 1.5h-4.5a0.75 0.75 0 0 1-0.75-0.75m0.75 2.25a0.75 0.75 0 0 0 0 1.5h2.5a0.75 0.75 0 0 0 0-1.5z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconBusca(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0m-0.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a0.75 0.75 0 1 1-1.06 1.06z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconFiltrar(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M12.5 4c0 0.174-0.071 0.513-0.885 0.888s-2.077 0.612-3.615 0.612-2.799-0.237-3.615-0.612c-0.815-0.375-0.885-0.714-0.885-0.888s0.071-0.513 0.885-0.888 2.077-0.612 3.615-0.612 2.799 0.237 3.615 0.612c0.814 0.375 0.885 0.714 0.885 0.888m-1.448 2.66c-0.894 0.228-1.937 0.34-3.052 0.34s-2.158-0.113-3.052-0.34l1.98 2.905c0.21 0.308 0.322 0.672 0.322 1.044v3.37q0.088 0.02 0.25 0.021c0.422 0 0.749-0.14 0.95-0.316 0.185-0.162 0.3-0.38 0.3-0.684v-2.39c0-0.373 0.112-0.737 0.322-1.045z m-3.052-5.66c3.314 0 6 1 6 3a3.24 3.24 0 0 1-0.563 1.826l-3.125 4.584a0.35 0.35 0 0 0-0.062 0.2v2.39c0 1.5-1.25 2.5-2.75 2.5s-1.75-1-1.75-1v-3.89a0.35 0.35 0 0 0-0.061-0.2l-3.126-4.584a3.24 3.24 0 0 1-0.563-1.826c0-2 2.686-3 6-3m-0.88 12.936q-0.015-0.008-0.013-0.01z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconHoje(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M5.25 5.497a0.75 0.75 0 0 1-0.75-0.75v-0.747a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v0.75a0.75 0.75 0 0 1-1.5 0v-0.75h-4v0.747a0.75 0.75 0 0 1-0.75 0.75m4.75-2.997h-4v-0.752a0.75 0.75 0 1 0-1.5 0v0.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-0.75a0.75 0.75 0 0 0-1.5 0z m-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconEditar(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M11.423 1a3.577 3.577 0 0 1 3.577 3.577c0 0.27-0.108 0.53-0.3 0.722l-0.528 0.529-1.971 1.971-5.059 5.059a3 3 0 0 1-1.533 0.82l-2.638 0.528a1 1 0 0 1-1.177-1.177l0.528-2.638a3 3 0 0 1 0.82-1.533l5.059-5.059 2.5-2.5c0.191-0.191 0.451-0.299 0.722-0.299m-2.31 4.009l-4.91 4.91a1.5 1.5 0 0 0-0.41 0.766l-0.38 1.903 1.902-0.38a1.5 1.5 0 0 0 0.767-0.41l4.91-4.91a2.08 2.08 0 0 0-1.88-1.88m3.098 0.658a3.6 3.6 0 0 0-1.878-1.879l1.28-1.28c0.995 0.09 1.788 0.884 1.878 1.88z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconExcluir(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M9 2h-2a0.5 0.5 0 0 0-0.5 0.5v0.5h3v-0.5a0.5 0.5 0 0 0-0.5-0.5m2 1v-0.5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v0.5h-2.749a0.75 0.75 0 0 0 0 1.5h0.312l0.317 7.625a3 3 0 0 0 2.998 2.875h4.245a3 3 0 0 0 2.997-2.875l0.318-7.625h0.312a0.75 0.75 0 0 0 0-1.5z m0.936 1.5h-7.872l0.315 7.562a1.5 1.5 0 0 0 1.499 1.438h4.245a1.5 1.5 0 0 0 1.498-1.438z m-6.186 2v5a0.75 0.75 0 0 0 1.5 0v-5a0.75 0.75 0 0 0-1.5 0m3.75-0.75a0.75 0.75 0 0 1 0.75 0.75v5a0.75 0.75 0 0 1-1.5 0v-5a0.75 0.75 0 0 1 0.75-0.75" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function IconSetaDireita(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false" {...props}>
      <path d="M1.25 8a0.75 0.75 0 0 1 0.75-0.75h10.19l-2.72-2.72a0.75 0.75 0 0 1 1.06-1.06l4 4a0.75 0.75 0 0 1 0 1.06l-4 4a0.75 0.75 0 1 1-1.06-1.06l2.72-2.72h-10.19a0.75 0.75 0 0 1-0.75-0.75" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}
