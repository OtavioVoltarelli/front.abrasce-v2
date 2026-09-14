import { useId } from 'react';
import { fileUrl } from '../services/config';

/**
 * Lista de anexos de uma notícia ou processo seletivo.
 *
 * REGRA DO BRIEFING: quando não há anexo, não existe seção nenhuma — nem
 * título, nem caixa vazia, nem "nenhum anexo disponível". O componente devolve
 * `null` e some da página.
 *
 * Isso é mais importante do que parece: uma seção vazia ocupa espaço, cria uma
 * pergunta na cabeça de quem lê ("perdi alguma coisa?") e, no celular, é mais
 * um bloco a rolar sem receber nada em troca.
 *
 * Cada anexo é um link comum. Não é `<a download>` porque a ideia é ABRIR o
 * PDF — no celular, o navegador mostra o documento na hora; forçar o download
 * joga o arquivo numa pasta que a pessoa vai ter que caçar.
 *
 * `files` é a lista de `StoredFileOutput` que o backend devolve —
 * `{ storedName, originalName, contentType }`, sem `id`. `storedName` é o
 * nome físico no servidor (entra na URL); `originalName` é o nome que a
 * pessoa que fez upload usou (é o que aparece na tela).
 */
export default function AttachmentList({ files, category, title = 'Documentos' }) {
    // `useId` em vez de um id fixo: se um dia a página tiver duas listas
    // de anexos, dois elementos com o mesmo id quebram o aria-labelledby.
    const headingId = useId();

    if (!files?.length) return null;

    return (
        <section aria-labelledby={headingId} className="rounded-2xl bg-sand p-5 ring-1 ring-line sm:p-6">
            <h2 id={headingId} className="text-base font-bold text-ink-900">
                {title}
            </h2>

            <ul className="mt-4 space-y-2">
                {files.map((file) => (
                    <li key={file.storedName}>
                        <a
                            href={fileUrl(category, file.storedName)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-h-14 items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-line transition-colors hover:bg-brand-50 hover:ring-brand-300"
                        >
                            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M14 2v6h6M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                </svg>
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-ink-900">
                                    {file.originalName}
                                </span>
                                {/* Avisar que abre em outra aba é uma exigência de
                                    acessibilidade: uma aba nova sem aviso desorienta
                                    quem usa leitor de tela ou ampliador. */}
                                <span className="block text-xs text-muted">Abre em uma nova aba</span>
                            </span>

                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                            </svg>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
