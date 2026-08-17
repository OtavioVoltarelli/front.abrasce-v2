export default function Loading() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Carregando"
            className="flex items-center justify-center p-8"
        >
            <span
                aria-hidden="true"
                className="size-10 animate-spin rounded-full border-4 border-surface border-t-brand motion-reduce:animate-[spin_2s_linear_infinite]"
            />
            <span className="sr-only">Carregando…</span>
        </div>
    );
}
